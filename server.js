import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Path to data file
const DATA_DIR = path.join(__dirname, 'public', 'data');
const PLACEMENTS_FILE = path.join(DATA_DIR, 'placements.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure placements file exists
if (!fs.existsSync(PLACEMENTS_FILE)) {
    fs.writeFileSync(PLACEMENTS_FILE, JSON.stringify({}), 'utf8');
}

// GET Placements
app.get('/api/placements', (req, res) => {
    try {
        if (fs.existsSync(PLACEMENTS_FILE)) {
            const data = fs.readFileSync(PLACEMENTS_FILE, 'utf8');
            res.json(JSON.parse(data));
        } else {
            res.json({});
        }
    } catch (err) {
        console.error("Error reading placements:", err);
        res.status(500).json({ error: "Failed to read placements" });
    }
});

// POST Placements
app.post('/api/placements', (req, res) => {
    try {
        const newPlacements = req.body;
        fs.writeFileSync(PLACEMENTS_FILE, JSON.stringify(newPlacements, null, 2), 'utf8');
        console.log("Saved placements to file.");
        res.status(200).json({ success: true });
    } catch (err) {
        console.error("Error saving placements:", err);
        res.status(500).json({ error: "Failed to save placements" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Serve static files from the React app (dist)
// This handles the frontend assets when running in production
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));

    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
}
