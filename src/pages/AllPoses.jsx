// YogaPoses.jsx
// import React from 'react';
import { Link } from 'react-router-dom';

export default function AllPoses() {
    const poses = [
        { id: 1, name: 'Downward Dog' },
        { id: 2, name: 'Warrior II' },
        // Add more poses here
    ];

    return (
        <div className='flex flex-col items-center justify-center h-screen bg-green-500 text-white'>
            <h1 className='text-3xl font-bold mb-4'>Yoga Poses</h1>
            {poses.map((pose) => (
                <Link key={pose.id} to={`/pose/${pose.id}`} className='text-2xl hover:text-green-200 transition-colors duration-300'>
                    {pose.name}
                </Link>
            ))}
        </div>
    );
}