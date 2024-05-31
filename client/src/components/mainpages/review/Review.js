import React, { useContext, useState } from 'react';
import './review.css'; 
import { GlobalState } from '../../../GlobalState';
import axios from 'axios';

const intialState = {
    review: '',
    rating: ''
}

function Review() {
    const state = useContext(GlobalState)
    const [id, setId] = state.userAPI.id
    const [review, setReview] = useState(intialState)

    const handleChangeInput = e=>{
        const {name, value} = e.target;
        setReview({...review, [name]:value})
    }

    const handleSubmit = async e=>{
        e.preventDefault()
        try{
            const res = await axios.post(`http://localhost:8000/api/postReview/${id}`,{...review})
            alert(res.data.msg)

        }catch(err){
            alert(err.response.data.msg)

        }
    }
  return (
    <div className="review-container">
      <h1>Review</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='review'>Write your review</label>
          <textarea id="review" name="review" rows="4" required value={review.review} onChange={handleChangeInput}></textarea>
        </div>
        <div className='form-group'>
          <label htmlFor='rating'>Rate out of 5</label>
          <input type='number' id='rating' name='rating' min='1' max='5' required value={review.rating} onChange={handleChangeInput}/>
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
}

export default Review;
