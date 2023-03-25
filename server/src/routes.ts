import Router from 'express-promise-router'
import logger from './lib/logger'
import { RequestHandler } from 'express'
import { createUrl, getUrl } from './db'
import { get, set } from './cache'
import { randomBytes } from 'crypto'
import { Prisma } from '@prisma/client'

// not using semicolons to follow pattern of code style 

const router = Router()

router.get('/health', (_, res) => res.sendStatus(200))

router.get('/hello', (_, res) => {
  res.json({ message: 'hello' })
})

router.put('/url', (async (_req, res) => {
  const url = _req.body.url;

  // check for null/undefined/not valid url
  const isValid = (url: string) => {
    if(!url) return false;
    try {
      new URL(url)
      return true
    } catch (err) {
      return false
    } 
  }
  
  if(!isValid(url)) {
    // short circuit fail case
    logger.error({url}, 'bad_url')
    res.status(400).send('Invalid URL')
  } else {
    // check cache for key
    const cacheValue = await get(url)

    let slug;
    // if cache use it
    if (cacheValue) {
      slug = cacheValue
    // check db before gen new slug
    } else {
      // google'd slug generator -- saw can use standard node lib 
      // can up bytes based on collision risk eval
      logger.info({slug}, 'generate_slug')
      const randomSlug = randomBytes(8).toString('hex')
      
      // try/catch for creating https://www.prisma.io/docs/concepts/components/prisma-client/handling-exceptions-and-errors
      // slug String @unique
      try {
        await createUrl(url, randomSlug)
        await set(url, randomSlug)
        slug = randomSlug
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // The .code property can be accessed in a type-safe manner
          if (e.code === 'P2002') {
            console.log(
              'There is a unique constraint violation on the slug'
            )

            isValid(url)
          }
        }
      }

      slug = randomSlug
    }

    return res.status(200).send({ slug });
  }
}) as RequestHandler)

router.get('/:slug', (async (_req, res) => {
  console.log(_req)

  let resolvedSlug;

  resolvedSlug = await get(_req.params.slug);

  if(!resolvedSlug) {
    resolvedSlug = await getUrl(_req.params.slug);
  }

  if(resolvedSlug !== null) {
    return res.redirect(resolvedSlug);
  }

  return res.status(400).send('No shortened slug available');
}) as RequestHandler)

export default router
