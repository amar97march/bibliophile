import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import Button from "@material-ui/core/Button";
import "../../css/friend-section.css";
import { getFriendsData, updateProfileData } from "../../services/auth";
import default_pic from "../../Assets/profile.jpeg"
import FriendsUser from "./friend_user";

const defaultValues = {
  first_name: "",
  last_name: "",
  phone: 0,
  email: "",
  description: "",
};
const FriendPage= () => {
  const [pendingRequests, setPendingRequest] = useState([]);
  const [friends, setFriends] = useState([]);

  const fetchItems= ()=>{
    getFriendsData()
    .then((res) => {
      console.log("aaaaaa",res);
      setPendingRequest(res.data.data.pending)
      setFriends(res.data.data.friends)
    })
    .catch((err) => {});
  }

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   console.log(formValues);
  //   updateProfileData(formValues)
  //   .then((res) => {
  //     console.log(res);
  //     alert("Updated")
  //   })
  //   .catch((err) => {
  //     alert("Please try again later")
  //   });
    
  // };

  useEffect(
    fetchItems, []);


  return (
    <div className="friend_section">
      <h3>Friends</h3>
      <div className="friend-subsection row">
        <div className="friend-image column">
          
        </div>
        <div className="friend-form column">
          <div className = "extra-section">
            <h1>Pending Friend Requests</h1>
            <hr/>
            <div className="friends-list-container">
              {pendingRequests.map((item) => (
                <FriendsUser email = {item.user.email} image_link = {item.user.profile_image} user_id = {item.id}/>
              ))}
            </div>
            
          </div>
          <div className = "extra-section">
            <h1>Friends</h1>
            <hr/>
            <div className="friends-list-container">
              {friends.map((item) => (
                <FriendsUser email = {item.user.email} image_link = {item.user.profile_image} uset_id = {item.id}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FriendPage;
