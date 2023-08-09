import { useEffect, useState } from "react";

function Avatar( {userName, userId, online} ){

    const colorPalette = [
        'bg-slate-300',
        'bg-red-200',
        'bg-red-400',
        'bg-pink-300',
        'bg-purple-300',
        'bg-yellow-200',
        'bg-orange-300',
        'bg-green-300',
        'bg-blue-200'
    ]
    //for generating random colors to users
    const color = colorPalette[ parseInt(userId,16) % colorPalette.length ]
    
    return(
        <div className={`relative w-8 h-8 rounded-2xl text-center ${color}`}>
            <div className={`absolute w-3 h-3 border border-white bottom-0 right-0 rounded-full ${online ? 'bg-green-500' : 'bg-gray-400' }`}></div>
            <div className='opacity-80'>{userName[0]?.toUpperCase()}</div>
        </div>
    )
}
export default Avatar;