import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { GlobalState } from '../../../GlobalState';
import Loading from '../../utils/loading/Loading';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto; 
  height: 100vh; 
   background-color: #white; 
`;

const VideoContainer = styled.div`
  width: 80%; 
  display: flex; 
  margin-bottom: 20px; 
  background-color: #f3cfce; 
  padding: 20px; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // Shadow for depth
`;

const Video = styled.video`
  width: 60%; 
  max-height: 400px; 
`;

const InfoContainer = styled.div`
  flex: 1; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 20px; 
`;

const Title = styled.h1`
  color: white;
  margin: 0; 
  text-align: left;
`;

const Description = styled.p`
  color: white;
  font-size: 14px;
  text-align: left;
  margin-top: 10px; // Space between title and description
`;

const Recipe = () => {
  const state = useContext(GlobalState)
  const [recipes, setRecipes] = state.recipeAPI.recipes
  const [isLogged] =state.userAPI.isLogged
  const [token] = state.token
  console.log(state.recipeAPI.recipes)
  const [callback, setCallback] = state.recipeAPI.callback
  const [loading, setLoading] = useState(false)

  const deleteRecipe = async(id, public_id)=>{
    console.log({id,public_id})

    try{
        setLoading(true)
        const destroyVideo = axios.post('http://localhost:8000/api/destroyVideo',{public_id})

        const deleteRecipe = axios.delete(`http://localhost:8000/api/deleteRecipe/${id}`,{
            headers: {Authorization: token}
        })

        await destroyVideo
        await deleteRecipe
        setCallback(!callback)
        setLoading(false)

    }catch(err){
        alert(err.response.data.msg)
    }
  }

  

  if(loading) return <div><Loading/></div>
  return (
    <Container>
      {recipes.map(recipe => (
        <VideoContainer key={recipe._id}>
          <Video src={recipe.video.url} controls />
          <InfoContainer>
            <Title>{recipe.title}</Title>
            <h4>{recipe.cooktime}</h4>
            <Description>{recipe.description}</Description>
          </InfoContainer>
          <Link to={`/edit_recipe/${recipe._id}`}>
          <button>Update</button>

          </Link>
          
          <button onClick={() => deleteRecipe(recipe._id, recipe.video.public_id)}>Delete</button>

         
        </VideoContainer>
      ))}
    </Container>
  );
};

export default Recipe;