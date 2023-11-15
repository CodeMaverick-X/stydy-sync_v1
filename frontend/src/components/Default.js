import React, { useEffect, useState } from "react";
import {
    Typography,
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Input
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { createGroup, joinGroup, getGroups } from "../lib/utils";

export default function Default() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);

    const [groups, setGroups] = useState([])
    const user = JSON.parse(localStorage.getItem('user'))
    const [newGroup, setNewGroup] = useState('')
    const user_id = user.id

    // Handle create group
    const handleCreateGroup = async () => {

        const inputElement = document.querySelector('.create-group')
        const name = inputElement.value

        const group = await createGroup(name)
        if (group) {
            setNewGroup(group)
        } else {
            console.log('could not create group')
        }
    }

    // Handle join group
    const handleJoinGroup = async () => {

        const inputElement = document.querySelector('.join-group')
        const group_id = inputElement.value

        const group = await joinGroup(group_id, user_id)
        if (group) {
            setNewGroup(group)
        } else {
            console.log('could not join group')
        }
    }


    // Get groups
    useEffect(() => {
        (async () => {
            const groups = await getGroups()
            if (groups) {
                setLoading(false)
                setGroups(groups)
            }
            // setGroups([{'id': '132435465768', 'name': 'Hello world'}]) TODO: remove line
        })()
    }, [newGroup])


    const handlePageChange = (group_id, group_name) => {
        navigate(`group?group_id=${group_id}&group_name=${group_name}`)
    }

    return (
        <div className="container px-6 mx-auto lg:max-w-6xl">
            <div className="card-container lg:flex sm:flex-row lg:space-x-8 ">
                <div className=" ">
                    <Card className="mt-6 w-96">
                        <CardBody>
                            <Typography variant="h5" color="blue-gray" className="mb-2">
                                Join Group
                            </Typography>
                            <div className="w-72">
                                <Input className="join-group" name="name" label="Group ID" variant="static" color="blue" shrink={true} />
                            </div>
                        </CardBody>
                        <CardFooter className="pt-0">
                            <Button onClick={handleJoinGroup}>Join</Button>
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
                                <Input className="create-group" label="Group Name" variant="static" color="blue" shrink={true} />
                            </div>
                        </CardBody>
                        <CardFooter className="pt-0">
                            <Button onClick={handleCreateGroup}>Create</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
            <div className="groups-container mt-5 space-y-2">
                <Typography variant="h4" className="mb-1"> Groups</Typography>
                {loading ? (<Loader />) :
                    groups.length !== 0 ? groups.map((group, index) => (
                        <div key={index}>

                            <Card className="w-3/5 max-w-[48rem] flex-row" variant="gradient">
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
                                        {group.name}
                                    </Typography>
                                    <Typography color="gray" className="mb-1 font-normal">
                                        {group.id}
                                    </Typography>
                                    <Button onClick={() => handlePageChange(group.id, group.name)} >Chat</Button>
                                </CardBody>
                            </Card>

                        </div>
                    )) : <p>No groups yet, you can create one or join one above</p>
                }
            </div>
        </div>
    )
}