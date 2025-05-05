"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authorize = void 0;
const oauth_1 = require("../config/oauth");
const dotenv_1 = require("dotenv");
const oAuthService_1 = require("../services/oAuthService");
(0, dotenv_1.config)();
const Authorize = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { client_id, redirect_uri, response_type, scope, state } = req.query;
    const checkcli = (0, oAuthService_1.generateCharString)(new Date());
    if (client_id !== checkcli) {
        res.status(400).json({ error: "Invalid client_id" });
        return;
    }
    if (!client_id || !redirect_uri || !response_type) {
        res.status(400).json({ error: "Missing required parameters" });
        return;
    }
    const isValidRedirectUri = oauth_1.OAuthConfigs.some(config => config.redirectUrl === redirect_uri);
    if (!isValidRedirectUri) {
        res.status(400).json({ error: "Invalid redirect_uri" });
        return;
    }
    const config = oauth_1.OAuthConfigs.find(cfg => cfg.clientId === client_id && cfg.redirectUrl === redirect_uri);
    if (!config) {
        res.status(400).json({ error: "Invalid client_id or redirect_uri" });
        return;
    }
    const isValidResponseType = response_type === "code";
    if (!isValidResponseType) {
        res.status(400).json({ error: "Invalid response_type" });
        return;
    }
    // Optionally, you can perform additional checks here, such as verifying the user's permissions or scope
    res.redirect(`${process.env.FRONTEND_URL}/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}&state=${state}`);
});
exports.Authorize = Authorize;
