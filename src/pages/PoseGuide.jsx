import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"
import { PoseDetectorContext } from "../context/poseDetectorContext";
import { calculateAngleBetweenPairs, calculateAngleDifference } from "../util/poses";

export default function PoseGuide() {
    const { poseDetector, loaded } = useContext(PoseDetectorContext);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const uploadRef = useRef(null)
    const param = useParams()
    const [isVideo, setIsVideo] = useState(null);
    const [progress, setProgress] = useState(0);

    const constraints = {
        video:
            navigator.userAgentData.mobile ?
                {
                    facingMode: { exact: "environment" }
                }
                : true
    }

    const videoSeek = (e) => {
        videoRef.current.currentTime = e.target.value * videoRef.current.duration / 100
    }

    const videoPause = (e) => {
        if (videoRef.current.paused) {
            videoRef.current.play()
            e.target.innerHTML = "pause_circle"
        } else {
            videoRef.current.pause()
            e.target.innerHTML = "play_circle"
        }
    }

    const videoLoad = async () => {
        onResize()
        console.log("video width:", videoRef.current.videoWidth, "video height:", videoRef.current.videoHeight);
        if (videoRef.current.readyState >= 3) {

            setInterval(async () => {
                if (videoRef.current.paused || videoRef.current.ended) return;
                const poses = await poseDetector.current.getPose(videoRef.current)
                poseDetector.current.drawPoses(poses, videoRef.current);
                // poseDetector.current.drawSkeleton(poses);

                const anglesDiff = calculateAngleDifference(poses, param.pose)
                poseDetector.current.drawAngularSkeleton(poses, anglesDiff)
                const pose = poses[0];
                if (pose) {
                    // const userpose = checkYogaPose(pose.keypoints, "mountain");
                    // console.log(userpose)
                }
            }, 40);
        }
    }


    async function startCamera() {
        videoUnload()
        const video = videoRef.current;
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        video.addEventListener('loadeddata', videoLoad);
    }

    async function videoUnload() {
        if (videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop())
            videoRef.current.srcObject = null
        }
        else {
            videoRef.current.src = ""
        }
        setIsVideo(false)
        uploadRef.current.value = ""
        canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        videoRef.current.removeEventListener('loadeddata', videoLoad)
        videoRef.current.removeEventListener('timeupdate', TimeUpdate)
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


    function TimeUpdate() {
        try {
            setProgress(videoRef.current.currentTime / videoRef.current.duration * 100)
        }
        catch (e) {
            console.log(e)
        }
    }

    const videoChange = (e) => {
        console.log(uploadRef.current.value)
        console.log(e.target.files[0])
        // setVideo(e.target.files[0]);
        setIsVideo(true)
        videoRef.current.src = URL.createObjectURL(e.target.files[0]);
        videoRef.current.addEventListener('loadeddata', videoLoad);
        videoRef.current.addEventListener('timeupdate', TimeUpdate);
    }

    useEffect(() => {
        window.addEventListener('beforeunload', videoUnload)
        window.addEventListener('resize', onResize)

        return () => {
            window.removeEventListener('beforeunload', videoUnload)
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
                        <div className="flex flex-row justify-center items-center gap-x-16 py-4">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={startCamera}>Start Camera</button>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={videoUnload}>Stop Video</button>
                            <label htmlFor="fileupload" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                                Upload Video
                            </label>
                            <input
                                id="fileupload"
                                type='file'
                                accept='video/*'
                                onChange={videoChange}
                                hidden
                                ref={uploadRef}
                            />
                        </div>
                        <canvas id="canvas" ref={canvasRef}></canvas>

                        <div className="flex flex-col justify-center items-center">
                            {
                                isVideo ? <>
                                    <div className="buttons">
                                        <span id="play" className="material-symbols-outlined text-4xl" onClick={videoPause}>pause_circle</span>
                                    </div>
                                    <input className="text-4xl w-96" type="range" max="100" value={progress} step="any" onChange={videoSeek}></input>
                                </> : <></>
                            }
                        </div>


                        <video id="video" ref={videoRef} width="300px" autoPlay muted playsInline className="invisible fixed -z-10"></video>
                    </div >
                </> : <h1>Loading...</h1>
            }

        </>
    )
}