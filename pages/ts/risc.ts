import { Int16, Int32, Uint16, Uint32 } from './math.js';

interface Appendable {
    appendTo(node: HTMLElement): void;
}

class StatusRegister {
    public zero: boolean;
    public negative: boolean;
    public carry: boolean;
    public overflow: boolean;

    constructor() {
        this.zero = false;
        this.negative = false;
        this.carry = false;
        this.overflow = false;
    }

    public reset(): void {
        this.zero = false;
        this.negative = false;
        this.carry = false;
        this.overflow = false;
    }
}

class ControlUnit {
    public programCounter: Uint16;
    public instructionRegister: Uint16;
    public statusRegister: StatusRegister;
    public addressRegister: Uint16;
    public dataRegister: Uint16;
    public stackPointer: Uint16;

    constructor() {
        this.programCounter = new Uint16();
        this.instructionRegister = new Uint16();
        this.statusRegister = new StatusRegister();
        this.addressRegister = new Uint16();
        this.dataRegister = new Uint16();
        this.stackPointer = new Uint16();
    }
}

class ArithmeticLogicUnit {
    public readonly registers: Uint16[];
    private readonly statusRegister: StatusRegister;

    constructor(statusRegister: StatusRegister) {
        this.registers = [];
        this.reset();
        this.statusRegister = statusRegister;
    }

    public reset(): void {
        for(let i = 0; i < 0x10; i++) {
            this.registers.push(new Uint16());
        }
    }

    private updateZeroAndNegative(r: number): void {
        this.statusRegister.negative = this.registers[r].neg();
        this.statusRegister.zero = this.registers[r].eq(0x0000);
    }

    public add(d: number, s: number): void {
        if(d > 0xF || s > 0xF) return;
        const resc = new Uint32(this.registers[d].add(this.registers[s]));
        const a = new Int16(this.registers[d]), b = new Int16(this.registers[s]);
        const res = new Int32(a.add(b)), c = new Int16(res);
        this.registers[d].set(res);
        this.statusRegister.carry = resc.gt(0xFFFF);
        this.statusRegister.overflow = !c.eq(res);
        this.updateZeroAndNegative(d);
    }

    public sub(d: number, s: number): void {
        if(d > 0xF || s > 0xF) return;
        const a = new Int16(this.registers[d]), b = new Int16(this.registers[s]);
        const res = new Int32(a.sub(b)), resc = new Int32(this.registers[d].add(this.registers[s].twos()))
        this.registers[d].set(res);
        this.statusRegister.carry = resc.gt(0xFFFF);
        this.statusRegister.overflow = !new Int16(this.registers[d]).eq(res);
        this.updateZeroAndNegative(d);
    }

    public not(r: number): void {
        if(r > 0xF) return;
        this.registers[r].set(this.registers[r].not());
        this.statusRegister.carry = false;
        this.statusRegister.overflow = false;
        this.updateZeroAndNegative(r);
    }

    public and(d: number, s: number) {
        if(d > 0xF || s > 0xF) return;
        this.registers[d].set(this.registers[d].and(this.registers[s]));
        this.statusRegister.carry = false;
        this.statusRegister.overflow = false;
        this.updateZeroAndNegative(d);
    }

    public or(d: number, s: number) {
        if(d > 0xF || s > 0xF) return;
        this.registers[d].set(this.registers[d].or(this.registers[s]));
        this.statusRegister.carry = false;
        this.statusRegister.overflow = false;
        this.updateZeroAndNegative(d);
    }

    public xor(d: number, s: number) {
        if(d > 0xF || s > 0xF) return;
        this.registers[d].set(this.registers[d].xor(this.registers[s]));
        this.statusRegister.carry = false;
        this.statusRegister.overflow = false;
        this.updateZeroAndNegative(d);
    }

    public inc(r: number): void {
        if(r > 0xF) return;
        this.statusRegister.carry = this.registers[r].eq(0xFFFF);
        this.statusRegister.overflow = this.registers[r].eq(0x7FFF);
        this.registers[r].set(this.registers[r].add(0x0001));
        this.updateZeroAndNegative(r);
    }

    public dec(r: number): void {
        if(r > 0xF) return;
        this.statusRegister.carry = true;
        this.statusRegister.overflow = this.registers[r].eq(0x8000);
        this.registers[r].set(this.registers[r].sub(0x0001));
        this.updateZeroAndNegative(r);
    }

    public lShift(r: number): void {
        if(r > 0xF) return;
        this.statusRegister.carry = this.registers[r].gt(0x8000);
        this.statusRegister.overflow = false;
        this.registers[r].set(this.registers[r].lShift());
        this.updateZeroAndNegative(r);
    }

    public rShift(r: number): void {
        if(r > 0xF) return;
        this.statusRegister.carry = false;
        this.statusRegister.overflow = false;
        this.registers[r].set(this.registers[r].rShift());
        this.updateZeroAndNegative(r);
    }
}

class CentralProcessingUnit {
    public controlUnit: ControlUnit;
    public arithmeticLogicUnit: ArithmeticLogicUnit;

    constructor() {
        this.controlUnit = new ControlUnit();
        this.arithmeticLogicUnit = new ArithmeticLogicUnit(this.controlUnit.statusRegister);
    }

    public reset(): void {
        //TODO
        this.controlUnit.statusRegister.reset();
    }
}