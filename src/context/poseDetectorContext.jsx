import { createContext } from "react";

export const PoseDetectorContext = createContext({
    poseDetector: null,
    loaded: false,
});
