import React, { useRef, useEffect, useState } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import checkMountainYogaPose, { isMountainPose } from '../util/poses';
import PoseDetector from '../util/poseDetector';



const PoseDetection = () => {

    const [video, setVideo] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [loaded, setLoaded] = useState(false);

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
    }


    async function detectPoseFromVideo(video) {
        video.addEventListener('loadeddata', async () => {
            poseDetector.current.setVideoData(video.videoWidth, video.videoHeight)
            console.log("video width:", video.videoWidth, "video height:", video.videoHeight);
            if (video.readyState >= 3) {

                setInterval(async () => {
                    if (video.paused || video.ended) return;
                    const poses = await poseDetector.current.getPose(video)
                    poseDetector.current.drawPoses(poses, video);
                    poseDetector.current.drawSkeleton(poses);
                    const pose = poses[0];
                    if (pose) {
                        const mountainYogaPose = isMountainPose(pose.keypoints);
                        if (mountainYogaPose) {
                            console.log('mountainYogaPose');
                            console.log(pose.keypoints);
                        }
                    }
                }, 40);
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
            setLoaded(true);
        }
        loadModel();

    }, []);




    const imageRef = useRef(null);

    return (
        <div>
            {
                loaded ?
                    <p>
                        <video ref={videoRef} width="640" height="480" autoPlay playsInline controls />

                        <button onClick={startVideo} className='w-full '>Use camera</button>

                        <input type='file'
                            accept='video/*'
                            onChange={videoChange}
                        /></p> :
                    <p>Loading model</p>
            }

            <canvas ref={canvasRef} ></canvas>









            <div className='TEST'>
                <input type='file'
                    accept='image/*'
                    onChange={(e) => {
                        imageRef.current.src = URL.createObjectURL(e.target.files[0]);
                        imageRef.current.onload = async () => {
                            console.log("test");
                            poseDetector.current.setVideoData(imageRef.current.width, imageRef.current.height)
                            const pose = await poseDetector.current.getPose(imageRef.current)
                            console.log(pose);
                            poseDetector.current.drawPoses(pose, imageRef.current);
                            poseDetector.current.drawSkeleton(pose);
                            const mountainYogaPose = isMountainPose(pose[0].keypoints, poseDetector.current.canvas_scale_x, poseDetector.current.canvas_scale_y);
                            console.log(mountainYogaPose);
                        }
                    }}


                />
                <img src='' width="480" height="320" ref={imageRef} />
            </div>






        </div>

    );
};

export default PoseDetection;
