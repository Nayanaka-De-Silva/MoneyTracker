import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { WalletContextProvider } from './context/WalletContext';
import AddBudget from './routes/AddBudget';
import AddTransaction from './routes/AddTransaction';
import AddWallet from './routes/AddWallet';
import CategoryView from './routes/CategoryView';
import EditWallet from './routes/EditWallet';
import Home from './routes/Home';
import Login from './routes/Login';
import Register from './routes/Register';
import SessionExpired from './routes/SessionExpired';
import WalletView from './routes/WalletView';

function App() {
  return (
    <div>
      <WalletContextProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route path="/home" component={Home} />
          <Route path="/addWallet" component={AddWallet} />
          <Route path="/editWallet" component={EditWallet} />
          <Route path="/walletView" component={WalletView} />
          <Route path="/addTransaction" component={AddTransaction} />
          <Route path="/session" component={SessionExpired} />
          <Route path="/categoryView" component={CategoryView} />
          <Route path="/addBudget" component={AddBudget} />
        </Switch>
      </Router>
      </WalletContextProvider>
    </div>
  );
}

export default App;
