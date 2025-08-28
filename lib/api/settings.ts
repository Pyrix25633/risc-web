import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { findUser, findUserTokenAndCustomization, findUserTokenAndPasswordHash, updateUserPassword, updateUserSettings, updateUserTfaKey } from "../database/user";
import { sendSecurityNotification } from "../email";
import { getEmail, getSessionDuration, getTfaKey, getUsername } from "../validation/semantic-validation";
import { getNonEmptyString, getObject, getOrNull, getOrUndefined } from "../validation/type-validation";
import { Forbidden, NoContent, Ok, handleException } from "../web/response";
import { validateToken } from "./auth";

export async function getSettings(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req, findUser);
        new Ok({
            id: user.id,
            username: user.username,
            email: user.email,
            sessionExpiration: user.sessionExpiration,
            sessionDuration: user.sessionDuration,
            tfa: user.tfaKey != null
        }).send(res);
    } catch(e: any) {
        console.error(e);
        handleException(e, res);
    }
}

export async function patchSettings(req: Request, res: Response): Promise<void> {
    try {
        const partialUser = await validateToken(req, findUserTokenAndPasswordHash);
        const body = getObject(req.body);
        const username = getUsername(body.username);
        const email = getEmail(body.email);
        const password = getOrUndefined(body.password, getNonEmptyString);
        const oldPassword = getNonEmptyString(body.oldPassword);
        if(!bcrypt.compareSync(oldPassword, partialUser.passwordHash))
            throw new Forbidden();
        const sessionDuration = getSessionDuration(body.sessionDuration);
        const tfaKey = getOrUndefined(body.tfaKey, (raw: any): string | null => { return getOrNull(raw, getTfaKey); });
        const user = await updateUserSettings(partialUser.id, username, email, sessionDuration);
        if(password != undefined)
            await updateUserPassword(partialUser.id, password);
        if(tfaKey !== undefined)
            await updateUserTfaKey(partialUser.id, tfaKey);
        new NoContent().send(res);
        sendSecurityNotification('settings', user, req);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function getSettingsCustomization(req: Request, res: Response): Promise<void> {
    try {
        const partialUser = await validateToken(req, findUserTokenAndCustomization);
        new Ok({
            ...(partialUser.customization)
        }).send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function getSettingsId(req: Request, res: Response): Promise<void> {
    try {
        const partialUser = await validateToken(req);
        new Ok({
            id: partialUser.id
        }).send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}