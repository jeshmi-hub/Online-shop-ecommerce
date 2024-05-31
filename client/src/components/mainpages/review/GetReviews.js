import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../../utils/loading/Loading';
import { GlobalState } from '../../../GlobalState';

function GetReviews() {
    const state = useContext(GlobalState)
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAdmin] = state.userAPI.isAdmin
    const token = state.token

    useEffect(()=>{
        const fetchAllReviews = async()=>{
            setLoading(true);
            try{
                const response = await axios.get("http://localhost:8000/api/reviews")
                setReviews(response.data)
            }catch(err){
                console.error("Error fetching reviews:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchAllReviews()
    }, [])

    const deleteReview = async(id)=>{
        try{
            setLoading(true);
            await axios.delete(`http://localhost:8000/api/review/${id}`);
            setReviews(reviews.filter(review => review._id !== id));
            alert("Deleted a review");
        } catch(err){
            alert("Error deleting review: " + err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <style>
                {`
                    table {
                        border-collapse: collapse;
                        border-spacing: 0;
                        width: 100%;
                        border: 1px solid #ddd;
                        table-layout: fixed;
                    }
                    img {
                        width:100px;
                        height:100px;
                        display: block; 
                        margin: 0 auto;
                        border-radius: 50%;
                        border:5px solid teal
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    tr:nth-child(even) {
                        background-color: #f2f2f2;
                    }
                    th {
                        background-color: teal;
                        color: white;
                    }
                    button{
                        width:50px
                        border:none;
                        background-color:#333;
                        color:#fff;
                        border-radius:5px
                    }
                `}
            </style>

            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Image</th>
                        <th>Rating</th>
                        <th>Review</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map(review => (
                        <tr key={review._id}>
                            <td>{review.username}</td>
                            <td><img src={review.image.url} alt=""/></td>
                            <td>{review.rating}</td>
                            <td>{review.review}</td>
                            <td><button onClick={() => deleteReview(review._id)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default GetReviews;
