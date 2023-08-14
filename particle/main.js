class ParticleBox {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.cellSize = 80;
    this.rows = Math.floor(height / this.cellSize);
    this.cols = Math.floor(width / this.cellSize);
    this.effectFields = this.genEffectFields();
    console.log(this.rows, this.cols, this.effectFields.length)
    this.particles = new Array(this.effectFields.length).fill('').map(_ => new Particle(canvas, ctx));
  }


  genEffectFields(rows, cols) {
    const fields = [];
    const pixelData = this.genImageDataWithText().data;
    for (let y = 0;y < this.rows;y++) {
      for (let x = 0;x < this.cols;x++) {
        const fieldX = x * this.cellSize + this.x;
        const fieldY = y * this.cellSize + this.y;
        if (true || this.checkIfPositionFilled(fieldX, fieldY, pixelData)) {
          const position = {
            x: fieldX,
            y: fieldY
          };
          const filedIndex = this.cols * (y - 1) + x;
          const angle = filedIndex * Math.PI / 4;
          fields.push({
            position,
            angle
          });
        }
      }
    }
    return fields;
  }

  genImageDataWithText() {
    ctx.save();
    ctx.font = `italic bold 300px serif`
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.fillText('PARTICLE', canvas.width / 2, canvas.height / 2 - 150)
    ctx.fillText('SYSTEM', canvas.width / 2, canvas.height / 2 + 150)
    ctx.restore();
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  // FIXME: Filter Not Effect Yet
  checkIfPositionFilled(x, y, data) {
    const pixelIndex = x * y;
		const r = data[pixelIndex - 3];
		const g = data[pixelIndex - 2];
		const b = data[pixelIndex - 1];
    return (r + g + b) / 3 > 100;
  }

  render() {
    this.particles.forEach((particle, i) => {
      const effect = this.effectFields[i];
      const { x, y } = effect.position;
      const angle = effect.angle;
      particle.draw(x, y, angle);
    })
  }
}

class Particle {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.history = [];
    this.lineWidth = 2;
    this.strokeStyle = this.genStrokeStyle(this.ctx);
    this.zoom = 4;
  }

  genStrokeStyle(ctx) {
    // return 'cyan'
    const rg = ctx.createRadialGradient(0, 0, particleBoxSize.w / 5, 0, 0, particleBoxSize.w);
    for (let offset = 0; offset <= 1; offset+= 0.2) {
      rg.addColorStop(offset, `hsl(${offset}turn, 80%, 50%)`);
    }
    return rg;
  }

  draw(x, y, angle) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.lineCap = 'round'

    if (!this.history.length) {
      this.history[0] = {x , y, angle};
    }
    const last = this.history[this.history.length - 1];
    const newAngle = last.angle + Math.random() * 0.2;
    const deltaX = Math.cos(newAngle) + Math.random() * 2 - 1;
    const deltaY = Math.sin(newAngle) * 2;
    const newX = last.x + deltaX * this.zoom;
    const newY = last.y + deltaY * this.zoom;

    this.history.push({x: newX, y: newY, angle: newAngle});
    if (this.history.length > 30) {
      this.history.shift()
    }

    this.ctx.moveTo(this.history[0].x, this.history[0].y);
    for (let i = 0; i < this.history.length; i ++) {
      this.ctx.lineTo(this.history[i].x, this.history[i].y);
    }

    this.ctx.stroke();
  }
}

const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particleBoxOrigin = {x: 50, y: 50};
const particleBoxSize = {w: canvas.width, h: canvas.height};

let particleBox = new ParticleBox(particleBoxOrigin.x, particleBoxOrigin.y, particleBoxSize.w, particleBoxSize.h);

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particleBox = new ParticleBox(particleBoxOrigin.x, particleBoxOrigin.y, particleBoxSize.w, particleBoxSize.h);
})

animate();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  particleBox.render();
  requestAnimationFrame(() => animate());
}
