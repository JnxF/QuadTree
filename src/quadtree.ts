class Point {
    x: number;
    y: number;
    userData?: any;
    constructor(x: number, y: number, userData?: any) {
        this.x = x;
        this.y = y;
        this.userData = userData;
    }
}

class QuadTree {
    readonly QT_NODE_CAPACITY = 4;
    boundary: AABB;
    points: Point[];

    northWest?: QuadTree;
    northEast?: QuadTree;
    southWest?: QuadTree;
    southEast?: QuadTree;

    isSubdivided: boolean = false;

    constructor(boundary: AABB) {
        this.boundary = boundary;
        this.points = [];
    }

    draw() {
        this.boundary.draw();

        this.northEast?.draw();
        this.northWest?.draw();
        this.southEast?.draw();
        this.southWest?.draw();
    }

    /**
     * Inserts a point into the quad tree
     * @param p The point to insert
     * @returns Whether the point could be inserted
     */
    insert(p: Point): boolean {
        // Ignore objects that do not belong in this quad tree
        if (!this.boundary.containsPoint(p)) {
            return false;
        }

        // If there is space in this quad tree and if doesn't
        // have subdivisions, add the object here
        if (this.points.length < this.QT_NODE_CAPACITY) {
            this.points.push(p);
            return true;
        }

        // Otherwise, subdivide and then add the point to
        // whichever node will accept it
        if (!this.isSubdivided) {
            this.subdivide();
        }

        // We have to add the points/data contained into this
        // quad array to the new quads if we only want 
        // the last node to hold the data 
        if (this.northWest!.insert(p) ||
            this.northEast!.insert(p) ||
            this.southWest!.insert(p) ||
            this.southEast!.insert(p)) {
            return true;
        }
        // Otherwise, the point cannot be inserted for some
        // unknown reason (this should never happen)
        return false;
    }


    subdivide() {
        this.isSubdivided = true;
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w / 2;
        let h = this.boundary.h / 2;

        let ne = new AABB(x + w, y - h, w, h);
        let nw = new AABB(x - w, y - h, w, h);
        let se = new AABB(x + w, y + h, w, h);
        let sw = new AABB(x - w, y + h, w, h);

        this.northEast = new QuadTree(ne);
        this.northWest = new QuadTree(nw);
        this.southEast = new QuadTree(se);
        this.southWest = new QuadTree(sw);
    }

    queryRange(range: AABB): Point[] {
        // Automatically abort if the range does not intersect this quad
        if (!this.boundary.intersectsAABB(range)) {
            return [];
        }

        // Check objects at this quad level
        var found = this.points.filter(p => range.containsPoint(p));

        // Terminate if there are no children
        if (!this.isSubdivided) {
            return found;
        }

        // Otherwise, add the points from the children
        found = found.concat(this.northWest!.queryRange(range));
        found = found.concat(this.northEast!.queryRange(range));
        found = found.concat(this.southWest!.queryRange(range));
        found = found.concat(this.southEast!.queryRange(range));

        return found;
    }
}