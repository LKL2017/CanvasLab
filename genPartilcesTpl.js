/**
 * simple template and has not very strict validation
 */
const fs = require('fs');
const path = require('path');
const input = process.argv.slice(2);

if (input.length !== 1) return;

const html = `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title></title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        #scene {
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <canvas id="scene"></canvas>
    <script src="main.js"></script>
</body>
</html>
`;

const js = `window.onload = () => {
  const canvas = document.querySelector('#scene');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  class Particle {
    constructor(effect, x, y) {
      this.context = effect.context;
      this.originX = x;
      this.originY = y;
    }

    draw() {}

    update() {}
  }

  class Effect {
    constructor(context, width, height) {
      this.context = context;
      this.width = width;
      this.height = height;

      this.gap = 1;
      this.particles = [];
    }
    init() {
      const img = {};
      this.context.drawImage(img, 0, 0, img.width, img.height);
      const pixelData = this.context.getImageData(0,0,this.width, this.height).data;
      for (let y = 0; y < this.height; y += this.gap) {
        for (let x = 0; x < this.width; x += this.gap) {
          const pixelIndex = (y * this.width + x) * 4;
          const alpha = pixelData[pixelIndex + 3];
          if (alpha > 0) {
            const r = pixelData[pixelIndex];
            const g = pixelData[pixelIndex + 1];
            const b = pixelData[pixelIndex + 2];
            this.particles.push(new Particle(this, x, y))
          }
        }
      }
    }

    update() {
      this.particles.forEach(p => {
        p.update();
        p.draw();
      });
    }
  }

  const effect = new Effect(ctx, canvas.width, canvas.height);
  effect.init();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.update();
    requestAnimationFrame(animate)
  }
  animate()
}
`;

const outputPath = input[0];
const finalPathPrefix = path.isAbsolute(outputPath) ? outputPath : path.join(process.cwd(), outputPath);
fs.writeFileSync(`${finalPathPrefix}/index.html`, html);
fs.writeFileSync(`${finalPathPrefix}/main.js`, js);

