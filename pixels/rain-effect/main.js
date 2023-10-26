window.onload = () => {
  const canvas = document.querySelector('#scene');
  const ctx = canvas.getContext('2d', { willReadFrequently: true});
  const img = document.querySelector('img');
  canvas.width = img.width;
  canvas.height = img.height;

  class Particle {
    constructor(effect) {
      this.effect = effect;
      this.context = effect.context;
      this.x = Math.random() * effect.width;
      this.y = 0;
      this.size = Math.random() + 1;
      this.velocity = 1;

      this.vx = 0;
      this.vy = Math.random() * 2;
    }

    update() {
      if (this.y > this.effect.height) {
        this.y = 0;
      }
      this.velocity = this.effect.brightnessArr[Math.floor(this.y)][Math.floor(this.x)];
      this.y += this.vy + (1 - this.velocity) * 3;
    }

    draw() {
      this.context.beginPath();
      this.context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      this.context.fill();
    }
  }

  class Effect {
    constructor(context, width, height) {
      this.context = context;
      this.width = width;
      this.height = height;
      this.numOfParticles = 5000;
      this.particles = [];
      this.brightnessArr = [];
    }

    init() {
      this.context.drawImage(img, 0, 0, img.width, img.height);
      const pixelsData = this.context.getImageData(0, 0, img.width, img.height).data;
      // this.context.clearRect(0, 0, img.width, img.height);
      this.context.fillStyle = 'white';

      for (let y = 0; y < img.height; y++) {
        let row = [];
        for (let x = 0; x < img.width; x++) {
          const pixelIndex = (y * img.width + x) * 4;
          const red = pixelsData[pixelIndex];
          const green = pixelsData[pixelIndex + 1];
          const blue = pixelsData[pixelIndex + 2];
          const alpha = pixelsData[pixelIndex + 3];
          row.push(this.calcRelativeBrightness(red, green, blue))
        }
        this.brightnessArr.push(row);
      }

      this.context.globalAlpha = 0.3;
      this.particles = new Array(this.numOfParticles).fill('').map(_ => {
        return new Particle(this)
      })

    }

    calcRelativeBrightness(r, g, b) {
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    }

    render() {
      this.particles.forEach(p => {
        p.update();
        p.draw();
      })
    }
  }

  const effect = new Effect(ctx, img.width, img.height);
  effect.init();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.render();
    requestAnimationFrame(animate)
  }

  animate();
}
