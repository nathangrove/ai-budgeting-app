import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { user } = useContext(UserContext);

  return (
    <div>
      <h1>Welcome, {user?.email}!</h1>
      <p>This is your home page.</p>
      <Link to="/settings">Go to Settings</Link>
      <br/>
      <Link to="/email-check">Check Email</Link>
      <br/>
      <Link to="/accounts">Manage Accounts</Link>
      <br/>
      <Link to="/transactions">View Transactions</Link>
      <br/>
    </div>
  );
};

export default HomePage;
