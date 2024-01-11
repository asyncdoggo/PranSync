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

const angleBetweenPairs =
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


// Defining a yoga pose 
const yogaPoses = {
    'mountain': {
        'left_shoulder-left_elbow': 85,
        'left_elbow-left_wrist': 72,
        'right_shoulder-right_elbow': 96,
        'right_elbow-right_wrist': 109,
        'left_hip-left_knee': 97,
        'right_hip-right_knee': 90,
        'left_knee-left_ankle': 95,
        'right_knee-right_ankle': 90

    },
    'tree': {
        'left_shoulder-left_elbow': 66,
        'left_elbow-left_wrist': -164,
        'right_shoulder-right_elbow': 124,
        'right_elbow-right_wrist': -9,
        'left_hip-left_knee': 94,
        'right_hip-right_knee': 153,
        'left_knee-left_ankle': 100,
        'right_knee-right_ankle': 1
    },
}

// 'Downward Dog': {
// gives inaccurate pose
// },
// 'Warrior Pose': {

// },
// 'Child\'s Pose': {

// },
// 'Cobra Pose': {

// },
// 'Bridge Pose': {

// },
// 'Chair Pose': {

// },
// 'Plank Pose': {

// },
// Add more poses as needed


// Calculate the angle between two keypoints in degrees
function calculateAngle(keypoint1, keypoint2) {
    return Math.atan2(keypoint2.y - keypoint1.y, keypoint2.x - keypoint1.x) * 180 / Math.PI;
}

// // Calculate the distance between two keypoints
// function calculateDistance(keypoint1, keypoint2, scaleX = 1, scaleY = 1) {
//     return Math.sqrt(Math.pow(keypoint2.x - keypoint1.x, 2) + Math.pow(keypoint2.y - keypoint1.y, 2));
// }

// Check if the detected pose matches a yoga pose
export default function checkYogaPose(keypoints, pose) {

    let isMatch = true;
    for (const pair in yogaPoses[pose]) {
        const angle = calculateAngle(keypoints[joints[pair.split('-')[0]]], keypoints[joints[pair.split('-')[1]]]);
        const lowerBound = yogaPoses[pose][pair] - 10;
        const upperBound = yogaPoses[pose][pair] + 10;
        if (angle < lowerBound || angle > upperBound) {
            isMatch = false;
            break;
        }
    }

    return isMatch;
}



export function calculateAngleBetweenPairs(pose) {
    let s = "{"
    const keypoints = pose[0].keypoints;
    for (const pair of angleBetweenPairs) {
        const [keypoint1, keypoint2] = pair.split('-');
        const angle = calculateAngle(keypoints[joints[keypoint1]], keypoints[joints[keypoint2]]);
        s += `"${pair}": ${angle},\n`
    }
    s += "}"
    return s
}