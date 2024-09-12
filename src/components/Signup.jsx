import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import Header from "./Header";
import Footer from "./Footer";
import Button from "./Button";
import { Link } from "react-router-dom";
import { FiBook, FiUser } from "react-icons/fi";
import api from "./api/api";
import videoFile from './dd.mp4';
import './Signup.css'; // Import the CSS file
import { toast } from 'react-toastify';


const Signup = () => {
    const pathname = useLocation();
    const [openNavigation, setOpenNavigation] = useState(false);
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [enrollment, setEnrollment] = useState('');
    const [branch, setBranch] = useState('');
    const [photo, setPhoto] = useState(null);
    const [department, setDepartment] = useState('');
    const [isTeacher, setIsTeacher] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [usernameAvailable, setUsernameAvailable] = useState(true);
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true); // Start loading

        const formData = new FormData();
        formData.append('user.username', username);
        formData.append('user.password', password);
        formData.append('user.email', email);
        formData.append('user.first_name', firstName);
        formData.append('user.last_name', lastName);
        if (isTeacher) {
            formData.append('department', department);
        } else {
            formData.append('enrollment', enrollment);
            formData.append('branch', branch);
            if (photo) {
                formData.append('photo', photo);
            }
        }

        try {
            const response = await api.post(`${isTeacher ? 'teachers' : 'students'}/`, formData);
            setSuccessMessage('Registration successful!');
            navigate("/login",{ state: { successMessage: 'Registration successful!' } });
        } catch (error) {
            if (error.response) {
                setErrors(error.response.data);
                const errorMessages = formatErrorMessages(error.response.data);
                toast.error(errorMessages);
                console.log(JSON.stringify(error.response.data))
            } else {
                console.log('Error', error.message);
            }
        } finally {
            setIsLoading(false); // Stop loading
        }
    };
    const formatErrorMessages = (errorData) => {
        let messages = [];
        for (const key in errorData) {
            if (Array.isArray(errorData[key])) {
                errorData[key].forEach(message => {
                    messages.push(`${key} - ${message}`);
                });
            } else if (typeof errorData[key] === 'object') {
                for (const subKey in errorData[key]) {
                    errorData[key][subKey].forEach(message => {
                        messages.push(`${key}.${subKey} - ${message}`);
                    });
                }
            }
        }
        return messages.join(' ');
    };

    const checkUsernameAvailability = async (username) => {
        try {
            const response = await api.get(`check_username/${username}/`);
            console.log(response.data.exists);
            setUsernameAvailable(!response.data.exists);
            console.log('Username available:', response.data.exists);
        } catch (error) {
            console.log(error);
        }
    };

    const toggleNavigation = () => {
        if (openNavigation) {
            setOpenNavigation(false);
            enablePageScroll();
        } else {
            setOpenNavigation(true);
            disablePageScroll();
        }
    };

    const handleClick = () => {
        if (!openNavigation) return;

        enablePageScroll();
        setOpenNavigation(false);
    };

    return (
        <div className="h-full bg-gray-400 dark:bg-gray-900 flex flex-col lg:flex-row">
        <div className="flex w-full lg:w-1/2 h-64 lg:h-auto">
          <div className="relative w-full h-full">
            <video 
              className="w-full h-full object-cover"
              autoPlay loop muted>
              <source src={videoFile} type="video/mp4" />
            </video>
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
          </div>
        </div>
            <div className="w-full lg:w-1/2 h-auto lg:h-full flex justify-center items-center">
                <div className="w-full object-cover bg-black dark:bg-gray-700 rounded-lg">
                <h3 className="py-4 text-2xl text-center text-gray-800 glowing-text">Create an Account!</h3>                    
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center justify-center w-full">
                            <FiBook
                                className={`cursor-pointer mr-2 text-3xl ${isTeacher ? 'text-blue-500  glowing-text ' : 'text-gray-400'}`}
                                onClick={() => setIsTeacher(true)}
                            />
                            <FiUser
                                className={`cursor-pointer text-3xl ${isTeacher ? 'text-gray-400' : 'text-blue-500  glowing-text'}`}
                                onClick={() => setIsTeacher(false)}
                            />
                        </div>
                        <p className="text-gray-800 light:text-gray glowing-text">Register as a {isTeacher ? 'Teacher' : 'Student'}</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="firstName" className="text-n-1">
                                First Name
                            </label>
                            <input
                                className="w-full p-2 text-n-1 bg-n-8 border border-n-9 rounded"
                                id="firstName"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="First Name"
                            />
                            {errors.firstName && <p className="text-red">{errors.firstName}</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="lastName" className="text-n-1">
                                Last Name
                            </label>
                            <input
                                className="w-full p-2 text-n-1 bg-n-8 border border-n-9 rounded"
                                id="lastName"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Last Name"
                            />
                            {errors.lastName && <p className="text-red">{errors.lastName}</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-n-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="w-full p-2 text-n-1 bg-n-8 border border-n-9 rounded"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                            />
                            {errors.email && <p className="text-red">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-n-1">
                                Username
                            </label>
                            <input
                                className="w-full p-2 text-n-1 bg-n-8 border border-n-9 rounded"
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    checkUsernameAvailability(e.target.value);
                                }}
                                placeholder="Username"
                            />
                            {!usernameAvailable && <p className="text-red">Username is taken</p>}
                            {errors.username && <p className="text-red">{errors.username}</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-n-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="w-full p-2 text-n-1 bg-n-8 border border-n-9 rounded"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                            {errors.password && <p className="text-red">{errors.password}</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="c_password" className="text-n-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="c_password"
                                id="c_password"
                                className="w-full p-2 text-n-1 bg-n-8 border border-n-9 rounded"
                                placeholder="Confirm Password"
                            />
                        </div>
                        {isTeacher ? (
                            <div className="space-y-2">
                                <label htmlFor="department" className="text-n-1">
                                    Department
                                </label>
                                <input
                                    className="w-full p-2 text-n-1 bg-n-8 border border-n-9 rounded"
                                    id="department"
                                    type="text"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    placeholder="Department"
                                />
                                {errors.department && <p className="text-red">{errors.department}</p>}
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <label htmlFor="enrollment" className="text-n-1">
                                        Enrollment
                                    </label>
                                    <input
                                        className="w-full p-2 text-n-1 bg-n-8 border border-n-9 rounded"
                                        id="enrollment"
                                        type="text"
                                        value={enrollment}
                                        onChange={(e) => setEnrollment(e.target.value)}
                                        placeholder="Enrollment"
                                    />
                                    {errors.enrollment && <p className="text-red">{errors.enrollment}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="branch" className="text-n-1">
                                        Branch
                                    </label>
                                    <input
                                        className="w-full p-2 text-n-1 bg-n-8 border border-n-9 rounded"
                                        id="branch"
                                        type="text"
                                        value={branch}
                                        onChange={(e) => setBranch(e.target.value)}
                                        placeholder="Branch"
                                    />
                                    {errors.branch && <p className="text-red">{errors.branch}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="photo" className="text-n-1">
                                        Photo
                                    </label>
                                    <input
                                        className="w-full p-2 text-n-1 bg-n-8 border border-n-9 rounded"
                                        id="photo"
                                        type="file"
                                        onChange={(e) => setPhoto(e.target.files[0])}
                                    />
                                    {errors.photo && <p className="text-red">{errors.photo}</p>}
                                </div>
                            </>
                        )}
                         <div className="text-center">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <dotlottie-player
                                    src="https://lottie.host/71c0f00d-ed75-4dd9-adc1-bf17ea9453ae/9Bj7nxdREN.json"
                                    background="transparent"
                                    speed="1"
                                    style={{ width: '50px', height: '50px' }}
                                    loop
                                    autoplay
                                  /> // Loading animation
                                ) : (
                                    "Register Account"
                                )}
                            </Button>
                        </div>
                        <hr className="my-6 border-t" />
                        <div className="text-center">
                            <a className="inline-block text-sm glowing-text dark:text-blue-500 hover:text-blue-800 " href="#">
                                Forgot Password?
                            </a>
                        </div>
                        <div className="text-center">
                            <a className="inline-block text-sm glowing-text dark:text-blue-500 hover:text-blue-800" href="/login">
                                Already have an account? Login!
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;