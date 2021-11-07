const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/home.html'); // Used to load the site
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));