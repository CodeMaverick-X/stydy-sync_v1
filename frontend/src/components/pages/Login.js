import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom"
import { useUser } from '../UserContext';

export default function Login() {

    const { userData, setUserData } = useUser();

    const [formData, setFormData] = React.useState({
        username: "",
        password: "",
    })
    const navigate = useNavigate()

    function handleChange(event) {
        const {name, value, type, checked} = event.target
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault();
        console.log('help');

        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json()
                setUserData(data)
                localStorage.setItem('user', JSON.stringify(data))
                console.log('successful')
                navigate('/home');
                // handle success like redirect
                console.log(data);
            } else {
                const data = await response.json();
                console.log('error');
                // handle error
                console.log(data);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            // handle the error here
        }
    }


    return (
        <div className="min-h-screen flex justify-center items-center">
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3" onSubmit={handleSubmit}>
            <h2 className="text-2xl mb-4">Login</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                name="username"
                onChange={handleChange}
                value={formData.username}
                type="text"
                placeholder="Username"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                name="password"
                onChange={handleChange}
                value={formData.password}
                type="password"
                placeholder="Password"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Sign In
              </button>
            </div>
            <p className="pt-5 italic">dont have an account? <Link to={'/signup'}>Sign up</Link></p>
          </form>
        </div>
      );
}
