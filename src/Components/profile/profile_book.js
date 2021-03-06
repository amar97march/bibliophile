import React from "react";
import BookNA from "../../Assets/book_na.jpg"
import { Link } from "react-router-dom";

const ProfileBook = (props) => {


  return (
    <div className="order-inner-product col-md-3 col-sm-4 col-6">
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
                  <div className="name">{props.title}</div>
                </div>
                </div>


                </div>
  );
};
export default ProfileBook;
