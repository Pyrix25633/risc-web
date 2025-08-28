import { ApiCallButton, ApiFeedbackInput, BooleanInput, Button, InfoSpan, Input, InputElement, InputSection, PasswordInput, StructuredForm } from "./form.js";
import { defaultStatusCode } from "./utils.js";
const idInfoSpan = new InfoSpan('Id:');
const usernameInput = new ApiFeedbackInput('username', 'text', 'Username:', 'You can change your Username', '/api/feedbacks/register-username');
const emailInput = new ApiFeedbackInput('email', 'text', 'Email:', 'You can change your Email', '/api/feedbacks/register-email');
class InfoSection extends InputSection {
    constructor() {
        super('Info', [idInfoSpan, usernameInput, emailInput]);
    }
    async parse() {
        return {};
    }
}
class SessionDurationInput extends Input {
    constructor() {
        super('sessionDuration', 'number', 'Session Duration:', 'You can change your Session Duration (Days)');
        this.input.classList.add('small');
    }
    async parse() {
        const sessionDuration = parseInt(this.input.value);
        if (sessionDuration == this.precompiledValue) {
            this.precompile(sessionDuration);
            return sessionDuration;
        }
        if (!Number.isSafeInteger(sessionDuration)) {
            this.setError(true, 'Invalid Verification Code!');
            return undefined;
        }
        if (sessionDuration < 5 || sessionDuration > 90) {
            this.setError(true, 'Session Duration must be between 5 and 90 Days!');
            return undefined;
        }
        this.setError(false, 'Valid Session Duration');
        return sessionDuration;
    }
}
class TfaActivationInput extends InputElement {
    constructor() {
        super('tfa-activation');
        this.formOrSection = undefined;
        this.timeout = undefined;
        this.key = undefined;
        this.error = true;
        this.box = document.createElement('div');
        this.box.classList.add('box');
        this.qr = document.createElement('img');
        this.qr.classList.add('rounded');
        this.qr.alt = '2FA QR';
        this.labelText = '2FA Code Test:';
        this.codeInput = document.createElement('input');
        this.codeInput.id = this.id;
        this.codeInput.classList.add('medium');
        this.codeInput.type = 'number';
        this.feedback = document.createElement('span');
        this.feedback.classList.add('text', 'error');
        this.feedback.innerText = 'Input 2FA Code!';
        this.codeInput.addEventListener('keyup', () => {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.parse();
            }, 1000);
        });
        this.codeInput.addEventListener('keydown', () => {
            clearTimeout(this.timeout);
        });
        this.codeInput.addEventListener('focusout', () => {
            clearTimeout(this.timeout);
            this.parse();
        });
        this.codeInput.addEventListener('change', () => {
            this.parse();
        });
        this.show(false);
    }
    appendTo(formOrSection) {
        this.formOrSection = formOrSection;
        const inputFeedback = document.createElement('div');
        inputFeedback.classList.add('box', 'input-feedback');
        const container = document.createElement('div');
        container.classList.add('container', 'label-input');
        const label = document.createElement('label');
        label.htmlFor = this.id;
        label.innerText = this.labelText;
        container.appendChild(label);
        container.appendChild(this.codeInput);
        inputFeedback.appendChild(container);
        inputFeedback.appendChild(this.feedback);
        this.box.appendChild(this.qr);
        this.box.appendChild(inputFeedback);
        formOrSection.appendChild(this.box);
    }
    async parse() {
        const text = this.codeInput.value.replace(' ', '');
        const code = parseInt(this.codeInput.value);
        if (!Number.isSafeInteger(code)) {
            this.setError(true, 'Invalid 2FA Code!');
            return undefined;
        }
        if (text.length != 6) {
            this.setError(true, '6 Digits needed!');
            return undefined;
        }
        return new Promise((resolve) => {
            $.ajax({
                url: '/api/auth/tfa/validate-code',
                method: 'GET',
                data: {
                    tfaKey: this.key,
                    tfaCode: code
                },
                contentType: 'application/json',
                success: (res) => {
                    if (res.valid) {
                        this.setError(false, 'Verified 2FA Code');
                        resolve(code);
                    }
                    else {
                        this.setError(true, 'Wrong 2FA Code!');
                        resolve(undefined);
                    }
                },
                error: () => {
                    this.setError(true, 'Server Unreachable!');
                    resolve(undefined);
                }
            });
        });
    }
    getKey() {
        return this.key;
    }
    setError(error, feedbackText) {
        var _a;
        this.error = error;
        if (this.error)
            this.feedback.classList.replace('success', 'error');
        else
            this.feedback.classList.replace('error', 'success');
        this.feedback.innerText = feedbackText;
        (_a = this.formOrSection) === null || _a === void 0 ? void 0 : _a.validate();
    }
    getError() {
        return this.key != undefined ? this.error : false;
    }
    async show(show) {
        if (show) {
            this.box.style.display = '';
            return new Promise((resolve) => {
                $.ajax({
                    url: '/api/auth/tfa/generate-key',
                    method: 'GET',
                    success: (res) => {
                        this.qr.src = res.tfaQr;
                        this.key = res.tfaKey;
                        resolve();
                    },
                    statusCode: defaultStatusCode
                });
            });
        }
        else {
            this.box.style.display = 'none';
            this.key = undefined;
        }
    }
}
const passwordInput = new PasswordInput('You can change your Password');
const logoutButton = new ApiCallButton('Logout', '/img/logout.svg', 'Logs you out of this Device', '/api/auth/logout', (res) => {
    location.href = '/login';
});
const regenerateTokenButton = new ApiCallButton('Regenerate Token', '/img/logout.svg', 'Logs you out of all Devices', '/api/auth/regenerate-token', (res) => {
    location.href = '/login';
});
const sessionExpirationInfoSpan = new InfoSpan('Session Expiration:');
const sessionDurationInput = new SessionDurationInput();
const tfaInput = new BooleanInput('tfa', '2 Factor Authentication', 'Protects your Account', async (value) => {
    await tfaActivationInput.show(value);
    settingsForm.validate();
});
const tfaActivationInput = new TfaActivationInput();
class SecuritySection extends InputSection {
    constructor() {
        super('Security', [
            passwordInput,
            logoutButton,
            sessionExpirationInfoSpan,
            regenerateTokenButton,
            sessionDurationInput,
            tfaInput,
            tfaActivationInput
        ]);
        this.section.classList.add('warning');
    }
    async parse() {
        return {
            password: await passwordInput.parse()
        };
    }
}
class SettingsForm extends StructuredForm {
    constructor() {
        super('settings-form', '/api/settings', '', [new InfoSection(), new SecuritySection()], new Button('Continue', '/img/continue.svg', true), () => { }, [], 'settings', true);
    }
    precompile(res) {
        idInfoSpan.set(res.id);
        usernameInput.precompile(res.username);
        emailInput.precompile(res.email);
        passwordInput.precompile('');
        sessionDurationInput.precompile(res.sessionDuration);
        sessionExpirationInfoSpan.set(new Date(res.sessionExpiration).toLocaleString('en-ZA'));
        tfaInput.precompile(res.tfa);
    }
    async submit() {
        this.show(false);
        oldPasswordForm.show(true);
    }
    async getData() {
        const data = {
            username: await usernameInput.parse(),
            email: await emailInput.parse(),
            sessionDuration: await sessionDurationInput.parse()
        };
        if (passwordInput.changed()) {
            const password = await passwordInput.parse();
            if (password != undefined)
                data.password = password;
        }
        if (tfaInput.changed()) {
            if (await tfaInput.parse() && tfaActivationInput.getKey() != undefined)
                data.tfaKey = tfaActivationInput.getKey();
            else
                data.tfaKey = null;
        }
        return data;
    }
}
const settingsForm = new SettingsForm();
const oldPasswordInput = new PasswordInput();
const settingsStatusCode = Object.assign({}, defaultStatusCode);
settingsStatusCode[403] = () => {
    oldPasswordInput.setError(true, 'Wrong Password!');
};
class OldPasswordForm extends StructuredForm {
    constructor() {
        super('old-password-form', '/api/settings', 'PATCH', [oldPasswordInput], new Button('Save', '/img/save.svg', true), async (res) => {
            window.location.href = '/';
        }, settingsStatusCode, 'authentication');
    }
    async getData() {
        return JSON.stringify(Object.assign(Object.assign({}, await settingsForm.getData()), { oldPassword: await oldPasswordInput.parse() }));
    }
}
const oldPasswordForm = new OldPasswordForm();
oldPasswordForm.show(false);
