type XY = [x: number, y: number]
type Velocity = [vx: number, vy: number]

class Particle implements Rendereable {
    p: XY;
    v: Velocity;
    r: number;
    ctx: CanvasRenderingContext2D;
    color: number;
    opacity: number;

    constructor(p: XY, r: number, ctx: CanvasRenderingContext2D) {
        this.p = p;
        this.r = r;
        this.v = [Math.random() * 8 - 4, Math.random() * 8 - 4];
        this.ctx = ctx;
        this.opacity = 1;
        this.color = 220 + (Math.random() * 80 - 40);
    }

    update() {
        // p += v
        this.p[0] += this.v[0];
        this.p[1] += this.v[1];

        // p %= [WIDTH, HEIGHT] 
        this.p[0] %= WIDTH;
        this.p[1] %= HEIGHT;

        this.opacity *= 0.99;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.p[0], this.p[1], this.r, 0, 2 * Math.PI);
        ctx.fillStyle = `hsla(${this.color}, 100%, 60%, ${this.opacity})`;

        ctx.fill();
    }

    newSpeed(other: Particle) {
        const x1 = this.p;
        const x2 = other.p;

        const v1 = this.v;
        const v2 = other.v;

        const x1MinusX2 = minus(x1, x2);
        const v1MinusV2 = minus(v1, v2);

        const top = 2 * other.r * dotProduct(v1MinusV2, x1MinusX2);
        const bottom = (this.r + other.r) * squaredLength(x1MinusX2);

        const factor = top / bottom;

        return minus(v1, times(factor, x1MinusX2));
    }

    elasticCollision(other: Particle) {
        const v1prime = this.newSpeed(other);
        const v2prime = other.newSpeed(this);
        this.v = v1prime;
        other.v = v2prime;

        this.p = add(this.p, this.v);
        other.p = add(other.p, other.v);

        this.opacity = 1;
        other.opacity = 1;
    }

    intersects(other: Particle): boolean {
        const distance = vecLen(minus(this.p, other.p))
        const minDistance = this.r + other.r;

        return distance < minDistance;
    }
}