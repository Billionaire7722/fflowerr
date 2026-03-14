const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3100";

export const API_BASE_URL = rawBaseUrl.replace(/\/$/, "");
