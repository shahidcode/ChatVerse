import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    async function handleRegister(e){
        e.preventDefault();

        if( password === confirmPass ){
            await axios.post('/auth/signup',{username,password})
            .then( ()=> {
                navigate('/');
            })
            .catch( ()=>{
                toast.error('username already exists',{autoClose:1500});
            } );
        }
        else{
            console.log("passwords didn't matched")
        }
    }

    return (
       <div className="h-screen flex items-center justify-start flex-col">

            <h1 className="text-4xl pt-[10rem] pb-10">Register</h1>

            <form className="bg-blue-300 w-96 mx-auto p-10 rounded-lg shadow-2xl" onSubmit={handleRegister}>

                <input type='text' required placeholder="username" className="block w-full p-2 mb-2 rounded-md" aria-required value={username} onChange={(e)=>setUsername(e.target.value)}/>
                <input type="password" required placeholder="password" className="block w-full p-2 mb-2 rounded-md" aria-required value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <input type="password" required placeholder="confirm password" className="block w-full p-2 mb-2 rounded-md" aria-required value={confirmPass} onChange={(e)=>setConfirmPass(e.target.value)}/>
                <button className="bg-blue-400 w-full p-2 mb-2 rounded-md">Register</button>

                <Link to={"/"}>Already have an account? Login.</Link>
            </form>
            <ToastContainer/>
       </div>
    )
}

export default Register;