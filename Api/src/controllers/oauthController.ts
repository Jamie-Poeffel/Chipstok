import { RequestHandler, Request, Response } from "express";
import { OAuthConfig } from "../config/oauth";

interface AuthQuery {
    client_id: string;
    redirect_uri: string;
    response_type: string;
    scope?: string;
    state?: string;
}

export const Authorize: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { client_id, redirect_uri, response_type, scope, state } = req.query as unknown as AuthQuery;

    if (!client_id || !redirect_uri || !response_type) {
        res.status(400).json({ error: "Missing required parameters" });
        return;
    }

    const isValidClient = client_id === OAuthConfig.clientId;
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
}