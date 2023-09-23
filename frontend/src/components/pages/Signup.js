import React from "react"
import { Outlet, Link, useNavigate } from "react-router-dom"


export default function Signup() {
    const [formData, setFormData] = React.useState({
        username: "",
        email: "",
        password: "",
        passwordConfirm: ""
    })
    const navigate = useNavigate()

    const [passMatched, setPassMatched] = React.useState("shadow")
    

    
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

        if (formData.password === formData.passwordConfirm) {
            setPassMatched("shadow");
            try {
                const response = await fetch('http://localhost:5000/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('successful');
                    navigate('/home');
                    // handle success like redirect
                    console.log(data);
                } else {
                    console.log('error');
                    // handle error
                    console.log(data);
                }
            } catch (error) {
                console.error('An error occurred:', error);
                // handle the error here
            }
        } else {
            setPassMatched("shadow-md shadow-red-500/50 border-2 border-rose-500");
            return;
        }
    }
    
    return (
        <div className="min-h-screen flex justify-center items-center">
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3" onSubmit={handleSubmit}>
            <h2 className="text-2xl mb-4">Sign Up</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                onChange={handleChange}
                value={formData.username}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                value={formData.email}
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
                type="password"
                placeholder="Password"
                onChange={handleChange}
                value={formData.password}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="passwordConfirm">
                Confirm Password
              </label>
              <input
                className={passMatched + " appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                placeholder="confirm Password"
                onChange={handleChange}
                value={formData.passwordConfirm}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Sign Up
              </button>
            </div>
            <p className="pt-5 italic">already have an account? <Link to={'/login'}>login</Link></p>
          </form>
          
        </div>
      );
}
