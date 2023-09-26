import React, { useState, useEffect } from "react"

import socketIOClient from 'socket.io-client'

const ENDPOINT = 'http://localhost:5000/' // replace with main endpoint

export default function Message() {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])

    const socket = socketIOClient()

    useEffect(() => {
        socket.on('message', (data) => {
            setMessages((prev) => {
                return [...prev, data]
            })
    })
    }, [])
    console.log('************ -DEBUGGING- *************')

    useEffect(() => {
        console.log('new message was gotten')
        console.log(messages)
        
        }
    , [messages])

    const sendMessage = () => {
        socket.emit('message', message)
        setMessage('')
    }

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    )
}