import React from "react";
import "../../css/book-info.css";
import BookReader from "./book_reader_user";

const BookReaders = (props) => {

  return (
    <div className="review_section">
      <div className="review-form column">
        <div>
          <h1>Readers</h1>
          {props.friends.map((friend_item) => (
            <BookReader
            key={friend_item.id}
            email={friend_item.user.email}
            image_link={friend_item.user.profile_image}
            user_id={friend_item.user.id}
          />
          ))}
        </div>
      </div>
    </div>
  );
};
export default BookReaders;
