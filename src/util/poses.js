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
    "tree": {
        "left_shoulder-left_elbow": -103.72909823424804,
        "left_elbow-left_wrist": -105.53433583262016,
        "right_shoulder-right_elbow": -82.4044243590426,
        "right_elbow-right_wrist": -85.53150626827403,
        "left_hip-left_knee": 104.32430242001331,
        "right_hip-right_knee": 136.43363604459574,
        "left_knee-left_ankle": 102.67629265313344,
        "right_knee-right_ankle": -13.058555287164655
    },
    "warrior1": {
        "left_shoulder-left_elbow": -93.7751418229658,
        "left_elbow-left_wrist": -79.75744799371566,
        "right_shoulder-right_elbow": -86.37656247174819,
        "right_elbow-right_wrist": -73.3828472870703,
        "left_hip-left_knee": 45.60408471655095,
        "right_hip-right_knee": 160.11636329891667,
        "left_knee-left_ankle": 39.35451633346065,
        "right_knee-right_ankle": 90.4245191199344
    },
    "warrior2": {
        "left_shoulder-left_elbow": -6.968405271900924,
        "left_elbow-left_wrist": -13.548854196562637,
        "right_shoulder-right_elbow": -179.1394915174031,
        "right_elbow-right_wrist": -179.10416187797284,
        "left_hip-left_knee": 10.683008249950333,
        "right_hip-right_knee": 135.00763436131228,
        "left_knee-left_ankle": 85.41603125292671,
        "right_knee-right_ankle": 145.9772497684203
    },
    "warrior3": {
        "left_shoulder-left_elbow": 159.3826792338062,
        "left_elbow-left_wrist": 173.25954540817366,
        "right_shoulder-right_elbow": 154.6091705805564,
        "right_elbow-right_wrist": 171.32716750844114,
        "left_hip-left_knee": 95.74795790530723,
        "right_hip-right_knee": 4.765332108373474,
        "left_knee-left_ankle": 92.27587209805871,
        "right_knee-right_ankle": -16.540600290051906
    },
    "triangle": {
        "left_shoulder-left_elbow": -75.07602229645241,
        "left_elbow-left_wrist": -99.56982927776733,
        "right_shoulder-right_elbow": 87.86999039569875,
        "right_elbow-right_wrist": 103.74124859270742,
        "left_hip-left_knee": 63.46250896573152,
        "right_hip-right_knee": 122.17754356328709,
        "left_knee-left_ankle": 64.43640335883282,
        "right_knee-right_ankle": 131.67405182842387
    },
    "halfmoon": {
        "left_shoulder-left_elbow": -82.85239742278264,
        "left_elbow-left_wrist": -91.0752009868503,
        "right_shoulder-right_elbow": 86.49973544656086,
        "right_elbow-right_wrist": 102.380541247523,
        "left_hip-left_knee": 1.558776593094161,
        "right_hip-right_knee": 91.0817920563828,
        "left_knee-left_ankle": 8.597104131934996,
        "right_knee-right_ankle": 97.48967368085644
    },
    "chair": {
        "left_shoulder-left_elbow": -126.80237325112117,
        "left_elbow-left_wrist": -122.77501198202296,
        "right_shoulder-right_elbow": -123.78264186800696,
        "right_elbow-right_wrist": -128.10917149526222,
        "left_hip-left_knee": 147.19285792945337,
        "right_hip-right_knee": 146.70283613093602,
        "left_knee-left_ankle": 65.98758687357808,
        "right_knee-right_ankle": 65.43303416387998
    },
    "forwardfold": {
        "left_shoulder-left_elbow": 107.95072238319966,
        "left_elbow-left_wrist": 88.78878170844038,
        "right_shoulder-right_elbow": 107.42963046241928,
        "right_elbow-right_wrist": 92.04930984306726,
        "left_hip-left_knee": 82.74323408906763,
        "right_hip-right_knee": 82.85945260940989,
        "left_knee-left_ankle": 93.93170449770442,
        "right_knee-right_ankle": 93.36227840116335
    },
    "downwarddog": {
        "left_shoulder-left_elbow": 122.42116061677291,
        "left_elbow-left_wrist": 131.20465270921625,
        "right_shoulder-right_elbow": 122.85406695465974,
        "right_elbow-right_wrist": 130.20966005934952,
        "left_hip-left_knee": 52.01360175244879,
        "right_hip-right_knee": 52.83112992016958,
        "left_knee-left_ankle": 57.30926566964522,
        "right_knee-right_ankle": 56.1438913582264
    },
    "triangletwist": {
        "left_shoulder-left_elbow": 109.54734043106654,
        "left_elbow-left_wrist": 93.6087391195005,
        "right_shoulder-right_elbow": -106.30126630640727,
        "right_elbow-right_wrist": -86.32134997313894,
        "left_hip-left_knee": 125.55791806869648,
        "right_hip-right_knee": 63.701217977697425,
        "left_knee-left_ankle": 115.90835920798311,
        "right_knee-right_ankle": 75.36607766033771
    },
    "crescentlunge": {
        "left_shoulder-left_elbow": -79.41955318642957,
        "left_elbow-left_wrist": -54.872299124132375,
        "right_shoulder-right_elbow": -86.98728879317646,
        "right_elbow-right_wrist": -50.67999505489762,
        "left_hip-left_knee": -168.07837607334685,
        "right_hip-right_knee": 53.510890313162385,
        "left_knee-left_ankle": 87.84441685861763,
        "right_knee-right_ankle": -0.8779758323884516
    },
    "dancer": {
        "left_shoulder-left_elbow": -37.11394850978495,
        "left_elbow-left_wrist": -44.93060753851281,
        "right_shoulder-right_elbow": -158.05633229270853,
        "right_elbow-right_wrist": -163.1064969776013,
        "left_hip-left_knee": 92.42729926018806,
        "right_hip-right_knee": -160.45385116056784,
        "left_knee-left_ankle": 90.01427334923339,
        "right_knee-right_ankle": -62.802339067430495
    }
}

// Calculate the angle between two keypoints in degrees
export function calculateAngle(keypoint1, keypoint2) {
    return Math.atan2(keypoint2.y - keypoint1.y, keypoint2.x - keypoint1.x) * 180 / Math.PI;
}

// // Calculate the distance between two keypoints
// function calculateDistance(keypoint1, keypoint2, scaleX = 1, scaleY = 1) {
//     return Math.sqrt(Math.pow(keypoint2.x - keypoint1.x, 2) + Math.pow(keypoint2.y - keypoint1.y, 2));
// }


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
    let s = {}
    const keypoints = pose[0].keypoints;
    for (const pair of angleBetweenPairs) {
        const [keypoint1, keypoint2] = pair.split('-');
        const angle = calculateAngle(keypoints[joints[keypoint1]], keypoints[joints[keypoint2]]);
        s[pair] = angle
    }
    return s
}



export function calculateAngleDifference(poses, pose_name) {
    if (!poses || poses.length === 0) return {}
    const angles1 = calculateAngleBetweenPairs(poses)
    const angles2 = yogaPoses[pose_name]

    let diff = {}
    for (const pair in angles1) {
        const pair_split = pair.split('-')
        const joint_pair = [joints[pair_split[0]], joints[pair_split[1]]]
        diff[joint_pair] = angles1[pair] - angles2[pair]
    }
    return diff
}