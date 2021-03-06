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
  const color_column = 4;
  let maxEnergy = data.map(d => d.feature[color_column]).reduce((a, b) => Math.max(a, b))
  let minEnergy = data.map(d => d.feature[color_column]).reduce((a, b) => Math.min(a, b))
  for (let i = 0; i < data.length; i++) {

    let sorted = [...data]
    sorted.sort((a, b) => math.distance(data[i].feature, a.feature) - math.distance(data[i].feature, b.feature))
    //console.log(sorted.map(v=>math.distance(v.feature, data[i].feature)),'\n',data[i].name)
    var maxFeature = math.max(data[i].feature)

    nodes.push({ id: data[i].name, group: parseInt(13*(data[i].feature[color_column] - minEnergy) / (maxEnergy - minEnergy)) })
    // console.log('Features: ', data[i].feature)
    // console.log('Group: ', data[i].feature.filter(x => (x > meanHeat)))

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

  res = await getData(access_token);
  username = res.userInfo.username;
  document.getElementById("user-info").innerHTML = username;

  data = convertRawSongData(res.data);
  graph = ForceGraph3D()
    (document.getElementById('3d-graph'))
    .graphData(data)
    .nodeLabel('id')
    .nodeAutoColorBy('group')
    .linkDirectionalParticles("value")
    .linkDirectionalParticleSpeed(d => d.value * 0.001)
    .nodeThreeObject(node => {
      const sprite = new SpriteText(node.id);
      sprite.material.depthWrite = false; // make sprite background transparent
      sprite.color = node.color;
      sprite.textHeight = 8;
      return sprite;
    });
  graph.d3Force('charge').strength(-120);
}
