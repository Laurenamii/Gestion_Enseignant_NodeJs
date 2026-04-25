import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ConfirmLogoutModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div style={modal.overlay}>
      <div style={modal.box}>
        <div style={modal.iconWrap}></div>
        <h3 style={modal.title}>Déconnexion</h3>
        <p style={modal.body}>
          Êtes-vous sûr de vouloir vous déconnecter ?
        </p>
        <div style={modal.actions}>
          <button id="btn-cancel-logout" onClick={onCancel} style={modal.btnCancel}>
            Annuler
          </button>
          <button id="btn-confirm-logout" onClick={onConfirm} style={modal.btnConfirm}>
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    localStorage.removeItem('token');
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <>
      <nav style={styles.nav}>
        <span style={styles.brand}>Gestion Enseignants</span>
        <div style={styles.links}>
          <Link to="/" style={styles.link}>Liste</Link>
          <Link to="/bilan" style={styles.link}>Bilan</Link>
          <button onClick={() => setShowLogoutModal(true)} style={styles.btn}>Déconnexion</button>
        </div>
      </nav>

      <ConfirmLogoutModal 
        isOpen={showLogoutModal} 
        onConfirm={confirmLogout} 
        onCancel={() => setShowLogoutModal(false)} 
      />
    </>
  );
}

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '12px 24px',
    background: '#2c3e50', color: 'white',
    position: 'sticky', top: 0, zIndex: 1000,
  },
  brand: { fontSize: '1.2rem', fontWeight: 'bold' },
  links: { display: 'flex', alignItems: 'center', gap: '16px' },
  link: { color: 'white', textDecoration: 'none', fontSize: '1rem' },
  btn: {
    background: '#e74c3c', color: 'white', border: 'none',
    padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
  },
};

const modal = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease' },
  box: { background: '#fff', borderRadius: '16px', padding: '32px 28px', maxWidth: '380px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', textAlign: 'center', animation: 'slideUp 0.25s ease' },
  iconWrap: { marginBottom: '12px' },
  title: { margin: '0 0 10px', fontSize: '1.15rem', color: '#2c3e50', fontWeight: 800 },
  body: { margin: '0 0 22px', fontSize: '1rem', color: '#555' },
  actions: { display: 'flex', gap: '12px' },
  btnCancel: { flex: 1, padding: '11px', background: '#f0f2f5', color: '#555', border: 'none', borderRadius: '9px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600 },
  btnConfirm: { flex: 1, padding: '11px', background: 'linear-gradient(135deg,#e74c3c,#c0392b)', color: 'white', border: 'none', borderRadius: '9px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600 },
};