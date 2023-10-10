import React, { useState, useEffect, useRef } from "react"
import { io } from "socket.io-client";
import { useUser } from './UserContext'
import { Input, Button } from "@material-tailwind/react"


const ENDPOINT = 'http://localhost:5000/' // replace with main endpoint

export default function Message({ group_id, group_name }) {
    const [messages, setMessages] = useState([])
    const [socket, setSocket] = useState('')
    const messagesRef = useRef(null)
    // const { userData } = useUser() // refresh issue
    const user  = JSON.parse(localStorage.getItem('user'))
    const user_id = user.id


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
                    let messages = data.messages //.map((msg_obj) => msg_obj.content)
                    console.log(messages, 'from messages')
                    setMessages(messages)
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
            setMessages((prevMessages) => [...prevMessages, message]);
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


    const sendMessage = () => {
        const inputBox = document.querySelector('.message-box')
        const message = inputBox.value
        console.log(message);
        socket.emit('data', { message, group_id, user_id })
        inputBox.value = ''
    }
    const handleEnterKey = (e) => {
        if (e.key === 'Enter') {
            // Enter key was pressed, trigger the button click
            sendMessage();
        }
    }

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messagesRef, messages])


    return (
        <div className="container  flex flex-col px-6 mx-auto lg:max-w-4xl">
            <div className="overflow-auto flex-grow" ref={messagesRef}>
                {messages.map((msg, index) => {
                    let messageContainerClass = 'justify-start'
                    let messageContentClass = 'bg-gray-900 text-white'

                    if (msg.owner_id === user_id) {
                        messageContainerClass = 'justify-end'
                        messageContentClass = 'bg-gray-600 text-white'
                    }

                    return (
                        <div key={index} className={`flex ${messageContainerClass} my-2`}>
                            <div className={` ${messageContentClass}  rounded-lg p-2`}>
                                {msg.content}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="flex">
                <div className="w-72 mr-4">
                    <Input
                        name="message"
                        className="message-box rounded-lg"
                        type="text"
                        // value={inputValue}
                        // onChange={handleChange}
                        onKeyUp={handleEnterKey} // Trigger send on Enter key
                    />
                </div>
                <Button
                    className="rounded-lg"
                    onClick={sendMessage}
                    variant="gradient"
                >
                    {'>>'}
                </Button>
            </div>
        </div>
    )
}