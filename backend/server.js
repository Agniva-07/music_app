const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors({
    origin: "http://127.0.0.1:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

const musicFolder = path.join(__dirname, "music");
app.use("/music", express.static(musicFolder)); // ✅ Serve static files

// 🎵 ✅ API to get all songs (with artist detection)
app.get("/songs", (req, res) => {
    const artist = req.query.artist; // ✅ Artist query parameter
    
    fs.readdir(musicFolder, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error("Error reading music directory:", err);
            return res.status(500).json({ error: "Unable to read music directory" });
        }

        let allSongs = [];

        files.forEach(folder => {
            if (folder.isDirectory()) {
                const artistName = folder.name;
                const artistPath = path.join(musicFolder, artistName);
                const songFiles = fs.readdirSync(artistPath);

                songFiles.forEach(file => {
                    if (file.endsWith(".mp3")) {
                        allSongs.push({
                            name: file.replace(/.mp3$/, ""),
                            artist: artistName,
                            url: `http://localhost:${PORT}/music/${artistName}/${file}`
                        });
                    }
                });
            }
        });

        if (artist) {
            const filteredSongs = allSongs.filter(song => song.artist.toLowerCase() === artist.toLowerCase());
            res.json(filteredSongs);
        } else {
            res.json(allSongs);
        }
    });
});

// 🎤 ✅ API to get all artists
app.get("/artists", (req, res) => {
    fs.readdir(musicFolder, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error("Error reading music directory:", err);
            return res.status(500).json({ error: "Unable to read music directory" });
        }
        const artists = files.filter(folder => folder.isDirectory()).map(folder => folder.name);
        res.json(artists);
    });
});

// 🎤 ✅ API to get songs by artist
app.get('/songs/:artist', (req, res) => {
    const artistName = decodeURIComponent(req.params.artist);
    const artistFolder = path.join(__dirname, 'music', artistName);

    if (!fs.existsSync(artistFolder)) {
        return res.status(404).json({ error: "Artist folder not found" });
    }

    fs.readdir(artistFolder, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Error reading directory" });
        }

        // Yeh line fix kar: bas filenames bhej
        const mp3Files = files.filter(file => file.endsWith('.mp3'));

        res.json(mp3Files);
    });
});

// 🎶 ✅ Serve a specific song (Direct Play)
app.get("/play/:filename", (req, res) => {
    const requestedFile = req.params.filename;
    let foundFile = null;

    fs.readdirSync(musicFolder, { withFileTypes: true }).forEach(folder => {
        if (folder.isDirectory()) {
            const artistPath = path.join(musicFolder, folder.name);
            const songPath = path.join(artistPath, requestedFile);

            if (fs.existsSync(songPath)) {
                foundFile = songPath;
            }
        }
    });

    if (foundFile) {
        res.sendFile(foundFile);
    } else {
        res.status(404).json({ error: "Song not found" });
    }
});

// 🚀 Start the server
app.listen(PORT, () => {
    console.log(`🎵 Server running on http://localhost:${PORT}`);
});
