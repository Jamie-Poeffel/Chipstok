import { RequestHandler, Request, Response } from "express";
import { OAuthConfig } from "../config/oauth";
import { config } from "dotenv";
config();

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

    res.redirect(`${process.env.FRONTEND_URL}/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}&state=${state}`);
}