// import logo from './logo.svg';
import { BrowserRouter as Router,Switch, Route } from 'react-router-dom';
import './App.css';
import LoginSection from './Containers/login_section'
import Home from './Components/home/home';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

function App() {
  return (
    <Router>
    <div className = "App">
      <Switch>
        <Route path="/home/" exact component={Home}/>
        <Route path="/" component={LoginSection} />
        {/* <Route component = {RouterUrl}/> */}
        </Switch>
    </div>
    </Router>
  );
}

export default App;
