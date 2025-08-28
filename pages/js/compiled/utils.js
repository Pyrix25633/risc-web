function navigateToErrorPage(req) {
    window.location.href = '/error?code=' + req.status + '&message=' + req.statusText;
}
export const pendingActionKey = 'pendingAction';
export const defaultStatusCode = {
    400: (req) => {
        navigateToErrorPage(req);
    },
    401: () => {
        localStorage.setItem(pendingActionKey, window.location.pathname);
        window.location.href = '/login';
    },
    403: (req) => {
        navigateToErrorPage(req);
    },
    404: (req) => {
        navigateToErrorPage(req);
    },
    405: (req) => {
        navigateToErrorPage(req);
    },
    422: (req) => {
        navigateToErrorPage(req);
    },
    500: (req) => {
        navigateToErrorPage(req);
    }
};
export class RequireNonNull {
    static getElementById(id) {
        const element = document.getElementById(id);
        if (element != null)
            return element;
        throw new Error('No element found with id: ' + id);
    }
    static parse(value) {
        if (value == null)
            throw new Error('Null not allowed');
        return value;
    }
}
export class Auth {
    static getCookie() {
        const match = document.cookie.match(new RegExp(Auth.cookieName + "=(.+?)(?:;|$)"));
        if (match == null)
            throw new Error('Auth Cookie not found!');
        return match[1];
    }
    static async validateToken() {
        return new Promise((resolve) => {
            $.ajax({
                url: '/api/auth/validate-token',
                method: 'GET',
                success: (res) => {
                    if (res.valid)
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
Auth.cookieName = 'risc-web-auth';
