import { Box } from "@mui/material";
import { styled } from "@mui/system";
import background from "../assets/images/celebration.gif"; // Background image

// Pixel Box Style
export const PixelBox = styled(Box)(({ theme }) => ({
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    fontFamily: '"Press Start 2P", cursive',
    position: "relative",
}))
  
// Image Container Style
export const ImageContainer = styled(Box)(() => ({
    position: "relative", 
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
    top: "-10%",
}))
  
// Button Container Style
export const ButtonContainer = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: "80%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
}))
  
// Pixel Button Style
export const PixelButton = styled(Box)(({ theme }) => ({
    display: "inline-block",
    backgroundColor: "#2c2c54",
    color: "#fff",
    fontFamily: '"Press Start 2P", cursive',
    fontSize: "18px",
    padding: "20px 50px",
    border: "3px solid #00d9ff",
    borderRadius: "12px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
    cursor: "pointer",
    textAlign: "center",
    transition: "transform 0.3s, background-color 0.3s, box-shadow 0.3s",
    "&:hover": {
      backgroundColor: "#40407a",
      borderColor: "#00aaff",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)",
    },
    "&:active": {
      transform: "scale(0.95)",
    },
}))  