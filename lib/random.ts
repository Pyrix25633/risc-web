import { createHash, randomInt } from 'crypto';

export function generateVerificationCode(): number {
    return randomInt(100000, 1000000);
}

function hash(data: string): string {
    const hash = createHash('sha3-512');
    hash.update(data);
    return hash.digest('hex');
}

export function generateUserToken(username: string, email: string, passwordHash: string): string {
    return hash(username + '.' + email + '@' + passwordHash + '#' + Date.now() + '&' + randomInt(1000000));
}

export function encodeSvgToBase64(svg: string): string {
    return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
}

export function generateTfaToken(userId: number, pendingTfas: { [index: string]: number; }): string {
    const pendingTfaKeys = Object.keys(pendingTfas);
    for(const t of pendingTfaKeys)
        if(pendingTfas[t] == userId) return t;
    function alreadyInUse(tfaToken: string): boolean {
        return pendingTfas[tfaToken] != undefined;
    }
    let tfaToken: string;
    do {
        tfaToken = hash('2FAToken:' + userId + '.' + Date.now() + '&' + randomInt(1000000));
    } while(alreadyInUse(tfaToken));
    return tfaToken;
}