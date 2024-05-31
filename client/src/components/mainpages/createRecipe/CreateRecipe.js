import React,{useState,useEffect,useContext} from "react";
import axios from "axios";
import { GlobalState } from "../../../GlobalState";
import { useParams } from "react-router-dom";
import Loading from "../../utils/loading/Loading";

const initialState = {
    title: '',
    description: '',
    cooktime: '',
    _id: ''
}


function CreateRecipe(){
    const state = useContext(GlobalState)
    const [recipe, setRecipe] = useState(initialState)
    const [videos, setVideos] = useState(false)
    const [loading, setLoading] = useState(false)

    const [token] = state.token
    const param = useParams()

    const [recipes] = state.recipeAPI.recipes
    const [onEdit, setOnEdit] = useState(false)
    const [callback, setCallback] = state.recipeAPI.callback

    useEffect(()=>{
        if(param.id){
            setOnEdit(true)
            recipes.forEach(recipe=>{
                if(recipe._id === param.id){
                    setRecipe(recipe)
                    setVideos(recipe.video)
                }
            })
        }else{
            setOnEdit(false)
            setRecipe(initialState)
            setVideos(false)
        }
    },[param.id, recipes])

    const handleUpload = async e => {
        e.preventDefault();
        try {
            const file = e.target.files[0];
            if (!file) return alert("File does not exist");
    
            console.log("Uploaded file mimetype:", file.type); // Log the mimetype
    
            if (file.size > 1024 * 1024 * 100)
                return alert("Size too large!");
    
            // Check if the mimetype starts with 'video/'
            if (!file.type.startsWith("video/"))
                return alert("File format is incorrect.");
    
            let formData = new FormData();
            formData.append('file', file);
            setLoading(true);
    
            const res = await axios.post('http://localhost:8000/api/uploadVideo', formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: token }
            });
    
            setLoading(false);
            setVideos(res.data);
            console.log(res.data);
    
        } catch (err) {
            alert(err.response.data.msg);
        }
    }
    

    const handleDestroy = async()=>{
        try{
            setLoading(true)
            await axios.post('http://localhost:8000/api/destroyVideo',{
                public_id: videos.public_id
            },{
                headers: {Authorization: token}
            })
            setLoading(false)
            setVideos(false)

        }catch(err){
            alert(err.response.data.msg)

        }
    }

    const handleChangeInput = e =>{
        const {name, value} = e.target
        setRecipe({...recipe, [name]: value})
    }

    const handleSubmit = async e=>{
        e.preventDefault()
        try{
            if(!videos) return alert("No video uploaded")
            console.log(videos)
            const{public_id, url} = videos

            if(onEdit){
                await axios.put(`http://localhost:8000/api/updateRecipe/${recipe._id}`,{...recipe,video:{public_id,url}},{
                    headers: {Authorization:token}
                })
            }else{
                await axios.post('http://localhost:8000/api/addRecipe',{...recipe,video:{public_id,url}},{
                    headers: {Authorization: token}
                })
            }
            setVideos(false)
            setRecipe(initialState)
            setCallback(!callback)
            window.location.href = "/"

        }catch(err){
            if(err.response){
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
                alert(err.response.data.msg);
            }else if(err.request){
                console.log(err.request);
                alert("No response from server");
            }else{
                console.log('Error', err.message);
                alert("An error occurred");
            }

        }
    }

    const styleUpload = {
        display: videos? "block" : "none"
    }

    return(
        <div className="create_product">
            <div className="upload">
                <input type="file" name="file" id="file_up" onChange={handleUpload}/>
                {
                    loading? <div id="file_video"><Loading/></div>:
                    <div id="file_video" style={styleUpload}>
                    <video src={videos? videos.url:''} controls preload="auto"  />
                    <span onClick={handleDestroy}>X</span>
                    </div>
                }
            </div>

            <form onSubmit={handleSubmit}>
                <div className="rows">
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title" required value={recipe.title} onChange={handleChangeInput}/>
                </div>
                <div className="rows">
                    <label htmlFor="description">Description</label>
                    <input type="text" name="description" id="description" required value={recipe.description} onChange={handleChangeInput}/>
                </div>
                <div className="rows">
                    <label htmlFor="cooktime">Cooktime</label>
                    <input type="text" name="cooktime" id="cooktime" required value={recipe.cooktime} onChange={handleChangeInput}/>
                </div>
                <button type='submit'>{onEdit? "Update": "Create"}</button>
            </form>
        </div>
    )
}

export default CreateRecipe