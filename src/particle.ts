type XY = [x: number, y: number]
type Velocity = [vx: number, vy: number]

class Particle implements Rendereable {
    p: XY;
    v: Velocity;
    r: number;
    m: number;
    ctx: CanvasRenderingContext2D;
    color: string;
    opacity: number;

    constructor(p: XY, r: number, ctx: CanvasRenderingContext2D) {
        this.p = p;
        this.r = r;
        this.m = r;
        this.v = [Math.random() * 3 - 1.5, Math.random() * 3 - 1.5];
        this.ctx = ctx;
        this.opacity = 1;
        this.color = `rgba(255,0,0,${this.opacity})`;
    }

    update() {
        // p += v
        this.p[0] += this.v[0];
        this.p[1] += this.v[1];

        // p %= [WIDTH, HEIGHT]
        this.p[0] %= WIDTH;
        this.p[1] %= HEIGHT;

        this.opacity *= 0.95;
        this.color = `rgba(255,0,0,${this.opacity})`;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.p[0], this.p[1], this.r, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    newSpeed(other: Particle) {
        const x1 = this.p;
        const x2 = other.p;

        const v1 = this.v;
        const v2 = other.v;

        const m1 = this.m;
        const m2 = other.m;

        const x1MinusX2 = minus(x1, x2);
        const v1MinusV2 = minus(v1, v2);

        const top = 2 * m2 * dotProduct(v1MinusV2, x1MinusX2);
        const bottom = (m1 + m2) * squaredLength(x1MinusX2);

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