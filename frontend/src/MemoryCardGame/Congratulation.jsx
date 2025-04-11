import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgMusic from "../assets/audio/celebrate.mp3"; // Background music file
import congratulationImage from "../assets/images/congrats2.png"; // Path to your congratulation image
import { PixelBox, ImageContainer, ButtonContainer, PixelButton } from "../Utils/CongratulationStyles";

const Congratulations = ({difficulty}) => {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [bgVolume, setBgVolume] = useState(
    parseInt(localStorage.getItem("bgVolume"), 10) || 0
  );

  // Audio setup
  useEffect(() => {
    // Initialize audio object
    audioRef.current = new Audio(bgMusic);
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = bgVolume / 100;

    const handleClick = () => {
      audio.play().catch((error) => console.error("Background music playback failed:", error));
      document.removeEventListener("click", handleClick);
    };

    document.addEventListener("click", handleClick);

    return () => {
      // Cleanup
      audio.pause();
      audio.currentTime = 0;
      document.removeEventListener("click", handleClick);
    };
  }, [bgVolume]);

  // Listen to volume changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newVolume = parseInt(localStorage.getItem("bgVolume"), 10) || 0;
      setBgVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume / 100;
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Ensure the game was completed before showing congratulations
  useEffect(() => {
    const gameCompleted = localStorage.getItem("gameCompleted");
    if (!gameCompleted || gameCompleted !== "true") {
      navigate("/Play");
    }
  }, [navigate]);

  // Handlers for navigation buttons
  const handlePlayAgain = () => {
    switch(difficulty) {
      case "easy":
        navigate("/easy");
        break;

      case "medium":
        navigate("/medium");
        break;

      case "hard":
        navigate("/hard");
        break;
    }    
  };

  const handleExit = () => {
    localStorage.removeItem("gameCompleted");
    navigate("/play");
  };

  return (
    <PixelBox>
      <ImageContainer>
        <img
          src={congratulationImage}
          alt="Congratulations"
          style={{
            width: "100%",  // Adjust the width as you desire (e.g., 50%)
            height: "89%", // Maintain the aspect ratio
          }}
        />
      </ImageContainer>

      <ButtonContainer>
        <PixelButton onClick={handlePlayAgain}>Yes</PixelButton>
        <PixelButton onClick={handleExit}>No</PixelButton>
      </ButtonContainer>
    </PixelBox>
  );
};

export default Congratulations;
