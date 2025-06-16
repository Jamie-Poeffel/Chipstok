import { RequestHandler, Request, Response } from "express";
import { OAuthConfigs } from "../config/oauth";
import { config } from "dotenv";
import { generateCharString } from "../services/oAuthService";
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

    const checkcli = generateCharString(new Date());

    if (client_id !== checkcli) {
        res.status(400).json({ error: "Invalid client_id" });
        return;
    }

    if (!client_id || !redirect_uri || !response_type) {
        res.status(400).json({ error: "Missing required parameters" });
        return;
    }

    const isValidRedirectUri = OAuthConfigs.some(config => config.redirectUrl === redirect_uri);

    if (!isValidRedirectUri) {
        res.status(400).json({ error: "Invalid redirect_uri" });
        return;
    }

    const isValidResponseType = response_type === "code";

    if (!isValidResponseType) {
        res.status(400).json({ error: "Invalid response_type" });
        return;
    }

    // Optionally, you can perform additional checks here, such as verifying the user's permissions or scope

    res.redirect(`${process.env.FRONTEND_URL}/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}&state=${state}`);
}