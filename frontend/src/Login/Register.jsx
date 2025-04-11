import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import backgroundMusic from "../assets/audio/background-music.mp3"
import buttonHoverSound from "../assets/audio/button-hover.mp3"
import buttonClickSound from "../assets/audio/button-click.mp3"
import backgroundGif from "../assets/images/play.gif"
import calmBackground from "../assets/images/calm-wallpaper.jpg"
import styles from './Login.module.css'
import { PixelButton, PixelInput } from '../Utils/CongratulationStyles'
import { PixelTypography } from '../Utils/CardStyles'

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [message, setMessage] = useState('')
  const [bgVolume, setBgVolume] = useState(
    localStorage.getItem("bgVolume") !== null ? parseInt(localStorage.getItem("bgVolume"), 10) : 50
  )
  const [sfxVolume, setSfxVolume] = useState(
    localStorage.getItem("sfxVolume") !== null ? parseInt(localStorage.getItem("sfxVolume"), 10) : 50
  )
  const [isCalmMode, setIsCalmMode] = useState(false)

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
      bgAudio.play().catch((error) => console.error("Autoplay failed:", error))
    }

    document.addEventListener("click", startMusic, { once: true })

    return () => {
      document.removeEventListener("click", startMusic)
      bgAudio.pause()
      bgAudio.currentTime = 0
    }
  }, [])

  useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = bgVolume / 100
    }
    localStorage.setItem("bgVolume", bgVolume)
  }, [bgVolume])

  useEffect(() => {
    hoverAudioRef.current.volume = sfxVolume / 100
    clickAudioRef.current.volume = sfxVolume / 100
    localStorage.setItem("sfxVolume", sfxVolume)
  }, [sfxVolume])

  const handleBgVolumeChange = (event) => {
    const newVolume = parseInt(event.target.value, 10)
    setBgVolume(newVolume)
    setMutedBg(newVolume === 0)
  }

  const handleSfxVolumeChange = (event) => {
    const newVolume = parseInt(event.target.value, 10)
    setSfxVolume(newVolume)
    setMutedSfx(newVolume === 0)
  }

  const toggleCalmMode = () => {
    setIsCalmMode((prev) => !prev)
    playClickSound()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', formData)
      setMessage(response.data.message)
    } catch (error) {
      setMessage(error.response?.data.message || 'Error registering')
    }
  }

  return (
    <div className="background-container"
      style={{
        backgroundImage: `url(${isCalmMode ? calmBackground : backgroundGif})`,
      }}>

      <div className={styles.container}>
        <form>
          <PixelTypography variant="h3" style={{ justifySelf: "center" }}>
            Account Register
          </PixelTypography>

          <PixelInput
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })} />

          <PixelInput
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

          <div style={{ display: 'flex', justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
            <PixelButton onClick={handleSubmit} sx={{ margin: 2 }}>
              Register
            </PixelButton>
          </div>

          <div style={{ justifySelf: 'center' }}>
            {message && <PixelTypography variant="h6" style={{ textAlign: "center", fontSize: "15px" }}>{message}</PixelTypography>}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register