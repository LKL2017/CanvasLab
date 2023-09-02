class Particle {
    constructor(effect) {
        this.effect = effect;
        this.context = effect.context;
        this.x = Math.random() * effect.width;
        this.y = Math.random() * effect.height;
        this.vx = 4;
        this.vy = 4;

        this.history = [{x: this.x, y: this.y}];
        this.maxLength = 60;
        this.timer = this.maxLength * 2;

        this.index = this.getIndex();
        this.angle = this.effect.effectFields[this.index];
    }


    // It just like we project a particle into the flow fields,
    // and we want to get the index by stacking the square cell and counting where it is.
    // 口口口口口
    // 口口口口口
    // 口口口
    // the 'index' of graphic above is 2 * 5 + 3
    getIndex() {
        const col = Math.floor(this.x / this.effect.cellSize);
        const row = Math.floor(this.y / this.effect.cellSize);
        return row <= 1 ? col : (row - 1) * this.effect.cols + col;
    }

    update() {
        if (this.timer > 0) {
            this.timer--;
            const last = this.history[this.history.length - 1]
            const x = last.x + this.getDeltaX();
            const y = last.y + this.getDeltaY();
            this.history.push({x, y});
            if (this.history.length > this.maxLength) {
                this.history.shift();
            }
        } else if (this.history.length) {
            this.history.shift();
        } else {
            this.reset();
        }
    }

    getDeltaX() {
        const range = 10;
        const value = Math.cos(this.angle * this.timer) * this.vx;
        return value + Math.random() * range - range / 2;
    }

    getDeltaY() {
        return Math.sin(this.angle * this.timer) * this.vy;
    }

    reset() {
        this.history = [{x: this.x, y: this.y}];
        this.timer = this.maxLength * 2;
    }

    draw(context) {
        if (!this.history.length) return;

        context.beginPath();
        const start = this.history[0];
        context.moveTo(start.x, start.y);
        for (let i = 0; i < this.history.length; i++) {
            const p = this.history[i];
            context.lineTo(p.x, p.y);
        }
        context.stroke();
    }

}

class Effect {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.context.strokeStyle = 'white';

        // fields
        this.cellSize = 20;
        this.rows = Math.floor(this.height / this.cellSize);
        this.cols = Math.floor(this.width / this.cellSize);
        this.effectFields = new Array(this.rows * this.cols)
            .fill('')
            .map((_, index) => {
                return index * 0.1;
            })

        // particles
        this.numOfPartilces = 40;
        this.particles = new Array(this.numOfPartilces).fill('').map(() => new Particle(this));
    }

    render() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.context);
        })
    }
}

const canvas = document.getElementById('scene');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');


const effect = new Effect(canvas);


function animate(target) {
    target.render();
    requestAnimationFrame(() => animate(target));
}

animate(effect);

