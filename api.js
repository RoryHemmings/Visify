const express = require('express');
const analyzer = require('./spotify-analysis')
const router = express.Router();

router.get('/data', (req, res) => {
    let access_token = req.cookies['access_token']
    analyzer.getUserSongList(access_token)
        .then(data => res.send(data))
        .catch(err => {res.send(err); console.error(err)})
})

module.exports = router;