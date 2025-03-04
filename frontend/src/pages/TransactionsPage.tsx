import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@material-ui/core';
import { Transaction } from '../types/transaction';

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Fetch transactions from the API
    fetch('/api/transactions')
      .then(response => response.json())
      .then(data => setTransactions(data))
      .catch(error => console.error('Error fetching transactions:', error));
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Transactions</Typography>
      <List>
        {transactions.map(transaction => (
          <ListItem key={transaction._id}>
            <ListItemText
              primary={transaction.description}
              secondary={`Amount: $${transaction.amount} - Date: ${transaction.date}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default TransactionsPage;
