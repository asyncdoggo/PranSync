import React, { useRef, useEffect, useState, createContext, useContext } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import PoseDetector from '../util/poseDetector';
import checkYogaPose, { calculateAngleBetweenPairs, calculateAngleDifference } from '../util/poses';
import { PoseDetectorContext } from '../context/poseDetectorContext';



const PoseDetection = () => {
    const { poseDetector, loaded } = useContext(PoseDetectorContext);

    const [video, setVideo] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

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

            poseDetector.current.setVideoData(video.videoWidth, video.videoHeight, canvasRef)
            console.log("video width:", video.videoWidth, "video height:", video.videoHeight);
            if (video.readyState >= 3) {

                setInterval(async () => {
                    if (video.paused || video.ended) return;
                    const poses = await poseDetector.current.getPose(video)
                    poseDetector.current.drawPoses(poses, video);
                    // poseDetector.current.drawSkeleton(poses);

                    const anglesDiff = calculateAngleDifference(poses, "mountain")
                    poseDetector.current.drawAngularSkeleton(poses, anglesDiff)

                    const pose = poses[0];
                    if (pose) {
                        const userpose = checkYogaPose(pose.keypoints, "mountain");
                        console.log(userpose)
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
                            poseDetector.current.setVideoData(imageRef.current.width, imageRef.current.height, canvasRef)
                            const pose = await poseDetector.current.getPose(imageRef.current)
                            poseDetector.current.drawPoses(pose, imageRef.current);
                            poseDetector.current.drawSkeleton(pose);
                            const angles = calculateAngleBetweenPairs(pose)
                            console.log(angles);
                            const userpose = checkYogaPose(pose[0].keypoints, "mountain");
                            console.log(userpose)

                        }
                    }}


                />
                <img src='' width="480" height="320" ref={imageRef} />
            </div>






        </div>

    );
};

export default PoseDetection;
