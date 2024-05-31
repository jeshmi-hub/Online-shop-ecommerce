import React, { useContext } from 'react';
import Navbar from '../Navbar';
import Announcement from '../Announcement';
import { GlobalState } from '../../GlobalState';
import { Link } from 'react-router-dom';



function Home(){
  const state = useContext(GlobalState);
  const [id, setId] = state.userAPI.id

  return (
    <>
    <Announcement/>
    <Navbar/>
    <button><Link to={`/postReview/${id}`}>Give Review</Link></button>
    
    
    </>
  )
}

export default Home