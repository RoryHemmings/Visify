const SpotifyWebApi = require('spotify-web-api-node')
const EventEmitter = require('events')
var spotifyApi = new SpotifyWebApi()


async function getUserMatrix(userAccessToken) {
    spotifyApi.setAccessToken(userAccessToken)
    
    let data = await spotifyApi.getMe()
    let playlistsData = await spotifyApi.getUserPlaylists(data.body.id)
    var vectorEmitter = new EventEmitter()

    var userTasteMatrix = []
    vectorEmitter.on('vector', (vector) => {
        console.log(vector)
        userTasteMatrix.push(vector)
    })
    await Promise.all(
        playlistsData.body.items.map(async (playlist) => {

            let playlistInfo = await spotifyApi.getPlaylist(playlist.id)

            let features = await spotifyApi.getAudioFeaturesForTracks(playlistInfo.body.tracks.items.map(track => track.track.id))
            // extract into a vector
            let featuresVector = features.body.audio_features.map(
                feature => [feature.danceability,
                feature.energy,
                feature.key,
                feature.loudness,
                feature.mode,
                feature.speechiness,
                feature.acousticness,
                feature.instrumentalness,
                feature.liveness,
                feature.valence,
                feature.tempo,
                feature.duration_ms,
                feature.time_signature]
            )
            featuresVector.forEach(vector => vectorEmitter.emit('vector', vector))
        })
    )

    return userTasteMatrix
}