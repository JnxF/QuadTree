const canvas = <HTMLCanvasElement>document.getElementById('canvas');
const ctx = canvas.getContext('2d')!;
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const boundary = new AABB(WIDTH / 2, HEIGHT / 2, WIDTH / 2 + 1, HEIGHT / 2 + 1);
var particles: Particle[] = [];

function init() {
    window.requestAnimationFrame(draw);
    for (let i = 0; i < 3000; ++i) {
        const randX = Math.random() * WIDTH;
        const randY = Math.random() * HEIGHT;
        const position: [number, number] = [randX, randY];
        const r = Math.random() * 2 + 2;
        particles.push(new Particle(position, r, ctx));
    }
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    const qt = new QuadTree(boundary);
    for (const particle of particles) {
        qt.insert(new Point(particle.p[0], particle.p[1], particle));
    }
    qt.draw();


    for (const particle of particles) {
        const boundaryParticle = new AABB(particle.p[0], particle.p[1], particle.r * 2, particle.r * 2);
        const nearPoints = qt.queryRange(boundaryParticle);

        for (const nearPoint of nearPoints) {
            const nearParticle = <Particle>nearPoint.userData;
            if (nearParticle != particle && particle.intersects(nearParticle)) {
                particle.elasticCollision(nearParticle);
            }
        }
    }

    for (const particle of particles) {
        particle.update();
        particle.draw();
    }

    window.requestAnimationFrame(draw);
}


init();