import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@material-ui/core';

const SettingsPage: React.FC = () => {
  const [imapUser, setImapUser] = useState('');
  const [imapPassword, setImapPassword] = useState('');
  const [imapHost, setImapHost] = useState('');
  const [imapPort, setImapPort] = useState(993);

  const handleSaveSettings = () => {
    // Implement save settings logic here
    console.log('Saving IMAP settings', { imapUser, imapPassword, imapHost, imapPort });
    // call /api/settings endpoint to save the settings
    fetch('/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imapUser, imapPassword, imapHost, imapPort }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Settings saved:', data);
        // Optionally, redirect or show a success message
      })
      .catch(error => {
        console.error('Error saving settings:', error);
        // Optionally, show an error message
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>IMAP Settings</Typography>
      <TextField
        label="IMAP User"
        fullWidth
        margin="normal"
        value={imapUser}
        onChange={(e) => setImapUser(e.target.value)}
      />
      <TextField
        label="IMAP Password"
        type="password"
        fullWidth
        margin="normal"
        value={imapPassword}
        onChange={(e) => setImapPassword(e.target.value)}
      />
      <TextField
        label="IMAP Host"
        fullWidth
        margin="normal"
        value={imapHost}
        onChange={(e) => setImapHost(e.target.value)}
      />
      <TextField
        label="IMAP Port"
        type="number"
        fullWidth
        margin="normal"
        value={imapPort}
        onChange={(e) => setImapPort(Number(e.target.value))}
      />
      <Button variant="contained" color="primary" onClick={handleSaveSettings}>
        Save Settings
      </Button>
    </Container>
  );
};

export default SettingsPage;
