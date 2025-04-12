import React from "react"
import Modal from "react-modal"
import { PixelTypography } from '../Utils/CardStyles'
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

const InstructionsModal = ({
  isOpen,
  onRequestClose,
  isCalmMode,
  playClickSound
}) => {

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
        onClick={() => {onRequestClose(); playClickSound()}}
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

      <div>
        <h2 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h2`}>
          Game Instructions
        </h2>

        <PixelTypography style={{fontSize: "15px"}}>
          Click on the cards to flip them.
          <br></br>
          Match all the pairs to win.
        </PixelTypography>
      </div>
    </Modal>
  )
}

export default InstructionsModal
