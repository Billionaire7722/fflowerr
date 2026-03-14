const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3100";

export const API_BASE_URL = rawBaseUrl.replace(/\/$/, "");
