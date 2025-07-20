import nextConfig from "../next.config.mjs";

export const  urlenv = nextConfig.env?.API_URL || 'http://localhost:8000/api/v1/';  