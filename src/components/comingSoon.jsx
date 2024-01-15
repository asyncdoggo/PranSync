// ComingSoon.jsx
// import React from 'react';
import appimage from '../assets/app.svg'


export default function ComingSoon() {
    return (

        // <div className='flex justify-center items-center h-64 bg-green-500 text-white text-3xl font-bold'>
            
        //     Mobile App Coming Soon 
        //     <img src="/app.svg" alt="App Illustration Image" style={{width: '80%', height: '80%'}}/>
            
            
        //     {/* className='h-12 w-12 mr-4'  */}
            
        // </div> 

        <div className='flex h-screen bg-green-500'>
                <div className='w-1/2 flex items-center justify-center'>
                    <div>
                        <h1 className='text-5xl text-white font-bold'>Mobile App Coming Soon</h1>

                    </div>
                </div>

                <img src={appimage} alt="App Illustration Image" style={{width: '80%', height: '80%'}}/> 
        </div>
    );
}