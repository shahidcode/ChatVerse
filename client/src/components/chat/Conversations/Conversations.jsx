import { useState, useRef } from "react";
import {uniqBy} from 'lodash';
import axios from 'axios';

function Conversations( {selectedUser, socket, allMessages, setAllMessages, id, theme} ){

    const [currentMessage, setCurrentMessage] = useState('');
    const [hideInput, setHideInput] = useState(false);
    const [fileDetails, setFileDetails] = useState(null);
    const fileInputRef = useRef(null);

    const sendMessage = (ev)=>{
        if( ev ) ev.preventDefault();
        
        if( currentMessage.trim().length !== 0 || fileDetails ){
            if (!socket) {
                console.error('Socket not connected yet');
                return;
            }

            const messagePayload = {
                text: currentMessage,
                recipient: selectedUser,
                file: fileDetails
            };

            if (fileDetails) {
                console.log('File details:', {
                    name: fileDetails.name,
                    dataLength: fileDetails.data?.length,
                    dataType: typeof fileDetails.data,
                    dataPreview: fileDetails.data?.substring(0, 50)
                });
            }
            console.log('Sending message with file:', !!fileDetails);
            socket.emit('message', messagePayload, (response) => {
                if (!response || !response.success) {
                    console.error('Message send failed:', response?.error);
                    return;
                }

                // Add the server-saved message to the chat
                setAllMessages(prev => {
                    // Avoid duplicates by checking if message already exists
                    const messageExists = prev.some(m => m._id === response.message._id);
                    if (messageExists) {
                        return prev;
                    }
                    return [...prev, response.message];
                });
            });
    
            setCurrentMessage('');
            setFileDetails(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setHideInput(false);
        }
    }

    const handleFile = (e)=>{
        e.preventDefault();
        setHideInput(true);

        const file = e.target.files[0];
        if (!file) {
            console.warn('No file selected');
            return;
        }
        
        console.log('File selected:', { name: file.name, size: file.size, type: file.type });

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            console.log('File read complete:', { dataLength: reader.result.length });
            setFileDetails({
                name: file.name,
                data: reader.result,
            });
        };
        reader.onerror = (error) => {
            console.error('File read error:', error);
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
                                            msg.file && typeof msg.file === 'string' && 
                                            <div className="mt-2">
                                                <img
                                                    src={msg.file.startsWith('data:') ? msg.file : axios.defaults.baseURL + '/uploads/' + msg.file}
                                                    alt={msg.file.slice(msg.file.lastIndexOf('-') + 1) || 'attachment'}
                                                    className="max-w-full max-h-80 rounded-md border border-slate-300"
                                                    onError={(e) => {
                                                        console.error('Image failed to load:', e.target.src);
                                                    }}
                                                />
                                                <div className="text-xs text-slate-600 mt-1">
                                                    {msg.file.slice(msg.file.lastIndexOf('-') + 1)}
                                                </div>
                                            </div>
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
                            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFile} />
                               
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
