// import logo from './logo.svg';
import { BrowserRouter as Router,Switch, Route } from 'react-router-dom';
import './App.css';
import LoginSection from './Containers/login_section'
import Home from './Components/home/home';
import axios from 'axios';
import MyProfile from './Components/profile/user_profile'
import FriendPage from './Components/friends/user_friends';
import BookInfoBox from './Containers/book-info-box'
import UserProfile from './Components/profile/friend_profile'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

function App() {
  return (
    <Router>
    <div className = "App">
      <Switch>
        <Route path="/home/" exact component={Home}/>
        <Route path="/book_info/:book_id/" exact component={(props) => <BookInfoBox {...props}/>}/>
        <Route path="/profile/" exact component={MyProfile}/>
        <Route path="/user_profile/:user_id/" exact component={(props) => <UserProfile {...props}/>}/>
        <Route path="/friends/" exact component={FriendPage}/>
        <Route path="/" component={LoginSection} />
        {/* <Route component = {RouterUrl}/> */}
        </Switch>
    </div>
    </Router>
  );
}


export default App;
