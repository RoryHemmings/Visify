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
  nodes = []
  links = []
  meanHeat = 0
  meanHeat = data.map(d => data.map(
    (v) => 1 / (math.distance(v.feature, d.feature) + 1))
    .reduce((a, b) => a + b))
    .reduce((a, b) => a + b) / (data.length * data.length)
  console.log('meanHeat: ', meanHeat)
  for (let i = 0; i < data.length; i++) {

    let sorted = [...data]
    sorted.sort((a, b) => math.distance(data[i].feature, a.feature) - math.distance(data[i].feature, b.feature))
    //console.log(sorted.map(v=>math.distance(v.feature, data[i].feature)),'\n',data[i].name)

    nodes.push({ id: data[i].name, group: data[i].feature.filter(x => (x > meanHeat)).length})
    console.log('Features: ', data[i].feature)
    console.log('Group: ', data[i].feature.filter(x => (x > meanHeat)))

    for (let j = 1; j < 5; j++) {
      links.push({ source: data[i].name, target: sorted[j].name })
    }
  }
  return { nodes, links }

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
console.log("test");

  res = await getData(access_token);
  username = res.userInfo.username;

  data = convertRawSongData(res.data);
  graph = ForceGraph3D()
    (document.getElementById('3d-graph'))
    .graphData(data)
    .nodeLabel('id')
    .nodeAutoColorBy('group')
    .linkDirectionalParticles("value")
    .linkDirectionalParticleSpeed(d => d.value * 0.001);
}
