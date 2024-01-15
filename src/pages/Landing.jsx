// import React from 'react';
import { Link } from 'react-router-dom';
import Features from '../components/features.jsx';
import ComingSoon from '../components/comingSoon.jsx';
import prana1 from '../assets/prana-1.png'


export default function Landing() {

    return (
        // <div className='w-full'>
        //     Me is the landing
        // </div> 

        // <div className='flex flex-col items-center justify-center h-screen bg-green-500'>
        //     <h1 className='text-5xl text-white font-bold'>Welcome to PranaSync</h1>
        //     <p className='text-2xl text-white mt-4'>Your syncing partner for a healthy life style</p>
        //     <button className='mt-8 px-4 py-2 bg-white text-green-500 rounded-full font-bold text-xl hover:bg-green-200 transition-colors duration-300'>Start Session</button>
        // </div> 

        <>
            <div className='flex h-screen md:w-[75%] w-full self-center p-4 gap-x-4 md:flex-row flex-col rounded-lg bg-gradient-to-r from-green-700 to-green-400'>
                <div className='w-full flex items-center justify-center'>
                    <div className='flex flex-col w-full'>
                        <h1 className='text-5xl text-white font-bold'>Welcome to PranaSync</h1>
                        <p className='text-2xl text-white mt-4'>Breathe. Move. Thrive.</p>
                        <p className='text-2xl text-white mt-4'>Experience Harmony with PranaSync.</p>
                        <div className='flex w-full justify-center items-center'>
                            <div className='w-1/2'>
                                <div className='mt-8'>
                                    <button className='px-4 py-2 bg-white text-green-500 rounded-full font-bold text-xl hover:bg-green-200 transition-colors duration-300'>Get Started</button>
                                </div>
                                <div className='mt-4'>
                                    <button className='px-4 py-2 bg-white text-green-500 rounded-full font-bold text-xl hover:bg-green-200 transition-colors duration-300'>Pre-register for Mobile App</button>
                                </div>
                            </div>
                            <div className='w-1/2 flex justify-end md:justify-center'>
                                <img src={prana1} alt='Yoga' className='w-32 md:w-96 object-cover' />
                            </div>
                        </div>
                    </div>
                </div>


            </div>

            <div>
                <h1 className='text-5xl text-green-500 text-center font-bold'> Our Core Feats </h1>
                <Features />
            </div>

            <div>

                <ComingSoon />
            </div>
        </>

    )
}