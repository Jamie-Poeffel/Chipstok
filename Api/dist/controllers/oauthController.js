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
const Authorize = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { client_id, redirect_uri, response_type, scope, state } = req.query;
    if (!client_id || !redirect_uri || !response_type) {
        res.status(400).json({ error: "Missing required parameters" });
        return;
    }
    const isValidClient = client_id === oauth_1.OAuthConfig.clientId;
    const isValidRedirectUri = true;
    const isValidResponseType = response_type === "code";
    if (!isValidClient) {
        res.status(400).json({ error: "Invalid client_id" });
        return;
    }
    if (!isValidRedirectUri) {
        res.status(400).json({ error: "Invalid redirect_uri" });
        return;
    }
    if (!isValidResponseType) {
        res.status(400).json({ error: "Invalid response_type" });
        return;
    }
    // Optionally, you can perform additional checks here, such as verifying the user's permissions or scope
    // Generate an authorization code and store it in the database with the associated client_id and redirect_uri
    const authorizationCode = "generated_authorization_code"; // Replace with actual code generation logic
    // Redirect the user to the redirect_uri with the authorization code
    const redirectUrl = `${redirect_uri}?code=${authorizationCode}&state=${state}`;
    res.redirect(redirectUrl);
});
exports.Authorize = Authorize;
