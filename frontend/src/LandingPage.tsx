import './App.css'

const navItems: string[] = []

function LandingPage() {
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

          <button type="button" className="signin-button">
            Sign in
          </button>
        </header>

        <main className="landing-main">
          <div className="hero-scene">
            <div className="text-banner">
              <h1>Bakehouse Express</h1>
              <p>Batch it. Track it. Sell it.</p>
            </div>

          </div>

          <aside className="signup-card" aria-label="Sign Up form">
            <h2>
              Welcome to <span>BakeHouse Express</span>
            </h2>

            <label className="field-group">
              <span>Email</span>
              <input type="email" aria-label="Email" />
            </label>

            <label className="field-group">
              <span>Password</span>
              <input type="password" aria-label="Password" />
            </label>

            <label className="field-group">
              <span>Confirm password</span>
              <input type="password" aria-label="Confirm password" />
            </label>

            <button type="button" className="submit-button">
              Sign up
            </button>

            <p className="login-link">
              Already have an account? <a href="#">Sign in</a>
            </p>
          </aside>
        </main>
      </div>
    </div>
  )
}

export default LandingPage
