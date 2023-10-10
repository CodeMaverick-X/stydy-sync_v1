import React, { useEffect, useState, createContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import Default from "../Default";
import {
    Navbar,
    MobileNav,
    Typography,
    Button,
    IconButton,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Input
} from "@material-tailwind/react";


export const pageContext = createContext()

export default function Home() {
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(<Default />)

    function handlePageChange() {
        setCurrentPage(<Default />)
    }

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
                    Grades
                </a>
            </Typography>
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="p-1 font-normal"
            >
                <a href="#" className="flex items-center">
                    Events
                </a>
            </Typography>
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="p-1 font-normal"
            >
                <a href="#" className="flex items-center">
                    Settings
                </a>
            </Typography>
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="p-1 font-normal"
            >
                <a href="#" className="flex items-center">
                    Help
                </a>
            </Typography>
        </ul>
    );
    // end of navigation code

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
        <pageContext.Provider value={{currentPage, setCurrentPage}}>
            <div className="h-screen max-h-[768px] w-[calc(100%+48px)] overflow-scroll">
                <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none py-2 px-4 lg:px-8 lg:py-4">
                    <div className="flex items-center justify-between text-blue-gray-900">
                        <Typography
                            as="a"
                            href="#"
                            color="gray-900"
                            variant="h3"
                            className="mr-4 cursor-pointer py-1.5 font-medium"
                            onClick={handlePageChange}
                        >
                            Study-sync
                        </Typography>
                        <div className="flex items-center gap-4">
                            <div className="mr-4 hidden lg:block">{navList}</div>
                            <Button
                                variant="gradient"
                                size="sm"
                                color="red-800"
                                className="hidden lg:inline-block"
                                onClick={handleLogOut}
                            >
                                <span>Logout</span>
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
                        <Button variant="gradient" size="sm" fullWidth className="mb-2" color="red-800" onClick={handleLogOut}>
                            <span>Logout</span>
                        </Button>
                    </MobileNav>
                </Navbar>

                {currentPage}

            </div>
        </pageContext.Provider>
    )
}
