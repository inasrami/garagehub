import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, setupError, getClient } from '../lib/supabase';
import { errorMessage } from '../utils/errors';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase) {
      setError(setupError);
      setLoading(false);
      return;
    }
    let active = true;
    let eventVersion = 0;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Keep this callback synchronous; SDK calls inside it can deadlock.
      eventVersion += 1;
      if (active) {
        setUser(session?.user || null);
        setError('');
        setLoading(false);
      }
    });
    const initialVersion = eventVersion;
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active || eventVersion !== initialVersion) return;
      if (sessionError) setError(errorMessage(sessionError));
      setUser(data.session?.user || null);
      setLoading(false);
    }).catch(sessionError => {
      if (active && eventVersion === initialVersion) {
        setError(errorMessage(sessionError));
        setLoading(false);
      }
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function login(email, password) {
    const { data, error: authError } = await getClient().auth.signInWithPassword({ email, password });
    if (authError) throw authError;
    setUser(data.user);
    setError('');
    return data;
  }

  async function register(email, password, displayName) {
    const { data, error: authError } = await getClient().auth.signUp({
      email, password,
      options: { data: { display_name: displayName }, emailRedirectTo: `${window.location.origin}/login` },
    });
    if (authError) throw authError;
    if (data.session) setUser(data.user);
    return data;
  }

  async function logout() {
    const { error: authError } = await getClient().auth.signOut({ scope: 'local' });
    if (authError) throw authError;
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
