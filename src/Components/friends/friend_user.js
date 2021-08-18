import React from "react";
import default_pic from "../../Assets/profile.jpeg"
import { Link } from "react-router-dom";

const FriendsUser = (props) => {


  return (
    <div className="friend-inner-section col-md-3 col-sm-4 col-6">
      <Link
                    to={"/user_profile/"+props.user_id+"/"}
                  >
                <div className="container">
                <div className="image-product-id">
                  
                    <div className="image">
                      <img className="img-item" src={(props.image_link!=null)?props.image_link:default_pic} alt="" />
                    </div>
                  
                </div>
                <div className="item-info">
                  <div className="name">{props.email}</div>
                </div>
                </div>

                </Link>
                </div>
  );
};
export default FriendsUser;
