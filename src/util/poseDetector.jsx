import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-webgpu'
import checkMountainYogaPose from './MountaionYogaPose';


export default class PoseDetector {
    constructor(canvasRef) {

        // this.video = videoRef.current;
        this.canvas = canvasRef.current;
        this.model = null;

        // const { width, height } = this.scaleDimensions(videoWidth, videoHeight, 240);

        // console.log("scaled dims:", width, height);

        // this.scaledWidth = width;
        // this.scaledHeight = height;

        // this.videoWidth = videoWidth;
        // this.videoHeight = videoHeight;

        // this.canvas_scale = 2;

        // this.canvas.width = this.scaledWidth * this.canvas_scale;
        // this.canvas.height = this.scaledHeight * this.canvas_scale;

        this.ctx = this.canvas.getContext('2d');

        // // this.detectorConfig = {
        // //     architecture: 'MobileNetV2',
        // //     outputStride: 16,
        // //     inputResolution: { width: this.scaledWidth, height: this.scaledHeight },
        // //     multiplier: 0.5
        // // };


        this.detectorConfig = {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
            enableTracking: true,
            trackerType: poseDetection.TrackerType.BoundingBox,
            minPoseScore: 0.5,

        };

        this.estimationConfig = {
            maxPoses: 1,
            flipHorizontal: false,
            scoreThreshold: 0.5,
            nmsRadius: 20
        };
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
        console.log(poses)
        return poses;


        frame.dispose();
        // return await this.model.estimatePoses(frame, this.estimationConfig);
    }

    unloadModel() {
        this.model.dispose();
        this.model = null;
    }


    setVideoData(videoWidth, videoHeight) {
        const { width, height } = this.scaleDimensions(videoWidth, videoHeight, 240);

        console.log("scaled dims:", width, height);

        this.scaledWidth = width;
        this.scaledHeight = height;

        this.videoWidth = videoWidth;
        this.videoHeight = videoHeight;

        this.canvas_scale = 2;

        this.canvas.width = this.scaledWidth * this.canvas_scale;
        this.canvas.height = this.scaledHeight * this.canvas_scale;
    }


    scaleCoordinates(originalX, originalY) {
        const scaleX = this.scaledWidth / this.canvas.width;
        const scaleY = this.scaledHeight / this.canvas.height;

        const scalefactor_y = this.canvas.height / this.videoHeight;
        const scalefactor_x = this.canvas.width / this.videoWidth;
        const scaledX = originalX * scaleX * scalefactor_x * this.canvas_scale;
        const scaledY = originalY * scaleY * scalefactor_y * this.canvas_scale;
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
                this.ctx.arc(x1, y1, 5, 0, 2 * Math.PI);
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
                this.ctx.lineWidth = 2; // Adjust line width as needed
                this.ctx.stroke();
            }
        }
    }

    scaleDimensions(originalWidth, originalHeight, constWidth = 512, constHeight = null) {

        if (originalHeight > originalWidth) {
            constHeight = constWidth;
            constWidth = null;
        }

        const aspectRatio = originalWidth / originalHeight;

        if (constWidth && constHeight) {
            return { width: originalWidth, height: originalHeight };
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
