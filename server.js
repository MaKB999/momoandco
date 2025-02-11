const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080;

// ✅ Serve static files from the "cmc" folder
app.use(express.static(path.join(__dirname, 'cmc')));

// ✅ Route to serve index.html when visiting "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'cmc', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
