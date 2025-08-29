type Bits = 8 | 16 | 32;

class Int {
    private readonly signed: boolean;
    private n: number;
    private readonly mask: number;
    private readonly flag: number;

    constructor(bits: Bits, signed: boolean, n: number | Int | undefined = undefined) {
        this.signed = signed;
        this.n = 0;
        this.mask = 2**bits - 1;
        this.flag = 2**(bits - 1);
        if(n != undefined) this.set(n);
    }

    public set(n: number | Int): void {
        if(n instanceof Int) n = n.get();
        this.n = n & this.mask;
        if(this.signed && this.neg()) this.n = -(this.n ^ (this.mask - 1));
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
        return (this.n & this.flag) == this.flag;
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
        return ~this.n & this.mask;
    }

    public twos(): number {
        return (~this.n + 1) & this.mask;
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

    public lShift(): number {
        return (this.n << 1) & this.mask;
    }

    public rShift(): number {
        return this.n >> 1;
    }
}

export class Int8 extends Int {
    constructor(n: number | Int | undefined = undefined) {
        super(8, true, n)
    }
}

export class Uint8 extends Int {
    constructor(n: number | Int | undefined = undefined) {
        super(8, false, n)
    }
}

export class Int16 extends Int {
    constructor(n: number | Int | undefined = undefined) {
        super(16, true, n)
    }
}

export class Uint16 extends Int {
    constructor(n: number | Int | undefined = undefined) {
        super(16, false, n)
    }
}

export class Int32 extends Int {
    constructor(n: number | Int | undefined = undefined) {
        super(32, true, n)
    }
}

export class Uint32 extends Int {
    constructor(n: number | Int | undefined = undefined) {
        super(32, false, n)
    }
}