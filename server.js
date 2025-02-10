const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080; // Use Render's dynamic port

app.use(express.static(path.join(__dirname, 'cmc')));

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'cmc', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server successfully running on port ${PORT}`);
});
