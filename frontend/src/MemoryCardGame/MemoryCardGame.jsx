import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Box, Grid2, Modal } from "@mui/material"
import bgMusic from "../assets/audio/memory-bg.mp3"
import axios from "axios"
import CardUtils from "../Utils/CardUtils"
import { StyledGameContainer, PixelButton, PixelBox, PixelTimerBox, PixelTypography, PixelButtonModal, modalStyle } from "../Utils/CardStyles"
import MemoryCardConstants from "../Utils/MemoryCardConstants"
import Card from "./Card"

const saveGameData = async (gameData) => {
  try {
    const response = await axios.post("http://localhost:5000/api/memory/save", gameData, {
      headers: { "Content-Type": "application/json" },
    })

    console.log("Game data saved successfully", response.data)
  } catch (error) {
    console.error("Error saving game data:", error.response ? error.response.data : error.message)
  }
}

const MemoryCardGame = ({difficulty}) => {
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedCards, setMatchedCards] = useState([])
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [timer, setTimer] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [initialReveal, setInitialReveal] = useState(true)
  const [musicStarted, setMusicStarted] = useState(false)
  const [mouseDisabled, setMouseDisabled] = useState(false)
  const [bgVolume] = useState(parseInt(localStorage.getItem("bgVolume"), 10) || 0)
  const [sfxVolume] = useState(parseInt(localStorage.getItem("sfxVolume"), 10) || 0)
  const audioRef = useRef(null)
  const [audioIndex, setAudioIndex] = useState(0)
  const [openModal, setOpenModal] = useState(false)

  // ================================================== //
  const gridSxDifficulty = MemoryCardConstants[difficulty].gridSxDifficulty
  const gridSpacingDifficulty = MemoryCardConstants[difficulty].gridSpacingDifficulty

  const cardImages = MemoryCardConstants[difficulty].cardImages
  const matchAudioFiles = MemoryCardConstants[difficulty].matchAudioFiles
  const congratsAudio = MemoryCardConstants[difficulty].congratsAudio

  const cardSize = MemoryCardConstants[difficulty].cardSize
  const saveApiEnum = MemoryCardConstants[difficulty].saveApiEnum

  const congratulationsRedirectURI = MemoryCardConstants[difficulty].congratulationsRedirectURI
  // ================================================== //

  const handleSaveNewGame = () => {
    saveGameData({
        userID,
        gameDate: new Date(),
        failed: failedAttempts,
        difficulty: saveApiEnum,
        completed: 0,
        timeTaken: timer,
    })
  }
  
  const handleNewGame = () => { 
    setCards(CardUtils.shuffleArray(cardImages))
    setMatchedCards([])
    setFlippedCards([])
    setFailedAttempts(0)
    setTimer(0)
    setTimerActive(false)
    setInitialReveal(true)
    setAudioIndex(0) // Reset audio index

    const mouseDisableDuration = 2000
    setMouseDisabled(true)
    setTimeout(() => setMouseDisabled(false), mouseDisableDuration)

    setTimeout(() => {
      setInitialReveal(false)
      setTimerActive(true)
    }, 1500)
  }

  const handleBackButton = () => {
    setOpenModal(true) // Show the confirmation modal
  }

  const handleModalYes = () => {
    setOpenModal(false)
    localStorage.removeItem("gameCompleted") // Remove game completion flag
    navigate("/play") // Navigate to play
  }

  const handleModalNo = () => {
    setOpenModal(false) // Close the modal and resume game
  }
  
  useEffect(() => {
    handleNewGame()
    const handleFirstClick = () => {
      if (!musicStarted && audioRef.current) {
        audioRef.current.volume = bgVolume / 100
        audioRef.current.play().catch((error) => console.error("Audio play error:", error))
        setMusicStarted(true)
      }
    }
    document.addEventListener("click", handleFirstClick)

    return () => document.removeEventListener("click", handleFirstClick)
  }, [])

  useEffect(() => {
    let interval
    if (timerActive) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [timerActive])

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [card1, card2] = flippedCards
      setTimeout(() => {
        if (card1.image === card2.image) {
          setMatchedCards((prev) => [...prev, card1.id, card2.id])
          if (audioIndex < matchAudioFiles.length) {
            // Play the next audio in order
            const nextAudio = new Audio(matchAudioFiles[audioIndex])
            nextAudio.volume = sfxVolume / 100 // Set the volume for sound effects
            nextAudio.play()
            setAudioIndex(audioIndex + 1) // Move to the next audio
          }
        } else {
          setFailedAttempts((prev) => prev + 1)
        }
        setFlippedCards([])
      }, 1000)
    }
  }, [flippedCards, audioIndex, sfxVolume])

  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
        // Play the congratulations audio
        const congrats = new Audio(congratsAudio)
        congrats.volume = sfxVolume / 100
        congrats.play()

        // Stop the timer before saving the game data
        setTimerActive(false)

        // Ensure the game data is saved only once
        const saveData = async () => {
            try {
                await saveGameData({
                    userID,
                    gameDate: new Date(),
                    failed: failedAttempts,
                    difficulty: saveApiEnum,
                    completed: 1,  
                    timeTaken: timer,
                })
                
                localStorage.setItem("gameCompleted", "true")
                setTimeout(() => navigate(congratulationsRedirectURI), 1000)
            } catch (error) {
                console.error("Error saving game data:", error)
            }
        }

        saveData()
    }
  }, [matchedCards, cards.length, navigate, sfxVolume, failedAttempts, timer])

  // Validating userID
  const userID = localStorage.getItem("userID") // ✅ Fetch from local storage or auth context
  if (!userID) {
    console.error("Error: userID is missing.")
    return
  }

  // Action for dealing with the card click
  const handleCardClick = (card) => {
    if (!matchedCards.includes(card.id) && flippedCards.length < 2 && !flippedCards.some((c) => c.id === card.id)) {
      setFlippedCards((prev) => [...prev, card])
    }
  }

  return (
    <StyledGameContainer mouseDisabled={mouseDisabled}>
      <audio ref={audioRef} src={bgMusic} loop />
      <PixelButton onClick={handleBackButton} sx={{ alignSelf: "flex-end", position: "absolute", bottom: "9%", margin: 2 }}>
        Back
      </PixelButton>
      <PixelTimerBox>Timer: {timer}s</PixelTimerBox>
      <PixelBox>Learning Moments: {failedAttempts}</PixelBox>
      <Grid2 container spacing={gridSpacingDifficulty} justifyContent="center" sx={gridSxDifficulty}>
        {cards.map((card) => (
          <Grid2 key={card.id}>
            <Card
              size={cardSize}
              card={card}
              handleClick={() => handleCardClick(card)}
              flipped={initialReveal || flippedCards.some((c) => c.id === card.id) || matchedCards.includes(card.id)}
              matched={matchedCards.includes(card.id)}
            />
          </Grid2>
        ))}
      </Grid2>

      <Box sx={{ mt: 2, textAlign: "center" }}>
        <PixelButton onClick={() => { handleSaveNewGame(); handleNewGame() }} sx={{ mt: 2 }}>
          New Game
        </PixelButton>
      </Box>


      <Modal open={openModal} onClose={handleModalNo}>
        <Box sx={modalStyle}>
          <PixelTypography variant="h6">
            Are you sure you want to go back to the play page?
          </PixelTypography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
            <PixelButtonModal onClick={() => { handleSaveNewGame(); handleModalYes() }} variant="contained" color="primary">
              Yes
            </PixelButtonModal>
            <PixelButtonModal onClick={handleModalNo} variant="contained" color="secondary">
              No
            </PixelButtonModal>
          </Box>
        </Box>
      </Modal>

    </StyledGameContainer>
  )
}

export default MemoryCardGame