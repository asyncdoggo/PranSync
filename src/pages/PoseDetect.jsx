import React, { useRef, useEffect, useState } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import checkMountainYogaPose from '../util/MountaionYogaPose';
import PoseDetector from '../util/poseDetector';



const PoseDetection = () => {

    const [video, setVideo] = useState(null);
    console.log(video);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const poseDetector = useRef(null);


    const videoChange = (e) => {
        setVideo(e.target.files[0]);
        videoRef.current.src = URL.createObjectURL(e.target.files[0]);
        detectPoseFromVideo(videoRef.current);
        console.dir(videoRef.current)
        // videoRef.current.play();
    }

    async function detectPoseFromVideo(video) {
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

    async function startVideo(video) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        detectPoseFromVideo(video);
    }

    useEffect(() => {
        // startVideo(videoRef.current);
    }, []);

    return (
        <>
            <video ref={videoRef} width="640" height="480" autoPlay playsInline controls />
            <canvas ref={canvasRef} ></canvas>

            <input type='file'
                accept='video/*'
                onChange={videoChange}
            />
        </>

    );
};

export default PoseDetection;
