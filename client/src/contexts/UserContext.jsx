import { useState, createContext, useEffect } from 'react';
import axios from 'axios';

export const userCtx = createContext(null);

function UserContext(props){

    const [username, setUsername] = useState(null);
    const [id, setId] = useState(null);
    const [theme, setTheme] = useState('light');

    useEffect( ()=>{
        
        axios.get('/auth/verify',{
            headers: {
                Authorization : localStorage.getItem('token'),
                "Content-Type": "application/json",
            }
        }).then( (res)=>
        {
            setId(res.data.id);
            setUsername(res.data.username);

        }).catch( err => console.log(err.message) );

    } ,[]);

    useEffect( ()=>{
        //daisyui
        if( theme === 'light' ){
            document.querySelector('html').setAttribute('data-theme','light');
        }
        else{
            document.querySelector('html').setAttribute('data-theme','dark');
        }
    } ,[theme]);

    return(
        <userCtx.Provider value={{id,username,theme,setTheme}}>
            {props.children}
        </userCtx.Provider>
    )
    
}

export default UserContext;