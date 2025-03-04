import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Account } from '../types/account';
import { Container, TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, MenuItem } from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';

const AccountsPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newAccount, setNewAccount] = useState({ name: '', type: '', balance: 0, number: '', institution: '' });
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get<Account[]>('/api/accounts');
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleAddAccount = async () => {
    try {
      const response = await axios.post('/api/accounts', newAccount);
      setAccounts([...accounts, response.data]);
      setNewAccount({ name: '', type: '', balance: 0, number: '', institution: '' });
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  const handleEditAccount = async (id: string) => {
    try {
      const response = await axios.put(`/api/accounts/${id}`, editingAccount);
      setAccounts(accounts.map(account => account._id === id ? response.data : account));
      setEditingAccount(null);
    } catch (error) {
      console.error('Error editing account:', error);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      await axios.delete(`/api/accounts/${id}`);
      setAccounts(accounts.filter(account => account._id !== id));
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Accounts</Typography>
      <List>
        {accounts.map(account => (
          <ListItem key={account._id}>
            <ListItemText primary={`${account.name} - ${account.type} - ${account.balance}`} />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => setEditingAccount(account)}>
                <Edit />
              </IconButton>
              <IconButton edge="end" onClick={() => handleDeleteAccount(account._id)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      { !editingAccount && (<>
      <Typography variant="h5" gutterBottom>Add Account</Typography>
      <TextField
        label="Name"
        value={newAccount.name}
        onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        select
        label="Type"
        value={newAccount.type}
        onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value })}
        fullWidth
        margin="normal"
      >
        <MenuItem value="bank">Bank</MenuItem>
        <MenuItem value="credit">Credit</MenuItem>
        <MenuItem value="charge">Charge</MenuItem>
      </TextField>
      <TextField
        label="Balance"
        type="number"
        value={newAccount.balance}
        onChange={(e) => setNewAccount({ ...newAccount, balance: parseFloat(e.target.value) })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Number"
        value={newAccount.number}
        onChange={(e) => setNewAccount({ ...newAccount, number: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Institution"
        value={newAccount.institution}
        onChange={(e) => setNewAccount({ ...newAccount, institution: e.target.value })}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleAddAccount}>Add Account</Button>
      </>
      )}
      {editingAccount && (
        <div>
          <Typography variant="h5" gutterBottom>Edit Account</Typography>
          <TextField
            label="Name"
            value={editingAccount.name}
            onChange={(e) => setEditingAccount({ ...editingAccount, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Type"
            value={editingAccount.type}
            onChange={(e) => setEditingAccount({ ...editingAccount, type: e.target.value as typeof editingAccount.type })}
            fullWidth
            margin="normal"
          >
            <MenuItem value="bank">Bank</MenuItem>
            <MenuItem value="credit">Credit</MenuItem>
            <MenuItem value="charge">Charge</MenuItem>
          </TextField>
          <TextField
            label="Balance"
            type="number"
            value={editingAccount.balance}
            onChange={(e) => setEditingAccount({ ...editingAccount, balance: parseFloat(e.target.value) })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Number"
            value={editingAccount.number}
            onChange={(e) => setEditingAccount({ ...editingAccount, number: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Institution"
            value={editingAccount.institution}
            onChange={(e) => setEditingAccount({ ...editingAccount, institution: e.target.value })}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={() => handleEditAccount(editingAccount._id)}>Save Changes</Button>
        </div>
      )}
    </Container>
  );
};

export default AccountsPage;
