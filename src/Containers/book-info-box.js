import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import BookInfo from "../Components/book_page/book_page_info";
import BookReviews from "../Components/book_page/book_info_review";
import Box from "@material-ui/core/Box";
import { getBookInfo, getBookReviews, addReadlist, addWishlist, addShelflist } from "../services/auth";
import BookNA from "../Assets/book_na.jpg";
import wishlist_img from "../Assets/wishlist.png";
import wishlist_disable_img from "../Assets/wishlist_disable.png";
import shelflist_img from "../Assets/shelf.png";
import shelflist_disable_img from "../Assets/shelf_disable.png";
import readlist_img from "../Assets/readlist.png";
import readlist_disable_img from "../Assets/readlist_disable.png";
import BookReaders from "../Components/book_page/book_readers";
import "../css/book-info.css";

const BookInfoBox = (props) => {
  const book_id = props.match.params.book_id;

  const [value, setValue] = useState(0);
  const [wishlistStatus, setWishlistStatus] = useState(false);
  const [readlistStatus, setReadlistStatus] = useState(false);
  const [shelflistStatus, setShelflistStatus] = useState(false);
  const [readers, setReaders] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const onWishlistClick = () => {
    const payload = {book_id: book_id,
    status:  !(wishlistStatus)}
    addWishlist(payload)
    .then((res) => {
      if (res.data.status === true){
        setWishlistStatus(true)
      }
      else {
        setWishlistStatus(false)
      }
      
      
      
    })
    .catch((err) => {
      console.log("Wishlist not processed");
    });

  }

  const onReadlistClick = () => {
    const payload = {book_id: book_id,
    status:  !(readlistStatus)}
    addReadlist(payload)
    .then((res) => {
      if (res.data.status === true){
        setReadlistStatus(true)
        fetchItems()
      }
      else {
        setReadlistStatus(false)
      }
      
      
      
    })
    .catch((err) => {
      console.log("Readlist not processed");
    });

  }

  const onShelflistClick = () => {
    const payload = {book_id: book_id,
    status:  !(shelflistStatus)}
    addShelflist(payload)
    .then((res) => {
      if (res.data.status === true){
        setShelflistStatus(true)
      }
      else {
        setShelflistStatus(false)
      }
      
      
      
    })
    .catch((err) => {
      console.log("Shelflist not processed");
    });

  }


  const paperStyle = { width: "90%", margin: "20px auto" };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box>{children}</Box>}
      </div>
    );
  }
  const [publishedDate, setPublishedDate] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [totalReviews, setTotalReviews] = useState(0);
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  const fetchItems = () => {
    getBookInfo(book_id)
      .then((res) => {
        setPublishedDate(res.data.volumeInfo.publishedDate);
        setDescription(
          res.data.volumeInfo.description
            ? res.data.volumeInfo.description
            : "<p>Description not available</p?"
        );
        setTitle(res.data.volumeInfo.title);
        setAuthor(
          res.data.volumeInfo.authors ? res.data.volumeInfo.authors[0] : "NA"
        );
        // if (res.data.volumeInfo.imageLinks.hasOwnProperty("large")) {
        //   setImage(res.data.volumeInfo.imageLinks.large);
        // } else if (res.data.volumeInfo.imageLinks.hasOwnProperty("medium")) {
        //   setImage(res.data.volumeInfo.imageLinks.medium);
        // } else if (res.data.volumeInfo.imageLinks.hasOwnProperty("small")) {
        //   setImage(res.data.volumeInfo.imageLinks.small);
        // } else 
        if (res.data.volumeInfo.imageLinks.hasOwnProperty("thumbnail")) {
          setImage(res.data.volumeInfo.imageLinks.thumbnail);
        } else {
          setImage(BookNA);
        }
      })
      .catch((err) => {});

    getBookReviews(book_id)
      .then((res) => {
        setTotalReviews(res.data.data.review_count);
        setRating(res.data.data.average_rating);
        setReviews(res.data.data.reviews)
        setWishlistStatus(res.data.data.wishlist_status);
        setReadlistStatus(res.data.data.readlist_status);
        setShelflistStatus(res.data.data.shelflist_status);
        setReaders(res.data.data.reading_users);
      })
      .catch((err) => {});
  };

  useEffect(fetchItems, [book_id]);

  return (
    <div className="book-info-root">
      <div className="book-info-outer-section row">
        <div className="background-left column">
          <img src={image} alt="book cover" />
        </div>
        <div className="background-right column">
          <div className="user-btn-section">
            <button onClick = {onWishlistClick}>
              <img
                className="wishlist_image"
                alt=""
                src={wishlistStatus ? wishlist_img : wishlist_disable_img}
              />
            </button>
            <button onClick = {onShelflistClick}>
              <img
                className="shelflist_image"
                alt=""
                src={shelflistStatus ? shelflist_img : shelflist_disable_img}
              />
            </button>
            <button onClick = {onReadlistClick}>
              <img
                className="readlist_image"
                alt=""
                src={readlistStatus ? readlist_img : readlist_disable_img}
              />
            </button>
          </div>
          <div className="book-info-inner">
            <Paper elevation={20} style={paperStyle}>
              <Tabs
                value={value}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChange}
                aria-label="disabled tabs example"
              >
                <Tab label="Info" />
                <Tab label="Reviews" />
                <Tab label="Readers"></Tab>
              </Tabs>
              <TabPanel value={value} index={0}>
                <BookInfo
                  bookId={book_id}
                  publishedDate={publishedDate}
                  title={title}
                  author={author}
                  description={description}
                  rating={rating}
                  totalReviews={totalReviews}
                />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <BookReviews
                  fetchItems={fetchItems}
                  bookId={book_id}
                  reviews={reviews}
                />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <BookReaders
                  friends = {readers}
                />
              </TabPanel>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BookInfoBox;
