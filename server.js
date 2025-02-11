const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Allowed users with password "Momo"
const AUTH_USERS = {
    "Damien": "Momo",
    "Clement": "Momo"
};

// Authentication Middleware
app.use((req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Mushroom Map"');
        return res.status(401).send('Authentication required');
    }

    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const [username, password] = credentials;

    if (AUTH_USERS[username] && AUTH_USERS[username] === password) {
        return next(); // User authenticated
    }

    res.setHeader('WWW-Authenticate', 'Basic realm="Mushroom Map"');
    return res.status(401).send('Unauthorized');
});

// Serve static files from the "cmc" folder
app.use(express.static(path.join(__dirname, 'cmc')));

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'cmc', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
