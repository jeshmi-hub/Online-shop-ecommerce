import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { GlobalState } from '../../../GlobalState';
import Loading from '../../utils/loading/Loading';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const MainContainer = styled.div`
background-color: #f0f0f0; 
padding: 40px;
width: 90%; 
height: 75vh; 
display: flex;
justify-content: center; 
align-items: flex-start; /* Align content to the top */
margin-top: 50px; /* Add margin to push the container down */
margin-left: auto; /* Center the container horizontally */
margin-right: auto; /* Center the container horizontally */
`;

const ProfileTitle = styled.h2`
    margin-bottom: 20px;
`;

const ProfileContainer = styled.div`
    border: 2px solid #ccc;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    width:75vh;
    height:45vh;
    align-items: center;
    max-width: 400px; /* Limit container width */
    margin: 50px auto 0; /* Center horizontally and add top margin */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add shadow for depth */
`;

const ProfileInfoContainer = styled.div`
    flex: 1; /* Take remaining width */
`;

const ProfileImageWrapper = styled.div`
    margin-right: 20px;
`;

const ProfileImage = styled.img`
    width: 20vh;
    height: 25vh; 
    object-fit: cover;
    border-radius: 50%; 
    border: 2px solid #fff; 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
`;

const EditImageButton = styled.label`
    display: block;
    margin-top: 10px;
    padding: 8px 16px;
    background-color: teal;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #007c91;
    }
`;

const InputFile = styled.input`
    display: none;
`;

const ProfileField = styled.div`
    margin-bottom: 20px;

    label {
        display: block;
        margin-bottom: 5px;
        color: #333; 
        font-weight: bold; 
    }

    input {
        width: calc(100% - 20px); 
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
`;

const EditButton = styled.button`
    width: 100%;
    padding: 10px;
    background-color: teal;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #007c91;
    }
`;

const intialState = {
    username: '',
    email: ''
}

function UserProfile() {
    const state = useContext(GlobalState)
    const [images, setImages] = useState(false)
   
    const [token] = state.token
    const [user, setUser] = useState(intialState)
    const [loading, setLoading] = useState(false)
    const [onEdit, setOnEdit] = useState(false)
    const param = useParams()

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


  

    const styleUpload = {
        display: images ? "block" : "none"
    }
    
    return (
        <MainContainer>
            <ProfileTitle>Profile</ProfileTitle>
            <ProfileContainer>
                {loading?<div id="file_img"><Loading/></div>:
                <ProfileImageWrapper>
                    
                    <ProfileImage style={styleUpload} src={images ? user.image.url:''} alt="Profile" />
                        <div>
                            <InputFile type="file" accept="image/*" id="fileInput"/>
                            <EditImageButton htmlFor="fileInput">Change Image</EditImageButton>
                        </div>

                </ProfileImageWrapper>
                }
                <ProfileInfoContainer>
                    <ProfileField>
                        <label>Username</label>
                        <input type="text" name="username" value={user.username} />
                    </ProfileField>
                    <ProfileField>
                        <label>Email</label>
                        <input type="email" name="email" value={user.email} />
                    </ProfileField>
                    
                    <EditButton>
                        Update Profile
                    </EditButton>
                    
                    
                </ProfileInfoContainer>
            </ProfileContainer>
        </MainContainer>
    );
}

export default UserProfile;