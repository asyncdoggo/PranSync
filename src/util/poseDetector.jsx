import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import checkMountainYogaPose from './MountaionYogaPose';


export default class PoseDetector {
    constructor(canvasRef, videoWidth, videoHeight) {

        // this.video = videoRef.current;
        this.canvas = canvasRef.current;
        this.model = null;

        this.videoWidth = videoWidth;
        this.videoHeight = videoHeight;

        this.canvas.width = videoWidth;
        this.canvas.height = videoHeight;

        this.ctx = this.canvas.getContext('2d');

        this.detectorConfig = {
            architecture: 'MobileNetV1',
            outputStride: 16,
            inputResolution: { width: videoWidth, height: videoHeight },
            multiplier: 0.5
        };
        this.estimationConfig = {
            maxPoses: 1,
            flipHorizontal: false,
            scoreThreshold: 0.5,
            nmsRadius: 20
        };
    }

    async loadModel() {
        await tf.ready();
        this.model = await poseDetection.createDetector(poseDetection.SupportedModels.PoseNet, this.detectorConfig);
    }

    // async startVideo() {
    //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    //     this.video.srcObject = stream;

    //     this.video.addEventListener('play', async () => {
    //         await this.loadModel()
    //         setInterval(async () => {
    //             const poses = await this.model.estimatePoses(this.video, this.estimationConfig);
    //             this.drawPoses(poses);
    //             this.drawSkeleton(poses);
    //             if (poses && poses.length > 0) {
    //                 const pose = poses[0]; // Assuming you want to draw the first pose
    //                 const mountainYogaPose = checkMountainYogaPose(pose.keypoints);
    //                 if (mountainYogaPose) {
    //                     console.log('mountainYogaPose');
    //                 }
    //             }
    //         }, 100); // Adjust interval for performance
    //     });
    // }

    async getPose(frame) {
        return await this.model.estimatePoses(frame, this.estimationConfig);
    }

    drawPoses(poses, frame) {
        // Clear the canvas before drawing new poses
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.drawImage(frame, 0, 0, this.videoWidth, this.videoHeight);

        console.log(this.videoWidth, this.videoHeight);

        if (poses && poses.length > 0) {
            const pose = poses[0]; // Assuming you want to draw the first pose
            const keypoints = pose.keypoints;

            for (const keypoint of keypoints) {
                const { score, x, y } = keypoint;

                // Only draw keypoints with high confidence scores
                if (score > 0.5) {

                    // Draw a circle for each keypoint
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
                    this.ctx.fillStyle = 'red'; // Adjust color as needed
                    this.ctx.fill();
                }
            }
        }
    }
    drawSkeleton(pose) {
        const keypoints = pose[0].keypoints;

        // Define connections as pairs of keypoint indices
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

                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.strokeStyle = 'green'; // Adjust color as needed
                this.ctx.lineWidth = 2; // Adjust line width as needed
                this.ctx.stroke();
            }
        }
    }
}
