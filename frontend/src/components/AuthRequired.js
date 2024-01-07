import React from "react";
import { Outlet, useNavigate, Navigate } from "react-router-dom";

export default function RequireAuth() {
    const navigate = useNavigate()
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (isLoggedIn === 'loggedin') {
        return <Outlet />
    }
    return <Navigate to='/auth/login'/>
}