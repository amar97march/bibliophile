import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import BookInfo from "../Components/book_page/book_page_info";
import Box from "@material-ui/core/Box";
import { getBookInfo, getBookReviews } from "../services/auth";
import BookNA from "../Assets/book_na.jpg";
import "../css/book-info.css";

const defaultValues = {
  first_name: "",
  last_name: "",
  phone: 0,
  email: "",
  description: "",
};
const BookInfoBox = (props) => {
  const book_id = props.match.params.book_id;

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
        if (res.data.volumeInfo.imageLinks.hasOwnProperty("large")) {
          setImage(res.data.volumeInfo.imageLinks.large);
        } else if (res.data.volumeInfo.imageLinks.hasOwnProperty("medium")) {
          setImage(res.data.volumeInfo.imageLinks.medium);
        } else if (res.data.volumeInfo.imageLinks.hasOwnProperty("small")) {
          setImage(res.data.volumeInfo.imageLinks.small);
        } else if (res.data.volumeInfo.imageLinks.hasOwnProperty("thumbnail")) {
          setImage(res.data.volumeInfo.imageLinks.thumbnail);
        } else {
          setImage(BookNA);
        }
      })
      .catch((err) => {});

    getBookReviews(book_id)
      .then((res) => {
        setTotalReviews(res.data.data.review_count)
        setRating(res.data.data.review)
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
              </Tabs>
              <TabPanel value={value} index={0}>
                <BookInfo
                  publishedDate={publishedDate}
                  title={title}
                  author={author}
                  description={description}
                  rating={rating}
                  totalReviews={totalReviews}
                />
              </TabPanel>
              <TabPanel value={value} index={1}>
                {/* <Signup /> */}
              </TabPanel>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BookInfoBox;
