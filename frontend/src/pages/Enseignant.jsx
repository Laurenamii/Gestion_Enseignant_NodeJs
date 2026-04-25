import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import {
  getEnseignants, addEnseignant,
  updateEnseignant, deleteEnseignant
} from '../services/api';

const emptyForm = { nom: '', nbheures: '', tauxhoraire: '' };

// ─── Modal de confirmation ────────────────────────────────────────────────────
function ConfirmModal({ enseignant, onConfirm, onCancel }) {
  if (!enseignant) return null;
  return (
    <div style={modal.overlay}>
      <div style={modal.box}>
        <div style={modal.iconWrap}></div>
        <h3 style={modal.title}>Supprimer l'enseignant ?</h3>
        <p style={modal.body}>
          <strong>{enseignant.nom}</strong> ({enseignant.numEns})
        </p>
        <div style={modal.actions}>
          <button id="btn-cancel-delete" onClick={onCancel} style={modal.btnCancel}>
            Annuler
          </button>
          <button id="btn-confirm-delete" onClick={onConfirm} style={modal.btnConfirm}>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg }) {
  if (!msg.text) return null;
  return (
    <div style={{
      ...toast.box,
      background: msg.ok
        ? 'linear-gradient(135deg,#27ae60,#2ecc71)'
        : 'linear-gradient(135deg,#c0392b,#e74c3c)',
    }}>
      {msg.text}
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function Enseignant() {
  const [enseignants, setEnseignants] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);   // id (numérique) en édition
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [msg, setMsg] = useState({ text: '', ok: true });
  const [loading, setLoading] = useState(false);

  // Chargement
  const load = async () => {
    try {
      const res = await getEnseignants();
      const liste = Array.isArray(res.data?.data) ? res.data.data
        : Array.isArray(res.data) ? res.data
          : [];
      setEnseignants(liste);
    } catch { setEnseignants([]); }
  };
  useEffect(() => { load(); }, []);

  // Toast
  const showMsg = (text, ok = true) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg({ text: '', ok: true }), 3000);
  };

  // Soumettre ajout / modification
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nom.trim() || !form.nbheures || !form.tauxhoraire) {
      showMsg('Remplissez tous les champs.', false);
      return;
    }
    const payload = {
      nom: form.nom.trim(),
      nbHeures: Number(form.nbheures),
      tauxHoraire: Number(form.tauxhoraire),
    };
    setLoading(true);
    try {
      if (editing !== null) {
        // PUT /api/enseignants/:id  (id numérique)
        await updateEnseignant(editing, payload);
        showMsg('Enseignant modifié avec succès.');
        setEditing(null);
      } else {
        await addEnseignant(payload);
        showMsg('Enseignant ajouté avec succès.');
      }
      setForm(emptyForm);
      load();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Erreur serveur.', false);
    } finally {
      setLoading(false);
    }
  };

  // Édition
  const handleEdit = (e) => {
    setEditing(e.id);   // ← id numérique MySQL
    setForm({
      nom: e.nom,
      nbheures: String(e.nbHeures ?? e.nbheures ?? ''),
      tauxhoraire: String(e.tauxHoraire ?? e.tauxhoraire ?? ''),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleCancel = () => { setEditing(null); setForm(emptyForm); };

  // Suppression
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      await deleteEnseignant(deleteTarget.id);   // ← id numérique
      showMsg(`"${deleteTarget.nom}" supprimé.`);
      setDeleteTarget(null);
      load();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Erreur suppression.', false);
      setDeleteTarget(null);
    } finally {
      setLoading(false);
    }
  };

  const nb = (e) => Number(e.nbHeures ?? e.nbheures ?? 0);
  const taux = (e) => Number(e.tauxHoraire ?? e.tauxhoraire ?? 0);

  return (
    <>
      <Navbar />
      <Toast msg={msg} />
      <ConfirmModal
        enseignant={deleteTarget}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div style={S.container}>

        {/* En-tête */}
        <div style={S.pageHeader}>
          <h1 style={S.pageTitle}>Gestion des Enseignants</h1>
          <span style={S.count}>
            {enseignants.length} enseignant{enseignants.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Formulaire */}
        <div style={{ ...S.card, borderLeft: editing !== null ? '4px solid #f39c12' : '4px solid #27ae60' }}>
          <h2 style={S.cardTitle}>
            {editing !== null ? 'Modifier un enseignant' : 'Ajouter un enseignant'}
          </h2>

          <form onSubmit={handleSubmit} style={S.formGrid}>

            <div style={S.field}>
              <label style={S.label}>Nom complet *</label>
              <input
                id="input-nom"
                placeholder="Ex : Jean Dupont"
                style={S.input}
                value={form.nom}
                onChange={e => setForm({ ...form, nom: e.target.value })}
              />
            </div>

            <div style={S.field}>
              <label style={S.label}>Nb Heures *</label>
              <input
                id="input-nbheures"
                placeholder="Ex : 40"
                type="number" min="0"
                style={S.input}
                value={form.nbheures}
                onChange={e => setForm({ ...form, nbheures: e.target.value })}
              />
            </div>

            <div style={S.field}>
              <label style={S.label}>Taux horaire (Ar) *</label>
              <input
                id="input-tauxhoraire"
                placeholder="Ex : 5000"
                type="number" min="0"
                style={S.input}
                value={form.tauxhoraire}
                onChange={e => setForm({ ...form, tauxhoraire: e.target.value })}
              />
            </div>

          </form>

          {/* Aperçu salaire */}
          {form.nbheures && form.tauxhoraire && (
            <div style={S.preview}>
              Salaire estimé :{' '}
              <strong style={{ color: '#27ae60' }}>
                {(Number(form.nbheures) * Number(form.tauxhoraire)).toLocaleString('fr-FR')} Ar
              </strong>
            </div>
          )}

          <div style={S.formActions}>
            <button
              id="btn-submit"
              onClick={handleSubmit}
              disabled={loading}
              style={{ ...S.btn, background: editing !== null ? '#f39c12' : '#27ae60' }}
            >
              {loading ? 'Chargement...' : editing !== null ? 'Mettre à jour' : 'Ajouter'}
            </button>
            {editing !== null && (
              <button id="btn-cancel" onClick={handleCancel} style={{ ...S.btn, background: '#95a5a6' }}>
                Annuler
              </button>
            )}
          </div>
        </div>

        {/* Tableau */}
        <div style={S.card}>
          <h2 style={S.cardTitle}>Liste des enseignants</h2>

          {enseignants.length === 0 ? (
            <div style={S.empty}>
              <p>Aucun enseignant enregistré.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={S.table}>
                <thead>
                  <tr style={S.thead}>
                    <th style={S.th}>N° Ens</th>
                    <th style={S.th}>Nom</th>
                    <th style={S.th}>Heures</th>
                    <th style={S.th}>Taux / h</th>
                    <th style={S.th}>Salaire</th>
                    <th style={S.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enseignants.map((e, idx) => (
                    <tr
                      key={e.id}
                      style={{
                        ...S.tr,
                        background: editing === e.id
                          ? '#fff8e8'
                          : idx % 2 === 0 ? '#fff' : '#f9fafb',
                      }}
                    >
                      <td style={S.td}>
                        <span style={S.badge}>{e.numEns}</span>
                      </td>
                      <td style={{ ...S.td, fontWeight: 600 }}>{e.nom}</td>
                      <td style={S.td}>{nb(e)} h</td>
                      <td style={S.td}>{taux(e).toLocaleString('fr-FR')} Ar</td>
                      <td style={S.td}>
                        <strong style={{ color: '#27ae60' }}>
                          {(nb(e) * taux(e)).toLocaleString('fr-FR')} Ar
                        </strong>
                      </td>
                      <td style={S.td}>
                        <div style={S.actions}>
                          <button
                            id={`btn-edit-${e.id}`}
                            onClick={() => handleEdit(e)}
                            style={S.btnEdit}
                          >
                            Modifier
                          </button>
                          <button
                            id={`btn-del-${e.id}`}
                            onClick={() => setDeleteTarget(e)}
                            style={S.btnDel}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: '#2c3e50', color: 'white' }}>
                    <td style={S.tfoot} colSpan={2}>
                      <strong>TOTAL — {enseignants.length} enseignants</strong>
                    </td>
                    <td style={S.tfoot}>
                      <strong>{enseignants.reduce((s, e) => s + nb(e), 0)} h</strong>
                    </td>
                    <td style={S.tfoot}>—</td>
                    <td style={S.tfoot}>
                      <strong>
                        {enseignants.reduce((s, e) => s + nb(e) * taux(e), 0)
                          .toLocaleString('fr-FR')} Ar
                      </strong>
                    </td>
                    <td style={S.tfoot} />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

      </div>
    </>
  );
}

// ══════════ STYLES ══════════
const S = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '28px 20px', fontFamily: "'Segoe UI',system-ui,sans-serif" },
  pageHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' },
  pageTitle: { margin: 0, fontSize: '1.6rem', color: '#2c3e50', fontWeight: 800 },
  count: { background: '#eaf0ff', color: '#3b5bdb', padding: '4px 14px', borderRadius: '20px', fontWeight: 700, fontSize: '0.9rem' },

  card: { background: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', marginBottom: '24px', border: '1px solid #e8ecef' },
  cardTitle: { margin: '0 0 20px', fontSize: '1.05rem', color: '#2c3e50', fontWeight: 700 },

  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.78rem', fontWeight: 700, color: '#555', letterSpacing: '0.03em', textTransform: 'uppercase' },
  input: { padding: '10px 14px', border: '1.5px solid #dde1e7', borderRadius: '8px', fontSize: '0.95rem', color: '#2c3e50', outline: 'none' },

  preview: { marginTop: '14px', padding: '10px 16px', background: '#f0fff4', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid #b7ebc8' },
  formActions: { display: 'flex', gap: '12px', marginTop: '18px' },
  btn: { padding: '10px 22px', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.92rem', fontWeight: 600 },

  table: { width: '100%', borderCollapse: 'collapse', minWidth: '640px' },
  thead: { background: 'linear-gradient(135deg,#2c3e50,#3d5166)' },
  th: { padding: '12px 16px', textAlign: 'left', color: 'white', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' },
  tr: { transition: 'background 0.15s' },
  td: { padding: '11px 16px', borderBottom: '1px solid #edf0f3', fontSize: '0.92rem', color: '#2c3e50' },
  tfoot: { padding: '11px 16px', fontSize: '0.9rem' },

  badge: { background: '#eaf0ff', color: '#3b5bdb', padding: '3px 8px', borderRadius: '5px', fontSize: '0.8rem', fontWeight: 700 },
  actions: { display: 'flex', gap: '8px' },
  btnEdit: { background: 'linear-gradient(135deg,#f39c12,#e67e22)', color: 'white', border: 'none', padding: '6px 13px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 },
  btnDel: { background: 'linear-gradient(135deg,#e74c3c,#c0392b)', color: 'white', border: 'none', padding: '6px 13px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 },

  empty: { textAlign: 'center', padding: '48px', color: '#7f8c8d', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
};

// ══════════ MODAL ══════════
const modal = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease' },
  box: { background: '#fff', borderRadius: '16px', padding: '32px 28px', maxWidth: '380px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', textAlign: 'center', animation: 'slideUp 0.25s ease' },
  iconWrap: { fontSize: '2.2rem', marginBottom: '12px' },
  title: { margin: '0 0 10px', fontSize: '1.15rem', color: '#2c3e50', fontWeight: 800 },
  body: { margin: '0 0 22px', fontSize: '1rem', color: '#555' },
  actions: { display: 'flex', gap: '12px' },
  btnCancel: { flex: 1, padding: '11px', background: '#f0f2f5', color: '#555', border: 'none', borderRadius: '9px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600 },
  btnConfirm: { flex: 1, padding: '11px', background: 'linear-gradient(135deg,#e74c3c,#c0392b)', color: 'white', border: 'none', borderRadius: '9px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600 },
};

// ══════════ TOAST ══════════
const toast = {
  box: { position: 'fixed', bottom: '20px', right: '20px', zIndex: 2000, color: 'white', padding: '13px 20px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.18)', animation: 'slideInRight 0.3s ease' },
};