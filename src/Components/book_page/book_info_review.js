import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import "../../css/book-info.css";
import { addBookReview } from "../../services/auth";
import StarRatings from "react-star-ratings";
import { Link, useHistory } from "react-router-dom";

const defaultValues = {
  review: "",
};
const BookReviews = (props) => {
  let history = useHistory();
  const [formValues, setFormValues] = useState(defaultValues);
  const [rating, setRating] = useState(0);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const changeRating = (newRating, name) => {
    setRating(newRating);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      book_id: props.bookId,
      comment: formValues.review,
      rating: rating,
    };
    addBookReview(data)
      .then((res) => {
        console.log(res);
        props.fetchItems()
      })
      .catch((err) => {
        if (err.response.status){
          history.push("/login/");
        }
        console.log("Please try again later");
      });
  };

  //   useEffect(
  //     fetchItems, []);

  return (
    <div className="review_section">
      <div className="review-form column">
        <h1>What is you rate?</h1>
        <div className="reviews">
          <StarRatings
            rating={rating}
            changeRating={changeRating}
            starRatedColor="yellow"
            starDimension="40px"
            starSpacing="15px"
          />
        </div>
        <form onSubmit={handleSubmit}>
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            direction="column"
          >
            <Grid item>
              <TextField
                id="review-input"
                name="review"
                label="Review"
                type="text"
                value={formValues.review}
                onChange={handleInputChange}
              />
            </Grid>
            <Button variant="contained" color="primary" type="submit">
              Add
            </Button>
          </Grid>
        </form>
        <div>
          <h1>Reviews</h1>
          {props.reviews.map((review_item) => (
            <div className = "user-review">
              <div className = "review-details">
              <div className = "review-user"><Link
                    to={"/user_profile/"+review_item.user_id+"/"}
                  >{review_item.user}</Link></div>
              <div className = "review-timestamp">{new Date(review_item.timestamp).toLocaleString()}</div>
              </div>
              <div style={{"clear": "both"}} ></div>
              <div>
                <StarRatings
                  rating={review_item.rating}
                  starRatedColor="yellow"
                  starDimension="20px"
                  starSpacing="8px"
                />
              </div>
              <div className= "comment">{review_item.comment}</div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default BookReviews;
