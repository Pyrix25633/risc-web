class Int {
    constructor(bits, signed, n = undefined) {
        this.signed = signed;
        this.n = 0;
        this.mask = 2 ** bits - 1;
        this.flag = 2 ** (bits - 1);
        if (n != undefined)
            this.set(n);
    }
    set(n) {
        if (n instanceof Int)
            n = n.get();
        this.n = n & this.mask;
        if (this.signed && this.neg())
            this.n = -(this.n ^ (this.mask - 1));
    }
    get() {
        return this.n;
    }
    add(n) {
        if (n instanceof Int)
            n = n.get();
        return this.n + n;
    }
    sub(n) {
        if (n instanceof Int)
            n = n.get();
        return this.n - n;
    }
    neg() {
        return (this.n & this.flag) == this.flag;
    }
    gt(n) {
        if (n instanceof Int)
            n = n.get();
        return this.n > n;
    }
    eq(n) {
        if (n instanceof Int)
            n = n.get();
        return this.n == n;
    }
    not() {
        return ~this.n & this.mask;
    }
    twos() {
        return (~this.n + 1) & this.mask;
    }
    and(n) {
        if (n instanceof Int)
            n = n.get();
        return this.n & n;
    }
    or(n) {
        if (n instanceof Int)
            n = n.get();
        return this.n | n;
    }
    xor(n) {
        if (n instanceof Int)
            n = n.get();
        return this.n ^ n;
    }
    lShift() {
        return (this.n << 1) & this.mask;
    }
    rShift() {
        return this.n >> 1;
    }
}
export class Int8 extends Int {
    constructor(n = undefined) {
        super(8, true, n);
    }
}
export class Uint8 extends Int {
    constructor(n = undefined) {
        super(8, false, n);
    }
}
export class Int16 extends Int {
    constructor(n = undefined) {
        super(16, true, n);
    }
}
export class Uint16 extends Int {
    constructor(n = undefined) {
        super(16, false, n);
    }
}
export class Int32 extends Int {
    constructor(n = undefined) {
        super(32, true, n);
    }
}
export class Uint32 extends Int {
    constructor(n = undefined) {
        super(32, false, n);
    }
}
