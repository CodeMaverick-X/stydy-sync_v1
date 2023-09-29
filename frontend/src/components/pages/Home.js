import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import Message from "../message";
import {
    Navbar,
    MobileNav,
    Typography,
    Button,
    IconButton,
    Card,
    CardBody,
    CardFooter,
} from "@material-tailwind/react";


export default function Home() {
    const navigate = useNavigate()

    const [socketInstance, setSocketInstance] = useState('')
    const [buttonStatus, setButtonStatus] = useState(false)

    // navigation code 
    const [openNav, setOpenNav] = React.useState(false);

    React.useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setOpenNav(false)
        );
    }, []);

    const navList = (
        <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="p-1 font-normal"
            >
                <a href="#" className="flex items-center">
                    Pages
                </a>
            </Typography>
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="p-1 font-normal"
            >
                <a href="#" className="flex items-center">
                    Account
                </a>
            </Typography>
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="p-1 font-normal"
            >
                <a href="#" className="flex items-center">
                    Blocks
                </a>
            </Typography>
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="p-1 font-normal"
            >
                <a href="#" className="flex items-center">
                    Docs
                </a>
            </Typography>
        </ul>
    );
    // end of navigation code

    useEffect(() => {
        if (buttonStatus === true) {
            const socket = io('localhost:5000/', {
                transports: ['websocket'],
                cors: {
                    origin: 'http://localhost:3000'
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
        if (buttonStatus === false) {
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
        <div className=" max-h-[768px] w-[calc(100%+48px)] overflow-scroll">
            <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none py-2 px-4 lg:px-8 lg:py-4">
                <div className="flex items-center justify-between text-blue-gray-900">
                    <Typography
                        as="a"
                        href="#"
                        color="red"
                        className="mr-4 cursor-pointer py-1.5 font-medium"
                    >
                        Study-sync
                    </Typography>
                    <div className="flex items-center gap-4">
                        <div className="mr-4 hidden lg:block">{navList}</div>
                        <Button
                            variant="gradient"
                            size="sm"
                            color="blue"
                            className="hidden lg:inline-block"
                        >
                            <span>Buy Now</span>
                        </Button>
                        <IconButton
                            variant="text"
                            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
                            ripple={false}
                            onClick={() => setOpenNav(!openNav)}
                        >
                            {openNav ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            )}
                        </IconButton>
                    </div>
                </div>
                <MobileNav open={openNav}>
                    {navList}
                    <Button variant="gradient" size="sm" fullWidth className="mb-2" color="blue">
                        <span>Buy Now</span>
                    </Button>
                </MobileNav>
            </Navbar>

            {/* card */}
            <Card className="mt-6 w-96">
                <CardBody>
                    <Typography variant="h5" color="blue-gray" className="mb-2">
                        UI/UX Review Check
                    </Typography>
                    <Typography>
                        The place is close to Barceloneta Beach and bus stop just 2 min by
                        walk and near to &quot;Naviglio&quot; where you can enjoy the main
                        night life in Barcelona.
                    </Typography>
                </CardBody>
                <CardFooter className="pt-0">
                    <Button>Read More</Button>
                </CardFooter>
            </Card>

            <p>Welcome to the home page</p>
            <button onClick={handleLogOut}>Logout</button>
            <h1>React Flask App + Socket.io</h1>
            {!buttonStatus ? (
                <button onClick={handleClick} className="lg:text-blue-gray-800 md:text-red-500" >Turn chat on</button>
            ) : <>
                <button onClick={handleClick} >Turn chat off</button>
                <Message socket={socketInstance} />
            </>}
        </div>
    )
}
