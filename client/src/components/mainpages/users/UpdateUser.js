import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import Loading from '../../utils/loading/Loading';
import { useParams } from 'react-router-dom';

const intialState = {
    username : '',
    email: ''
}
function UpdateUser() {
    const state = useContext(GlobalState);
    const [images, setImages] = useState(false);
    const [loading, setLoading] = useState(false);
    const [token] = state.token;
    const [isAdmin] = state.userAPI.isAdmin;
    const [user, setUser] = useState(intialState);
    const [onEdit, setOnEdit] = useState(false);
    const param = useParams();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (param.id) {
                    setOnEdit(true);
                    setLoading(true);
                    const response = await axios.get(`http://localhost:8000/api/getOneUser/${param.id}`, {
                        headers: { Authorization: token }
                    });

                    setUser(response.data);
                    console.log(response.data)
                    setImages(response.data.image)
                    console.log(response.image)
                    setLoading(false);
                }
            } catch (err) {
                alert(err.response.data.msg);
            }
        };

        fetchUserData();
    }, [param.id, token]);

    const handleInputChange = e => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleUpload = async e=>{
        try{
            const file = e.target.files[0]
            if(!file) return alert("File does not exist.")

            if(file.size>1024*1024)
            return alert("Size too large!")

            if(file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/webp')
            return alert("File format is incorrect.")

            let formData = new FormData()
            formData.append('file', file)
            setLoading(true)
            const res = await axios.post('http://localhost:8000/api/uploadUserImage',formData,{
                headers: {'Content-Type' : 'multipart/form-data'}
            })

            setLoading(false)
            setImages(res.data)
        }catch(err){
            alert(err.response.data.msg)

        }
    }

    const handleDestroy = async()=>{
        try{
            setLoading(true)
            await axios.post('http://localhost:8000/api/destroyUserImage',{
                public_id: images.public_id
            })

            setLoading(false)
            setImages(false)

        }catch(err){
            alert(err.response.data.msg)

        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const { public_id, url } = images;
            await axios.put(`http://localhost:8000/api/updateUser/${param.id}`, {...user, image: { public_id, url }}, {
                headers: { Authorization: token }
            });
    
            alert("User updated successfully");
        } catch (err) {
            console.error('Error updating user:', err);
            alert('An error occurred while updating the user');
        }
    };

    const styleUpload = {
        display: images ? "block" : "none"
    }

    return (
        <>
         <div className='create_product'>
            <div className='upload'>
                <input type='file' name='file' id='file_up' onChange={handleUpload}/>
                {
                    loading ? <div id="file_img"><Loading/></div>:
                    <div id="file_img" style={styleUpload}>
                    <img src={images ? images.url: ''} alt=''/>
                    <span onClick={handleDestroy}>X</span>
                     </div>
                }
            </div>

            <form onSubmit={handleSubmit}>
                <div className='rows'>
                    <label htmlFor='title'>Username</label>
                    <input type='text' name='username' id='username' required value={user.username} onChange={handleInputChange}/>
                </div>
                <div className='rows'>
                    <label htmlFor='desc'>Email</label>
                    <input type='text' name='desc' id='desc' required value={user.email} />
                </div>
            <button type='submit'>Update</button>
            </form>
        </div>
           
        </>
    );
}

export default UpdateUser;
