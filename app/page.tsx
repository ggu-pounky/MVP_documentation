"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fonction pour ouvrir la modale
  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Fonction pour fermer la modale
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--background-start-rgb))] text-[rgb(var(--foreground-rgb))]">
      {/* Barre latérale */}
      <aside className="sidebar">
        <div className="logo">
          <i className="fas fa-building logo-icon"></i>
          <span>Corporate UI</span>
        </div>
        <nav className="nav">
          <a href="#" className="nav-item active">
            <i className="fas fa-home nav-item-icon"></i>
            <span>Tableau de bord</span>
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-chart-bar nav-item-icon"></i>
            <span>Analytique</span>
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-users nav-item-icon"></i>
            <span>Utilisateurs</span>
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-cog nav-item-icon"></i>
            <span>Paramètres</span>
          </a>
          <a href="#" className="nav-item" onClick={openModal}>
            <i className="fas fa-info-circle nav-item-icon"></i>
            <span>Version</span>
          </a>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="main-content">
        {/* Barre supérieure */}
        <header className="header">
          <div className="search-bar">
            <i className="fas fa-search search-bar-icon"></i>
            <input type="text" placeholder="Rechercher..." />
          </div>
          <div className="user-menu">
            <i className="fas fa-bell user-menu-icon"></i>
            <i className="fas fa-user-circle user-menu-icon"></i>
          </div>
        </header>

        {/* Cartes */}
        <div className="cards">
          <div className="card">
            <div className="card-header">
              <h3>Utilisateurs actifs</h3>
              <i className="fas fa-users card-header-icon"></i>
            </div>
            <div className="card-body">
              <p className="metric">1,234</p>
              <p className="description">+12% par rapport au mois dernier</p>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3>Revenus</h3>
              <i className="fas fa-dollar-sign card-header-icon"></i>
            </div>
            <div className="card-body">
              <p className="metric">$45,678</p>
              <p className="description">+8% par rapport au mois dernier</p>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3>Tâches complétées</h3>
              <i className="fas fa-check-circle card-header-icon"></i>
            </div>
            <div className="card-body">
              <p className="metric">89%</p>
              <p className="description">Objectif : 100%</p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="form-container">
          <h2>Ajouter un utilisateur</h2>
          <form className="form">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Nom</label>
              <input
                type="text"
                id="name"
                className="form-input"
                placeholder="Entrez le nom"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="Entrez l'email"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="role">Rôle</label>
              <select id="role" className="form-select">
                <option value="">Sélectionnez un rôle</option>
                <option value="admin">Administrateur</option>
                <option value="user">Utilisateur</option>
                <option value="guest">Invité</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-plus"></i>
                Ajouter
              </button>
              <button type="reset" className="btn btn-secondary">
                <i className="fas fa-times"></i>
                Annuler
              </button>
            </div>
          </form>
        </div>

        {/* Tableau */}
        <div className="table-container">
          <h2>Liste des utilisateurs</h2>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Jean Dupont</td>
                  <td>jean.dupont@example.com</td>
                  <td><span className="badge badge-admin">Admin</span></td>
                  <td><span className="badge badge-active">Actif</span></td>
                  <td>
                    <button className="btn-icon btn-edit"><i className="fas fa-edit"></i></button>
                    <button className="btn-icon btn-delete"><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
                <tr>
                  <td>Marie Martin</td>
                  <td>marie.martin@example.com</td>
                  <td><span className="badge badge-user">Utilisateur</span></td>
                  <td><span className="badge badge-active">Actif</span></td>
                  <td>
                    <button className="btn-icon btn-edit"><i className="fas fa-edit"></i></button>
                    <button className="btn-icon btn-delete"><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
                <tr>
                  <td>Pierre Lambert</td>
                  <td>pierre.lambert@example.com</td>
                  <td><span className="badge badge-guest">Invité</span></td>
                  <td><span className="badge badge-inactive">Inactif</span></td>
                  <td>
                    <button className="btn-icon btn-edit"><i className="fas fa-edit"></i></button>
                    <button className="btn-icon btn-delete"><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Fenêtre modale pour la version */}
      <div className={`modal-overlay ${isModalOpen ? 'modal-open' : ''}`} onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2><i className="fas fa-info-circle"></i> Informations sur la version</h2>
            <button className="modal-close" onClick={closeModal}>&times;</button>
          </div>
          <div className="modal-body">
            <div className="version-info">
              <div className="version-item">
                <span className="version-label">Version actuelle :</span>
                <span className="version-value">1.0.0</span>
              </div>
              <div className="version-item">
                <span className="version-label">Date de sortie :</span>
                <span className="version-value">15 octobre 2024</span>
              </div>
              <div className="version-item">
                <span className="version-label">Auteur :</span>
                <span className="version-value">Équipe Corporate UI</span>
              </div>
            </div>
            <div className="version-description">
              <h3>Résumé des modifications</h3>
              <ul>
                <li><strong>Nouveautés :</strong> Ajout de l'interface Dark Mode avec thème bleu électrique.</li>
                <li><strong>Améliorations :</strong> Design corporate moderne et responsive.</li>
                <li><strong>Corrections :</strong> Optimisation des performances et de l'accessibilité.</li>
              </ul>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={closeModal}>
              <i className="fas fa-check"></i> Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
