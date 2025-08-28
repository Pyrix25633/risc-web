import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import fs from 'fs';
import helmet from 'helmet';
import http from 'http';
import https from 'https';
import path from 'path';
import { getTfaGenerateKey, getTfaValidateCode, getValidateToken, postLogin, postLoginTfa, postLogout, postRegenerateToken } from './lib/api/auth';
import { getConfirmUsernameFeedback, getLoginUsernameFeedback, getRegisterEmailFeedback, getRegisterUsernameFeedback } from './lib/api/feedbacks';
import { getSettings, getSettingsCustomization, getSettingsId, patchSettings } from './lib/api/settings';
import { postTempUser, postTempUserConfirm } from './lib/api/temp-users';
import { settings } from './lib/settings';

const main: Express = express();
const upgradeMain: Express = express();

main.set('trust proxy', true);
main.use(cookieParser());
main.use(bodyParser.urlencoded({ extended: true }));
main.use(bodyParser.json({ limit: '6mb' }));
main.use(cors());
main.use(helmet());
main.use(helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
        "default-src": ["'self'"],
        "base-uri": "'self'",
        "font-src": ["'self'", "https:"],
        "frame-ancestors": ["'self'"],
        "img-src": ["'self'", "data:"],
        "object-src": ["'none'"],
        "script-src": ["'self'", "https:"],
        "script-src-attr": "'none'",
        "style-src": ["'self'", "https:", "data:", "'unsafe-inline'"],
    }
}));
main.use('/css', express.static('./pages/css'));
main.use('/js', express.static('./pages/js'));
main.use('/img', express.static('./pages/img'));
main.use('/font', express.static('./pages/font'));
main.use('/pfps', express.static('./pfps'));
main.use('/chatLogos', express.static('./chatLogos'));

// --api-- //

// feedbacks //

main.get('/api/feedbacks/register-username', getRegisterUsernameFeedback);

main.get('/api/feedbacks/register-email', getRegisterEmailFeedback);

main.get('/api/feedbacks/confirm-username', getConfirmUsernameFeedback);

main.get('/api/feedbacks/login-username', getLoginUsernameFeedback);

// temp-users //

main.post('/api/temp-users', postTempUser);

main.post('/api/temp-users/:username/confirm', postTempUserConfirm);

// auth //

main.get('/api/auth/validate-token', getValidateToken);

main.post('/api/auth/login', postLogin);

main.post('/api/auth/login-tfa', postLoginTfa);

main.get('/api/auth/tfa/generate-key', getTfaGenerateKey);

main.get('/api/auth/tfa/validate-code', getTfaValidateCode);

main.post('/api/auth/logout', postLogout);

main.post('/api/auth/regenerate-token', postRegenerateToken);

// settings //

main.get('/api/settings', getSettings);

main.patch('/api/settings', patchSettings);

main.get('/api/settings/customization', getSettingsCustomization);

main.get('/api/settings/id', getSettingsId);

// --server-- //

if(settings.https.port != null) {
    const options = {
        key: fs.readFileSync(path.resolve(__dirname, settings.https.key)),
        cert: fs.readFileSync(path.resolve(__dirname, settings.https.cert)),
        passphrase: settings.https.passphrase
    };
    const server = https.createServer(options, main);
    server.listen(settings.https.port, (): void => {
        console.log('Server listening on Port ' + settings.https.port);
    });
    upgradeMain.all('*', (req, res): void => {
        const port = settings.production ? '' : (':' + settings.https.port);
        res.redirect(301, 'https://' + req.hostname + port + req.url);
    });
    const upgradeServer = http.createServer(upgradeMain);
    upgradeServer.listen(settings.https.upgradePort, (): void => {
        console.log('Upgrade Server listening on Port ' + settings.https.upgradePort);
    });
}
else {
    const server = http.createServer(main);
    server.listen(settings.https.upgradePort, (): void => {
        console.log('Server listening on Port ' + settings.https.upgradePort);
    });
}

// --pages-- //

main.get('/register', (req: Request, res: Response): void => {
    res.sendFile(path.resolve(__dirname, './pages/register.html'));
});

main.get('/terms-and-conditions', (req: Request, res: Response): void => {
    res.sendFile(path.resolve(__dirname, './pages/terms-and-conditions.html'));
});

main.get('/temp-users/:username/confirm', (req: Request, res: Response): void => {
    res.sendFile(path.resolve(__dirname, './pages/confirm.html'));
});
main.get('/confirm', (req: Request, res: Response): void => {
    res.sendFile(path.resolve(__dirname, './pages/confirm.html'));
});

main.get('/login', (req: Request, res: Response): void => {
    res.sendFile(path.resolve(__dirname, './pages/login.html'));
});

main.get('/settings', (req: Request, res: Response): void => {
    res.sendFile(path.resolve(__dirname, './pages/settings.html'));
});

main.get('/', (req: Request, res: Response): void => {
    res.sendFile(path.resolve(__dirname, './pages/index.html'));
});


main.get('/error', (req: Request, res: Response): void => {
    res.sendFile(path.resolve(__dirname, './pages/error.html'));
})