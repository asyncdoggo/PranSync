import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"
import { PoseDetectorContext } from "../context/poseDetectorContext";

export default function PoseGuide() {
    const { poseDetector, loaded } = useContext(PoseDetectorContext);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const param = useParams()
    const [canvasloaded, setCanvasLoaded] = useState(false);



    const constraints = {
        video:
            navigator.userAgentData.mobile ?
                {
                    facingMode: { exact: "environment" }
                }
                : true
    }

    const videoChange = (e) => {
        // setVideo(e.target.files[0]);
        videoRef.current.src = URL.createObjectURL(e.target.files[0]);
        detectPoseFromVideo(videoRef.current);
    }


    const videoLoad = async () => {
        onResize()
        console.log("video width:", video.videoWidth, "video height:", video.videoHeight);
        if (video.readyState >= 3) {

            setInterval(async () => {
                if (video.paused || video.ended) return;
                const poses = await poseDetector.current.getPose(video)
                poseDetector.current.drawPoses(poses, video);
                poseDetector.current.drawSkeleton(poses);
                const pose = poses[0];
                if (pose) {
                    // const userpose = checkYogaPose(pose.keypoints, "mountain");
                    // console.log(userpose)
                }
            }, 40);
        }
    }

    async function detectPoseFromVideo(video) {
        video.addEventListener('loadeddata', videoLoad);
    }

    async function startVideo() {
        const video = videoRef.current;
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        detectPoseFromVideo(video);
    }

    async function stopVideo() {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop())
        video.removeEventListener('loadeddata', videoLoad)
    }

    const onResize = () => {

        if (window.innerWidth > 1440) {
            poseDetector.current.setVideoData(videoRef.current.videoWidth, videoRef.current.videoHeight, canvasRef, window.innerWidth - 768)
            return
        }
        if (window.innerWidth > 1024 && window.innerWidth < 1440) {
            poseDetector.current.setVideoData(videoRef.current.videoWidth, videoRef.current.videoHeight, canvasRef, window.innerWidth - 512)
            return
        }
        else if (window.innerWidth > 768 && window.innerWidth < 1024) {
            poseDetector.current.setVideoData(videoRef.current.videoWidth, videoRef.current.videoHeight, canvasRef, window.innerWidth - 100)
            return
        }

        poseDetector.current.setVideoData(videoRef.current.videoWidth, videoRef.current.videoHeight, canvasRef, window.innerWidth - 50)

    }

    useEffect(() => {
        window.addEventListener('beforeunload', stopVideo)
        window.addEventListener('resize', onResize)

        return () => {
            window.removeEventListener('beforeunload', stopVideo)
            window.removeEventListener('resize', onResize)
        }
    }, [])




    return (
        <>
            {
                loaded ? <>
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-3xl font-bold text-center">Pose Guide</h1>
                        <h2 className="text-xl font-bold text-center">{param.pose} pose</h2>

                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={startVideo}>Start Camera</button>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={stopVideo}>Stop Camera</button>

                        <canvas id="canvas" ref={canvasRef}></canvas>
                        <video id="video" ref={videoRef} width="1px" autoPlay muted playsInline className="invisible fixed -z-10"></video>
                    </div >
                </> : <h1>Loading...</h1>
            }

        </>
    )
}