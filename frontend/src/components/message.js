import React, { useState, useEffect, useRef } from "react"
import { io } from "socket.io-client";
import { Input, Button } from "@material-tailwind/react"
import { useSearchParams } from "react-router-dom";
import Loader from "./Loader";
import { getMessages } from "../lib/utils";


const ENDPOINT = 'http://localhost:5000/' // TODO: replace with main endpoint

export default function Message() {
    const [messages, setMessages] = useState([])
    const [socket, setSocket] = useState('')
    const messagesRef = useRef(null)
    const user = JSON.parse(localStorage.getItem('user'))
    const user_id = user.id
    const [searchParams, setSearchParams] = useSearchParams()
    const group_id = searchParams.get('group_id')
    const group_name = searchParams.get('group_name')
    const [loading, setLoading] = useState(true);


    // Fetch prevous message from server
    useEffect(() => {
        (async () => {
            const grMessages = await getMessages(group_id)
            setLoading(false)
            if (grMessages) {
                setMessages(grMessages)
                console.log(grMessages) //TODO: remove debugging
            }
        })()
    }, [])

    // Web sockets for message communication
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
            // console.log('got a new message', message)
        });

        setSocket(socket_obj)
        return () => { // clean up
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
        // console.log(message);
        socket.emit('data', { message, group_id, user_id })
        inputBox.value = ''
    }

    // Enter key was pressed, trigger the button click
    const handleEnterKey = (e) => {
        if (e.key === 'Enter') {
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
            {loading ? (<Loader />) :
                <div className="overflow-auto flex-grow mb-10" ref={messagesRef}>
                    {messages.map((msg, index) => {
                        let messageContainerClass = 'justify-start'
                        let messageContentClass = 'bg-gray-900 text-white'
                        let messageOwner = msg.username

                        if (msg.owner_id === user_id) {
                            messageContainerClass = 'justify-end'
                            messageContentClass = 'bg-gray-600 text-white'
                            messageOwner = 'me'
                        }

                        return (
                            <div key={index} className={`flex ${messageContainerClass} my-2`}>
                                <div className={` ${messageContentClass}  rounded-lg p-2`}>
                                    <div className="text-xs underline" >{messageOwner}</div>
                                    <div>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
            <div className="flex absolute bottom-0 w-auto bg-white pb-3">
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