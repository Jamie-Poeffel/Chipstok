interface AuthConfig {
    redirectUrl: string;
}

export const OAuthConfigs: AuthConfig[] = [
    {
        redirectUrl: "http://localhost:3000/auth/oauth/callback",
    }
];
