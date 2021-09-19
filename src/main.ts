const canvas = <HTMLCanvasElement>document.getElementById('canvas');
const ctx = canvas.getContext('2d')!;
var WIDTH = canvas.width;
var HEIGHT = canvas.height;
var particles: Particle[] = [];

function init() {
    window.requestAnimationFrame(draw);
    for (let i = 0; i < 1000; ++i) {
        const randX = Math.random() * WIDTH;
        const randY = Math.random() * HEIGHT;
        const position: [number, number] = [randX, randY];
        const r = Math.random() * 3 + 4;
        particles.push(new Particle(position, r, ctx));
    }
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    const boundary = new AABB(WIDTH / 2, HEIGHT / 2, WIDTH / 2 + 1, HEIGHT / 2 + 1);
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

/**
 * On resize, adapt the height and width of the particles
 */
function resize() {
    const NEW_HEIGHT = window.innerHeight - 2;
    const NEW_WIDTH = window.innerWidth - 2;

    const factor_x = NEW_HEIGHT / HEIGHT;
    const factor_y = NEW_WIDTH / WIDTH;

    for (const particle of particles) {
        particle.p[0] = particle.p[0] * factor_x;
        particle.p[1] = particle.p[1] * factor_y;
    }

    HEIGHT = NEW_HEIGHT;
    WIDTH = NEW_WIDTH;
    canvas.height = NEW_HEIGHT;
    canvas.width = NEW_WIDTH;
}

window.onresize = resize

resize();
init();
