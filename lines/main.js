class Line {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.segGroup = [];
    this.maxSegment = 14;
  }

  generateEndPoint() {
    const x = Math.random() * this.canvas.width;
    const y = Math.random() * this.canvas.height;
    return { x, y };
  }

  generateSeg() {
    for (let i = 0; i < this.maxSegment; i++) {
      if (this.segGroup.length === 0) {
        const start = this.generateEndPoint();
        const end = this.generateEndPoint();
        this.segGroup.push([start, end]);
      } else {
        const start = this.segGroup[i - 1][1];
        const end = this.generateEndPoint();
        this.segGroup.push([start, end])
      }
    }
  }

  drawBySeg() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 4;

    for (let i = 0; i < this.segGroup.length; i++) {
        const [start , end] = this.segGroup[i];
        ctx.moveTo(start.x , start.y);
        ctx.lineTo(end.x, end.y);
    }
    this.ctx.stroke();
  }

  updateSeg() {
    const start = this.segGroup[this.segGroup.length - 1];
    const end = this.generateEndPoint();
    this.segGroup.shift();
    this.segGroup.push([start, end]);
  }

  animate() {
    // console.log('animating...')
		this.updateSeg();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBySeg();

    requestAnimationFrame(() => this.animate());
  }
}


const canvas = document.getElementById('scene');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

const linesArray = new Array(1).fill('').map(_ => {
  return new Line(canvas);
})
linesArray.forEach(l => {
  l.generateSeg();
  l.drawBySeg();
  l.animate();
})
