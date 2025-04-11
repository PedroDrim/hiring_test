import { DifficultyEnums } from "./DifficultyEnums"

const hardValues = {
    // Card Images
    cardImages: [
        { id: 1, image: "/images/earth.png" },
        { id: 2, image: "/images/earth.png" },
        { id: 3, image: "/images/jupiter.png" },
        { id: 4, image: "/images/jupiter.png" },
        { id: 5, image: "/images/mars.png" },
        { id: 6, image: "/images/mars.png" },
        { id: 7, image: "/images/mercury.png" },
        { id: 8, image: "/images/mercury.png" },
        { id: 9, image: "/images/neptune.png" },
        { id: 10, image: "/images/neptune.png" },
        { id: 11, image: "/images/saturn.png" },
        { id: 12, image: "/images/saturn.png" },
    ],

    cardSize: 120,
    saveApiEnum: "Hard",
  
    // Audio files for matching and final congratulation
    matchAudioFiles: [
        "/audio/wonderful.mp3",
        "/audio/NiceJob.mp3",
        "/audio/Greatwork.mp3",
        "/audio/KeepItGoing.mp3",
        "/audio/Amazing.mp3",
    ],
    
    congratsAudio: "/audio/congrats.mp3", // Final congratulations audio

    gridSxDifficulty: { maxWidth: 600, marginTop: "-80px" },
    gridSpacingDifficulty: 6,

    congratulationsRedirectURI: "/congratulations-hard"
}

const mediumValues = {
    // Card Images
    cardImages: [
        { id: 1, image: "/images/meteor.png" },
        { id: 2, image: "/images/meteor.png" },
        { id: 3, image: "/images/moon.png" },
        { id: 4, image: "/images/moon.png" },
        { id: 5, image: "/images/comet.png" },
        { id: 6, image: "/images/comet.png" },
    ],

    cardSize: 160,
    saveApiEnum: "Normal",

    // Audio files for matching and final congratulation
    matchAudioFiles: [
        "/audio/wonderful.mp3",
        "/audio/NiceJob.mp3",
    ],

    congratsAudio: "/audio/congrats.mp3", // Final congratulations audio

    gridSxDifficulty: { maxWidth: 700, marginTop: "-50px" },
    gridSpacingDifficulty: 10,

    congratulationsRedirectURI: "/congratulations-medium"
}

const easyValues = {
    // Card Images
    cardImages: [
        { id: 1, image: "/images/meteor.png" },
        { id: 2, image: "/images/meteor.png" },
        { id: 3, image: "/images/comet.png" },
        { id: 4, image: "/images/comet.png" },
    ],

    cardSize: 220,
    saveApiEnum: "Easy",

    // Audio files for matching and final congratulation
    matchAudioFiles: [
        "/audio/wonderful.mp3",
    ],

    
    congratsAudio: "/audio/congrats.mp3", // Final congratulations audio

    gridSxDifficulty: { maxWidth: 700, marginTop: "-120px" },
    gridSpacingDifficulty: 8,

    congratulationsRedirectURI: "/congratulations-easy"
}

const MemoryCardConstants = {}
MemoryCardConstants[DifficultyEnums.easy] = easyValues
MemoryCardConstants[DifficultyEnums.meduim] = mediumValues
MemoryCardConstants[DifficultyEnums.hard] = hardValues

export default MemoryCardConstants