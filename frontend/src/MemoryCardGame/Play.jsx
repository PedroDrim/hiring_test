import React, { useState, useRef, useEffect } from "react"
import backgroundGif from "../assets/images/play.gif"
import calmBackground from "../assets/images/calm-wallpaper.jpg"
import backgroundMusic from "../assets/audio/background-music.mp3"
import buttonHoverSound from "../assets/audio/button-hover.mp3"
import buttonClickSound from "../assets/audio/button-click.mp3"
import SettingsModal from "./SettingsModal"
import InstructionsModal from "./InstructionsModal"
import PlayModal from "./PlayModal"
import "./Play.css"

const Play = () => {
  const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false)
  const [instructionsModalIsOpen, setInstructionsModalIsOpen] = useState(false)
  const [playModalIsOpen, setPlayModalIsOpen] = useState(false)
  const [isCalmMode, setIsCalmMode] = useState(false)

  const [bgVolume, setBgVolume] = useState(() => {
    const saved = localStorage.getItem("bgVolume")
    return saved !== null ? parseInt(saved, 10) : 50
  })

  const [sfxVolume, setSfxVolume] = useState(() => {
    const saved = localStorage.getItem("sfxVolume")
    return saved !== null ? parseInt(saved, 10) : 50
  })

  const bgAudioRef = useRef(null)
  const hoverAudioRef = useRef(null)
  const clickAudioRef = useRef(null)

  useEffect(() => {
    bgAudioRef.current = new Audio(backgroundMusic)
    hoverAudioRef.current = new Audio(buttonHoverSound)
    clickAudioRef.current = new Audio(buttonClickSound)

    const bgAudio = bgAudioRef.current
    bgAudio.loop = true
    bgAudio.volume = bgVolume / 100

    const startMusic = () => {
      bgAudio.play().catch((err) => console.error("Autoplay error:", err))
    }

    document.addEventListener("click", startMusic, { once: true })

    return () => {
      document.removeEventListener("click", startMusic)
      bgAudio.pause()
      bgAudio.currentTime = 0
    }
  }, [])

  useEffect(() => {
    if (bgAudioRef.current) bgAudioRef.current.volume = bgVolume / 100
  }, [bgVolume])

  useEffect(() => {
    if (hoverAudioRef.current) hoverAudioRef.current.volume = sfxVolume / 100
    if (clickAudioRef.current) clickAudioRef.current.volume = sfxVolume / 100
  }, [sfxVolume])

  const playHoverSound = () => {
    if (hoverAudioRef.current) {
      hoverAudioRef.current.currentTime = 0
      hoverAudioRef.current.play().catch(() => { })
    }
  }

  const playClickSound = () => {
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0
      clickAudioRef.current.play().catch(() => { })
    }
  }

  const handleBgVolumeChange = (volume) => {
    setBgVolume(volume)
    localStorage.setItem("bgVolume", volume)
    if (bgAudioRef.current) bgAudioRef.current.volume = volume / 100
  }

  const handleSfxVolumeChange = (volume) => {
    setSfxVolume(volume)
    localStorage.setItem("sfxVolume", volume)
    if (clickAudioRef.current) clickAudioRef.current.volume = volume / 100
    if (hoverAudioRef.current) hoverAudioRef.current.volume = volume / 100
  }

  return (
    <div className="background-container" style={{
      backgroundImage: `url(${isCalmMode ? calmBackground : backgroundGif})`,
    }}>
      <h1 className={`game-title ${isCalmMode ? "calm-title" : ""}`}>WonderCards</h1>

      <div className="button-container">
        <button className={`game-button ${isCalmMode ? "calm-button" : ""}`} onClick={() => { setPlayModalIsOpen(true); playClickSound() }} onMouseEnter={playHoverSound}>Play</button>
        <button className={`game-button ${isCalmMode ? "calm-button" : ""}`} onClick={() => { setInstructionsModalIsOpen(true); playClickSound() }} onMouseEnter={playHoverSound}>Instructions</button>
        <button className={`game-button ${isCalmMode ? "calm-button" : ""}`} onClick={() => { setSettingsModalIsOpen(true); playClickSound() }} onMouseEnter={playHoverSound}>Settings</button>
      </div>

      <SettingsModal
        isOpen={settingsModalIsOpen}
        onRequestClose={() => setSettingsModalIsOpen(false)}
        isCalmMode={isCalmMode}
        playClickSound={playClickSound}
        onBgVolumeChange={handleBgVolumeChange}
        onSfxVolumeChange={handleSfxVolumeChange}
        initialBgVolume={bgVolume}
        initialSfxVolume={sfxVolume} />

      <InstructionsModal
        isOpen={instructionsModalIsOpen}
        onRequestClose={() => setInstructionsModalIsOpen(false)}
        isCalmMode={isCalmMode}
        playClickSound={playClickSound} />

      <PlayModal
        isOpen={playModalIsOpen}
        onRequestClose={() => setPlayModalIsOpen(false)}
        isCalmMode={isCalmMode}
        playClickSound={playClickSound}
        playHoverSound={playHoverSound} />
    </div>
  )
}

export default Play
