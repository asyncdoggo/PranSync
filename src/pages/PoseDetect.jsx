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

    const constraints = {
        video:
            navigator.userAgentData.mobile ?
                {
                    facingMode: { exact: "environment" }
                }
                : true
    }

    const videoChange = (e) => {
        setVideo(e.target.files[0]);
        videoRef.current.src = URL.createObjectURL(e.target.files[0]);
        detectPoseFromVideo(videoRef.current);
        console.dir(videoRef.current)
        // videoRef.current.play();
    }


    async function detectPoseFromVideo(video) {
        video.addEventListener('loadeddata', async () => {
            poseDetector.current.setVideoData(video.videoWidth, video.videoHeight)
            console.log("video width:", video.videoWidth, "video height:", video.videoHeight);
            if (video.readyState >= 3) {

                setInterval(async () => {
                    // poseDetector.current.ctx.drawImage(video, 0, 0, poseDetector.current.canvas.width, poseDetector.current.canvas.height);
                    const poses = await poseDetector.current.getPose(video)

                    if (poses && poses.length > 0) {
                        poseDetector.current.drawPoses(poses, video);
                        poseDetector.current.drawSkeleton(poses);
                        const pose = poses[0]; // Assuming you want to draw the first pose
                        const mountainYogaPose = checkMountainYogaPose(pose.keypoints);
                        if (mountainYogaPose) {
                            console.log('mountainYogaPose');
                        }
                    }
                }, 100); // Adjust interval for performanc
            }
        });
    }

    async function startVideo() {
        const video = videoRef.current;
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        detectPoseFromVideo(video);
    }

    useEffect(() => {

        const loadModel = async () => {
            if (!poseDetector.current) {
                poseDetector.current = new PoseDetector(canvasRef);
                console.log("loading model")
                await poseDetector.current.loadModel();
                console.log("model loaded")
            }
        }
        loadModel();

    }, []);

    return (
        <>
            <video ref={videoRef} width="640" height="480" autoPlay playsInline controls />
            <canvas ref={canvasRef} ></canvas>

            <button onClick={startVideo}>Use camera</button>

            <input type='file'
                accept='video/*'
                onChange={videoChange}
            />
        </>

    );
};

export default PoseDetection;
