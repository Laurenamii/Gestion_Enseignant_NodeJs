import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api';

export default function Login() {
  const [mode, setMode]   = useState('login'); // 'login' | 'register'
  const [form, setForm]   = useState({ username: '', password: '', confirmPassword: '', role: 'user' });
  const [msg,  setMsg]    = useState({ text: '', ok: true });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const showMsg = (text, ok = true) => {
    setMsg({ text, ok });
    if (!ok) setTimeout(() => setMsg({ text: '', ok: true }), 4000);
  };

  const switchMode = (m) => {
    setMode(m);
    setForm({ username: '', password: '', confirmPassword: '', role: 'user' });
    setMsg({ text: '', ok: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', ok: true });

    try {
      if (mode === 'login') {
        const res = await login({ username: form.username, password: form.password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        showMsg('✅ Connexion réussie ! Redirection…');
        setTimeout(() => navigate('/'), 800);

      } else {
        // Inscription
        if (!form.username.trim() || !form.password.trim()) {
          showMsg("⚠️ Veuillez remplir tous les champs.", false);
          setLoading(false);
          return;
        }
        if (form.password !== form.confirmPassword) {
          showMsg('⚠️ Les mots de passe ne correspondent pas.', false);
          setLoading(false);
          return;
        }
        if (form.password.length < 6) {
          showMsg('⚠️ Le mot de passe doit contenir au moins 6 caractères.', false);
          setLoading(false);
          return;
        }
        await register({ username: form.username, password: form.password, role: form.role });
        showMsg('🎉 Inscription réussie ! Vous pouvez vous connecter.');
        setTimeout(() => switchMode('login'), 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur de connexion au serveur.';
      showMsg(`❌ ${msg}`, false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Arrière-plan décoratif */}
      <div style={styles.bgShape1} />
      <div style={styles.bgShape2} />

      <div style={styles.card}>
        {/* En-tête */}
        <div style={styles.header}>
          <div style={styles.logo}></div>
          <h1 style={styles.title}>Gestion Enseignants</h1>
          <p style={styles.subtitle}>Système de gestion académique</p>
        </div>

        {/* Onglets */}
        <div style={styles.tabs}>
          <button
            id="tab-login"
            style={{ ...styles.tab, ...(mode === 'login' ? styles.tabActive : {}) }}
            onClick={() => switchMode('login')}
          >
            Connexion
          </button>
          <button
            id="tab-register"
            style={{ ...styles.tab, ...(mode === 'register' ? styles.tabActive : {}) }}
            onClick={() => switchMode('register')}
          >
            Inscription
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Nom d'utilisateur */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nom d'utilisateur</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}></span>
              <input
                id="input-username"
                type="text"
                placeholder="Entrez votre identifiant"
                style={styles.input}
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Mot de passe</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}></span>
              <input
                id="input-password"
                type="password"
                placeholder="Entrez votre mot de passe"
                style={styles.input}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>
          </div>

          {/* Champs supplémentaires pour l'inscription */}
          {mode === 'register' && (
            <>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirmer le mot de passe</label>
                <div style={styles.inputWrap}>
                  <span style={styles.inputIcon}></span>
                  <input
                    id="input-confirm"
                    type="password"
                    placeholder="Répétez le mot de passe"
                    style={styles.input}
                    value={form.confirmPassword}
                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Rôle</label>
                <div style={styles.inputWrap}>
                  <span style={styles.inputIcon}></span>
                  <select
                    id="input-role"
                    style={{ ...styles.input, cursor: 'pointer' }}
                    value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="user">Utilisateur</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Message de retour */}
          {msg.text && (
            <div style={{ ...styles.alert, background: msg.ok ? '#d4edda' : '#f8d7da', color: msg.ok ? '#155724' : '#721c24' }}>
              {msg.text}
            </div>
          )}

          {/* Bouton principal */}
          <button
            id="btn-submit"
            type="submit"
            style={{ ...styles.btn, opacity: loading ? 0.75 : 1 }}
            disabled={loading}
          >
            {loading
              ? 'Chargement...'
              : mode === 'login'
                ? 'Se connecter'
                : 'Créer le compte'}
          </button>
        </form>

        {/* Lien de bascule */}
        <p style={styles.switchText}>
          {mode === 'login'
            ? "Pas encore de compte ?"
            : 'Déjà inscrit ?'}{' '}
          <span
            id="link-switch"
            style={styles.switchLink}
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? "S'inscrire" : 'Se connecter'}
          </span>
        </p>

        <p style={styles.footer}>© 2025 Gestion Enseignants — SUJET 26</p>
      </div>
    </div>
  );
}

/* ────────────────────────── STYLES ────────────────────────── */
const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  bgShape1: {
    position: 'absolute', top: '-120px', right: '-120px',
    width: '400px', height: '400px',
    background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
    borderRadius: '50%', pointerEvents: 'none',
  },
  bgShape2: {
    position: 'absolute', bottom: '-100px', left: '-100px',
    width: '350px', height: '350px',
    background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
    borderRadius: '50%', pointerEvents: 'none',
  },
  card: {
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.6)',
    borderRadius: '24px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.08)',
    zIndex: 1,
  },
  header: { textAlign: 'center', marginBottom: '28px' },
  logo: { fontSize: '48px', marginBottom: '8px' },
  title: { color: '#1e293b', margin: '0 0 6px', fontSize: '1.6rem', fontWeight: 800 },
  subtitle: { color: '#64748b', margin: 0, fontSize: '0.9rem' },

  tabs: {
    display: 'flex', gap: '4px',
    background: 'rgba(0,0,0,0.05)',
    borderRadius: '12px', padding: '4px',
    marginBottom: '28px',
  },
  tab: {
    flex: 1, padding: '10px', border: 'none',
    borderRadius: '9px', cursor: 'pointer',
    background: 'transparent', color: '#64748b',
    fontWeight: 600, fontSize: '0.9rem',
    transition: 'all 0.25s ease',
  },
  tabActive: {
    background: '#fff',
    color: '#6366f1',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  },

  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#475569', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.02em' },
  inputWrap: {
    display: 'flex', alignItems: 'center',
    background: '#fff',
    border: '1.5px solid #cbd5e1',
    borderRadius: '10px', overflow: 'hidden',
    transition: 'border-color 0.2s',
  },
  inputIcon: { padding: '0 12px', fontSize: '1rem', flexShrink: 0 },
  input: {
    flex: 1, padding: '12px 12px 12px 0',
    background: 'transparent', border: 'none', outline: 'none',
    color: '#1e293b', fontSize: '0.95rem',
    width: '100%',
  },
  alert: {
    padding: '12px 16px', borderRadius: '10px',
    fontSize: '0.88rem', fontWeight: 500,
  },
  btn: {
    padding: '14px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#fff', border: 'none', borderRadius: '12px',
    fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
    boxShadow: '0 6px 20px rgba(99,102,241,0.3)',
    marginTop: '4px',
  },
  switchText: { textAlign: 'center', color: '#64748b', marginTop: '20px', fontSize: '0.88rem' },
  switchLink: { color: '#6366f1', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' },
  footer: { textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem', marginTop: '16px' },
};