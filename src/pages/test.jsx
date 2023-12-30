import React, { useRef, useEffect } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import checkMountainYogaPose from './MountaionYogaPose';


const PoseDetection = () => {
    const videoRef = useRef(null);
    const model = useRef(null);
    const canvasRef = useRef(null);

    const detectorConfig = {
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: { width: 320, height: 240 }, // Reduced input resolution
        multiplier: 0.5
    };

    const estimationConfig = {
        maxPoses: 1, // Limit to one pose for reducing resource usage
        flipHorizontal: false,
        scoreThreshold: 0.5,
        nmsRadius: 20
    };

    const drawPoses = (poses) => {
        const canvas = canvasRef.current;
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');

        // const filteredKeypoints = poses[0].keypoints.filter((keypoint) => keypoint.score > 0.7);
        // poses[0].keypoints = filteredKeypoints;
        // Clear the canvas before drawing new poses
        console.dir(videoRef.current);
        ctx.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
        ctx.clearRect(0, 0, canvas.width, canvas.height);



        if (poses && poses.length > 0) {
            const pose = poses[0]; // Assuming you want to draw the first pose
            const keypoints = pose.keypoints;

            ctx.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
            drawSkeleton(ctx, pose);
            

            for (const keypoint of keypoints) {
                const { score, x, y } = keypoint;

                // Only draw keypoints with high confidence scores
                if (score > 0.5) {

                    // Draw a circle for each keypoint
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, 2 * Math.PI);
                    ctx.fillStyle = 'red'; // Adjust color as needed
                    ctx.fill();
                }
            }

            const mountainYogaPose = checkMountainYogaPose(keypoints);
            if (mountainYogaPose) {
                console.log('mountainYogaPose');
            }



        }
    };

    const drawSkeleton = (ctx, pose) => {
        const keypoints = pose.keypoints;

        // Define connections as pairs of keypoint indices
        // const connections = [
        //     [0, 1], // Nose to neck
        //     [1, 2], // Neck to right shoulder
        //     [2, 3], // Right shoulder to right elbow
        //     [3, 4], // Right elbow to right wrist
        //     [1, 5], // Neck to left shoulder
        //     [5, 6], // Left shoulder to left elbow
        //     [6, 7], // Left elbow to left wrist
        //     [2, 8], // Right shoulder to right hip
        //     [8, 9], // Right hip to right knee
        //     [9, 10], // Right knee to right ankle
        //     [5, 11], // Left shoulder to left hip
        //     [11, 12], // Left hip to left knee
        //     [12, 13], // Left knee to left ankle
        //     [1, 14], // Neck to right eye
        //     [1, 15], // Neck to left eye
        //     [14, 16], // Right eye to right ear
        //     [15, 17], // Left eye to left ear
        // ];
        const connections = [
            [5, 7], // Left shoulder to left elbow
            [7, 9], // Left elbow to left wrist
            [6, 8], // Right shoulder to right elbow
            [8, 10], // Right elbow to right wrist
            [5, 6], // Left shoulder to right shoulder
            [11, 12], // Left hip to right hip
            [5, 11], // Left shoulder to left hip
            [6, 12], // Right shoulder to right hip
            [11, 13], // Left hip to left knee
            [13, 15], // Left knee to left ankle
            [12, 14], // Right hip to right knee
            [14, 16], // Right knee to right ankle
        ];

        for (const connection of connections) {
            const keypoint1 = keypoints[connection[0]];
            const keypoint2 = keypoints[connection[1]];

            if (keypoint1.score > 0.5 && keypoint2.score > 0.5) {
                const x1 = keypoint1.x;
                const y1 = keypoint1.y;
                const x2 = keypoint2.x;
                const y2 = keypoint2.y;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = 'green'; // Adjust color as needed
                ctx.lineWidth = 2; // Adjust line width as needed
                ctx.stroke();
            }
        }
    };

    useEffect(() => {
        const loadModel = async () => {
            await tf.ready();
            model.current = await poseDetection.createDetector(poseDetection.SupportedModels.PoseNet, detectorConfig);
        };

        const startVideo = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;

            videoRef.current.addEventListener('play', async () => {
                await loadModel();
                setInterval(async () => {
                    const poses = await model.current.estimatePoses(videoRef.current, estimationConfig);
                    // Draw the poses on a canvas or use them as needed
                    // console.log(poses);
                    drawPoses(poses);
                }, 100); // Adjust interval for performance
            });
        };

        startVideo();
    }, []);

    return (
        <>
            <video ref={videoRef} width="640" height="480" autoPlay playsInline />
            <canvas ref={canvasRef} ></canvas>
        </>

    );
};

export default PoseDetection;
