import './App.css'
import loginAsset from './assets/LoginAsset.png'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const navItems: string[] = []

function LandingPage() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password.');
      }

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_role', data.role);

      navigate('/pantry', { replace: true });

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-page-shell">
      <div className="landing-page-card">
        <header className="landing-topbar">
          <div className="brand-block" aria-label="Bakery Shop brand">
            <div className="brand-icon" aria-hidden="true">
              <span className="brand-icon-inner" />
            </div>
            <div className="brand-name">
              <span>BAKEHOUSE EXPRESS</span>
            </div>
          </div>

          {navItems.length > 0 && (
            <nav className="main-nav" aria-label="Main navigation">
              {navItems.map((item) => (
                <a key={item} href="#" className={item === 'Menu' ? 'active' : ''}>
                  {item}
                </a>
              ))}
            </nav>
          )}
        </header>

        <main
          className="landing-main"
          style={{
            backgroundImage: `linear-gradient(rgba(246, 237, 222, 0.62), rgba(230, 216, 198, 0.72)), url("${loginAsset}")`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        >
          <div className="hero-scene">
            <div className="text-banner">
              <h1>Bakehouse Express</h1>
              <p>Batch it. Track it. Sell it.</p>
            </div>
          </div>

          <aside className="signup-card" aria-label="Login form">
            <h2>
              Welcome to <span>BakeHouse Express</span>
            </h2>

            {/* Error Message Box */}
            {error && (
              <div style={{ color: '#dc2626', backgroundColor: '#fef2f2', padding: '0.5rem', borderRadius: '4px', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <label className="field-group">
                <span>Email</span>
                <input 
                  type="email" 
                  aria-label="Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Please enter your email"
                  required 
                />
              </label>

              <label className="field-group">
                <span>Password</span>
                <input 
                  type="password" 
                  aria-label="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Please enter your password"
                  required 
                />
              </label>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </form>

            <p className="login-link" style={{ marginTop: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>
              Don't have an account? Contact your Admin.
            </p>
          </aside>
        </main>
      </div>
    </div>
  );
}

export default LandingPage
