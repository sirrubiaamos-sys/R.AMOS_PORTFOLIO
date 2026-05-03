const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3000;
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname)));

// Root route
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'portfolio.html')));

app.listen(PORT, () => console.log(`Portfolio server listening on http://localhost:${PORT}`));

