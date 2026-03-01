import { Filter } from "bad-words";

// Initialize profanity filter
const profanityFilter = new Filter();

// Add custom words to filter
profanityFilter.addWords(
  "hitler",
  "nazi",
  "porn",
  "sex",
  "rape",
  "kill",
  "death",
  "drug",
  "cocaine",
  "heroin",
  "meth",
  "weed",
  "cannabis",
  "fuckyou",
  "yourmom",
  "wiener",
  "weiner",
  "irapeyourmom",
);

// Reserved usernames (system routes + common tech terms)
const RESERVED_USERNAMES = [
  // System routes
  "admin",
  "api",
  "dashboard",
  "settings",
  "submit",
  "profile",
  "login",
  "signup",
  "logout",
  "auth",
  "app",
  "test",
  "demo",
  "support",
  "help",
  "about",
  "terms",
  "privacy",
  "contact",
  "blog",
  "docs",
  "status",
  "billing",
  "account",
  "user",
  "root",
  "system",
  "config",
  "public",
  "static",
  "assets",
  "webhooks",
  "callback",
  "oauth",
  "cdn",
  "storage",
  "backup",

  // Tech terms that might confuse users
  "mongodb",
  "prisma",
  "postgres",
  "mysql",
  "redis",
  "firebase",
  "vercel",
  "nextjs",
  "react",
  "typescript",
  "javascript",
  "api-docs",
  "swagger",
  "graphql",
  "rest",
  "webhook",

  // Common names that look like system routes
  "home",
  "index",
  "main",
  "default",
  "new",
  "edit",
  "delete",
  "create",
  "update",
  "list",
  "view",
  "show",
  "search",
];

/**
 * Sanitize and validate username from URL
 * Returns sanitized username or null if invalid
 */
export function sanitizeUsername(username: string): string | null {
  try {
    // 1. Decode URL encoding (handles %20, etc.)
    let decoded = decodeURIComponent(username);

    // 2. Trim whitespace and convert to lowercase
    decoded = decoded.trim().toLowerCase();

    // 3. Check length (3-20 characters)
    if (decoded.length < 3 || decoded.length > 20) {
      return null;
    }

    // 4. Check format (only letters, numbers, hyphens, underscores)
    if (!/^[a-z0-9_-]+$/.test(decoded)) {
      return null;
    }

    // 5. Must start with letter or number (not special char)
    if (!/^[a-z0-9]/.test(decoded)) {
      return null;
    }

    // 6. No consecutive special characters
    if (/[-_]{2,}/.test(decoded)) {
      return null;
    }

    // 7. Check if reserved
    if (RESERVED_USERNAMES.includes(decoded)) {
      return null;
    }

    // 8. Profanity check
    if (profanityFilter.isProfane(decoded)) {
      return null;
    }

    return decoded;
  } catch {
    // If decoding fails, invalid username
    return null;
  }
}

/**
 * Validate username when user is creating/changing it
 * Returns validation result with error message
 */
export function validateUsername(username: string): {
  valid: boolean;
  error?: string;
} {
  // Length check
  if (username.length < 3) {
    return { valid: false, error: "Username must be at least 3 characters" };
  }

  if (username.length > 20) {
    return { valid: false, error: "Username must be at most 20 characters" };
  }

  // Format check
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return {
      valid: false,
      error:
        "Username can only contain letters, numbers, hyphens, and underscores",
    };
  }

  // Start character
  if (!/^[a-zA-Z0-9]/.test(username)) {
    return {
      valid: false,
      error: "Username must start with a letter or number",
    };
  }

  // Consecutive special chars
  if (/[-_]{2,}/.test(username)) {
    return {
      valid: false,
      error: "Username cannot have consecutive hyphens or underscores",
    };
  }

  // Reserved check
  if (RESERVED_USERNAMES.includes(username.toLowerCase())) {
    return { valid: false, error: "This username is reserved" };
  }

  // Profanity check
  if (profanityFilter.isProfane(username)) {
    return {
      valid: false,
      error: "Username contains inappropriate language",
    };
  }

  return { valid: true };
}
