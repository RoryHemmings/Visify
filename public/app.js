let access_token = '';
let data = { };

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

async function setup() {
  access_token = '';
  const cookies = parseCookie();
  access_token = cookies.get('access_token');
  if (!access_token) {
    // Redirect to login if not logged in
    window.location.href = '/login';
  }

  createCanvas(getWidth(), getHeight());
  data = await getData(access_token);
  console.log(data);
}

function draw() {
  background(51);
}
