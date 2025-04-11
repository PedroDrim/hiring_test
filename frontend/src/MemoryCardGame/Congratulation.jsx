import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid2, Modal } from "@mui/material"
import axios from "axios"
import bgMusic from "../assets/audio/celebrate.mp3"; // Background music file
import congratulationImage from "../assets/images/congrats2.png"; // Path to your congratulation image
import { PixelBox, ImageContainer, ButtonContainer, PixelButton } from "../Utils/CongratulationStyles";
import { PixelTypography, PixelButtonModal, modalStyle } from "../Utils/CardStyles"
import MemoryCardConstants from "../Utils/MemoryCardConstants";

const Congratulations = ({ difficulty }) => {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [scores, setScores] = useState([]);
  const [openModal, setOpenModal] = useState(false)
  const [bgVolume, setBgVolume] = useState(
    parseInt(localStorage.getItem("bgVolume"), 10) || 0
  );

  // ================================================== //
  const gameRedirectURI = MemoryCardConstants[difficulty].gameRedirectURI
  const saveApiEnum = MemoryCardConstants[difficulty].saveApiEnum
  // ================================================== //

  useEffect(() => {
    const scoreHistory = async () => {
      try {
        const scoreURI = "http://localhost:5000/api/memory/scoreHistory/" + localStorage.getItem("userID") + "/" + saveApiEnum
        const response = await axios.get(scoreURI, {
          headers: { "Content-Type": "application/json" },
        })
    
        console.log("History recieve successfully", response.data)
        setScores(response.data)
      } catch (error) {
        console.error("Error recieve history:", error.response ? error.response.data : error.message)
      }
    }

    // Getting history data
    scoreHistory()
  }, [difficulty])

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
    navigate(gameRedirectURI);
  };

  const handleExit = () => {
    localStorage.removeItem("gameCompleted");
    navigate("/play");
  };

  const handleShowHistory = () => {
    setOpenModal(true) // Show the history
  }

  const handleBackButton = () => {
    setOpenModal(false)
  }

  return (
    <>
      <PixelBox>
        <ImageContainer>
          <img
            src={congratulationImage}
            alt="Congratulations"
            style={{
              width: "100%",  // Adjust the width as you desire (e.g., 50%)
              height: "89%", // Maintain the aspect ratio
              alignSelf: "flex-start"
            }}
          />

          <ButtonContainer>
            <PixelButton onClick={handleShowHistory}>History</PixelButton>
          </ButtonContainer>
        </ImageContainer>

        <ButtonContainer>
          <PixelButton onClick={handlePlayAgain}>Yes</PixelButton>
          <PixelButton onClick={handleExit}>No</PixelButton>
        </ButtonContainer>

      </PixelBox>

      <Modal open={openModal} onClose={handleBackButton}>
        <Box sx={modalStyle} style={{width: "60vw"}}>
          <PixelTypography variant="h6">
            <Grid2 container spacing={2} justifyContent="center" style={{overflowY: "auto", maxHeight: "300px"}}>
              {scores.map((score) => (
                <Grid2 key={score.gameDate}>
                  Solved in {score.timeTaken}s with {score.failed} mistakes
                </Grid2>
              ))}
            </Grid2>

          </PixelTypography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
            <PixelButtonModal onClick={handleBackButton} variant="contained" color="secondary">
              Back
            </PixelButtonModal>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Congratulations;
