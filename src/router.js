import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
const MyOrderPage = lazy(() => import("./components/MyOrder"));
const AddressBook = lazy(() => import("./components/AddressBook"));
const WishlistPage = lazy(() => import("./components/WishlistPage"));
const AccountPage = lazy(() => import("./components/MyAccount"));
const ContactUsPage = lazy(() => import("./components/ContactUs"));

export default (
    <Switch>
        {/* <Route path='/:main_category/:sub_category/:name/:id/buy' exact/>
        <Route path="/cart_page/"/> 
        <Route path="/wishlist/" exact component={(props) => <WishlistPage/>} />
        <Route path="/account_page/"  priority ={0.8} exact component={AccountPage}/>
        <Route path="/address_book/" exact component={AddressBook}/>
        <Route path="/my_orders/" exact component={MyOrderPage}/>
        <Route path="/contact_us/" exact component={ContactUsPage}/> */}
        </Switch>
    )
    