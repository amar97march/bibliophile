import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import StarRatings from 'react-star-ratings';
// import "../css/book-info.css";

const BookInfo = (props) => {


  return (
    <div className = "book-info">
        <div className="published-date">{props.publishedDate.substring(0,4)}</div>
        <div className = "title">{props.title}</div>
        <div className = "author">{props.author}</div>
        <div className = "reviews"><StarRatings
        rating={props.rating}
        starDimension="40px"
        starSpacing="15px"
      />
      ( {props.totalReviews} )
      </div>
        <div className = "description">
            {parse(props.description)}</div>

    </div>
  );
};
export default BookInfo;
