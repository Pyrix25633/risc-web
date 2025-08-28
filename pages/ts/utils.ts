export type Response = { [index: string]: any; };
export type Success = (res: Response) => void;
export type StatusCode = { [index: number]: (req: JQueryXHR, message: string, error: string) => void; };

function navigateToErrorPage(req: JQueryXHR): void {
    window.location.href = '/error?code=' + req.status + '&message=' + req.statusText;
}

export const pendingActionKey = 'pendingAction';

export const defaultStatusCode: StatusCode = {
    400: (req: JQueryXHR): void => {
        navigateToErrorPage(req);
    },
    401: (): void => {
        localStorage.setItem(pendingActionKey, window.location.pathname);
        window.location.href = '/login';
    },
    403: (req: JQueryXHR): void => {
        navigateToErrorPage(req);
    },
    404: (req: JQueryXHR): void => {
        navigateToErrorPage(req);
    },
    405: (req: JQueryXHR): void => {
        navigateToErrorPage(req);
    },
    422: (req: JQueryXHR): void => {
        navigateToErrorPage(req);
    },
    500: (req: JQueryXHR): void => {
        navigateToErrorPage(req);
    }
};

export class RequireNonNull {
    static getElementById(id: string): HTMLElement {
        const element = document.getElementById(id);
        if(element != null) return element;
        throw new Error('No element found with id: ' + id);
    }

    static parse<T>(value: T | null): T {
        if(value == null) throw new Error('Null not allowed');
        return value;
    }
}

export class Auth {
    public static readonly cookieName = 'risc-web-auth';

    static getCookie(): string {
        const match = document.cookie.match(new RegExp(Auth.cookieName + "=(.+?)(?:;|$)"));
        if(match == null)
            throw new Error('Auth Cookie not found!');
        return match[1];
    }

    static async validateToken(): Promise<void> {
        return new Promise((resolve): void => {
            $.ajax({
                url: '/api/auth/validate-token',
                method: 'GET',
                success: (res: {valid: boolean}) => {
                    if(res.valid)
                        resolve();
                    else {
                        localStorage.setItem(pendingActionKey, window.location.pathname);
                        window.location.href = '/login';
                    }
                },
                statusCode: defaultStatusCode
            });
        });
    }
}