import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import "../../css/profile-section.css";
import { getUserProfileData, sendFriendRequest } from "../../services/auth";
import default_pic from "../../Assets/profile.jpeg";
import ProfileBook from "./profile_book";
import FriendsUser from "../friends/friend_user";
import {useHistory} from 'react-router-dom';


const UserProfile = (props) => {
  const user_id = props.match.params.user_id;

  let history = useHistory();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [requestedStatus, setRequestedStatus] = useState(false);
  const [phone, setPhone] = useState("");
  const [requestBtntext, setRequestText] = useState("Add Friend");
  const [description, setDescription] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [readlist, setReadlist] = useState([]);
  const [shelflist, setShelflist] = useState([]);
  const [friends, setFriends] = useState([]);

  const fetchItems = () => {
    getUserProfileData(user_id)
      .then((res) => {
        console.log(res);

        setFirstName(res.data.data.first_name ? res.data.data.first_name : "");
        setLastName(res.data.data.last_name ? res.data.data.last_name : "");
        setPhone(res.data.data.phone);
        setEmail(res.data.data.email);
        if (res.data.data.request_status === 0){
          setRequestedStatus(false)
          setRequestText("Add Friend")
        }
        else if (res.data.data.request_status === 1){
          setRequestedStatus(true)
          setRequestText("Requested")
        }
        else if (res.data.data.request_status === 4){
          setRequestedStatus(true)
          setRequestText("My Profile")
        }
        else{
          setRequestedStatus(true)
          setRequestText("Friend")

        }
        setDescription(
          res.data.data.description != null ? res.data.data.description : ""
        );
        setProfilePicUrl(res.data.data.profile_image);
        console.log(res.data.data.wishlist_list);
        setWishlist(res.data.data.wishlist_list);
        setShelflist(res.data.data.shelflist_list);
        setReadlist(res.data.data.readlist_list);
        setFriends(res.data.data.friends);
      })
      .catch((err) => {
        if (err.response.status === 401){
          history.push("/");
        }
      });
  };

  const onAddFriendClick = () => {
    const payload = {
      receiver_id: user_id
      }
      sendFriendRequest(payload)
      .then((res) => {
        console.log(res);
        setRequestedStatus(true)
        setRequestText("Requested")

      })
      .catch((err) => {
        if (err.response.status){
          history.push("/")
        }
        alert("Please try again later")
      });
    
  };

  useEffect(fetchItems, [user_id]);

  return (
    <div className="profile_section">
      <h3 className = "nav-heading">User Profile</h3>
      <div className="profile-subsection row">
        <div className="profile-image column">
          <img
            src={profilePicUrl ? profilePicUrl : default_pic}
            alt="Profile"
          />
          <div className="accept-btn">
            <Button disabled =  {requestedStatus} onClick={onAddFriendClick} variant="contained" color="primary">
              {requestBtntext}
            </Button>
          </div>
        </div>
        <div className="profile-form column">
          <div className="user-info">
            <div className="name">
              Name: {firstName} {lastName}
            </div>
            <div className="email">Email: {email}</div>
            <div className="phone">Phone Number: {phone}</div>
            <div className="description">Description: {description}</div>
          </div>
          <div className="extra-section">
            <h1>Currently reading</h1>
            <hr />
            <div className="books-list-container">
              {readlist.map((item) => (
                <ProfileBook
                  title={item.title}
                  image_link={item.image_link}
                  unique_book_id={item.unique_book_id}
                />
              ))}
            </div>
          </div>
          <div className="extra-section">
            <h1>Wishlist</h1>
            <hr />
            <div className="books-list-container">
              {wishlist.map((item) => (
                <ProfileBook
                  title={item.title}
                  image_link={item.image_link}
                  unique_book_id={item.unique_book_id}
                />
              ))}
            </div>
          </div>
          <div className="extra-section">
            <h1>Bookshelf</h1>
            <hr />
            <div className="books-list-container">
              {shelflist.map((item) => (
                <ProfileBook
                  title={item.title}
                  image_link={item.image_link}
                  unique_book_id={item.unique_book_id}
                />
              ))}
            </div>
          </div>
          <div className="extra-section">
            <h1>Friends</h1>
            <hr />
            <div className="friends-list-container">
              {friends.map((item) => (
                <FriendsUser
                  key={item.id}
                  fetchItems={fetchItems}
                  email={item.user.email}
                  image_link={item.user.profile_image}
                  user_id={item.user.id}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserProfile;
