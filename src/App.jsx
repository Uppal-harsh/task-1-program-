import React, { useState } from 'react';
import ThreeScene from './ThreeScene';
import { Sparkles, Compass, Shield, Zap, Layers, Globe, ArrowUpRight, Cpu } from 'lucide-react';
import './App.css';

export default function App() {
  const [themeMode, setThemeMode] = useState('techfest-default'); // 'techfest-default', 'warm-beige', 'platinum-white'

  return (
    <div className="app-container">
      {/* 3D Background / Hero Canvas */}
      <ThreeScene themeMode={themeMode} />

      {/* Top Header / Navigation */}
      <header className="header">
        <div className="logo-group">
          {/* Techfest style badge & logo */}
          <div className="tf-badge">
            <span className="tf-logo-icon">TF</span>
            <div className="tf-text-stack">
              <span className="tf-title">Techfest<sup>™</sup></span>
              <span className="tf-subtitle">IIT BOMBAY · 2026</span>
            </div>
          </div>
        </div>

        <nav className="nav-links">
          <a href="#about" className="nav-link active">Nexus</a>
          <a href="#exhibitions" className="nav-link">Exhibitions</a>
          <a href="#competitions" className="nav-link">Competitions</a>
          <a href="#initiatives" className="nav-link">Initiatives</a>
          <a href="#summit" className="nav-link">Summit</a>
        </nav>

        <div className="header-actions">
          {/* Theme Palette Switcher */}
          <div className="theme-toggle">
            <button
              onClick={() => setThemeMode('techfest-default')}
              className={`theme-btn ${themeMode === 'techfest-default' ? 'active' : ''}`}
              title="Ivory & Obsidian"
            >
              <span className="dot dot-ivory"></span> Ivory
            </button>
            <button
              onClick={() => setThemeMode('warm-beige')}
              className={`theme-btn ${themeMode === 'warm-beige' ? 'active' : ''}`}
              title="Warm Beige & Gold"
            >
              <span className="dot dot-beige"></span> Beige
            </button>
            <button
              onClick={() => setThemeMode('platinum-white')}
              className={`theme-btn ${themeMode === 'platinum-white' ? 'active' : ''}`}
              title="Monochrome Platinum"
            >
              <span className="dot dot-white"></span> Stark
            </button>
          </div>

          <button className="primary-btn register-btn">
            Register Portal <ArrowUpRight size={15} />
          </button>
        </div>
      </header>

      {/* Main Overlay Content */}
      <main className="hero-content">
        <div className="pill-tag">
          <span className="pill-dot"></span>
          ASIA'S LARGEST SCIENCE & TECHNOLOGY FESTIVAL
        </div>

        <h1 className="hero-headline">
          ARCHITECTING <br />
          <span className="text-glow">THE NEXT FRONTIER</span>
        </h1>

        <p className="hero-description">
          Experience the pinnacle of innovation, engineering mastery, and digital symphonies at Indian Institute of Technology Bombay. Move your cursor to interact with the core hyper-geometry.
        </p>

        <div className="cta-row">
          <button className="btn-solid">
            <Zap size={16} /> Explore Events
          </button>
          <button className="btn-outline">
            <Layers size={16} /> Festival Schedule
          </button>
        </div>

        {/* Live metric cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-num">175,000+</div>
            <div className="stat-label">Footfall & Attendees</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-card">
            <div className="stat-num">2,500+</div>
            <div className="stat-label">Colleges Worldwide</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-card">
            <div className="stat-num">₹60L+</div>
            <div className="stat-label">Prize Pool & Grants</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-card">
            <div className="stat-num">75+</div>
            <div className="stat-label">Global Keynotes</div>
          </div>
        </div>
      </main>

      {/* Footer minimal info */}
      <footer className="footer-bar">
        <div className="footer-left">
          <Cpu size={14} className="icon-pulse" />
          <span>REAL-TIME WEBGL RENDERING · 3D DAMPED TILT ENABLED</span>
        </div>
        <div className="footer-right">
          <span>IIT BOMBAY, POWAI, MUMBAI - 400076</span>
        </div>
      </footer>
    </div>
  );
}
