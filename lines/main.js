class Line {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.segGroup = [];
    this.maxSegment = 8;
    this.lineWidth = 16;
    this.nextOffset = 36;
    this.bottomBoundary = this.canvas.height * (Math.random() * 0.1 + 0.9);
  }

  generateEndPoint() {
    const x = Math.random() * this.canvas.width;
    const y = Math.random() * this.canvas.height / 4;
    return { x, y };
  }

  generateEndByOffset(start, offset) {
    const endX = start.x + Math.random() * offset - offset / 2;
    const endY = start.y + Math.random() * offset;
    return { x: endX, y: endY };
  }


  initSegment() {
    for (let i = 0; i < this.maxSegment; i++) {
      const start = this.segGroup.length === 0 ? this.generateEndPoint() : this.segGroup[i - 1][1];
      const end = this.generateEndByOffset(start, this.nextOffset);
      this.segGroup.push([start, end])
    }
  }

  updateSegment() {
    if (this.segGroup.length === 0) {
      this.initSegment();
    } else {
      const last = this.segGroup[this.segGroup.length - 1][1];
      if (last.y >= this.bottomBoundary) {
        this.segGroup.shift();
      } else {
        const end = this.generateEndByOffset(last, this.nextOffset);
        this.segGroup.shift();
        this.segGroup.push([last, end]);
      }
    }
  }

  drawBySeg() {
    this.ctx.beginPath();
    this.setStrokeStyle();
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.lineCap = 'round';

    for (let i = 0; i < this.segGroup.length; i++) {
        const [start , end] = this.segGroup[i];
        ctx.moveTo(start.x , start.y);
        ctx.lineTo(end.x, end.y);
    }
    this.ctx.stroke();
  }

  setStrokeStyle() {
    // this.ctx.strokeStyle = `hsl(${Math.random()}turn, 80%, 40%)`

    const g = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    g.addColorStop(0, 'hsl(0deg, 100%, 40%)');
    g.addColorStop(0.3, 'hsl(60deg, 100%, 40%)');
    g.addColorStop(0.4, 'hsl(120deg, 100%, 40%)');
    g.addColorStop(0.6, 'hsl(180deg, 100%, 40%)');
    g.addColorStop(0.7, 'hsl(240deg, 100%, 40%)');
    g.addColorStop(0.1, 'hsl(300deg, 100%, 40%)');
    this.ctx.strokeStyle = g;

    // this.ctx.strokeStyle = this.ctx.createPattern(document.querySelector('img'), 'no-repeat');

  }
}

const canvas = document.getElementById('scene');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

const linesArray = new Array(60).fill('').map(_ => {
  return new Line(canvas);
})

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  linesArray.forEach(l => {
    l.updateSegment();
    l.drawBySeg();
  })
  requestAnimationFrame(() => animate())
}
animate();
