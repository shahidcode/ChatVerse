import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async(e)=> {
        e.preventDefault();

        let data;
        await axios.post('/auth/signin',{username,password})
        .then((res)=>{
            data = res.data.token;
            localStorage.setItem('token','Bearer '+data);
            navigate('/chat');

            window.location.reload(false);
        })
        .catch( err => {
            console.log('login client error',err);
            toast.error('Invalid Credentials',{autoClose:1500});
        } );

    }

    return (
       <div className="h-screen flex items-center justify-start flex-col">

            <h1 className="text-4xl pt-[10rem] pb-10">Login</h1>

            <form className="bg-blue-300 w-96 mx-auto p-10 rounded-lg shadow-2xl" onSubmit={handleLogin}>

                <input type='text' placeholder="username" className="block w-full p-2 mb-2 rounded-md" value={username} onChange={(e)=>setUsername(e.target.value)} required/>
                <input type="password" placeholder="password" className="block w-full p-2 mb-2 rounded-md" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                <button className="bg-blue-400 w-full p-2 mb-2 rounded-md">Login</button>

                <Link to={"/signup"}>Dont have an account? create a new one.</Link>
            </form>
            <ToastContainer/>
       </div>
    )
}

export default Login;
