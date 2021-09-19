
class AABB implements Rendereable {
    x: number;
    y: number;
    w: number;
    h: number

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
    }

    /**
     * Does the AABB contain a point
     * @param point The point 
     * @returns Whether the AABB contains the given point
     */
    containsPoint(point: Point): boolean {
        return (
            point.x >= this.x - this.w &&
            point.x <= this.x + this.w &&
            point.y >= this.y - this.h &&
            point.y <= this.y + this.h
        );
    }

    /**
     * Determines whether two AABBs intersect
     * @param range The other AABB
     * @returns Whether the two AABBs intersect or not
     */
    intersectsAABB(range: AABB): boolean {
        return !(
            range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h
        );
    }

    draw() {
        ctx.beginPath();
        ctx.rect(this.x - this.w, this.y - this.h, this.w * 2, this.h * 2);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.stroke();
    }

    update(): void {
        throw new Error("Method not implemented.");
    }
}
