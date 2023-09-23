import React from   "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Landing from './pages/Landing'
import '../index.css'

export default function App() {
    return (
        <BrowserRouter>
        <Routes>
            <Route index element={<Landing />} />
            <Route path='login' element={<Login />} />
            <Route path='signup' element={<Signup />} />
            <Route path="home" element={<Home />} />
        </Routes>
        
        </BrowserRouter>
    )
}