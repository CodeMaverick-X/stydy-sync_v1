import React, { useState, useEffect } from "react"
import { io } from "socket.io-client";


const ENDPOINT = 'http://localhost:5000/' // replace with main endpoint

export default function Message() {
    const [messages, setMessages] = useState([])
    const [socket, setSocket] = useState('')

    useEffect(() => {
        const socket_obj = io('localhost:5000/', {
            transports: ['websocket'],
            cors: {
                origin: 'http://localhost:3000'
            }
        })
        setSocket(socket_obj)

        socket_obj.on('login', (data) => {
            console.log(data, 'connect event')
        })
        console.log('socket obj', socket)

        socket_obj.on('disconnect', (data) => {
            console.log(data, 'disconnect event')
        })

        return function cleanup() {
            socket_obj.disconnect()
        }

    }, [])


    const sendMessage = (e) => {
        e.preventDefault()
        const form =e.target
        console.log(form,form.message.value);
        socket.emit('data', form.message.value)
        form.message.value = ''
    }

    useEffect(() => {
        if(socket){
            socket.on('data', (data) => {
                setMessages([...messages, data.data])
            })
        }

        return () => {
            if(socket) {
                socket.off('data', () => {
                    console.log('data event was removed')
                })
        }
        }
    }, [socket, messages])

    return (
        <div className="container px-6 mx-auto lg:max-w-6xl">
            <div>THis is the message part to chat</div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    name="message"
            
                
                />  
                    <button type="submit">Send</button>
            </form>


        </div>
    )
}