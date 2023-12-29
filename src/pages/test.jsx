import React, { useRef, useEffect } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';

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
        ctx.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
        // ctx.clearRect(0, 0, canvas.width, canvas.height);



        if (poses && poses.length > 0) {
            const pose = poses[0]; // Assuming you want to draw the first pose
            const keypoints = pose.keypoints;
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

        }
    };

    const drawSkeleton = (ctx, pose) => {
        const keypoints = pose.keypoints;

        // Define connections as pairs of keypoint indices
        const connections = [
            [4, 2], // right ear to eye
            [2, 0], // right eye to nose
            [0, 1], // nose to left eye
            [1, 3], // left eye to left ear
            [6, 8], // right shoulder to elbow
            [8, 10], // right elbow to wrist
            [5, 7], // left shoulder to elbow
            [7, 9], // left elbow to wrist
            [6, 5], // right shoulder to left shoulder
            [6, 12], // right shoulder to hip
            [5, 11], // left shoulder to hip
            [12, 11], // hip to hip
            [12, 14], // right hip to knee
            [14, 16], // right knee to ankle
            [11, 13], // left hip to knee
            [13, 15] // left knee to ankle
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


    const loadModel = async (detectorConfig) => {
        await tf.ready();
        model.current = await poseDetection.createDetector(poseDetection.SupportedModels.PoseNet, detectorConfig);
    };

    const startVideo = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;

        videoRef.current.addEventListener('play', async () => {
            await loadModel(detectorConfig);
            setInterval(async () => {
                const poses = await model.current.estimatePoses(videoRef.current, estimationConfig);
                // Draw the poses on a canvas or use them as needed
                drawPoses(poses);
            }, 100); // Adjust interval for performance
        });
    };

    useEffect(() => {
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
