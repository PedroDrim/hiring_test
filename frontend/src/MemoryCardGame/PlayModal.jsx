import React, { useState } from "react"
import Modal from "react-modal"
import { X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import "./Play.css"

const modalPlayStyles = {
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
        height: "200px",
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

const difficulties = [
    { key: "green", label: "Easy" },
    { key: "yellow", label: "Normal" },
    { key: "red", label: "Hard" },
]

const PlayModal = ({
    isOpen,
    onRequestClose,
    isCalmMode,
    playClickSound,
    playHoverSound,
}) => {
    const navigate = useNavigate()
    const [difficulty, setDifficulty] = useState(null)

    const handlePlay = () => {
        playClickSound()
        const userID = localStorage.getItem("userID")
        if (!userID) {
            navigate("/login")
        }

        if (difficulty === null) {
            onRequestClose()
        }

        localStorage.setItem("gameStarted", "true")
        const routes = {
            green: isCalmMode ? "/calm-easy" : "/easy",
            yellow: isCalmMode ? "/calm-medium" : "/medium",
            red: isCalmMode ? "/calm-hard" : "/hard",
        }
        navigate(routes[difficulty])
    }

    const getLabel = () => {
        return difficulty !== null? "Accept" : "Cancel"
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={{
                ...modalPlayStyles,
                content: {
                    ...modalPlayStyles.content,
                    backgroundColor: isCalmMode ? "#86a17d" : "#1e1e2e",
                    color: isCalmMode ? "#ffffff" : "#fff",
                },
            }}
        >
            <button
                onClick={onRequestClose}
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#fff",
                }}>
                <X size={24} />
            </button>

            <h2 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h2`}>
                Select Difficulty
            </h2>

            <div className="difficulty-selection">
                {difficulties.map(({key, label}) => (
                    <button
                        key={key}
                        onClick={() => {setDifficulty(key); playClickSound()}}
                        onMouseEnter={playHoverSound}
                        className={`difficulty-button ${key} ${difficulty === label ? (isCalmMode ? "calm-selected" : "selected") : ""}`}>
                        {label}
                    </button>
                ))}
            </div>

            <button onClick={handlePlay} className="play-button" onMouseEnter={playHoverSound}>
                {getLabel()}
            </button>
        </Modal>
    )
}

export default PlayModal