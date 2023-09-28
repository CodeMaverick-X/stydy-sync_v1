import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import Message from "../message";


export default function Home() {
    const navigate = useNavigate()

    const [socketInstance, setSocketInstance] = useState('')
    const [buttonStatus, setButtonStatus] = useState(false)

    useEffect(() => {
        if(buttonStatus === true){
            const socket = io('localhost:5000/', {
                transports:['websocket'],
                cors:{
                    origin:'http://localhost:3000'
                }
            })
            setSocketInstance(socket)

            socket.on('login', (data) => {
                console.log(data, 'connect event')
            })
            console.log('socket obj', socket)

            socket.on('disconnect', (data) => {
                console.log(data, 'disconnect event')
            })

             return function cleanup() {
                 socket.disconnect()
             }
        }
    }, [buttonStatus])

    function handleClick() {
        if(buttonStatus === false) {
            setButtonStatus(true)
        } else {
            setButtonStatus(false)
        }
    }


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
        <h1>React Flask App + Socket.io</h1>
        {!buttonStatus ? (
            <button onClick={handleClick} >Turn chat on</button>
        ): <>
        <button onClick={handleClick} >Turn chat off</button>
        <Message socket={socketInstance} />
        </>}
        </>
    )
}
   