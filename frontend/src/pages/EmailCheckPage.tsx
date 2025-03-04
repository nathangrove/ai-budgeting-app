import React from 'react';
import { Button, Container, Typography } from '@material-ui/core';

const EmailCheckPage: React.FC = () => {
  const handleEmailCheck = async () => {
    fetch('/api/email/check', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        console.log('Email check response:', data);
        // Handle the response data as needed
       
       }).catch( console.error ) 
  };

  return (
    <Container>
      <Typography variant="h4">Email Check Page</Typography>
      <Button variant="contained" color="primary" onClick={handleEmailCheck}>
        Check Email
      </Button>
    </Container>
  );
};

export default EmailCheckPage;
