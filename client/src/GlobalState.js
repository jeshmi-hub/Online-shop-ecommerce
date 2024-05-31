import React, {createContext, useState, useEffect} from 'react'
import UserAPI from './api/UserAPI';
import axios from 'axios';
import CategoriesAPI from './api/CategoriesAPI';
import ProductsAPI from './api/ProductAPI';
import RecipeAPI from './api/RecipeAPI';
import AllUsersAPI from './api/AllUsers';





export const GlobalState = createContext()


export const DataProvider = ({children}) =>{
    const [token, setToken] = useState(false)

    useEffect(()=>{
        const firstLogin = localStorage.getItem('firstLogin')
        if(firstLogin){
            const refreshToken = async () =>{
                try {

                    const res = await axios.get('http://localhost:8000/api/refresh_token', {
                        withCredentials: true // Include cookies in the request
                    });
                    console.log(res)
                    setToken(res.data.accesstoken);
                } catch (error) {
                    console.error("Error refreshing token:", error);
                }
        }
         
        refreshToken()
        }
       
    },[])

 

    const state = {
        token: [token, setToken],
        userAPI: UserAPI(token), 
        categoriesAPI: CategoriesAPI(),
        productAPI: ProductsAPI(),
        recipeAPI: RecipeAPI(),
        allUsersAPI: AllUsersAPI(token)
    }
   

    return (
        <GlobalState.Provider value={state}>
            {children}
        </GlobalState.Provider>
    )
}