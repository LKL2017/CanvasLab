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
      this.size = Math.random() * 0.5 + 1;

      this.velocity = Math.random() * 2;
      this.speed = 1;
      this.color = 'white';
    }

    get vy () {
      return this.velocity + (2.5 - this.speed);
    }

    update() {
      if (this.y > this.effect.height) {
        this.y = 0;
        this.x = Math.random() * this.effect.width;
      }
      const pixelInfo = this.effect.brightnessArr[Math.floor(this.y / this.effect.gap)][Math.floor(this.x / this.effect.gap)];
      this.speed = pixelInfo.brightness;
      this.color = pixelInfo.color;
      this.y += this.vy;
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
      this.gap = 2;
      this.numOfParticles = 2000;
      this.particles = [];
      this.brightnessArr = [];
    }

    init() {
      this.context.drawImage(img, 0, 0, img.width, img.height);
      const pixelsData = this.context.getImageData(0, 0, img.width, img.height).data;
      this.context.clearRect(0, 0, img.width, img.height);
      this.context.fillStyle = 'white';

      for (let y = 0; y < img.height; y+=this.gap) {
        let row = [];
        for (let x = 0; x < img.width; x+=this.gap) {
          const pixelIndex = (y * img.width + x) * 4;
          const red = pixelsData[pixelIndex];
          const green = pixelsData[pixelIndex + 1];
          const blue = pixelsData[pixelIndex + 2];
          row.push({
            brightness: this.calcRelativeBrightness(red, green, blue),
            color: `rgb(${red},${green},${blue})`
          })
        }
        this.brightnessArr.push(row);
      }

      this.particles = new Array(this.numOfParticles).fill('').map(_ => {
        return new Particle(this)
      })

    }

    calcRelativeBrightness(r, g, b) {
      return Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b) / 100;
    }

    render() {
      this.particles.forEach(p => {
        p.update();
        this.context.globalAlpha = p.speed * 0.5;
        this.context.fillStyle = p.color;
        p.draw();
      })
    }
  }

  const effect = new Effect(ctx, img.width, img.height);
  effect.init();

  function animate() {
    // not clearing here and setting a background makes the particles 'fade out', that's amazing
    effect.context.globalAlpha = 0.02;
    effect.context.fillStyle = 'black';
    effect.context.fillRect(0, 0, effect.width, effect.height);
    effect.context.globalAlpha = 0.2;
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    effect.render();
    requestAnimationFrame(animate)
  }

  animate();
}
