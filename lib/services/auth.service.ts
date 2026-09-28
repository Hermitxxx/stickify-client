import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Retrieves the currently authenticated session on the server.
 * Returns null if the user is unauthenticated.
 */
export async function getServerSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error: unknown) {
    // Next.js uses internal digest errors for dynamic server usage and redirects
    const digest = (error as { digest?: string })?.digest;
    if (digest === "DYNAMIC_SERVER_USAGE" || digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Failed to retrieve server session:", error);
    return null;
  }
}

/**
 * Enforces authentication on a Server Component or route.
 * Redirects unauthenticated users to /login.
 */
export async function requireAuth(callbackUrl?: string) {
  const session = await getServerSession();
  if (!session) {
    const destination = callbackUrl
      ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/login";
    redirect(destination);
  }
  return session;
}

/**
 * Redirects already authenticated users away from auth pages (login/register).
 */
export async function redirectIfAuthenticated(destination = "/") {
  const session = await getServerSession();
  if (session) {
    redirect(destination);
  }
}
