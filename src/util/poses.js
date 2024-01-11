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
    'warrior pose': {
        "left_shoulder-left_elbow": 156.68071949091066,
        "left_elbow-left_wrist": 161.34216897848933,
        "right_shoulder-right_elbow": 0.6117792488025585,
        "right_elbow-right_wrist": -14.222851801720587,
        "left_hip-left_knee": 151.4445372271611,
        "right_hip-right_knee": -11.194360319262103,
        "left_knee-left_ankle": 165.70182735248983,
        "right_knee-right_ankle": 104.44616203546497,
    }, 
    'forward fold': {
        "left_shoulder-left_elbow": 80.99468415614923,
        "left_elbow-left_wrist": 91.71667490982325,
        "right_shoulder-right_elbow": 97.11760512819406,
        "right_elbow-right_wrist": 95.51614951720086,
        "left_hip-left_knee": 91.29800414792324,
        "right_hip-right_knee": 82.25783578578272,
        "left_knee-left_ankle": 92.1457243416118,
        "right_knee-right_ankle": 83.39897490494849,
    }, 
    'triangle pose': {
        "left_shoulder-left_elbow": 80.62974461414443,
        "left_elbow-left_wrist": 62.58738270953999,
        "right_shoulder-right_elbow": -100.47778020896679,
        "right_elbow-right_wrist": -82.32240103586281,
        "left_hip-left_knee": 55.5375037021053,
        "right_hip-right_knee": 118.24097308752138,
        "left_knee-left_ankle": 57.74971886029495,
        "right_knee-right_ankle": 113.52880934566475,
    }, 
    'tree-pose': {
        "left_shoulder-left_elbow": -94.77946584514672,
        "left_elbow-left_wrist": -105.21574323964435,
        "right_shoulder-right_elbow": -89.53122538630336,
        "right_elbow-right_wrist": -75.27259298737377,
        "left_hip-left_knee": 102.30280852088784,
        "right_hip-right_knee": 132.17892775583175,
        "left_knee-left_ankle": -96.42861142144108,
        "right_knee-right_ankle": -15.951258375217307,
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
    'peaceful-warrior-pose': {
        "left_shoulder-left_elbow": 78.4084361490467,
        "left_elbow-left_wrist": 74.97439910261855,
        "right_shoulder-right_elbow": -56.686546276412365,
        "right_elbow-right_wrist": -57.86869804308677,
        "left_hip-left_knee": 41.27041820208564,
        "right_hip-right_knee": 154.93188657466163,
        "left_knee-left_ankle": 43.05073063708958,
        "right_knee-right_ankle": 94.26399719288383,
    },
    'triangle-twist': {
        "left_shoulder-left_elbow": 80.6298232701816,
        "left_elbow-left_wrist": 62.587410046558716,
        "right_shoulder-right_elbow": -100.47768206240367,
        "right_elbow-right_wrist": -82.3224474653228,
        "left_hip-left_knee": 55.537460223322874,
        "right_hip-right_knee": 118.2409916297057,
        "left_knee-left_ankle": 57.749693724095096,
        "right_knee-right_ankle": 113.52877381544809,
    }, 
    'cresent-lunge': {
        "left_shoulder-left_elbow": -90.52616314287081,
        "left_elbow-left_wrist": -92.80271046741768,
        "right_shoulder-right_elbow": -105.35199844052634,
        "right_elbow-right_wrist": -87.19587572163918,
        "left_hip-left_knee": 65.15981189084104,
        "right_hip-right_knee": 177.83097334635562,
        "left_knee-left_ankle": -42.616165388508485,
        "right_knee-right_ankle": 93.762694757014,
    }, 
    'dancer-pose': {
        "left_shoulder-left_elbow": 16.46349483186454,
        "left_elbow-left_wrist": 17.907654139092855,
        "right_shoulder-right_elbow": -139.8591771613932,
        "right_elbow-right_wrist": -127.16303472777368,
        "left_hip-left_knee": 107.00600794435887,
        "right_hip-right_knee": -137.01815209673276,
        "left_knee-left_ankle": 85.19743044521314,
        "right_knee-right_ankle": 81.18849471656495,
    }, 
    'chair-pose': {
        "left_shoulder-left_elbow": -101.20962374912462,
        "left_elbow-left_wrist": -96.75757667294315,
        "right_shoulder-right_elbow": -101.03668109928273,
        "right_elbow-right_wrist": -94.40791836694423,
        "left_hip-left_knee": 138.23100831007383,
        "right_hip-right_knee": 137.63416185747886,
        "left_knee-left_ankle": 67.17287091549557,
        "right_knee-right_ankle": 67.23206453321264,
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