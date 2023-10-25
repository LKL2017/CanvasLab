window.onload = () => {
  const img = document.querySelector('img');
  const canvas = document.querySelector('#scene');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  class Particle {
    constructor(effect, x, y, gap, color) {
      this.context = effect.context;
      this.originX = x;
      this.originY = y;
      this.x = Math.random() * effect.width;
      this.y = Math.random() * effect.height;
      this.color = color;
      this.size = gap;

      this.speed = 0.1;
    }

    draw() {
      this.context.fillStyle = this.color;
      this.context.fillRect(this.x, this.y, this.size, this.size);
    }

    update() {
      this.x += (this.originX - this.x) * this.speed;
      this.y += (this.originY - this.y) * this.speed;
    }
  }

  class Effect {
    constructor(context, width, height) {
      this.context = context;
      this.width = width;
      this.height = height;

      this.particles = [];
      this.gap = 10;

      this.mouse = {
        radius: 4000,
        x: undefined,
        y: undefined
      }
      this.bindEvent();
    }
    init() {
      this.context.drawImage(img, this.width / 2 - img.width / 2, this.height / 2 - img.height / 2, img.width, img.height);
      const pixelData = this.context.getImageData(0, 0, this.width, this.height).data;

      for (let y = 0; y < this.height; y += this.gap) {
        for (let x = 0; x < this.width; x += this.gap) {
          const pixelIndex = (y * this.width + x) * 4;
          const alpha = pixelData[pixelIndex + 3];
          if (alpha > 0) {
            const r = pixelData[pixelIndex];
            const g = pixelData[pixelIndex + 1];
            const b = pixelData[pixelIndex + 2];
            const color = `rgb(${r},${g},${b})`;
            this.particles.push(new Particle(this, x, y, this.gap ,color))
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

    bindEvent() {
      window.addEventListener('mousemove', evt => {
        this.particles.forEach(p => {
          const dx = p.x - evt.x;
          const dy = p.y - evt.y;
          const ratio = (dx * dx + dy * dy) / this.mouse.radius;
          if (ratio < 1) {
            // const force = -ratio;
            const theta = Math.atan2(dy, dx);
            const vx = Math.cos(theta);
            const vy = Math.sin(theta);
            p.x += vx;
            p.y += vy;
          }
        })
      })
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
