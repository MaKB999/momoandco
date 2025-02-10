const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080;

// Serve static files from the "cmc/data" folder
app.use('/cmc/data', express.static(path.join(__dirname, 'cmc/data')));

// Serve static files from "cmc" folder (if needed)
app.use('/cmc', express.static(path.join(__dirname, 'cmc')));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
