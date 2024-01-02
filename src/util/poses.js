// // Define a yoga pose (e.g., "Mountain Pose") in terms of angles between keypoints
// const yogaPoses = {
//     'Mountain Pose': {
//         'leftElbow-rightElbow': 180, // The angle between the left elbow and the right elbow should be 180 degrees
//         // Add more keypoints as needed
//     },
//     // Add more poses as needed
// };

// // Calculate the angle between two keypoints
// function calculateAngle(keypoint1, keypoint2) {
//     // return Math.atan2(keypoint2.y - keypoint1.y, keypoint2.x - keypoint1.x) * 180 / Math.PI;
//     return Math.atan2(keypoint2.y - keypoint1.y, keypoint2.x - keypoint1.x);
// }

// // Check if the detected pose matches a yoga pose
// // export default function checkMountainYogaPose(pose) {
// //     for (const yogaPose in yogaPoses) {
// //         let isMatch = true;

// //         for (const keypoints in yogaPoses[yogaPose]) {
// //             const [keypoint1, keypoint2] = keypoints.split('-');
// //             const angle = calculateAngle(pose[keypoint1], pose[keypoint2]);

// //             if (Math.abs(angle - yogaPoses[yogaPose][keypoints]) > 10) { // Allow a margin of error of 10 degrees
// //                 isMatch = false;
// //                 break;
// //             }
// //         }

// //         if (isMatch) {
// //             return yogaPose;
// //         }
// //     }

// //     return null;
// // }

// // Check if the detected pose matches a yoga pose
// export default function checkMountainYogaPose(pose) {
//     for (const yogaPose in yogaPoses) {
//         let isMatch = true;

//         for (const keypoints in yogaPoses[yogaPose]) {
//             const [keypoint1, keypoint2] = keypoints.split('-');

//             // Check if the pose contains the expected keypoints
//             if (!pose[keypoint1] || !pose[keypoint2]) {
//                 console.error('Pose does not contain expected keypoints:', keypoints);
//                 continue;
//             }

//             const angle = calculateAngle(pose[keypoint1], pose[keypoint2]);

//             if (Math.abs(angle - yogaPoses[yogaPose][keypoints]) > 10) { // Allow a margin of error of 10 degrees
//                 isMatch = false;
//                 break;
//             }
//         }

//         if (isMatch) {
//             return yogaPose;
//         }
//     }

//     return null;
// }



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


const joints = {
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

// Defining a yoga pose 
const yogaPoses = {
    'Mountain Pose': {
        'angles': {
            'leftElbow-rightElbow': 180,
        },
        'distances': {
            'leftElbow-rightElbow': 100,
        },
    },
    'Tree Pose': {
        'angles': {
            'leftAnkle-rightHip': 90,
            'leftWrist-rightWrist': 180,
        },
        'distances': {
            'leftAnkle-rightHip': 50,
            'leftWrist-rightWrist': 100,
        },
    },
    'Downward Dog': {
        'angles': {
            'leftHand-rightFoot': 120,
            'rightHand-leftFoot': 120,
        },
        'distances': {
            'leftHand-rightFoot': 80,
            'rightHand-leftFoot': 80,
        },
    },
    'Warrior Pose': {
        'angles': {
            'leftKnee-leftAnkle': 90,
            'rightKnee-rightAnkle': 90,
        },
        'distances': {
            'leftKnee-leftAnkle': 70,
            'rightKnee-rightAnkle': 70,
        },
    },
    'Child\'s Pose': {
        'angles': {
            'head-hands': 90,
        },
        'distances': {
            'head-hands': 40,
        },
    },
    'Cobra Pose': {
        'angles': {
            'head-upperBody': 120,
        },
        'distances': {
            'head-upperBody': 60,
        },
    },
    'Bridge Pose': {
        'angles': {
            'knees-hips': 120,
        },
        'distances': {
            'knees-hips': 80,
        },
    },
    'Chair Pose': {
        'angles': {
            'knees-shoulders': 90,
        },
        'distances': {
            'knees-shoulders': 60,
        },
    },
    'Plank Pose': {
        'angles': {
            'shoulders-hips': 180,
        },
        'distances': {
            'shoulders-hips': 70,
        },
    },
    // Add more poses as needed
};


// Calculate the angle between two keypoints in degrees
function calculateAngle(keypoint1, keypoint2) {
    return Math.atan2(keypoint2.y - keypoint1.y, keypoint2.x - keypoint1.x) * 180 / Math.PI;
}

// Calculate the distance between two keypoints
function calculateDistance(keypoint1, keypoint2, scaleX = 1, scaleY = 1) {
    return Math.sqrt(Math.pow(keypoint2.x - keypoint1.x, 2) + Math.pow(keypoint2.y - keypoint1.y, 2));
}

// Check if the detected pose matches a yoga pose
export default function checkMountainYogaPose(pose) {
    for (const yogaPose in yogaPoses) {
        let isMatch = true;
        console.log(pose)
        for (const keypoints in yogaPoses[yogaPose].angles) {
            const [keypoint1, keypoint2] = keypoints.split('-');
            const angle = calculateAngle(pose[joints[keypoint1]], pose[joints[keypoint2]]);

            if (Math.abs(angle - yogaPoses[yogaPose].angles[keypoints]) > 10) { // Allow a margin of error of 10 degrees
                isMatch = false;
                break;
            }
        }

        for (const keypoints in yogaPoses[yogaPose].distances) {
            const [keypoint1, keypoint2] = keypoints.split('-');
            const distance = calculateDistance(pose[joints[keypoint1]], pose[joints[keypoint2]]);

            if (Math.abs(distance - yogaPoses[yogaPose].distances[keypoints]) > 10) { // Allow a margin of error of 10 pixels
                isMatch = false;
                break;
            }
        }

        if (isMatch) {
            return yogaPose;
        }
    }

    return null;
}

const mountainPoseGuide = {
    'angles': {
        'left_elbow-right_elbow': 180,

    },
}


export const isMountainPose = (pose) => {
    let isMatch = true;

    for (const keypoints in mountainPoseGuide.angles) {
        const [keypoint1, keypoint2] = keypoints.split('-');
        const angle = calculateAngle(pose[joints[keypoint1]], pose[joints[keypoint2]]);
        console.log("angle", angle)


        if (Math.abs(Math.abs(angle) - mountainPoseGuide.angles[keypoints]) > 10) { // Allow a margin of error of 10 degrees
            isMatch = false;
            break;
        }
    }

    return isMatch;
}