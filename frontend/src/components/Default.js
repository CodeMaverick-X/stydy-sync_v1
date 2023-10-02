import React, {useContext, useState} from "react";
import {
    Typography,
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Input
} from "@material-tailwind/react";
import { pageContext } from "./pages/Home";
import Message from "./message";

export default function Default() {

    const {currentPage, setCurrentPage} = useContext(pageContext)

    function handlePageChange() {
        setCurrentPage(<Message />)
    }

    return(
        <div className="container px-6 mx-auto lg:max-w-6xl">
                <div className="card-container lg:flex sm:flex-row lg:space-x-8 ">
                    <div className=" ">
                        <Card className="mt-6 w-96">
                            <CardBody>
                                <Typography variant="h5" color="blue-gray" className="mb-2">
                                    Join Group
                                </Typography>
                                <div className="w-72">
                                    <Input label="Group ID" variant="static" color="blue" shrink={true} />
                                </div>
                            </CardBody>
                            <CardFooter className="pt-0">
                                <Button>Join</Button>
                            </CardFooter>
                        </Card>
                    </div>

                    <div className="">
                        <Card className="mt-6 w-96">
                            <CardBody>
                                <Typography variant="h5" color="blue-gray" className="mb-2">
                                    Create Group
                                </Typography>
                                <div className="w-72 space-y-5 space-x-5">
                                    <Input label="Group Name" variant="static" color="blue" shrink={true} />
                                </div>
                            </CardBody>
                            <CardFooter className="pt-0">
                                <Button>Create</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
                <div className="groups-container mt-5">
                    <a href="#" className="w-96" onClick={handlePageChange}>
                        <Card className="w-96 max-w-[48rem] flex-row" color="light-green" variant="gradient">
                            <CardHeader
                                shadow={false}
                                floated={false}
                                className="m-0 w-2/5 shrink-0 rounded-r-none"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                                    alt="card-image"
                                    className="h-full w-full object-cover"
                                />
                            </CardHeader>
                            <CardBody>
                                <Typography variant="h5" color="blue-gray" className="mb-2">
                                    Group chat
                                </Typography>
                                <Typography color="gray" className="mb-1 font-normal">
                                    Group for CEG 315
                                </Typography>
                            </CardBody>
                        </Card>
                    </a>
                </div>
                <p>Welcome to the home page</p>
            </div>
    )
}