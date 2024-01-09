import React, { useState, useEffect, useRef } from "react"
import { io } from "socket.io-client";
import { Input, Button } from "@material-tailwind/react"
import { useSearchParams } from "react-router-dom";
import Loader from "./Loader";
import { getMessages, getGroupInfo } from "../lib/utils";


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
    const [groupInfo, setGroupInfo] = useState('')


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

    useEffect(() => {
        (async () => {
            const groupData = await getGroupInfo(group_id)
            if (groupData) {
                setGroupInfo(groupData)

            }

        })()
    }, [])

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
        <div className="flex" style={{ maxHeight: 'calc(100vh - 80px)' }}>
            <div className="lg: w-3/12 flex-shrink sm:hidden md:block"></div>

            {/* Middle chat part */}

            <div className="container  flex flex-col px-6 lg:max-w-4xl lg:border-l-2 lg:border-r-2 overscroll-contain]" style={{ maxHeight: 'calc(100vh - 100px)' }} >
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
                                    <div className={` ${messageContentClass}  rounded-lg p-2 max-w-sm`}>
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

                {/* Group side panel */}
            <div className=" sm:hidden lg:flex-shrink-0 md:flex-shrink min-w-min md:block flex flex-col overscroll-contain max-h-screen p-4" style={{ maxHeight: 'calc(100vh - 90px)' }}>
                <div className=" border-b-2">
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                        alt="card-image"
                        className="h-40 w-64 rounded-lg" />
                    <div>
                        <h3 className="text-3xl font-medium">{ groupInfo.name }</h3>
                        <div className="max-w-md">this is a place holder for the description, will add it later to also add that field to the database and when creating the group</div>
                    </div>
                </div>

                <div className="">
                    <div>Members</div>
                    <ul> {groupInfo ? groupInfo.members.map( (member, index) => {
                        return <li className="lowercase  italic">{member}</li>
                    }): <div>no user</div>  }
                    </ul>
                </div>

            </div>
        </div>
    )
}