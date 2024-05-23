/**
 * List of public routes
 * These routes are accessible without authentication
 * @type {string[]}
 */
export const publicRoutes: string[] = ["/"];

/**
 * List of routes used for authentication
 * These routes will redirect logged in users to the settings page
 * @type {string[]}
 */
export const authRoutes: string[] = ["/auth/signin", "/auth/signup"];

/**
 * Prefix for API routes
 * @type {string}
 */
export const apiAuthPrefix: string = "/api/auth";

/**
 * Default redirect after login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/settings";
