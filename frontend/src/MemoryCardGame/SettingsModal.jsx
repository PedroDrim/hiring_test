import React, { useState, useEffect } from "react"
import Modal from "react-modal"
import { X } from "lucide-react"

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  content: {
    backgroundColor: "#1e1e2e",
    border: "2px solid #4a4e69",
    borderRadius: "20px",
    padding: "40px",
    maxWidth: "600px",
    height: "300px",
    width: "90%",
    color: "#fff",
    textAlign: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    overflow: "hidden",
  },
}

const SettingsModal = ({
  isOpen,
  onRequestClose,
  isCalmMode,
  playClickSound,
  onBgVolumeChange,
  onSfxVolumeChange,
}) => {
  const [bgVolume, setBgVolume] = useState(localStorage.getItem("bgVolume") !== null? parseInt(localStorage.getItem("bgVolume"), 10): 50)
  const [sfxVolume, setSfxVolume] = useState(localStorage.getItem("sfxVolume") !== null? parseInt(localStorage.getItem("sfxVolume"), 10): 50)

  const [mutedBg, setMutedBg] = useState(bgVolume === 0)
  const [mutedSfx, setMutedSfx] = useState(sfxVolume === 0)

  // Efeito para sincronizar com o pai quando abrir o modal
  useEffect(() => {
    onBgVolumeChange?.(bgVolume)
    onSfxVolumeChange?.(sfxVolume)
  }, [bgVolume, sfxVolume])

  const handleBgVolumeChange = (event) => {
    const newVolume = parseInt(event.target.value, 10)
    setBgVolume(newVolume)
    setMutedBg(newVolume === 0)
    localStorage.setItem("bgVolume", newVolume)
    onBgVolumeChange?.(newVolume)
  }

  const handleSfxVolumeChange = (event) => {
    const newVolume = parseInt(event.target.value, 10)
    setSfxVolume(newVolume)
    setMutedSfx(newVolume === 0)
    localStorage.setItem("sfxVolume", newVolume)
    onSfxVolumeChange?.(newVolume)
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        onRequestClose()
        playClickSound()
      }}
      style={{
        ...modalStyles,
        content: {
          ...modalStyles.content,
          backgroundColor: isCalmMode ? "#86a17d" : "#1e1e2e",
          color: isCalmMode ? "#ffffff" : "#fff",
        },
      }}
    >
      <button
        onClick={() => {
          onRequestClose()
          playClickSound()
        }}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#fff",
        }}
      >
        <X size={24} />
      </button>

      <h2 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h2`}>
        Background Music
      </h2>
      <div className="volume-control">
        <span className="volume-icon">{mutedBg ? "🔇" : "🔊"}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={bgVolume}
          onChange={handleBgVolumeChange}
          className="volume-slider"
        />
      </div>

      <h2 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h2`}>
        Sound Effects
      </h2>
      <div className="volume-control">
        <span className="volume-icon">{mutedSfx ? "🔇" : "🔊"}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={sfxVolume}
          onChange={handleSfxVolumeChange}
          className="volume-slider"
        />
      </div>
    </Modal>
  )
}

export default SettingsModal
