const express = require('express');
const analyzer = require('./spotify-analysis')
const router = express.Router();

router.get('/data', async (req, res) => {
    var accessToken = req.cookies['access_token']
    try {
        let userInfo = await analyzer.getUserInfo(accessToken)
        let data = await analyzer.getUserSongList(accessToken)
        res.send({ userInfo, data })
    } catch (err) {
        console.log('Failure in login.')
        res.clearCookie('access_token') // deletes the token if it's invalid
        res.redirect('/login')
    }

})

module.exports = router;