import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Landing from './pages/Landing'
import { UserProvider } from './UserContext';

import { Button } from "@material-tailwind/react";





export default function App() {



    return (
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    <Route index element={<Landing />} />
                    <Route path='login' element={<Login />} />
                    <Route path='signup' element={<Signup />} />
                    <Route path="home" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </UserProvider>
    )
}