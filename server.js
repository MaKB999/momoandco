const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080;

// Serve static files from "cmc" and its subdirectories
app.use(express.static(path.join(__dirname, 'cmc')));
app.use('/data', express.static(path.join(__dirname, 'cmc', 'data'))); // ✅ Serve JSON files

// Serve index.html when visiting "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'cmc', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
