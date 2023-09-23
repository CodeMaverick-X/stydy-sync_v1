import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom"

export default function Landing() {
    return (
        <>
        <div>Welcome to studysync, we will help you study together</div>
        <p>if you don't hav an account <Link to={'signup'}>Signup</Link></p>
        <p>else <Link to={'login'}>Login</Link></p>
        </>
    )
}