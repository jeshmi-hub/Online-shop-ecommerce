import  { useEffect, useState } from "react";
import axios from "axios";

function CategoriesAPI(){
    const [categories, setCategories] = useState([])
    const [callback, setCallback] = useState(false)

    useEffect(()=>{
        const getCategories = async()=>{
            const res = await axios.get('http://localhost:8000/api/getCategory');
            setCategories(res.data);
        }
        getCategories();
    },[callback])

    return{
        categories: [categories,setCategories],
        callback: [callback, setCallback]
    };
}

export default CategoriesAPI;