const express = require('express');
const analyzer = require('./spotify-analysis')
const router = express.Router();

router.get('/data', (req, res) => {
    var accessToken = req.cookies['access_token']
    console.log(`accessToken: ${accessToken}`)
    analyzer.getUserData(accessToken).then(data => {
        res.send(data)
    }).catch(err => {
        console.log(err)
        res.redirect('/login.html')
    })
})


module.exports = router;