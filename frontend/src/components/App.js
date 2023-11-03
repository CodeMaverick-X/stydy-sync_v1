import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Landing from './pages/Landing'
import { UserProvider } from './UserContext';
import Default from "./Default";
import Message from "./message";
import Layout from "./Layout";
import RequireAuth from "./AuthRequired";


export default function App() {

    return (
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="landing" element={<Landing />} />
                    <Route path="/auth" element={<Outlet />}>
                        <Route path='login' element={<Login />} />
                        <Route path='signup' element={<Signup />} />
                    </Route>
                    <Route path="/" element={<RequireAuth />}>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Default />} />
                            <Route path="group" element={<Message />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </UserProvider>
    )
}