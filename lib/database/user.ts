import { TempUser, User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { generateUserToken } from "../random";
import { settings } from "../settings";
import { NotFound, UnprocessableContent } from "../web/response";
import { prisma } from "./prisma";

export async function createUserFromTempUser(tempUser: TempUser): Promise<User> {
    try {
        return await prisma.user.create({
            data: {
                username: tempUser.username,
                email: tempUser.email,
                passwordHash: tempUser.passwordHash,
                token: generateUserToken(tempUser.username, tempUser.email, tempUser.passwordHash)
            }
        });
    } catch(e: any) {
        throw new UnprocessableContent();
    }
}

export async function isUserUsernameInUse(username: string): Promise<boolean> {
    return (await prisma.user.count({
        where: {
            username: username
        }
    })) != 0;
}

export async function isUserEmailInUse(email: string): Promise<boolean> {
    return (await prisma.user.count({
        where: {
            email: email
        }
    })) != 0;
}

export async function findUser(id: number): Promise<User> {
    const user: User | null = await prisma.user.findUnique({
        where: {
            id: id
        }
    });
    if(user == null)
        throw new NotFound();
    return user;
}

type UserInfo = {
    username: string;
    status: string;
    online: boolean;
    lastOnline: Date;
    pfp: Buffer;
};

export async function findUserWhereUsername(username: string): Promise<User> {
    const user: User | null = await prisma.user.findUnique({
        where: {
            username: username
        }
    });
    if(user == null)
        throw new NotFound();
    return user;
}

export async function findUserToken(id: number): Promise<{ token: string; }> {
    const partialUser = await prisma.user.findUnique({
        select: {
            token: true
        },
        where: {
            id: id
        }
    });
    if(partialUser == null)
        throw new NotFound();
    return partialUser;
}

export async function findUserTokenAndCustomization(id: number): Promise<{ token: string; customization: Customization }> {
    const partialUser = await prisma.user.findUnique({
        select: {
            token: true
        },
        where: {
            id: id
        }
    });
    if(partialUser == null)
        throw new NotFound();
    return partialUser as { token: string; customization: Customization };
}

export async function findUserTokenAndPasswordHash(id: number): Promise<{ token: string; passwordHash: string; }> {
    const partialUser = await prisma.user.findUnique({
        select: {
            token: true,
            passwordHash: true
        },
        where: {
            id: id
        }
    });
    if(partialUser == null)
        throw new NotFound();
    return partialUser;
}

export async function findUserTokenAndUsername(id: number): Promise<{ token: string; username: string; }> {
    const partialUser = await prisma.user.findUnique({
        select: {
            token: true,
            username: true
        },
        where: {
            id: id
        }
    });
    if(partialUser == null)
        throw new NotFound();
    return partialUser;
}

export type Customization = {
    compactMode: boolean;
    condensedFont: boolean;
    aurebeshFont: boolean;
    sharpMode: boolean;
};

export async function updateUserSettings(id: number, username: string, email: string, sessionDuration: number): Promise<User> {
    try {
        const user = await prisma.user.update({
            data: {
                username: username,
                email: email,
                sessionDuration: sessionDuration
            },
            where: {
                id: id
            }
        });
        return user;
    } catch(e: any) {
        throw new UnprocessableContent();
    }
}

export async function updateUserPassword(id: number, password: string): Promise<User> {
    return prisma.user.update({
        data: {
            passwordHash: bcrypt.hashSync(password, settings.bcrypt.rounds)
        },
        where: {
            id: id
        }
    });
}

export async function updateUserTfaKey(id: number, tfaKey: string | null): Promise<User> {
    return prisma.user.update({
        data: {
            tfaKey: tfaKey
        },
        where: {
            id: id
        }
    });
}

export async function regenerateUserToken(user: User): Promise<User> {
    return prisma.user.update({
        data: {
            token: generateUserToken(user.username, user.email, user.passwordHash)
        },
        where: {
            id: user.id
        }
    });
}