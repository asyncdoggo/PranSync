// YogaPose.jsx
// import React from 'react';
import { useParams } from 'react-router-dom';

export default function Pose() {
    const { id } = useParams();
    // Fetch the pose data using the id
    // For now, we'll just display the id
    return (
        <div className='flex flex-col items-center justify-center h-screen bg-green-500 text-white'>
            <h1 className='text-3xl font-bold mb-4'>Yoga Pose {id}</h1>
            {/* Display pose data here */}
        </div>
    );
}