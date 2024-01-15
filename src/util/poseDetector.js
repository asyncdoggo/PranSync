import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-webgpu'
import { calculateAngle } from './poses';


export default class PoseDetector {
    constructor() {
        this.angleBetweenPairs =
            [
                'left_shoulder-left_elbow',
                'left_elbow-left_wrist',
                'right_shoulder-right_elbow',
                'right_elbow-right_wrist',
                "left_hip-left_knee",
                "right_hip-right_knee",
                "left_knee-left_ankle",
                "right_knee-right_ankle"
            ]

        this.joints = {
            "nose": "0",
            "left_eye": "1",
            "right_eye": "2",
            "left_ear": "3",
            "right_ear": "4",
            "left_shoulder": "5",
            "right_shoulder": "6",
            "left_elbow": "7",
            "right_elbow": "8",
            "left_wrist": "9",
            "right_wrist": "10",
            "left_hip": "11",
            "right_hip": "12",
            "left_knee": "13",
            "right_knee": "14",
            "left_ankle": "15",
            "right_ankle": "16"
        }

        this.canvas = null
        this.model = null;
        this.ctx = null

        this.detectorConfig = {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
            enableTracking: true,
            trackerType: poseDetection.TrackerType.Keypoint,
            minPoseScore: 0.4,

        };
    }

    setVideoData(videoWidth, videoHeight, canvasRef, canvasWidth) {

        this.canvas = canvasRef.current;
        this.ctx = this.canvas.getContext('2d');
        let { width, height } = this.scaleDimensions(videoWidth, videoHeight, 512);

        width = Math.floor(width);
        height = Math.floor(height);

        console.log("scaled dims:", width, height);

        this.scaledWidth = width;
        this.scaledHeight = height;

        this.videoWidth = videoWidth;
        this.videoHeight = videoHeight;


        let { width: cw, height: ch } = this.scaleDimensions(videoWidth, videoHeight, canvasWidth)

        this.canvas.width = Math.floor(cw);
        this.canvas.height = Math.floor(ch);

        this.canvas_scale_x = this.canvas.width / this.scaledWidth;
        this.canvas_scale_y = this.canvas.height / this.scaledHeight;

    }


    async loadModel() {
        tf.enableProdMode();

        if (navigator.userAgentData.mobile) {
            await tf.setBackend('webgl');
        } else {
            await tf.setBackend('webgpu');
        }
        await tf.ready();
        this.model = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, this.detectorConfig);
    }

    async getPose(video) {
        //scale video frame
        const frame = tf.browser.fromPixels(video)
        const resizedFrame = tf.image.resizeBilinear(frame, [this.scaledWidth, this.scaledHeight]);
        frame.dispose();
        const poses = await this.model.estimatePoses(video);
        resizedFrame.dispose();
        return poses;
    }

    unloadModel() {
        this.model.dispose();
        this.model = null;
    }

    resetCanvas() {
        this.ctx = null
        var new_element = this.canvas.cloneNode(true);
        this.canvas.parentNode.replaceChild(new_element, this.canvas);
        this.canvas = new_element;
        this.ctx = this.canvas.getContext('2d');
    }

    scaleCoordinates(originalX, originalY) {
        const scaleX = this.scaledWidth / this.videoWidth;
        const scaleY = this.scaledHeight / this.videoHeight;

        const scaledX = originalX * scaleX * this.canvas_scale_x;
        const scaledY = originalY * scaleY * this.canvas_scale_y;
        return { x: scaledX, y: scaledY };
    }

    drawPoses(poses, video) {
        // Clear the canvas before drawing new poses
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);

        if (!poses || poses.length === 0) {
            return;
        }
        const pose = poses[0]; // Assuming you want to draw the first pose
        const keypoints = pose.keypoints;

        for (const keypoint of keypoints) {
            const { score, x, y } = keypoint;

            // Only draw keypoints with high confidence scores
            if (score > 0.5) {
                const { x: x1, y: y1 } = this.scaleCoordinates(x, y);

                // Draw a circle for each keypoint
                this.ctx.beginPath();
                this.ctx.arc(x1, y1, 4, 0, 2 * Math.PI);
                this.ctx.fillStyle = 'red'; // Adjust color as needed
                this.ctx.fill();
            }
        }
    }
    drawSkeleton(pose) {

        if (!pose || pose.length === 0) return;

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
                const x1 = keypoint1.x
                const y1 = keypoint1.y
                const x2 = keypoint2.x
                const y2 = keypoint2.y

                const { x: x1s, y: y1s } = this.scaleCoordinates(x1, y1);
                const { x: x2s, y: y2s } = this.scaleCoordinates(x2, y2);


                this.ctx.beginPath();
                this.ctx.moveTo(x1s, y1s);
                this.ctx.lineTo(x2s, y2s);
                this.ctx.strokeStyle = 'green'; // Adjust color as needed
                this.ctx.lineWidth = 5; // Adjust line width as needed
                this.ctx.stroke();
            }
        }
    }




    drawAngularSkeleton(pose, anglesDiff) {
        if (!pose || pose.length === 0) return;

        const keypoints = pose[0].keypoints;

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


            let color = 'green';

            if (anglesDiff) {
                const diff = anglesDiff[`${connection[0]},${connection[1]}`];
                if (diff) {
                    if (Math.abs(diff) > 10) {
                        color = 'red'
                    }
                }
            }


            if (keypoint1.score > 0.5 && keypoint2.score > 0.5) {
                const x1 = keypoint1.x
                const y1 = keypoint1.y
                const x2 = keypoint2.x
                const y2 = keypoint2.y

                const { x: x1s, y: y1s } = this.scaleCoordinates(x1, y1);
                const { x: x2s, y: y2s } = this.scaleCoordinates(x2, y2);


                this.ctx.beginPath();
                this.ctx.moveTo(x1s, y1s);
                this.ctx.lineTo(x2s, y2s);
                this.ctx.strokeStyle = color
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        }
    }

    scaleDimensions(originalWidth, originalHeight, constWidth = null, constHeight = null) {

        if (originalHeight > originalWidth) {
            constHeight = constWidth;
            constWidth = null;
        }

        const aspectRatio = originalWidth / originalHeight;

        if (constWidth && constHeight) {
            return { width: constWidth, height: constHeight };
        }

        if (constWidth) {
            const scaledHeight = constWidth / aspectRatio;
            return { width: constWidth, height: scaledHeight };
        }

        if (constHeight) {
            const scaledWidth = constHeight * aspectRatio;
            return { width: scaledWidth, height: constHeight };
        }
        return { width: originalWidth, height: originalHeight };
    }
}
