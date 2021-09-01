import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import Button from "@material-ui/core/Button";
import "../../css/profile-section.css";
import { getProfileData, updateProfileData } from "../../services/auth";
import default_pic from "../../Assets/profile.jpeg";
import ProfileBook from "./profile_book";
import FriendsUserProfile from "../friends/friend_user_profile";
import {useHistory} from 'react-router-dom';
import ImageCrop from "../../Containers/ImageCropper";
import { updateProfilePicture } from "../../services/auth";
import { CognitoUserAttribute, CognitoUserPool } from "amazon-cognito-identity-js";
import UserPool from "../../services/UserPool";

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
  const [modalShow, setModalShow] = useState(false);
  // const [imageChangedFlag, setImageChangedFlag] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  function setCropUrlFunction(url) {
    // setCropUrl(url);
    // setImageChangedFlag(true);
    let arr = url.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    let imageCrop = new File([u8arr], "imagename", { type: mime });


    // setCropUrlImage(imageCrop);
    // updateDetails(imageCrop);
    let form_data = new FormData();
    
      form_data.append("profile_image", imageCrop);
      updateProfilePicture(form_data)

      .then((res) => {
        // setImageChangedFlag(false);
        fetchItems()
      })
      .catch((err) => {
        console.log(err);
        alert("Details not saved. Contact Admin")
      });
  }

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
    
    var cognitoUser = UserPool.getCurrentUser();
    if (cognitoUser != null) {
      cognitoUser.getSession(function(err, session) {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        }
        
        const attributes = []
        var attributeList = [
          {"Name":"family_name",
          "Value":formValues["last_name"]
        },
        {"Name":"given_name",
        "Value":formValues["first_name"]
      },

      ];
        attributes.forEach(function (attribute){
          var attribute_obj = new CognitoUserAttribute(attribute);
        attributeList.push(attribute_obj);
      })
        

        cognitoUser.updateAttributes(attributeList, function(err, result) {
          if (err) {
            alert(err.message || JSON.stringify(err));
            return;
          }
          console.log('call result: ' + result);
        });


      });
    }
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
      <h3 className = "nav-heading">Profile</h3>
      <div className="profile-subsection row">
        <div className="profile-image column">
          <img
            src={profilePicUrl ? profilePicUrl : default_pic}
            alt="Profile"
          />
          <Button variant="primary" onClick={() => setModalShow(true)}>
              Update picture
            </Button>
            <ImageCrop
              aspectRatio = {1}
              show={modalShow}
              onHide={() => setModalShow(false)}
              setCropUrl={setCropUrlFunction}
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
              {readlist.length !== 0?
              readlist.map((item) => (
                <ProfileBook
                  title={item.title}
                  image_link={item.image_link}
                  unique_book_id={item.unique_book_id}
                />
              )):<div className = "empty-book-list">You are not reading anything</div>}
            </div>
          </div>
          <div className="extra-section">
            <h1>Wishlist</h1>
            <hr />
            <div className="books-list-container">
              {wishlist.length !== 0?
              wishlist.map((item) => (
                <ProfileBook
                  title={item.title}
                  image_link={item.image_link}
                  unique_book_id={item.unique_book_id}
                />
              )):<div className = "empty-book-list">No books</div>}
            </div>
          </div>
          <div className="extra-section">
            <h1>Bookshelf</h1>
            <hr />
            <div className="books-list-container">
            {shelflist.length !== 0?
              shelflist.map((item) => (
                <ProfileBook
                  title={item.title}
                  image_link={item.image_link}
                  unique_book_id={item.unique_book_id}
                />
              )):<div className = "empty-book-list">No books</div>}
            </div>
          </div>
          <div className="extra-section">
            <h1>My friends</h1>
            <hr />
            <div className="friends-list-container">
            {friends.length !== 0?
              friends.map((item) => (
                <FriendsUserProfile
                  key={item.id}
                  fetchItems={fetchItems}
                  email={item.user.email}
                  image_link={item.user.profile_image}
                  user_id={item.user.id}
                />
              )):<div className = "empty-book-list" style = {{"textAlign":"center", "marginTop":"40px", "marginBottom":"40px"}}>No friends</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MyProfile;
