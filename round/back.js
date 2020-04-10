var W, H, V, cvs, ctx, handle, balls = [];
var epsilon = 1e-9, ballsAmount = 3000;

function f(x, y, z) {
  return x*x + y*y + z*z - 1;
}

function grad(x, y, z) {
  var ff = f(x, y, z);
  var dx = (f(x+epsilon, y, z) - ff)/epsilon;
  var dy = (f(x, y+epsilon, z) - ff)/epsilon;
  var dz = (f(x, y, z+epsilon) - ff)/epsilon;
  return {x:dx, y:dy, z:dz};
}

function init() {
  balls = [];
  for(var i = 0; i < ballsAmount; i++) {
    var x = 2*Math.random() - 1;
    var y = 2*Math.random() - 1;
    var z = 2*Math.random() - 1;
    balls.push({x:x, y:y, z:z});
  }
}

function update(dt) {
  balls.map(function(ball) {
    var ff = f(ball.x, ball.y, ball.z);
    if(Math.abs(ff) <= epsilon)
      return;
    
    var g = grad(ball.x, ball.y, ball.z);
    if(Math.abs(ff) > 1)
      ff /= Math.abs(ff);
    
    ball.x -= g.x*dt*ff;
    ball.y -= g.y*dt*ff;
    ball.z -= g.z*dt*ff;
  });
}

function draw() {
  var a = Date.now()/3e3; // 1st angle of view
  var b = Math.PI/6; // 2nd angle of view
  var x, y;
  
  ctx.fillRect(0, 0, W, H);
  balls.map(function(ball) {
    // projecting ball's coordinates
    x = ball.x*Math.cos(a) - ball.y*Math.sin(a);
    y = ball.x*Math.sin(a) + ball.y*Math.cos(a);
    y = ball.z*Math.cos(b) + y*Math.sin(b);
    
    // fitting in viewport
    x = W/2 + V/3*x;
    y = H/2 - V/3*y;
    
    // drawing point
    ctx.strokeRect(x, y, 1, 1);
  });
}

function animate() {
  update(1/60);
  draw();
  handle = requestAnimationFrame(animate);
}

function restart() {
  cancelAnimationFrame(handle);
  init();
  animate();
}

onload = function() {
  cvs = document.querySelector('canvas');
  W = cvs.width = innerWidth;
  H = cvs.height = innerHeight;
  V = Math.min(W, H);
  ctx = cvs.getContext('2d');
  ctx.fillStyle = 'rgba(0, 0, 0, .15)';
  ctx.strokeStyle = 'rgba(255,0,0,.6)';
  
  init();
  animate();
}// JavaScript Document