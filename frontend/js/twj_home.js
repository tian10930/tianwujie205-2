// 姓名：田武杰 | 学号：24002120205
// 时间：2026-11-20 | 大模型：GLM-5.3-Flash
// 首页 canvas 粒子连线背景动画

(function () {
  var twjCanvas = document.getElementById('twj_canvas');
  var twjCtx = twjCanvas.getContext('2d');
  var twjParticles = [];
  var twjCount = 70;
  var twjLinkDist = 140;

  function twjResize() {
    twjCanvas.width = window.innerWidth;
    twjCanvas.height = window.innerHeight;
  }

  function twjCreate() {
    twjParticles = [];
    for (var i = 0; i < twjCount; i++) {
      twjParticles.push({
        x: Math.random() * twjCanvas.width,
        y: Math.random() * twjCanvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        r: Math.random() * 2 + 1
      });
    }
  }

  function twjStep() {
    twjCtx.clearRect(0, 0, twjCanvas.width, twjCanvas.height);
    var i, j, p, q, dx, dy, dist;
    for (i = 0; i < twjParticles.length; i++) {
      p = twjParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > twjCanvas.width) { p.vx = -p.vx; }
      if (p.y < 0 || p.y > twjCanvas.height) { p.vy = -p.vy; }
      twjCtx.beginPath();
      twjCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      twjCtx.fillStyle = 'rgba(127, 179, 255, 0.8)';
      twjCtx.fill();
      for (j = i + 1; j < twjParticles.length; j++) {
        q = twjParticles[j];
        dx = p.x - q.x;
        dy = p.y - q.y;
        dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < twjLinkDist) {
          twjCtx.beginPath();
          twjCtx.moveTo(p.x, p.y);
          twjCtx.lineTo(q.x, q.y);
          twjCtx.strokeStyle = 'rgba(127, 179, 255,' + (0.35 * (1 - dist / twjLinkDist)) + ')';
          twjCtx.stroke();
        }
      }
    }
    requestAnimationFrame(twjStep);
  }

  window.addEventListener('resize', function () {
    twjResize();
    twjCreate();
  });
  twjResize();
  twjCreate();
  twjStep();
  console.log('首页 canvas 背景动画已启动');
})();
