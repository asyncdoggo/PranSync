// Features.jsx
// import React from 'react';

export default function Features() {
    const features = [
        { title: 'Real time', description: 'This is a description of feature 1.' },
        { title: 'Feature 2', description: 'This is a description of feature 2.' },
        { title: 'Feature 3', description: 'This is a description of feature 3.' },
        // Add more features here
    ];

    return (
        <div className='flex justify-around p-10 bg-white'>
            {features.map((feature, index) => (
                <div key={index} className='card bg-green-500 text-white rounded-lg p-5'>
                    <h2 className='text-2xl font-bold'>{feature.title}</h2>
                    <p className='mt-2'>{feature.description}</p>
                </div>
            ))}
        </div>
    );
}