import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/NavBar';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';
import Administration from './components/AdministrationPage';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

const NameApp = "";

const routesMeta = {
  "/login": {
    title: `Connexion - ${NameApp}`,
    description: `Connectez-vous pour accéder à votre compte ${NameApp}.`,
  },
  "/register": {
    title: `Inscription - ${NameApp}`,
    description: `Créez un compte pour accéder à ${NameApp}.`,
  },
  "/profile": {
    title: `Profil - ${NameApp}`,
    description: "Bienvenue sur votre profil.",
  },
  "/settings": {
    title: `Paramètres - ${NameApp}`,
    description: "Bienvenue sur votre Paramètres.",
  },
  "/administration": {
    title: `Administration - ${NameApp}`,
    description: `Gérez les utilisateurs et les paramètres administratifs de ${NameApp}.`,
  },
  // Ajoute d'autres routes ici...
};

function MetaUpdater() {
  const location = useLocation();
  const meta = routesMeta[location.pathname] || {
    title: "VEHICLE",
    description: "Bienvenue sur VEHICLE, votre application pour gérer vos véhicules.",
  };

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
    </Helmet>
  );
}

export default function App() {
  return (
    <Router>
      <MetaUpdater />
      <Routes>
        {/* Pages sans Navbar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Pages avec Navbar */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Navbar />
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Navbar />
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/administration"
          element={
            <ProtectedAdminRoute>
              <Navbar />
              <Administration />
            </ProtectedAdminRoute>
          }
        />

        {/* Page d'accueil */}
        <Route path="/" element={
            <ProtectedRoute>
              <Navbar />
              <ProfilePage />
            </ProtectedRoute>
          } />
      </Routes>
    </Router>
  );
}