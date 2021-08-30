import React, { useState, useEffect } from "react";
import "../../css/friend-section.css";
import { getFriendsData } from "../../services/auth";
import FriendsUser from "./friend_user";
import FriendsUserRequest from "./friend_user_request";
import {useHistory} from 'react-router-dom';

const FriendPage= () => {
  let history = useHistory();
  const [pendingRequests, setPendingRequest] = useState([]);
  const [friends, setFriends] = useState([]);

  const fetchItems= ()=>{
    getFriendsData()
    .then((res) => {
      setPendingRequest(res.data.data.pending)
      setFriends(res.data.data.friends)
    })
    .catch((err) => {
      if (err.response.status){
        history.pushState("/");
      }
    });
  }

  useEffect(
    fetchItems, []);


  return (
    <div className="friend_section">
      <h3 className = "nav-heading">Friends</h3>
      <div className="friend-subsection row">
        <div className="friend-image column">
          <h2>My Friends</h2>
        </div>
        <div className="friend-form column">
          <div className = "extra-section">
            <h1>Pending Friend Requests</h1>
            <hr/>
            <div className="friends-list-container">
              {pendingRequests.length !== 0?
              pendingRequests.map((item) => (
                <FriendsUserRequest key = {item.id} fetchItems ={fetchItems} email = {item.user.email} image_link = {item.user.profile_image} request_id = {item.id} user_id = {item.user.id}/>
              )):<div style = {{"textAlign":"center", "marginTop":"40px", "marginBottom":"40px"}} >No pending requests</div>}
            </div>
            
          </div>
          <div className = "extra-section">
            <h1>Friends</h1>
            <hr/>
            <div className="friends-list-container">
              {friends.length !== 0?
              friends.map((item) => (
                <FriendsUser key = {item.id} fetchItems = {fetchItems} email = {item.user.email} image_link = {item.user.profile_image} user_id = {item.user.id}/>
              )):<div style = {{"textAlign":"center", "marginTop":"40px", "marginBottom":"40px"}}>No friends yet</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FriendPage;
