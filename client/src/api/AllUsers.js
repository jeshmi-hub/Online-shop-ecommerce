import React, { useState, useEffect } from 'react';
import axios from 'axios';
function AllUsersAPI(token) {
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchAllUsers = async () => {
            if (!token) {
                setError("No token provided");
                return;
            }

            setLoading(true);
            try {
                // First verify if the user is an admin
                const userRes = await axios.get('http://localhost:8000/api/getUser', {
                    headers: { Authorization: token }
                });

                const user = userRes.data;
                if (user.role !== 1) {
                    setError("Access denied. Only admins can view all users.");
                    setIsAdmin(false);
                } else {
                    setIsAdmin(true);
                    const res = await axios.get('http://localhost:8000/api/allUsers', {
                        headers: { Authorization: token }
                    });
                    setAllUsers(res.data);
                }
            } catch (err) {
                setError(err.response && err.response.data.msg ? err.response.data.msg : err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllUsers();
    }, [token]);

    return {
        allUsers: [allUsers, setAllUsers],
        loading : [loading, setLoading],
        error : [error, setError],
        isAdmin: [isAdmin, setIsAdmin]
    }
}

export default AllUsersAPI;