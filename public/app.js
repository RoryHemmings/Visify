import ForceGraph3D from '3d-force-graph';
const debug = true;

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
let x = 25;
function setup() {
  //frameRate(10);
  console.log(getWidth());
  createCanvas(getWidth(),getHeight());
}

function draw() {
  background(51);
  fill(153, 204, 204);
  circle(30, 30, 20);
  circle(60, 60, 20);
  line(30, 30, 60, 60);

  strokeWeight(5);
  stroke('purple');
point(84, 91);
point(68, 19);
point(21, 17);
point(32, 91);
strokeWeight(1);
stroke('black');
  noFill();
beginShape();
curveVertex(84, 91);
curveVertex(84, 91);
curveVertex(68, 19);
curveVertex(21, 17);
curveVertex(32, 91);
curveVertex(32, 91);
endShape();

fill(153, 204, 204);
stroke('blue');
circle(x, 100, 30);
x = x + 1;

noFill();

point(100, 150);
point(150, 150);
point(125, 150);
point(125, 250);
point(100, 250);
point(150, 250);
beginShape();
curveVertex(100, 150);
curveVertex(100, 150);
curveVertex(150, 150);
curveVertex(150, 150);
curveVertex(125, 150);
curveVertex(125, 150);
curveVertex(125, 250);
curveVertex(125, 250);
curveVertex(100, 250);
curveVertex(100, 250);
curveVertex(150, 250);
curveVertex(150, 250);
endShape();

//get source and target vals
//curveVertex
}

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
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

async function setFields(tokens) {
  // data = await fetch('/api/data');

  let data = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: "Bearer " + tokens.access_token,
    }
  });

  data = await data.json();
  console.log(data);

  // document.getElementById('user-profile').innerHTML = `Song Data for ${data.display_name}`;
 }

function onLoad() {
  let tokens = {
    access_token: '',
    refresh_token: '',
  };

  const params = getHashParams();
  tokens.access_token = params.access_token;
  tokens.refresh_token = params.refresh_token;

  if (params.error)
  {
    document.getElementById('error-text') = `Login Error ${params.error}`;
    document.getElementById('main').style.display = "none";
    return;
  }

  document.getElementById('error-text').style.display = "none";
  document.getElementById('main').style.display = "block";

  // Redirect to login if not logged in
  if (!debug && (!tokens.access_token || !tokens.refresh_token))
    window.location.href = '/login';
  
  setFields(tokens);
}

async function obtainNewToken() {
  const data = {
    refresh_token: refresh_token,
  };

  return await fetch('/refresh_token', {
    body: JSON.stringify(data)
  });
}

onLoad();

/*document.getElementById("obtain-new-token").addEventListener(*/
    /*"click",*/
    /*obtainNewToken,*/
    /*false*/
  /*);*/


