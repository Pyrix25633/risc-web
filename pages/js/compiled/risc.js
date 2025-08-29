import { Int16, Int32, Uint16, Uint32 } from './math.js';
class StatusRegister {
    constructor() {
        this.zero = false;
        this.negative = false;
        this.carry = false;
        this.overflow = false;
    }
    reset() {
        this.zero = false;
        this.negative = false;
        this.carry = false;
        this.overflow = false;
    }
}
class ControlUnit {
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
    constructor(statusRegister) {
        this.registers = [];
        this.reset();
        this.statusRegister = statusRegister;
    }
    reset() {
        for (let i = 0; i < 0x10; i++) {
            this.registers.push(new Uint16());
        }
    }
    updateZeroAndNegative(r) {
        this.statusRegister.negative = this.registers[r].neg();
        this.statusRegister.zero = this.registers[r].eq(0x0000);
    }
    add(d, s) {
        if (d > 0xF || s > 0xF)
            return;
        const resc = new Uint32(this.registers[d].add(this.registers[s]));
        const a = new Int16(this.registers[d]), b = new Int16(this.registers[s]);
        const res = new Int32(a.add(b)), c = new Int16(res);
        this.registers[d].set(res);
        this.statusRegister.carry = resc.gt(0xFFFF);
        this.statusRegister.overflow = !c.eq(res);
        this.updateZeroAndNegative(d);
    }
    sub(d, s) {
        if (d > 0xF || s > 0xF)
            return;
        const a = new Int16(this.registers[d]), b = new Int16(this.registers[s]);
        const res = new Int32(a.sub(b)), resc = new Int32(this.registers[d].add(this.registers[s].twos()));
        this.registers[d].set(res);
        this.statusRegister.carry = resc.gt(0xFFFF);
        this.statusRegister.overflow = !new Int16(this.registers[d]).eq(res);
        this.updateZeroAndNegative(d);
    }
    not(r) {
        if (r > 0xF)
            return;
        this.registers[r].set(this.registers[r].not());
        this.statusRegister.carry = false;
        this.statusRegister.overflow = false;
        this.updateZeroAndNegative(r);
    }
    and(d, s) {
        if (d > 0xF || s > 0xF)
            return;
        this.registers[d].set(this.registers[d].and(this.registers[s]));
        this.statusRegister.carry = false;
        this.statusRegister.overflow = false;
        this.updateZeroAndNegative(d);
    }
    or(d, s) {
        if (d > 0xF || s > 0xF)
            return;
        this.registers[d].set(this.registers[d].or(this.registers[s]));
        this.statusRegister.carry = false;
        this.statusRegister.overflow = false;
        this.updateZeroAndNegative(d);
    }
    xor(d, s) {
        if (d > 0xF || s > 0xF)
            return;
        this.registers[d].set(this.registers[d].xor(this.registers[s]));
        this.statusRegister.carry = false;
        this.statusRegister.overflow = false;
        this.updateZeroAndNegative(d);
    }
    inc(r) {
        if (r > 0xF)
            return;
        this.statusRegister.carry = this.registers[r].eq(0xFFFF);
        this.statusRegister.overflow = this.registers[r].eq(0x7FFF);
        this.registers[r].set(this.registers[r].add(0x0001));
        this.updateZeroAndNegative(r);
    }
    dec(r) {
        if (r > 0xF)
            return;
        this.statusRegister.carry = true;
        this.statusRegister.overflow = this.registers[r].eq(0x8000);
        this.registers[r].set(this.registers[r].sub(0x0001));
        this.updateZeroAndNegative(r);
    }
    lShift(r) {
        if (r > 0xF)
            return;
        this.statusRegister.carry = this.registers[r].gt(0x8000);
        this.statusRegister.overflow = false;
        this.registers[r].set(this.registers[r].lShift());
        this.updateZeroAndNegative(r);
    }
    rShift(r) {
        if (r > 0xF)
            return;
        this.statusRegister.carry = false;
        this.statusRegister.overflow = false;
        this.registers[r].set(this.registers[r].rShift());
        this.updateZeroAndNegative(r);
    }
}
class CentralProcessingUnit {
    constructor() {
        this.controlUnit = new ControlUnit();
        this.arithmeticLogicUnit = new ArithmeticLogicUnit(this.controlUnit.statusRegister);
    }
    reset() {
        //TODO
        this.controlUnit.statusRegister.reset();
    }
}
