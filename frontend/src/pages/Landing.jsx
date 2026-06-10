const Landing = () => {
  return (
    <div className="landing-page-wrapper" style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="text-center px-6" style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: 'clamp(48px, 8vw, 72px)', fontWeight: 600, letterSpacing: '-2px', marginBottom: '24px' }}>
          Supply Chain Management System
        </h1>
        <p style={{ fontSize: '20px', lineHeight: 1.6, color: '#64748b', marginBottom: '40px' }}>
          A comprehensive inventory and supply chain management solution with real-time tracking, 
          demand forecasting, and supplier analytics.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/login">
            <button className="px-8 py-3 rounded-[12px] cursor-pointer border-0 whitespace-nowrap"
              style={{ background: '#111', color: '#fff', fontSize: '16px', fontWeight: 500 }}>
              Sign In
            </button>
          </a>
          <a href="/signup">
            <button className="px-8 py-3 rounded-[12px] cursor-pointer"
              style={{ background: 'transparent', border: '1px solid #e5e5e5', color: '#555', fontSize: '16px', fontWeight: 450 }}>
              Create Account
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Landing;