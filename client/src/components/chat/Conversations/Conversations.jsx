import { useState } from "react";
import {uniqBy} from 'lodash';
import axios from 'axios';

function Conversations( {selectedUser, socket, allMessages, setAllMessages, id, theme} ){

    const [currentMessage, setCurrentMessage] = useState('');
    const [hideInput, setHideInput] = useState(false);
    const [fileDetails, setFileDetails] = useState(null);

    const sendMessage = (ev)=>{
        if( ev ) ev.preventDefault();
        
        if( currentMessage.trim().length!=0 || fileDetails ){

            socket.send(JSON.stringify({
                text : currentMessage,
                recipient : selectedUser,
                file : fileDetails
            }))
    
            if( fileDetails ){
                axios.get('/messages/'+selectedUser,{
                    headers : {
                        Authorization : localStorage.getItem('token'),
                        "Content-Type": "application/json",
                    }
                }).then( res =>{
                    setAllMessages(res.data);
                });

                setHideInput(false);
            }
            else{
                setCurrentMessage('');  //to reset form values
                setAllMessages( prev=> ([...prev,{
                    text: currentMessage,
                    sender: id,
                    recipient: selectedUser,
                    _id: Date.now(),
                }]));
            }
        }
    }

    const handleFile = (e)=>{
        e.preventDefault();
        setHideInput(true);

        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setFileDetails({
                name: e.target.files[0].name,
                data: reader.result,
            });
        };
    }

    //store only 1 copy of messages either of sender/recipient
    const uniqueMessages = uniqBy(allMessages, '_id');

    return(
        <div className="conversation pr-4 py-4 flex flex-col md:w-3/4 w-3/5">

            {
                !selectedUser ? 
                    <div className="flex flex-grow items-center justify-center gap-2 text-gray-500 md:text-xl">

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"/>
                        </svg>

                        Select an user to chat
                    </div> 
                : 
                <>
                    <div className='flex flex-col flex-grow gap-2 overflow-y-auto border-b-2 border-slate-300'>
                        {
                            uniqueMessages.map( msg => (
                                <div key={msg._id} className={(msg.sender !== selectedUser ? 'text-right': 'text-left')}>
                                    <div className={"text-left inline-block max-w-lg p-2 my-2 rounded-md text-sm " +(msg.sender !== selectedUser ? 'bg-blue-200 text-black':'bg-slate-300 text-slate-700')}>
                                        {msg.text}
                                        {
                                            msg.file && 
                                            <a target="_blank"
                                               rel="noopener noreferrer"
                                               href={axios.defaults.baseURL + '/uploads/' + msg.file}
                                               className="underline underline-offset-4 flex items-center gap-1"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                </svg>

                                                {msg.file.split('-')[1]}    {/* to display user selected file name and not server-made */}
                                            </a>
                                        }
                                    </div>
                                </div>
                            ) ) 
                        }
                    </div>
                    
                    <form id='myForm' className="flex items-center pt-2 -mb-2 gap-3" onSubmit={sendMessage}>

                        <input type='text' 
                            placeholder="Type your messages here" 
                            className={(theme === 'light' ? 'bg-slate-200 ' : 'bg-[#1B262C] text-white ')+"p-2 border-2 rounded-md flex-grow"+(hideInput ? ' hidden' : '')}
                            value={currentMessage} 
                            onChange={(e)=>setCurrentMessage(e.target.value)} 
                        />

                        <div className={!hideInput ? 'hidden' : 'p-2 rounded-md flex-grow text-center '   +(theme === 'dark' ? 'bg-[#395B64]' : 'bg-slate-300')}>
                            {fileDetails?.name}
                        </div>

                        <label className={(theme !== 'light' ? 'bg-transparent ' : 'bg-blue-200 ' )+"p-2 flex cursor-pointer rounded-sm border border-blue-200"+(hideInput ? ' hidden' : '')}>
                            <input type="file" className="hidden" onChange={handleFile} />
                               
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                            </svg>
                        </label>

                        <button className={theme === 'dark' && "text-blue-300"}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                </>
            }
        </div>
    )
}

export default Conversations;