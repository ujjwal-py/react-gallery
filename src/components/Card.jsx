import React from 'react'
import download from '../assets/download.svg'

function Card(props) {
    return (
        <>
            <div className='bg-red-800 border-red-500 border-2  w-64 h-72 p-4 overflow-hidden rounded-lg text-lg item-center'>
                <a href = {props.down} target='_blank' rel='noreferrer'><img src={props.src} alt={props.alt} className='w-56 h-64' /></a>
                {/* <p className='text-center text-white font-mono w-3/4'>{props.title}</p> */}
            </div>
        </>
    )
}

export default Card