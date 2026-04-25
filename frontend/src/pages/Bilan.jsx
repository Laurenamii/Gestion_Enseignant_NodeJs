import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getEnseignants } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Cell
} from 'recharts';

export default function Bilan() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getEnseignants().then(res => {
      // res.data.data vient du format standard backend: { success, count, data: [...] }
      const liste = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
      setData(liste.map(e => ({
        nom: e.nom,
        salaire: parseFloat((e.nbHeures * e.tauxHoraire).toFixed(2)),
      })));
    }).catch(err => console.error("Erreur chargement bilan", err));
  }, []);

  const salaires = data.map(d => d.salaire);
  const min = salaires.length ? Math.min(...salaires) : 0;
  const max = salaires.length ? Math.max(...salaires) : 0;
  const total = salaires.reduce((sum, val) => sum + val, 0);

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2>Bilan des Salaires</h2>

        {/* Cartes stats */}
        <div style={styles.cards}>
          <div style={{ ...styles.card, borderLeft: '4px solid #e74c3c' }}>
            <span style={styles.label}>Salaire Minimal</span>
            <span style={styles.value}>{min.toLocaleString('fr-FR')} Ar</span>
          </div>
          <div style={{ ...styles.card, borderLeft: '4px solid #27ae60' }}>
            <span style={styles.label}>Salaire Maximal</span>
            <span style={styles.value}>{max.toLocaleString('fr-FR')} Ar</span>
          </div>
          <div style={{ ...styles.card, borderLeft: '4px solid #f39c12' }}>
            <span style={styles.label}>Total des Salaires</span>
            <span style={styles.value}>{total.toLocaleString('fr-FR')} Ar</span>
          </div>
          <div style={{ ...styles.card, borderLeft: '4px solid #3498db' }}>
            <span style={styles.label}>Nb Enseignants</span>
            <span style={styles.value}>{data.length}</span>
          </div>
        </div>

        {/* Graphique */}
        <div style={styles.chartBox}>
          <h3 style={{ marginBottom: '16px', color: '#2c3e50' }}>Histogramme des salaires</h3>
          {data.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                  <XAxis dataKey="nom" tick={{fill: '#555', fontSize: 13}} />
                  <YAxis width={110} tickFormatter={v => `${v.toLocaleString('fr-FR')} Ar`} tick={{fill: '#555', fontSize: 13}} />
                  <Tooltip formatter={v => `${v.toLocaleString('fr-FR')} Ar`} cursor={{fill: '#f5f5f5'}} />
                  <Bar dataKey="salaire" radius={[6, 6, 0, 0]} barSize={40}>
                    {data.map((entry, i) => (
                      <Cell key={i}
                        fill={entry.salaire === max ? '#27ae60' :
                              entry.salaire === min ? '#e74c3c' : '#3498db'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p style={styles.legend}>
                <span style={{ color: '#27ae60' }}>Max</span> &nbsp;&nbsp;|&nbsp;&nbsp; 
                <span style={{ color: '#e74c3c' }}>Min</span> &nbsp;&nbsp;|&nbsp;&nbsp; 
                <span style={{ color: '#3498db' }}>Autres</span>
              </p>
            </>
          ) : (
            <p style={styles.emptyMsg}>Aucune donnée disponible pour le graphique.</p>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  container: { padding: '28px', maxWidth: '1100px', margin: '0 auto', fontFamily: "'Segoe UI',system-ui,sans-serif" },
  cards: { display: 'flex', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' },
  card: { background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '4px', flex: '1', minWidth: '180px' },
  label: { fontSize: '0.8rem', color: '#7f8c8d', fontWeight: '600', textTransform: 'uppercase' },
  value: { fontSize: '1.25rem', fontWeight: 'bold', color: '#2c3e50' },
  chartBox: { background: 'white', padding: '28px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
  legend: { textAlign: 'center', marginTop: '20px', color: '#555', fontSize: '0.95rem', fontWeight: 'bold' },
  emptyMsg: { textAlign: 'center', color: '#888', padding: '40px 0' },
};