import './App.css';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Enseignant from './pages/Enseignant';
import Bilan from './pages/Bilan';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page de connexion — gère aussi l'inscription via onglets */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Login />} />

        {/* Pages protégées */}
        <Route path="/" element={
          <PrivateRoute><Enseignant /></PrivateRoute>
        } />
        <Route path="/bilan" element={
          <PrivateRoute><Bilan /></PrivateRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}


