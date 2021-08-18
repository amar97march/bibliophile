import React, { useEffect, useState } from "react";
import { alpha, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import MoreIcon from "@material-ui/icons/MoreVert";
import { SearchBook } from "../../services/auth";
import Pagination from "@material-ui/lab/Pagination";
import '../../css/home.css'
import { useHistory, Link } from "react-router-dom";
import { getHomePageData } from "../../services/auth";
import BookNA from "../../Assets/book_na.jpg"
import ProfileBook from "../profile/profile_book";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));



function BookItem(props) {
  return (
    <div className="order-inner-product col-md-3 col-sm-4 col-6">
      <div className="container">
        <div className="image-product-id">
          <Link
            to={"/book_info/"+props.productId}
          >
            <div className="image">
              <img className="img-item" src={props.image} alt="" />
            </div>
          </Link>
        </div>
        <div className="item-info">
          <div className="name">{props.title}</div>
          <div className="quantity">Author: {props.author}</div>
          <div className="size">Page Count: {props.pageCount}</div>
        </div>
        <div className="item-price">
          <div>Price: {props.price} {props.currency}</div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [timeout, setTimeout] = useState(0);
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("")
  const [totalPages, setTotalPages] = useState(0)
  const [topRatedBooks, setTopRatedBooks] = useState([])
  const [topPopularBooks, setTopPopularBooks] = useState([])
  const [friendRequestCount, setFriendRequestCount] = useState(0)
  let history = useHistory()

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    

  };

  const handleProfileMenuClick = () => {
    history.push("/profile/")
  }

  const handleFreindMenuOpen = () => {
    history.push("/friends/")
  }

  const fetchItems= ()=>{
    getHomePageData()
    .then((res) => {
      console.log(res);

      setTopRatedBooks(res.data.data.top_rating_books);
      setTopPopularBooks(res.data.data.top_popular_books);
      setFriendRequestCount(res.data.data.friend_request_count);
    })
    .catch((err) => {});
  }

  useEffect(
    fetchItems, []);

  const searchTrigger = (event) => {
    var search_text = event.target.value; // this is the search text
    setSearchText(search_text)
    // if(timeout) clearTimeout(this.timeout);
    // timeout = setTimeout(() => {
    //search function

    SearchBook(search_text, page)
      .then((res) => {
        console.log(res);
        if (res.data.totalItems % 10 > 0){
            setTotalPages(Math.floor((res.data.totalItems/10)+1))
        }
        else{
        setTotalPages(Math.floor(res.data.totalItems/10))
        }
        if (res.data.totalItems > 0){
        setBooks(res.data.items);
        }
        else{
            setBooks([]);
        }
      })
      .catch((err) => {});
    // }, 300);
    console.log(event.target.value);
  };


  const handleChange = (event, value) => {
    setPage(value);
    SearchBook(searchText, value)
      .then((res) => {
        console.log(res);
        setBooks(res.data.items);
      })
      .catch((err) => {});
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfileMenuClick}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleFreindMenuOpen}>
        <IconButton aria-label="show friend requests" color="inherit">
          <Badge badgeContent={friendRequestCount} color="secondary">
            <PeopleAltIcon />
          </Badge>
        </IconButton>
        <p>Friends</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>

          <Typography className={classes.title} variant="h6" noWrap>
            Bibliophile
          </Typography>

          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              onChange={searchTrigger}
              inputProps={{ "aria-label": "search" }}
            />
          </div>

          <div className={classes.grow} />

          <div className={classes.sectionDesktop}>
            <IconButton aria-label="show new freind requests" onClick={handleFreindMenuOpen} color="inherit">
              <Badge badgeContent={friendRequestCount} color="secondary">
                <PeopleAltIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>

          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    <div className="books-list-container">
      {books.map((noteItem) => (
        <BookItem
        key={noteItem.id}
        productId = {noteItem.id}
        image={noteItem.volumeInfo.imageLinks ? noteItem.volumeInfo.imageLinks.thumbnail:BookNA}
        title={(noteItem.volumeInfo.title.length < 24)?noteItem.volumeInfo.title:noteItem.volumeInfo.title.substring(0,25)+"..."}
        author = {noteItem.volumeInfo.authors && noteItem.volumeInfo.authors[0]}
        pageCount = {noteItem.volumeInfo && noteItem.volumeInfo.pageCount}
        description = {noteItem.volumeInfo.description}
        price = {noteItem.saleInfo.retailPrice ? noteItem.saleInfo.retailPrice.amount:"NA"}
        currency = {noteItem.saleInfo.retailPrice ? noteItem.saleInfo.retailPrice.currencyCode:""}
      />
        // <div>
        //     <div>Id: {noteItem.id}</div>
        //     <div>Title: {noteItem.volumeInfo.title}</div>
        //     <div>Author: {noteItem.volumeInfo.authors && noteItem.volumeInfo.authors[0]}</div>
        //     <div>Publisher: {noteItem.publisher}</div>
        //     <div>Description: {noteItem.description}</div>
        //     <div>Page Count: {noteItem.volumeInfo && noteItem.volumeInfo.pageCount}</div>
        //     <img src = {noteItem.volumeInfo.imageLinks && noteItem.volumeInfo.imageLinks.thumbnail} alt = "Book cover"/>
        //     <br/>
        //     <br/>
        //     <br/>
        //     </div>
      ))}
        </div>
      <Pagination
        count={totalPages}
        showFirstButton
        showLastButton
        onChange={handleChange}
      />
      <div className = "extra-section">
            <h1>Top Rated Books</h1>
            <hr/>
            <div className="books-list-container">
              {topRatedBooks.map((item) => (
                
                <ProfileBook title = {item.title} image_link = {item.image_link} unique_book_id = {item.unique_book_id}/>
              ))}
            </div>
          </div>
          <div className = "extra-section">
            <h1>Popupar Books</h1>
            <hr/>
            <div className="books-list-container">
              {topPopularBooks.map((item) => (
                
                <ProfileBook title = {item.title} image_link = {item.image_link} unique_book_id = {item.unique_book_id}/>
              ))}
            </div>
          </div>
          {/* <div className = "extra-section">
            <h1>Top Rated Books</h1>
            <hr/>
            <div className="books-list-container">
              {topRatedBooks.map((item) => (
                
                <ProfileBook title = {item.title} image_link = {item.image_link} unique_book_id = {item.unique_book_id}/>
              ))}
            </div>
          </div> */}
    </div>
  );
}
