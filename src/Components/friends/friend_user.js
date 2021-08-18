import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import StarRatings from 'react-star-ratings';
import BookNA from "../../Assets/book_na.jpg"
import { Link } from "react-router-dom";

const FriendsUser = (props) => {


  return (
    <div className="friend-inner-section col-md-3 col-sm-4 col-6">
                <div className="container">
                <div className="image-product-id">
                  <Link
                    to={"/book_info/"+props.unique_book_id}
                  >
                    <div className="image">
                      <img className="img-item" src={(props.image_link!=null)?props.image_link:BookNA} alt="" />
                    </div>
                  </Link>
                </div>
                <div className="item-info">
                  <div className="name">{props.email}</div>
                </div>
                </div>


                </div>
  );
};
export default FriendsUser;
