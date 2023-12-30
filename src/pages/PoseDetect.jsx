import React, { useRef, useEffect } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import checkMountainYogaPose from '../util/MountaionYogaPose';
import PoseDetector from '../util/poseDetector';



const PoseDetection = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const poseDetector = useRef(null);


    async function startVideo(video) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.addEventListener('play', async () => {
            poseDetector.current = new PoseDetector(canvasRef, video.videoWidth, video.videoHeight);
            await poseDetector.current.loadModel();
            setInterval(async () => {
                const poses = await poseDetector.current.getPose(video)
                poseDetector.current.drawPoses(poses, video);
                poseDetector.current.drawSkeleton(poses);
                if (poses && poses.length > 0) {
                    const pose = poses[0]; // Assuming you want to draw the first pose
                    const mountainYogaPose = checkMountainYogaPose(pose.keypoints);
                    if (mountainYogaPose) {
                        console.log('mountainYogaPose');
                    }
                }
            }, 100); // Adjust interval for performance
        });
    }

    useEffect(() => {
        startVideo(videoRef.current);
    }, []);

    return (
        <>
            <video ref={videoRef} hidden width="640" height="480" autoPlay playsInline />
            <canvas ref={canvasRef} ></canvas>
        </>

    );
};

export default PoseDetection;
