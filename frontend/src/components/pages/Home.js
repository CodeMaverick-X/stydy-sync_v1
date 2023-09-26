import React from "react";
import { Link, useNavigate } from "react-router-dom";

import Message from "../message";


export default function Home() {
    const navigate = useNavigate()

    function handleLogOut() {
        fetch('http://localhost:5000/auth/logout', {
                method: 'POST',
                credentials: 'include'
            })
            .then(res => {
                return res.json();
            })
            .then(response => {
                if (response.message === 'logged out') {
                    // console.log('Logout successful');
                    navigate('/login');
                } else {
                    console.log(`Logout failed`, response);
                    // Handle the error here if needed
                }
            })
            .catch(error => {
                console.error('An error occurred during logout:', error);
                // Handle the error here if needed
            });
    }

    return (
        <>
        <p>Welcome to the home page</p>
        <button onClick={handleLogOut}>Logout</button>
        <Message />
        </>
    )
}
