class IntProperties {
    constructor(bits, signed) {
        this.mask = 2 ** bits - 1;
        this.flag = 2 ** (bits - 1);
        this.signed = signed;
    }
}
const int8Properties = new IntProperties(8, true);
const uint8Properties = new IntProperties(8, false);
const int16Properties = new IntProperties(16, true);
const uint16Properties = new IntProperties(16, false);
const int32Properties = new IntProperties(32, true);
const uint32Properties = new IntProperties(32, false);
class Int {
    constructor(properties, n = undefined) {
        this.properties = properties;
        this.n = 0;
        if (n != undefined)
            this.set(n);
    }
    set(n) {
        if (n instanceof Int)
            n = n.get();
        this.n = n & this.properties.mask;
        if (this.properties.signed && this.neg())
            this.n = -(this.n ^ (this.properties.mask - 1));
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
        return (this.n & this.properties.flag) == this.properties.flag;
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
        return ~this.n & this.properties.mask;
    }
    twos() {
        return (~this.n + 1) & this.properties.mask;
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
    lShift(n = 1) {
        return this.n << n;
    }
    rShift(n = 1) {
        return this.n >> n;
    }
}
export class Int8 extends Int {
    constructor(n = undefined) {
        super(int8Properties, n);
    }
}
export class Uint8 extends Int {
    constructor(n = undefined) {
        super(uint8Properties, n);
    }
}
export class Int16 extends Int {
    constructor(n = undefined) {
        super(int16Properties, n);
    }
}
export class Uint16 extends Int {
    constructor(n = undefined) {
        super(uint16Properties, n);
    }
}
export class Int32 extends Int {
    constructor(n = undefined) {
        super(int32Properties, n);
    }
}
export class Uint32 extends Int {
    constructor(n = undefined) {
        super(uint32Properties, n);
    }
}
