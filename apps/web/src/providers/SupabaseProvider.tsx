import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type AuthState =
  | { status: "loading" }
  | { status: "ready"; token: string; expiresAt: number }
  | { status: "error"; message: string }
  | { status: "developer"; message: string };

type SupabaseContextValue = {
  supabase: SupabaseClient | null;
  authState: AuthState;
  refreshAuth: (force?: boolean) => Promise<void>;
  accessToken: string | null;
};

const STORAGE_KEY = "supabase.session.token";

const SupabaseContext = createContext<SupabaseContextValue | undefined>(undefined);

function readCachedToken() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { token?: string; expiresAt?: number };
    if (!parsed?.token || !parsed.expiresAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCachedToken(token: string, expiresAt: number) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ token, expiresAt }));
  } catch {
    // ignore
  }
}

function clearCachedToken() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const supabaseUrl = (import.meta.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const supabaseAnonKey = (import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();
  const backendBase = (import.meta.env.NEXT_PUBLIC_BACKEND_URL ?? "").trim();
  const authEndpoint = backendBase ? `${backendBase.replace(/\/+$/, "")}/api/tma-auth` : null;

  const [authState, setAuthState] = useState<AuthState>({ status: "loading" });
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const establishingRef = useRef<Promise<void> | null>(null);

  const establishAuth = useCallback(
    async (force = false) => {
      if (establishingRef.current) {
        try {
          await establishingRef.current;
        } catch {
          // ignore, the awaiting call will set error state
        }
        if (!force) return;
      }

      const runner = (async () => {
        if (!supabaseUrl || !supabaseAnonKey) {
          setAuthState({
            status: "error",
            message: "Supabase environment variables are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
          });
          return;
        }

        if (!authEndpoint) {
          setAuthState({
            status: "error",
            message: "Auth endpoint is not configured. Provide NEXT_PUBLIC_BACKEND_URL."
          });
          return;
        }

        if (!force) {
          const cached = readCachedToken();
          if (cached && cached.expiresAt - Date.now() > 5_000) {
            setAuthState({ status: "ready", token: cached.token, expiresAt: cached.expiresAt });
            return;
          }
        }

        if (typeof window === "undefined") {
          setAuthState({ status: "loading" });
          return;
        }

        const initData = window.Telegram?.WebApp?.initData ?? "";
        const urlToken = new URLSearchParams(window.location.search).get("token") ?? "";

        let requestPayload: Record<string, string> | null = null;
        if (initData && initData.trim().length > 0) {
          console.info("Auth path: initData");
          requestPayload = { initData };
        } else if (urlToken && urlToken.trim().length > 0) {
          console.info("Auth path: url-token");
          const trimmedToken = urlToken.trim();
          requestPayload = { token: trimmedToken };
          try {
            const url = new URL(window.location.href);
            url.searchParams.delete("token");
            const cleanedSearch = url.searchParams.toString();
            const cleanUrl = `${url.pathname}${cleanedSearch ? `?${cleanedSearch}` : ""}${url.hash}`;
            window.history.replaceState(null, "", cleanUrl);
          } catch (error) {
            console.debug("Failed to clean token param from URL:", error);
          }
        } else {
          console.warn("Auth path: none (no initData or token)");
          setAuthState({
            status: "developer",
            message:
              "Telegram WebApp initData topilmadi. Iltimos, mini-appni Telegram orqali ishga tushiring yoki token bilan oching."
          });
          clearCachedToken();
          return;
        }

        setAuthState({ status: "loading" });

        try {
          const response = await fetch(authEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(requestPayload)
          });

          if (response.status === 401) {
            clearCachedToken();
            setAuthState({
              status: "error",
              message: "Auth server rejected the provided credentials (401)."
            });
            return;
          }

          if (!response.ok) {
            const text = await response.text();
            throw new Error(text || `Auth request failed with status ${response.status}`);
          }

          const payload: {
            access_token?: string;
            token_type?: string;
            expires_in?: number;
          } = await response.json();

          if (!payload?.access_token) {
            throw new Error("Auth response did not include access_token.");
          }

          const expiresIn = typeof payload.expires_in === "number" ? payload.expires_in : 3600;
          const expiresAt = Date.now() + expiresIn * 1000;

          writeCachedToken(payload.access_token, expiresAt);

          setAuthState({
            status: "ready",
            token: payload.access_token,
            expiresAt
          });
        } catch (error) {
          clearCachedToken();
          const message =
            error instanceof Error ? error.message : "Unexpected authentication error. Please try again.";
          setAuthState({
            status: "error",
            message
          });
        }
      })();

      establishingRef.current = runner;
      await runner.finally(() => {
        establishingRef.current = null;
      });
    },
    [authEndpoint, supabaseAnonKey, supabaseUrl]
  );

  useEffect(() => {
    void establishAuth(false);
  }, [establishAuth]);

  useEffect(() => {
    if (authState.status !== "ready") {
      setClient(null);
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      },
      global: {
        headers: {
          Authorization: `Bearer ${authState.token}`
        }
      }
    });

    setClient(supabase);

    const refreshIn = Math.max(authState.expiresAt - Date.now() - 60_000, 10_000);
    const timer = window.setTimeout(() => {
      void establishAuth(true);
    }, refreshIn);

    return () => {
      window.clearTimeout(timer);
    };
  }, [authState, establishAuth, supabaseAnonKey, supabaseUrl]);

  const value = useMemo<SupabaseContextValue>(
    () => ({
      supabase: client,
      authState,
      accessToken: authState.status === "ready" ? authState.token : null,
      refreshAuth: (force = false) => establishAuth(force)
    }),
    [authState, client, establishAuth]
  );

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
}

