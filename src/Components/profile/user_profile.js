import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import Button from "@material-ui/core/Button";
import "../../css/profile-section.css";
import { getProfileData, updateProfileData } from "../../services/auth";
import default_pic from "../../Assets/profile.jpeg";
import ProfileBook from "./profile_book";
import FriendsUser from "../friends/friend_user";
import {useHistory} from 'react-router-dom';

const defaultValues = {
  first_name: "",
  last_name: "",
  phone: 0,
  email: "",
  description: "",
};
const MyProfile = () => {
  let history = useHistory();
  const [formValues, setFormValues] = useState(defaultValues);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [readlist, setReadlist] = useState([]);
  const [shelflist, setShelflist] = useState([]);
  const [friends, setFriends] = useState([]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const fetchItems = () => {
    getProfileData()
      .then((res) => {
        console.log(res);

        setFormValues({
          first_name: res.data.data.first_name,
          last_name: res.data.data.last_name,
          phone: res.data.data.phone,
          email: res.data.data.email,
          description:
            res.data.data.description != null ? res.data.data.description : "",
        });
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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formValues);
    updateProfileData(formValues)
      .then((res) => {
        console.log(res);
        alert("Updated");
      })
      .catch((err) => {
        if(err.response.status === 401){
          history.push("/");
        }
        alert("Please try again later");
      });
  };

  useEffect(fetchItems, []);

  return (
    <div className="profile_section">
      <h3>Profile</h3>
      <div className="profile-subsection row">
        <div className="profile-image column">
          <img
            src={profilePicUrl ? profilePicUrl : default_pic}
            alt="Profile"
          />
        </div>
        <div className="profile-form column">
          <form onSubmit={handleSubmit}>
            <Grid
              container
              alignItems="center"
              justify="center"
              direction="column"
            >
              <Grid item>
                <TextField
                  id="first-name-input"
                  name="first_name"
                  label="First Name"
                  type="text"
                  value={formValues.first_name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="last-name-input"
                  name="last_name"
                  label="Last Name"
                  type="text"
                  value={formValues.last_name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="email-input"
                  name="email"
                  label="Email"
                  type="email"
                  disabled
                  value={formValues.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="description-input"
                  name="description"
                  label="Description"
                  type="description"
                  multiline
                  variant="outlined"
                  value={formValues.description}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="phone-input"
                  name="phone"
                  label="Phone Number"
                  type="text"
                  value={formValues.phone}
                  onChange={handleInputChange}
                />
              </Grid>
              <Button variant="contained" color="primary" type="submit">
                Update
              </Button>
            </Grid>
          </form>
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
            <h1>My friends</h1>
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
export default MyProfile;
