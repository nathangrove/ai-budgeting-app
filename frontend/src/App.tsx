import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button } from '@material-ui/core'; // Import Button
import './App.css';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import HomePage from './pages/HomePage'; 
import EmailCheckPage from './pages/EmailCheckPage';
import AccountsPage from './pages/AccountsPage'; // Import AccountsPage
import TransactionsPage from './pages/TransactionsPage'; // Import TransactionsPage
import { UserContext } from './contexts/UserContext';
import { checkLoggedIn } from 'clients/user.client';

const AppContent: React.FC = () => {
  const { user, setUser } = useContext(UserContext);
  const history = useHistory();

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setUser(null);
      history.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    checkLoggedIn().then(loggedInUser => {
      if (loggedInUser) {
        setUser(loggedInUser);
      }
      // Redirect to login page if not logged in
      else if (!loggedInUser) {
        history.push('/login');
      }
    }).catch(error => {
      console.error('Error checking login status:', error);
      // Handle error, e.g., redirect to login page
      history.push('/login');
    });
  },[]);

  useEffect(() => {
    // Check if user is logged in and redirect accordingly
    if (user) history.push('/');
  }, [user, history]);

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Link to={'/'} ><Typography variant="h6" style={{ flexGrow: 1 }}>Budgeting App</Typography></Link>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/" exact component={HomePage} />
          <Route path="/email-check" component={EmailCheckPage} /> {/* Add EmailCheckPage route */}
          <Route path="/accounts" component={AccountsPage} /> {/* Add AccountsPage route */}
          <Route path="/transactions" component={TransactionsPage} /> {/* Add TransactionsPage route */}
          {/* Add other routes here */}
        </Switch>
      </Container>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <AppContent />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
