import { Link } from "react-router-dom"
import mountain_image from "../assets/mountain.png";
import tree_image from "../assets/tree.svg";
import warrior1 from "../assets/warrior1.svg";
import warrior2 from "../assets/warrior2.svg";
import warrior3 from "../assets/warrior3.png";
import triangle from "../assets/triangle.svg";
import halfmoon from "../assets/halfmoon.svg";
import chair from "../assets/chair.svg";
import forwardfold from "../assets/forwardfold.svg";
import downwardDog from "../assets/downwardDog.svg";
import triangleTwist from "../assets/triangleTwist.svg";
import crescentlunge from "../assets/crescentLunge.svg";
import dancerpose from "../assets/dancerPose.svg";

export default function Poses() {
    const yogaPoses = [
        {
            pose: "Mountain (Tadasana)",
            description: "The foundation of all standing poses, Mountain Pose makes a great a starting position, resting pose, or tool to improve posture.",
            image: mountain_image,
            link: "mountain"

        },
        {
            pose: "Tree",
            description: "Tree Pose stretches the thighs, groins, torso, and shoulders. It builds strength in the ankles and calves, and tones the abdominal muscles. The pose also helps to remedy flat feet and is therapeutic for sciatica.",
            image: tree_image,
            link: "tree"
        },
        {
            pose: "Warrior 1",
            description: "Warrior I is a standing lunge that deeply strengthens your legs and core. It also stretches your chest and shoulders, and opens your hips.",
            image: warrior1,
            link: "warrior1"
        },
        {
            pose: "warrior 2",
            description: "Warrior II strengthens the legs, opens the hips and chest and shoulders, and stretches the groins, ankles and calves.",
            image: warrior2,
            link: "warrior2"
        },
        {
            pose: "warrior 3",
            description: "Warrior III strengthens the legs and ankles, stretches the chest and shoulders, and improves balance and posture.",
            image: warrior3,
            link: "warrior3"
        },
        {
            pose: "triangle",
            description: "Triangle Pose stretches the legs, hips, groin, shoulders, chest, spine and ankles. It also increases both physical and mental stability, and cultivates balance and concentration.",
            image: triangle,
            link: "triangle"
        },
        {
            pose: "half moon",
            description: "Half Moon Pose strengthens the abdomen, ankles, thighs, buttocks, and spine. It stretches the groins, hamstrings and calves, shoulders, chest, and spine.",
            image: halfmoon,
            link: "halfmoon"
        },
        {
            pose: "chair",
            description: "Chair Pose clearly works the muscles of the arms and legs, but it also stimulates the diaphragm and heart.",
            image: chair,
            link: "chair"
        },
        {
            pose: "forward fold",
            description: "Forward Fold stretches the hamstrings, calves, and hips. It also strengthens the thighs and knees, and keeps your spine strong and flexible.",
            image: forwardfold,
            link: "forwardfold"
        },
        {
            pose: "downward dog",
            description: "Downward Dog stretches the shoulders, hamstrings, calves, arches, and hands. It strengthens the arms and legs, and helps relieve fatigue and sciatica.",
            image: downwardDog,
            link: "downwarddog"
        },
        {
            pose: "Triangle Twist",
            description: "Triangle Twist Pose is a standing yoga pose that tones the legs, reduces stress, and increases stability and balance.",
            image: triangleTwist,
            link: "triangletwist"
        },
        {
            pose: "Crescent Lunge",
            description: "Crescent Lunge strengthens and stretches the legs, hips, and thighs, while opening the chest, shoulders, and arms.",
            image: crescentlunge,
            link: "crescentlunge"
        },
        {
            pose: "Dancer Pose",
            description: "Dancer Pose stretches the shoulders, chest, thighs, groins, and abdomen. It strengthens the legs and ankles, improves balance, and adds grace and poise to your practice.",
            image: dancerpose,
            link: "dancerpose"
        },

    ]


    return (
        <>
            <h1>Poses</h1>
            <div className="pose-list justify-center items-center flex flex-col">

                {
                    yogaPoses.map((pose, index) => {
                        return (

                            <Link className="w-full posecard flex flex-row justify-start items-center border hover:border-gray-400 hover:shadow-lg p-4 my-4 hover:cursor-pointer"
                                key={index}
                                to={`/pose/${pose.link}`}>
                                <img src={pose.image} alt={pose.pose} className="w-1/4" />
                                <div className="w-3/4 flex flex-col justify-center items-center">
                                    <h1 className="text-2xl font-bold self-start">{pose.pose}</h1>
                                    <p className="text-md">{pose.description}</p>
                                </div>
                            </Link>
                        )
                    })
                }
            </div>
        </>
    )
}