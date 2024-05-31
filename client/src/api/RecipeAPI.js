import { useState, useEffect } from "react";
import axios from 'axios';


function RecipeAPI(){
    const [recipes, setRecipes] = useState([])
    const [callback, setCallback] = useState(false)

    useEffect(()=>{
        const getRecipes = async()=>{
            const res = await axios.get('http://localhost:8000/api/recipes')
            setRecipes(res.data)
            console.log(res.data)
        }
        getRecipes()
    },[callback])

    return{
        recipes: [recipes,setRecipes],
        callback: [callback, setCallback]
    }
}

export default RecipeAPI;