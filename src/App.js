import React, { useState } from "react";

const TaxEngineApp = () => {
  const [user, setUser] = useState(null);

  const mockLogin = () => {
    setUser({
      id: "123",
      email: "user@example.com",
      name: "John Taxpayer",
    });
  };

  const logout = () => {
    setUser(null);
  };

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #dbeafe, #e0e7ff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          maxWidth: '400px',
          width: '100%',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '32px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: '#2563eb',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'white',
              fontSize: '24px'
            }}>
              📄
            </div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>
              Tax Engine
            </h1>
            <p style={{
              color: '#6b7280',
              margin: '0'
            }}>
              Automated Tax Document Processing
            </p>
          </div>

          <button
            onClick={mockLogin}
            style={{
              width: '100%',
              background: '#2563eb',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '16px',
              marginBottom: '24px'
            }}
            onMouseOver={(e) => e.target.style.background = '#1d4ed8'}
            onMouseOut={(e) => e.target.style.background = '#2563eb'}
          >
            Sign In with Mock Account
          </button>

          <div style={{
            fontSize: '14px',
            color: '#6b7280',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0 0 8px 0' }}>Demo Features:</p>
            <div style={{ textAlign: 'left' }}>
              <div>• Upload W-2 and 1099 documents</div>
              <div>• Automated data extraction</div>
              <div>• 1040 form generation</div>
              <div>• JSON and PDF downloads</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <header style={{
        background: 'white',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{
              fontSize: '24px',
              marginRight: '12px'
            }}>📄</span>
            <h1 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#111827',
              margin: '0'
            }}>
              Tax Engine
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              <span style={{ marginRight: '8px' }}>👤</span>
              {user.name}
            </div>
            <button
              onClick={logout}
              style={{
                color: '#9ca3af',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              🚪
            </button>
          </div>
        </div>
      </header>

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 16px',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '16px'
        }}>
          Welcome to Tax Engine, {user.name}!
        </h2>
        <p style={{
          color: '#6b7280',
          fontSize: '18px'
        }}>
          Your tax processing application is ready.
        </p>
      </div>
    </div>
  );
};

function App() {
  return <TaxEngineApp />;
}

export default App;