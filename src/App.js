// import logo from './logo.svg';
import { BrowserRouter as Router,Switch, Route } from 'react-router-dom';
import './App.css';
import SignInOutContainer from './Containers';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

function App() {
  return (
    <Router>
    <div className = "App">
      <Switch>
        
        <Route path="/" component={SignInOutContainer} exact />
        {/* <Route path="/login/" component={Login} exact /> */}
        {/* <Route component = {RouterUrl}/> */}
        </Switch>
    </div>
    </Router>
  );
}

export default App;
