// LottiePlayer.js
import React from "react";
import Lottie from "lottie-react";

// Dynamic Lottie animation component
const LottiePlayer = ({ animationFile, width = "100px", height = "100px", loop = true }) => {
    return (
        <div style={{ width, height }}>
            <Lottie animationData={animationFile} loop={loop} />
        </div>
    );
};

export default LottiePlayer;