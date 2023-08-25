const canvas = document.getElementById('scene');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
g.addColorStop(0, `hsl(100, 100%, 50%)`);
g.addColorStop(0.5, `hsl(200, 100%, 50%)`);
g.addColorStop(1, `hsl(300, 100%, 50%)`);
ctx.fillStyle = g;

ctx.strokeStyle = 'white';

class Particle {
  constructor(effect) {
    this.canvas = effect.canvas;
    this.radius = Math.random() * 12 + 6;
    this.x = Math.random() * (this.canvas.width - 2 * this.radius) + this.radius;
    this.y = Math.random() * (this.canvas.height - 2 * this.radius) + this.radius;
    this.vx = Math.random() * 4;
    this.vy = Math.random() * 4;

    this.draw(effect.ctx);
  }

  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x > this.canvas.width - this.radius || this.x < 0 + this.radius) this.vx *= -1;
    if (this.y > this.canvas.height - this.radius || this.y < 0 + this.radius) this.vy *= -1;
  }
}

class Effect {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.numOfPartilces = 30;
    this.maxDistance = 240;
  }

  genParticles() {
    for (let i = 0; i < this.numOfPartilces; i++) {
      this.particles.push(new Particle(this))
    }
  }

  renderParticles () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.particles.forEach(particle => particle.update());
    this.drawConnection();
    this.particles.forEach(particle => particle.draw(this.ctx));
  }

  drawConnection(maxD) {
    for(let i = 0; i < this.particles.length; i++) {
      for(let j = i; j < this.particles.length; j++) {
        const first = this.particles[i];
        const second = this.particles[j];
        const dx = first.x - second.x;
        const dy = first.y - second.y;
        const distance = Math.hypot(dx, dy);
        if (distance < this.maxDistance) {
          this.ctx.save();
          this.ctx.globalAlpha = 1 - distance / this.maxDistance;
          this.ctx.moveTo(first.x, first.y);
          this.ctx.lineTo(second.x, second.y);
          this.ctx.stroke();
          this.ctx.restore();
        }
      }
    }
  }

}

const effect = new Effect(canvas);
effect.genParticles();

function animation() {
  effect.renderParticles();
  requestAnimationFrame(animation);
}

animation();
