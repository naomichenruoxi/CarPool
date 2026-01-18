import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import api from "@/lib/axios";
import { User } from "@supabase/supabase-js";

export type UserRole = "driver" | "carpooler" | null;

interface UserContextType {
  user: User | null;
  role: UserRole;
  loading: boolean;
  setRole: (role: UserRole) => void;
  signInWithGoogle: () => Promise<void>;
  mockLogin: (userId: string, name: string) => Promise<void>; // Dev only
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      // 1. Check strict Supabase session
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        syncUserToBackend(session.user);
      } else {
        // 2. Fallback to mock session if dev
        const mockToken = localStorage.getItem('mock_token');
        if (mockToken && mockToken.startsWith('mock-token-')) {
          const userId = mockToken.replace('mock-token-', '');
          // Reconstruct fake user
          const fakeUser = {
            id: userId,
            aud: "authenticated",
            role: "authenticated",
            email: `${userId.split('-').pop()}@test.com`,
            app_metadata: { provider: "email" },
            user_metadata: { full_name: userId.includes('driver') ? 'Driver' : 'Passenger' }, // Simplification
            created_at: new Date().toISOString(),
          } as User;
          setUser(fakeUser);
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // If Supabase signs in, it takes precedence
      if (session?.user) {
        setUser(session.user);
        syncUserToBackend(session.user);
        // Clear mock token if real login happens?
        // localStorage.removeItem('mock_token'); 
      } else {
        // If signed out, check if we still have mock token? 
        // Usually strict signout clears everything.
        // But here, if we just reload, onAuthStateChange might fire INITIAL_SESSION with null.
        // Let's rely on checkSession for initial load.
        // IF explicit SIGN_OUT event, we handle it.
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const syncUserToBackend = async (authUser: User) => {
    try {
      // Sync user to our backend (creates user if not exists)
      await api.post('/users/sync', {
        name: authUser.user_metadata.full_name || authUser.email,
        isDriver: false // Default, user can update profile later
      });
    } catch (err) {
      console.error("Failed to sync user", err);
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      }
    });
    if (error) console.error("Login failed:", error);
  };

  const mockLogin = async (userId: string, name: string) => {
    // Fake the Supabase session in local storage so app thinks we are logged in
    // This requires the backend to accept "mock-token-" via middleware (which we added)
    const fakeToken = `mock-token-${userId}`;
    const fakeUser = {
      id: userId,
      aud: "authenticated",
      role: "authenticated",
      email: `${userId.split('-').pop()}@test.com`,
      confirmed_at: new Date().toISOString(),
      app_metadata: { provider: "email" },
      user_metadata: { full_name: name },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as User;

    // Manually set session in supabase-js client?
    // Hard to spoof supabase client internal state deeply. 
    // BUT our UserProvider uses `user` state.
    // We can just set our state.
    setUser(fakeUser);
    setLoading(false);

    // Also need to trick backend requests.
    // We normally use `supabase.auth.getSession()` to get token.
    // We might need to intercept api calls? 
    // Or simpler: put fake token in localStorage key that Supabase reads?
    // Supabase key is `sb-<ref>-auth-token`.
    // Actually, `api.ts` (axios) needs the token.

    // Let's modify `src/lib/axios.ts` to read a special mock key if present.
    localStorage.setItem('mock_token', fakeToken);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('mock_token');
    setUser(null);
    setRole(null);
  };

  return (
    <UserContext.Provider value={{ user, role, loading, setRole, signInWithGoogle, mockLogin, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
