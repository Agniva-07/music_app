// 🎵 Select HTML Elements
const songList = document.getElementById("song-list"); 
const audioPlayer = document.getElementById("audio-player");
const playButton = document.querySelector(".play");
const nextButton = document.querySelector(".next");
const prevButton = document.querySelector(".prev");

let songs = [];
let currentSongIndex = 0;

console.log("JavaScript Loaded! ✅");

// 🎵 Fetch Songs from Backend
async function fetchSongs() {
    try {
        const response = await fetch("http://localhost:5000/songs");
        if (!response.ok) throw new Error("Songs not found.");
        songs = await response.json();
        displaySongs(songs);
    } catch (error) {
        console.error("Error fetching songs:", error);
        songList.innerHTML = "<li>No songs found.</li>";
    }
}

// 🎵 Display Songs in UI
function displaySongs(songs) {
    songList.innerHTML = "";
    songs.forEach((song, index) => {
        const songItem = document.createElement("li");
        songItem.textContent = song.name;
        songItem.classList.add("song-item");
        songItem.style.cursor = "pointer";

        songItem.addEventListener("click", () => {
            playSong(index);
        });

        songList.appendChild(songItem);
    });
}

// 🎵 Play Selected Song
function playSong(index) {
    currentSongIndex = index;
    audioPlayer.src = songs[currentSongIndex].url;
    audioPlayer.play();
    playButton.textContent = "⏸️"; // ✅ Ensure button updates
}

// 🎵 Play/Pause Button
playButton.addEventListener("click", () => {
    if (!songs.length) return;
    if (audioPlayer.paused) {
        audioPlayer.play();
        playButton.textContent = "⏸️";
    } else {
        audioPlayer.pause();
        playButton.textContent = "▶️";
    }
});

// 🎵 Next/Previous Button
nextButton.addEventListener("click", () => {
    if (songs.length === 0) return;
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(currentSongIndex);
});

prevButton.addEventListener("click", () => {
    if (songs.length === 0) return;
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(currentSongIndex);
});

// 🎵 Function to Fetch Songs by Artist
async function showSongs(artistName) {
    try {
        const response = await fetch(`http://localhost:5000/songs?artist=${encodeURIComponent(artistName)}`);
        if (!response.ok) throw new Error("Songs not found.");
        songs = await response.json();
        displaySongs(songs);
    } catch (error) {
        console.error("Error fetching songs:", error);
        songList.innerHTML = "<li>No songs found.</li>";
    }
}

// 🎵 Update Progress Bar
audioPlayer.addEventListener("timeupdate", () => {
    const progressBar = document.getElementById("progress-bar");
    const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${percentage}%`;
});

const progressContainer = document.querySelector(".progress-container");
const progressBar = document.getElementById("progress-bar");

// 🎵 **Update Progress Bar while Song Plays**
audioPlayer.addEventListener("timeupdate", () => {
    if (audioPlayer.duration) {
        const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = `${percentage}%`;
    }
});

// 🎵 **Allow Seeking in Progress Bar**
progressContainer.addEventListener("click", (e) => {
    const width = progressContainer.clientWidth;  // ✅ Progress bar ki width lo
    const clickX = e.offsetX;  // ✅ User ne kahan click kiya wo lo
    const duration = audioPlayer.duration;  // ✅ Song ka total duration lo

    if (duration) {
        audioPlayer.currentTime = (clickX / width) * duration; // ✅ Song ko new position pe seek karo
    }
});

// ✅ Fetch Songs on Page Load
fetchSongs();
