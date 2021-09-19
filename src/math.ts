function minus(a: [number, number], b: [number, number]): [number, number] {
    return [a[0] - b[0], a[1] - b[1]]
}
function add(a: [number, number], b: [number, number]): [number, number] {
    return [a[0] + b[0], a[1] + b[1]]
}

function times(scalar: number, a: [number, number]): [number, number] {
    return [a[0] * scalar, a[1] * scalar];
}

function squaredLength(a: [number, number]): number {
    return a[0] * a[0] + a[1] * a[1];
}

function vecLen(a: [number, number]): number {
    return Math.sqrt(squaredLength(a));
}

function dotProduct(a: [number, number], b: [number, number]): number {
    return a[0] * b[0] + a[1] * b[1];
}