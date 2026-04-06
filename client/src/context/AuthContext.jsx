import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 🔥 Check auth on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          credentials: 'include', // 🔥 CRITICAL
        });

        if (!res.ok) {
          setUser(null);
        } else {
          const data = await res.json();
          setUser(data.data);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [API_URL]);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // 🔥 CRITICAL
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error('Login failed');
    }

    // After login, fetch user
    const userRes = await fetch(`${API_URL}/api/auth/me`, {
      credentials: 'include',
    });

    const userData = await userRes.json();
    setUser(userData.data);
  };

  const register = async (name, email, password, role) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password, role }),
    });

    if (!res.ok) {
      throw new Error('Registration failed');
    }

    const userRes = await fetch(`${API_URL}/api/auth/me`, {
      credentials: 'include',
    });

    const userData = await userRes.json();
    setUser(userData.data);
  };

  const logout = async () => {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        authLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
