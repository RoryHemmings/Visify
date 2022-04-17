const SpotifyWebApi = require('spotify-web-api-node')
const EventEmitter = require('events')
const math = require('mathjs')
const util = require('util')
const { column, sort, re } = require('mathjs')

async function _getUserInfo(userAccessToken) {
    var spotifyApi = new SpotifyWebApi()
    spotifyApi.setAccessToken(userAccessToken)
    //console.log('getting user data')
    let data = await spotifyApi.getMe()
    //console.log(`${data.body.display_name}'s id is ${data.body.id}`)
    return data.body
}

async function getUserData(userAccessToken) {
    let userInfo = await getUserInfo(userAccessToken)
    let data = await getUserSongList(userAccessToken)
    return { userInfo, data }
}

/**
 * 
 * @param {string} userAccessToken the access token of the user from spotify
 * @returns {avatar_url: string, username: string} the user's avatar and username
 */
async function getUserInfo(userAccessToken) {
    let data = await _getUserInfo(userAccessToken)
    return {
        avatar_url: (data.images.length < 1) ? null : data.images[0].url,
        username: data.display_name,
    }
}

async function _getUserTracks(userAccessToken) {
    var spotifyApi = new SpotifyWebApi()
    spotifyApi.setAccessToken(userAccessToken)
    let playlistsData = await spotifyApi.getUserPlaylists(
        (await _getUserInfo(userAccessToken)).id
    )
    // console.log(playlistsData.body)
    var trackEmitter = new EventEmitter()

    var tracks = []
    trackEmitter.on('track', (vector) => {
        tracks.push(vector)
    })
    await Promise.all(
        playlistsData.body.items.map(async (playlist) => {
            let playlistInfo = await spotifyApi.getPlaylist(playlist.id)
            playlistInfo.body.tracks.items.forEach(track => trackEmitter.emit('track', track))
        })
    )
    return tracks
}

function _normalize(vector) {
    // normalizes vector with mean and standard deviation
    var mean = math.mean(vector)
    var std = math.std(vector)
    return vector.map(x => (x - mean) / std)
}

/**
 * 
 * @param {string} userAccessToken  the access token of the user from spotify
 * @returns {Array[Object{name: string, id: string, feature: Array[float]}]} an array of all of the user's tracks, each track is an object with the track's name, id, and feature vector
 */
async function getUserSongList(userAccessToken) {
    // get user tracks[id, name, featrues {danceability, energy, key, loudness, mode, speechiness, acousticness, instrumentalness, liveness, valence, tempo, duration_ms, time_signature}]
    let spotifyApi = new SpotifyWebApi()
    spotifyApi.setAccessToken(userAccessToken)
    let tracks = await _getUserTracks(userAccessToken)

    var addedTracks = []
    var iter = 0
    let trackLength = tracks.length
    do { 
        addedTracks.forEach(t => tracks.push(t))
        addedTracks = []
        let data = await spotifyApi.getMySavedTracks({ limit: 50, offset: iter*50})
        data.body.items.forEach(t => addedTracks.push(t))
        iter++
    }while(addedTracks.length > 0)

    console.log(`${tracks.length-trackLength} liked tracks added.`)

    var idNameMap = {}
    tracks.forEach(track => idNameMap[track.track.id] = track.track.name)
    var userSongList = []
    var vis = new Set()
    for (let i = 0; i < tracks.length; i += 48) {
        let trackIds = tracks.slice(i, i + 48).map(track => track.track.id)
        let features = await spotifyApi.getAudioFeaturesForTracks([trackIds])
        features.body.audio_features.forEach(
            feature => {
                if(vis.has(feature.id)) return
                vis.add(feature.id) 

                userSongList.push({
                    name: idNameMap[feature.id],
                    id: feature.id,
                    feature: _normalize([
                        feature.danceability,
                        feature.energy,
                        feature.key,
                        feature.loudness,
                        feature.mode,
                        feature.speechiness,
                        feature.acousticness,
                        feature.instrumentalness,
                        feature.liveness,
                        feature.valence,
                        feature.tempo/100,
                        // (feature.duration_ms / 1000.0) / 60.0, // convert to minutes
                        // feature.time_signature
                    ])
                })
            }
        )
    }
    return userSongList
}

/**
 * 
 * @param {string} userAccessToken  the access token of the user from spotify
 * @returns {Array[Array[string]]} an 2d array of the user's playlist data, each playlist is an array of song features
 */
async function getUserMatrix(userAccessToken) {
    let userSongList = await getUserSongList(userAccessToken)
    let userSongListMatrix = []
    userSongList.forEach(song => userSongListMatrix.push(song.feature))
    return userSongListMatrix
}

/**
 * 
 * @param {string} userAccessToken  the access token of the user from spotify
 * @returns {nodes:[id:string],links:[source:string, target:string, value: float]} nodes and links for the user's playlist graph
 */
async function getUserNodeLinkData(accessToken) {
    let userSongList = await getUserSongList(accessToken)
    nodes = []
    links = []
    for (let i = 0; i < userSongList.length; i++) {
        nodes.push({ id: userSongList[i].name, group: 1 })
        let sorted = [...userSongList]
        sorted.sort((a, b) => math.distance(userSongList[i].feature, a.feature) - math.distance(userSongList[i].feature, b.feature))
        //console.log(sorted.map(v=>math.distance(v.feature, userSongList[i].feature)),'\n',userSongList[i].name)

        links.push({ source: userSongList[i].name, target: sorted[1].name, value: 1 / math.distance(userSongList[i].feature, sorted[1].feature) })
        links.push({ source: userSongList[i].name, target: sorted[2].name, value: 1 / math.distance(userSongList[i].feature, sorted[2].feature) })
    }
    return { nodes, links }
}

// ; (async () => {
//     let accessToken = 'BQA1UH_hutOZT08eKnAsNOBDpCWCd4lZckRHJ7MWeBBS8tknkUoLeKwh8qWw8xm9Im7WLt5pBTxgkS4BTrMaA9-2MmEJuU4JY7__XKD8neVS-4OjZ0PBNI-P_bvHnfx6msqsl45scIMJWS3_UR0Dkf10Cp_bsxHzKpJb-w3SFSCfcdTvIfBB'
//     let songs = await getUserSongList(accessToken)
// })()

exports.getUserMatrix = getUserMatrix
exports.getUserSongList = getUserSongList
exports.getUserNodeLinkData = getUserNodeLinkData
exports.getUserInfo = getUserInfo
exports.getUserData = getUserData
