
import './App.css';
import styled from 'styled-components';
import Supermojo from './assets/supermojo.png'
import { useState } from 'react';
import axios from 'axios';


const App = () => {
  const baseUrl = 'http://localhost:9000'
  const [value, setValue] = useState('');
  const [response, setResponse] = useState('');

  // const handleSubmit = useCallback((async () => {
  //   console.log('trying submit with', value)
  //   try {
  //     await axios.get(`${baseUrl}/url`, { url: value })
  //       .then(res => {
  //         console.log(res);
  //         setResponse(res.data);
  //       })
  //   } catch (err) {
  //     console.log('Error:', err)
  //   }
  // }));

  // useEffect(() => {
  //   handleSubmit();
  // }, [handleSubmit])

  const handleSubmit = (async () => {
    console.log('trying submit with', value)
    try {
      await axios.put(`${baseUrl}/url`, { url: value })
        .then(res => {
          console.log(res);
          setResponse(res.data.slug);
        })
    } catch (err) {
      console.log('Error:', err)
    }
  })

  return (
    <AppContainer className="App">
      <Title>Supermojo Link Shortener</Title>
        <FormContainer>
          <Input type="text" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Please enter a link"/>
          <Button onClick={handleSubmit}>Submit</Button>
        </FormContainer>

        <Response>{`Submit a link: ${value}`}</Response>
        <Response>{`returns this shortened url slug:`}
        <a href={baseUrl + "/" + response}>{response}</a>
        </Response>
        <SupermojoFooter src={Supermojo} />
    </AppContainer>
  );
}

const AppContainer= styled.div``;

const SupermojoFooter = styled.img`
  position: absolute;
  left: 50%;
  bottom: 5%;
  transform: translate(-50%, -50%);
`;

const Title = styled.h2``;

const Button = styled.button``;

const Input = styled.input`
  width: 400px;
`;

const Response = styled.h2``;

const FormContainer = styled.div`
  width: 900px;
  gap: 12px;
`;

export default App;

