let access_token = '';
let data = {};
let graph;

function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}

/**
 * Convert raw song data returned from our server into
 * data that is readable by the graph display framework
 * 
 * @param {raw song data} data 
 */
function convertRawSongData(data) {

}

function getHashParams() {
  let hashParams = {};
  let e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

function parseCookie() {
  let raw = document.cookie;
  let parsed = raw.split(';');

  let cookies = new Map();
  parsed.forEach(cookie => {
    kv = cookie.split('=');
    cookies.set(kv[0], kv[1]);
  });

  return cookies;
}

async function getData(tokens) {
  res = await fetch('/api/data');
  return await res.json();
}

async function onload() {
  access_token = '';
  const cookies = parseCookie();
  access_token = cookies.get('access_token');
  if (!cookies.has('access_token') || !access_token) {
    // Redirect to login if not logged in
    window.location.href = '/login.html';
  }

  res = await getData(access_token);
  username = res.user_info.username;
  console.log(username);
}

fetch('/datasets/dat2.json').then(res=>res.json()).then(data => {
  graph = ForceGraph3D()
  (document.getElementById('3d-graph'))
  .graphData(data)
  .nodeLabel('id')
  .nodeAutoColorBy('group')
  .linkDirectionalParticles("value")
  .linkDirectionalParticleSpeed(d => d.value * 0.001);
})