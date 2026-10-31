import React, { useState } from 'react';
import { UserProfile } from '../types';
import { supabase } from '../services/supabase';

interface AccountViewProps {
  user: UserProfile | null;
  onUserChange: () => void;
  onToast: (msg: string) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({ user, onUserChange, onToast }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setErrorMsg('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        onToast('Account created! Please check your email or sign in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onToast('Welcome back! Signed in successfully.');
        onUserChange();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onToast('Signed out successfully.');
    onUserChange();
  };

  if (user) {
    return (
      <div style={{ maxWidth: 600 }}>
        <p className="page-eyebrow">Your Account</p>
        <h1 className="page-title">Reader Profile.</h1>
        <p className="page-lede">
          Signed in as <strong>{user.username}</strong>. Your reading progress, bookmarks, and submissions are synced.
        </p>

        <div style={{ background: 'var(--color-surface)', padding: 24, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <strong style={{ fontSize: '1.2rem', display: 'block' }}>{user.username}</strong>
              <small style={{ color: 'var(--color-muted)' }}>Role: {user.role.toUpperCase()}</small>
            </div>
            <span className="badge badge-accent">Authenticated</span>
          </div>

          <div style={{ padding: '16px 0', borderTop: '1px solid var(--color-line)', borderBottom: '1px solid var(--color-line)', marginBottom: 20 }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: 8 }}>
              Account Privileges:
            </p>
            <ul style={{ paddingLeft: 20, fontSize: '0.88rem', color: 'var(--color-ink)', lineHeight: 1.8 }}>
              <li>Cloud synchronization across all your browsers and devices</li>
              <li>Publish and submit visual books for community review</li>
              {user.role === 'admin' && <li><strong>Admin Access:</strong> Moderate and approve submitted books</li>}
            </ul>
          </div>

          <button className="btn btn-danger" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 460 }}>
      <p className="page-eyebrow">Reader Space</p>
      <h1 className="page-title">{isSignUp ? 'Create an Account' : 'Sign In'}</h1>
      <p className="page-lede">
        Sign in to synchronize your reading progress, submit visual books, and access your library anywhere.
      </p>

      <form
        onSubmit={handleAuth}
        style={{
          background: 'var(--color-surface)',
          padding: 24,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-line)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>
            Email Address
          </label>
          <input
            type="email"
            className="search-input"
            style={{ borderRadius: 'var(--radius-sm)' }}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>
            Password
          </label>
          <input
            type="password"
            className="search-input"
            style={{ borderRadius: 'var(--radius-sm)' }}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {errorMsg && (
          <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginBottom: 14 }}>
            {errorMsg}
          </p>
        )}

        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
          {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: 'none', border: 'none', color: 'var(--color-ink)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
        </div>
      </form>
    </div>
  );
};
