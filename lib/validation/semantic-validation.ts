import { BadRequest } from "../web/response";
import { getInt, getString } from "./type-validation";

const usernameRegex = /^(?:\w|-| ){3,32}$/;
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function getUsername(raw: any): string {
    const parsed = getString(raw);
    if(parsed.match(usernameRegex))
        return parsed;
    throw new BadRequest();
}

export function getEmail(raw: any): string {
    const parsed = getString(raw);
    if(parsed.match(emailRegex))
        return parsed;
    throw new BadRequest();
}

export function getSixDigitCode(raw: any): number {
    const parsed = getInt(raw);
    if(parsed < 100000 || parsed > 999999)
        throw new BadRequest();
    return parsed;
}

export function getToken(raw: any): string {
    const parsed = getString(raw);
    if(parsed.length != 128)
        throw new BadRequest();
    return parsed;
}

export function getSessionDuration(raw: any): number {
    const parsed = getInt(raw);
    if(parsed < 5 || parsed > 90)
        throw new BadRequest();
    return parsed;
}

export function getTfaKey(raw: any): string {
    const parsed = getString(raw);
    if(!parsed.match(/^\w{52}$/))
        throw new BadRequest();
    return parsed;
}

export function getName(raw: any): string {
    const parsed = getString(raw);
    if(parsed.length < 3 || parsed.length > 64)
        throw new BadRequest();
    return parsed;
}

export function getTokenExpiration(raw: any): Date | null {
    if(raw === null)
        return null;
    const parsed = getString(raw);
    if(!parsed.match(/\d{4}\/\d{1,2}\/\d{1,2}/))
        throw new BadRequest();
    const tokenExpiration = new Date(parsed);
    if(tokenExpiration.toString() == 'Invalid Date' || isNaN(tokenExpiration.getTime()))
        throw new BadRequest();
    return tokenExpiration;
}

export function getCode(raw: any): string {
    const parsed = getString(raw);
    if(parsed.length > 65536)
        throw new BadRequest();
    return parsed;
}