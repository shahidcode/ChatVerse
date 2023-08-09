import { useEffect, useState } from "react";
import Avatar from "./Avatar";

function Contacts( {peopleList, selectedUser, setSelectedUser, offlinePeople, user_id, user_name, theme, setTheme} ){

    const logout = ()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
    }

    return(
        <div className={"contacts pl-4 pt-4 pb-4 flex flex-col md:w-1/4 w-2/5 -my-1 "+(theme === 'light' ? 'bg-blue-100' : 'bg-[#090914]')}>
                <div className={'flex logo items-center justify-between lg:text-3xl'}>
                    <div className={'flex items-center gap-2 mb-4 '+(theme !== 'light' && ' text-blue-300')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                        </svg>

                        <a href="/">ChatVerse</a>
                    </div>
                    
                    <div className={"themeBtn cursor-pointer mr-4 pb-3 "+(theme === 'dark' && ' text-yellow-400')} 
                         onClick={()=>setTheme( theme === 'light' ? 'dark' : 'light' )}>
                        {
                            theme === 'dark' ?
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                            </svg>
                        }
                    </div>
                </div>

                <div className="users flex flex-col flex-grow">
                    {
                        //online-people
                        Object.keys(peopleList).map( id=> (
                            <div key={id} className={`userList flex items-center border-b border-slate-300 py-3 gap-2 cursor-pointer md:text-xl ${selectedUser === id && (theme === 'light' ? 'bg-blue-300' : 'bg-blue-300 text-black')+' ml-[-16px]'} `} 
                                onClick={()=>setSelectedUser(id)}
                            >
                                {
                                    selectedUser === id && <div className="w-1 h-full bg-blue-600 rounded-r-md"></div>
                                }
                                <Avatar userName={peopleList[id]} userId={id} online/>
                                {peopleList[id]}
                            </div>
                        ))
                    }
                    {
                        //offline-people
                        Object.keys(offlinePeople).map( id=> ( 
                            <div key={id} 
                                className={`userList flex items-center border-b border-slate-300 py-3 gap-2 cursor-pointer md:text-xl ${(selectedUser === offlinePeople[id]._id && (theme === 'light' ? 'bg-blue-300' : 'bg-blue-300 text-black') +' ml-[-16px]')} `} 
                                onClick={()=>setSelectedUser( offlinePeople[id]._id )}
                            >
                                {
                                    selectedUser === offlinePeople[id]._id && <div className="w-1 h-full bg-blue-600 rounded-r-md"></div>
                                }
                                <Avatar userName={offlinePeople[id].username} userId={offlinePeople[id]._id} online={false}/>
                                {offlinePeople[id].username}
                            </div>
                        ))
                    }
                </div>
                <div className='logout flex items-center justify-center md:text-xl border-t-2 border-gray-300 py-2'>
                    <div className="flex items-center gap-1 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                        {user_name}
                    </div>
                    <div className="cursor-pointer flex flex-row items-center justify-center text-center" onClick={logout}>
                        <a href="/">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
    )
}

export default Contacts;