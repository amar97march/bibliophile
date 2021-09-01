import React from "react";
import default_pic from "../../Assets/profile.jpeg"
import { Link } from "react-router-dom";
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from "@material-ui/core";
import { updateFriendRequest } from "../../services/auth";
import {useHistory} from 'react-router-dom';
import '../../css/friend-section.css'

const FriendsUserRequest = (props) => {
  let history = useHistory();

  const onAcceptClick = () => {
    const payload = {"request_id":props.request_id,
                "status":true
    }
    updateFriendRequest(payload)
    .then((res) => {
      console.log(res);
      props.fetchItems()
      
    })
    .catch((err) => {
      if (err.response.status === 401){
        history.push("/");
      }
      alert("Please try again later")
    });
  }

  const onDeclineClick = () => {
    const payload = {"request_id":props.request_id,
                "status":false
    }
    updateFriendRequest(payload)
    .then((res) => {
      console.log(res);
      props.fetchItems()
    })
    .catch((err) => {
      if (err.response.status === 401){
        history.push("/");
      }
      alert("Please try again later")
    });
  }



  return (
    <div className="friend-inner-section">
                <div className="container">
                <div className="image-product-id">
                  <Link
                    to={"/user_profile/"+props.user_id}
                  >
                    <div className="image">
                      <img className="img-item" src={(props.image_link!=null)?props.image_link:default_pic} alt="" />
                      <div className="mobile-name">{props.email}</div>
                    </div>
                  </Link>
                </div>
                <div className="item-info">
                  <div className="name">{props.email}</div>
                </div>
                <div className="item-info">
                  <div className="accept-btn"><Button onClick = {onAcceptClick} variant="contained" color="primary"
        startIcon={<DeleteIcon />}>Accept</Button></div>
                  <div className="reject-btn"><Button onClick = {onDeclineClick} variant="contained"
        color="secondary"
        startIcon={<DeleteIcon />}>Decline</Button></div>
                </div>
                </div>


                </div>
  );
};
export default FriendsUserRequest;
