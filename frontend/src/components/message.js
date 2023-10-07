import React, { useState, useEffect } from "react"
import { io } from "socket.io-client";
import { useUser } from './UserContext'
import { Input, Button } from "@material-tailwind/react"


const ENDPOINT = 'http://localhost:5000/' // replace with main endpoint

export default function Message({ group_id, group_name }) {
    const [messages, setMessages] = useState([])
    const [socket, setSocket] = useState('')
    const { userData } = useUser()
    const user_id = userData.id


    // fetch prevous message from server
    useEffect(() => {
        try {
            async function fetch_msg() {
                const res = await fetch(`http://localhost:5000/api/messages/${group_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'

                })

                if (res.ok) {
                    const data = await res.json()
                    let messages_content = data.messages.map((msg_obj) => msg_obj.content)
                    console.log(messages_content, 'from messages')
                    setMessages(messages_content)
                }
            }
            fetch_msg()
        } catch (error) {
            console.log(error, 'from fetch_msg')
        }
    }, [])

    useEffect(() => {
        const socket_obj = io(ENDPOINT, {
            transports: ['websocket'],
            cors: {
                origin: 'http://localhost:3000'
            }
        })
        socket_obj.emit('join', { group_id, user_id })

        socket_obj.on('disconnect', (data) => {
            console.log(data, 'disconnect event')
        })

        socket_obj.on('data', (message) => {
            setMessages((prevMessages) => [...prevMessages, message.content]);
            console.log('got a new message', message)
        });

        setSocket(socket_obj)
        return function cleanup() {
            socket_obj.off('data', () => {
                console.log('data event was removed')
            })
            socket_obj.emit('leave', { group_id, user_id })
            socket_obj.disconnect()
        }

    }, [])


    const sendMessage = (e) => {
        const inputBox = document.querySelector('.message-box')
        const message = inputBox.value
        console.log(message);
        socket.emit('data', { message, group_id, user_id })
        inputBox.value = ''
    }

    
    return (
        <div className="container px-6 mx-auto lg:max-w-6xl">
            <div> {group_name}: {group_id}</div>
            <div className=" overflow-auto ">
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <div className="flex">
                <div className="w-72 mr-4">
                    <Input name="message" className="message-box rounded-lg" type={'text'} />
                </div>
                <Button variant="gradient" className="rounded-lg" onClick={sendMessage}>{'>>'}</Button>
            </div>


        </div>
    )
}