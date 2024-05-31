import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Categories from "./mainpages/categories/Categories";
import Register from "./mainpages/auth/Register";
import Login from "./mainpages/auth/Login";
import Products from "./mainpages/products/Products";
import CreateProduct from "./mainpages/createProduct/CreateProduct";
import DetailProduct from "./mainpages/detailProduct/DetailProduct";
import CreateRecipe from "./mainpages/createRecipe/CreateRecipe";
import Cart from "./mainpages/cart/Cart";
import UpdateUser from "./mainpages/users/UpdateUser";
import UserList from "./mainpages/users/UserList";
import Recipe from "./mainpages/recipe/Recipe";
import UserProfile from "./mainpages/userProfile/UserProfile";
import Success from "./utils/Success";
import NotFound from "./mainpages/not_found/NotFound";
import { GlobalState } from "../GlobalState";
import Home from "./headers/Home";
import Review from "./mainpages/review/Review";
import GetReviews from "./mainpages/review/GetReviews";

function Pages(){
    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin
    return(
        <Routes>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/category" element={<Categories/>}/>
            <Route path="/product" element={<Products/>}/>
            <Route path='/create_product' element={isAdmin?<CreateProduct/>: <NotFound/>}/>
            <Route path="/edit_product/:id" element={isAdmin?<CreateProduct/>: <NotFound/>}/>
            <Route path="/detail/:id" element={<DetailProduct/>}></Route>
            <Route path="/create_recipe" element={<CreateRecipe/>}/>
            <Route path="/cart" element={isLogged? <Cart/>: <NotFound/>}/>
            <Route path="/updateUser/:id" element={isLogged?<UpdateUser/>: <NotFound/>}/>
            
            <Route path="/allUsers" element={isAdmin? <UserList/>: <NotFound/>}/>
            <Route path="/recipes" element={<Recipe/>}/>
            <Route path="/edit_recipe/:id" element={isLogged? <CreateRecipe/>: <NotFound/>}/>
            <Route path="/userProfile/:id" element={isLogged? <UserProfile/> :<NotFound/>}/>
            <Route path="/sucess" element={<Success/>}/>
            <Route path="/" element={<Home/>}/>
            <Route path="/postReview/:id" element={<Review/>}/>
            <Route path="/getReviews" element={<GetReviews/>}/>
        </Routes>

    )
}

export default Pages;