import { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/backend";
import Contacts from "./Contacts/Contacts";
import Conversations from "./Conversations/Conversations";
import {userCtx} from '../../contexts/UserContext';
import { useContext } from "react";
import {useNavigate} from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from "axios";

function ChatPage () {
    const {id, username, theme, setTheme} = useContext(userCtx);
    const navigate = useNavigate();
    const [socket,setSocket] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [offlinePeople, setofflinePeople] = useState({});
    const [allMessages, setAllMessages] = useState([]);

    useEffect( ()=>{
        !id && navigate('/');
    },[id] )
    
    useEffect( ()=>{
        setSocket(
            io(BASE_URL, {
                withCredentials: true,
                secure: false,
                rejectUnauthorized: false,
                transports: ['websocket', 'polling', 'flashsocket'],
                auth : {
                    token : localStorage.getItem('token')?.split(' ')[1]
                },
            })
        ) 
    } ,[])
 
    useEffect(()=>{
        socket?.on('connect',()=>{
            console.log('user connected')
            
            socket?.on('getMessage',handleMessage);
            socket?.emit('addOnlinePeople',id); 
            socket?.on('getOnlinePeople',(data)=>setOnlinePeople( data ));
        })
    },[socket, allMessages]);  

    function handleMessage(e){
        if( e.sender === selectedUser ){
            setAllMessages(prev => ([...prev, {...e}]));
        }
    }

    //fetch offline people
    useEffect( ()=>{
        axios.get('/people').then( res => {
            //don't include the current user itself and also online people
            const offlinePeopleArr = res.data.filter( p => p._id !== id )
                                             .filter( p => !Object.keys(onlinePeople).includes(p._id));
            setofflinePeople(offlinePeopleArr); 
        })
        .catch( err => console.log(err.message) );  
    },[onlinePeople] );
    
    //fetch msg from db
    useEffect( ()=>{
        if( selectedUser ) {
            axios.get('/messages/'+selectedUser,{
                headers: {
                    Authorization : localStorage.getItem('token'),
                    "Content-Type": "application/json",
                }
            })
            .then(res=>{
                setAllMessages(res.data);
            })
            .catch(err=>console.log(err.message));
        }
    } ,[selectedUser])

    //don't show current user in chat section.
    const excludeCurrentUser = onlinePeople;
    delete excludeCurrentUser[id];

    return (
        <div className='chat h-screen flex'>
            <Contacts 
                peopleList={excludeCurrentUser} 
                selectedUser={selectedUser} 
                setSelectedUser={setSelectedUser}
                offlinePeople={offlinePeople}
                user_id={id}
                user_name={username}
                theme={theme}
                setTheme={setTheme}
            />
            <Conversations 
                selectedUser={selectedUser}
                socket={socket}
                allMessages={allMessages}
                setAllMessages={setAllMessages}
                id={id}
                theme={theme}
            />
        </div> 
    )
}

export default ChatPage;