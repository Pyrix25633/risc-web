type Bits = 8 | 16 | 32;

class IntProperties {
    public readonly mask: number;
    public readonly flag: number;
    public readonly signed: boolean;

    constructor(bits: Bits, signed: boolean) {
        this.mask = 2**bits - 1;
        this.flag = 2**(bits - 1);
        this.signed = signed;
    }
}

const int8Properties = new IntProperties(8, true);
const uint8Properties = new IntProperties(8, false);
const int16Properties = new IntProperties(16, true);
const uint16Properties = new IntProperties(16, false);
const int32Properties = new IntProperties(32, true);
const uint32Properties = new IntProperties(32, false);

abstract class Int {
    private readonly properties: IntProperties;
    private n: number;

    constructor(properties: IntProperties, n: number | Int | undefined = undefined) {
        this.properties = properties;
        this.n = 0;
        if(n != undefined) this.set(n);
    }

    public set(n: number | Int): void {
        if(n instanceof Int) n = n.get();
        this.n = n & this.properties.mask;
        if(this.properties.signed && this.neg()) this.n = -(this.n ^ (this.properties.mask - 1));
    }

    public get(): number {
        return this.n;
    }

    public add(n: number | Int): number {
        if(n instanceof Int) n = n.get();
        return this.n + n;
    }

    public sub(n: number | Int): number {
        if(n instanceof Int) n = n.get();
        return this.n - n;
    }

    public neg(): boolean {
        return (this.n & this.properties.flag) == this.properties.flag;
    }

    public gt(n: number | Int): boolean {
        if(n instanceof Int) n = n.get();
        return this.n > n;
    }

    public eq(n: number | Int): boolean {
        if(n instanceof Int) n = n.get();
        return this.n == n;
    }

    public not(): number {
        return ~this.n & this.properties.mask;
    }

    public twos(): number {
        return (~this.n + 1) & this.properties.mask;
    }

    public and(n: number | Int): number {
        if(n instanceof Int) n = n.get();
        return this.n & n;
    }

    public or(n: number | Int): number {
        if(n instanceof Int) n = n.get();
        return this.n | n;
    }

    public xor(n: number | Int): number {
        if(n instanceof Int) n = n.get();
        return this.n ^ n;
    }

    public lShift(n: number = 1): number {
        return this.n << n;
    }

    public rShift(n: number = 1): number {
        return this.n >> n;
    }
}

export class Int8 extends Int {
    constructor(n: number | Int | undefined = undefined) {
        super(int8Properties, n)
    }
}

export class Uint8 extends Int {
    constructor(n: number | Int | undefined = undefined) {
        super(uint8Properties, n)
    }
}

export class Int16 extends Int {
    constructor(n: number | Int | undefined = undefined) {
        super(int16Properties, n)
    }
}

export class Uint16 extends Int {
    constructor(n: number | Int | undefined = undefined) {
        super(uint16Properties, n)
    }
}

export class Int32 extends Int {
    constructor(n: number | Int | undefined = undefined) {
        super(int32Properties, n)
    }
}

export class Uint32 extends Int {
    constructor(n: number | Int | undefined = undefined) {
        super(uint32Properties, n)
    }
}