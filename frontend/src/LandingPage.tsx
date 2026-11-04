import './App.css'
import LoginAsset from './assets/LoginAsset.png'
import logo from './assets/logo.png'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from './api/auth'


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
      const data = await loginUser(email, password);

      localStorage.setItem('bakehouse_auth_token', data.token);
      localStorage.setItem('bakehouse_user', JSON.stringify(data.user));

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
          <div className="brand-block" aria-label="BakeHouse Express">
            <img className="brand-icon" src={logo} alt="" aria-hidden="true" />
            <div className="brand-name">
              <span>BAKEHOUSE EXPRESS</span>
            </div>
          </div>
        </header>

        <main className="landing-main">
          <div
            className="hero-scene"
            style={{ backgroundImage: `url("${LoginAsset}")` }}
          >
            <div className="text-banner">
              <div className="text-banner-copy">
                <h1>Bakehouse Express</h1>
                <p>Batch it. Track it. Sell it.</p>
              </div>
            </div>
          </div>

          <aside className="signup-card" aria-label="Login form">
            <h2>
              Welcome to <span>BakeHouse Express</span>
            </h2>

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

            <p className="login-link">
              Don't have an account? Contact your Admin.
            </p>
          </aside>
        </main>
      </div>
    </div>
  );
}

export default LandingPage