import React, { useState, useEffect } from "react"


const ENDPOINT = 'http://localhost:5000/' // replace with main endpoint

export default function Message({socket}) {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])


    const sendMessage = (e) => {
        e.preventDefault()
        const form =e.target
        console.log(form,form.message.value);
        socket.emit('data', form.message.value)
        setMessage('')
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
        <div>
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