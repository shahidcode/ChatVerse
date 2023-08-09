import { Routes, Route } from "react-router-dom";
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ChatPage from './components/chat/ChatPage';
import 'react-toastify/dist/ReactToastify.css';
import {userCtx} from './contexts/UserContext';
import { useContext } from "react";

function ChildRoutes(){
    
    const {id} = useContext(userCtx);

    return(
        <Routes>
            <Route path='/' element={ !id ? <Login/> : <ChatPage/> } />
            <Route path='/chat' element={<ChatPage/>} />
            <Route path='/signup' element={<Register/>} />
        </Routes>
    )
}

export default ChildRoutes;