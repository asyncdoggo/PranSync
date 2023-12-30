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


// Define a yoga pose (e.g., "Mountain Pose") in terms of angles and distances between keypoints
const yogaPoses = {
    'Mountain Pose': {
        'angles': {
            'leftElbow-rightElbow': 180, // The angle between the left elbow and the right elbow should be 180 degrees
            // Add more angles as needed
        },
        'distances': {
            'leftElbow-rightElbow': 100, // The distance between the left elbow and the right elbow should be 100 pixels
            // Add more distances as needed
        },
    },
    'Tree Pose': {
        'angles': {
            'leftAnkle-rightHip': 90, // The angle between the left ankle and the right hip should be 90 degrees
            'leftWrist-rightWrist': 180, // The angle between the left wrist and the right wrist should be 180 degrees
        },
        'distances': {
            'leftAnkle-rightHip': 50, // The distance between the left ankle and the right hip should be 50 pixels
            'leftWrist-rightWrist': 100, // The distance between the left wrist and the right wrist should be 100 pixels
        },
    },
    // Add more poses as needed
};

// Calculate the angle between two keypoints in degrees
function calculateAngle(keypoint1, keypoint2) {
    console.log(keypoint1, keypoint2)
    return Math.atan2(keypoint2.y - keypoint1.y, keypoint2.x - keypoint1.x) * 180 / Math.PI;

}

// Calculate the distance between two keypoints
function calculateDistance(keypoint1, keypoint2) {
    console.log(keypoint1, keypoint2)
    // console.log("Distance is "+Math.sqrt(Math.pow(keypoint2.x - keypoint1.x, 2) + Math.pow(keypoint2.y - keypoint1.y, 2)))
    return Math.sqrt(Math.pow(keypoint2.x - keypoint1.x, 2) + Math.pow(keypoint2.y - keypoint1.y, 2));
}

// Check if the detected pose matches a yoga pose
export default function checkMountainYogaPose(pose) {
    console.log(pose)
    for (const yogaPose in yogaPoses) {
        let isMatch = true;

        for (const keypoints in yogaPoses[yogaPose].angles) {
            const [keypoint1, keypoint2] = keypoints.split('-');
            const angle = calculateAngle(pose[keypoint1], pose[keypoint2]);

            if (Math.abs(angle - yogaPoses[yogaPose].angles[keypoints]) > 10) { // Allow a margin of error of 10 degrees
                isMatch = false;
                break;
            }
        }

        for (const keypoints in yogaPoses[yogaPose].distances) {
            const [keypoint1, keypoint2] = keypoints.split('-');
            console.log("Atharv "+pose[keypoint1], pose[keypoint2])
            const distance = calculateDistance(pose[keypoint1], pose[keypoint2]);

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