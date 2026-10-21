import React, { forwardRef } from 'react';
import pandaLogo from '../img/panda-logo.png';
import github_icon from '../img/github-icon.png';
import x_icon from '../img/x-icon.png';
import linkedin_icon from '../img/linkedin-icon.png';
import '../styles/Sidebar.css';

const Sidebar = forwardRef(({ activeSection, isMenuOpen, toggleMenu }, ref) => {
  const handleLogoClick = () => {
    window.location.href = window.location.pathname;
  };

  const handleNavClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      if (isMenuOpen) {
        toggleMenu();
      }
    }
  };

  const navItems = [
    { id: 'about', text: 'About' },
    { id: 'works', text: 'Works' },
    { id: 'skills', text: 'Skills' },
    { id: 'publications', text: 'Publications' },
    { id: 'awards', text: 'Awards' },
    { id: 'history', text: 'History' },
  ];

  return (
    <>
      {/* 通常のサイドバー */}
      <div className={`sidebar ${isMenuOpen ? 'closed' : ''}`} ref={ref}>
        <div className="sidebar-header">
          <div className="logo-container">
            <img
              src={pandaLogo}
              alt="Panda Logo"
              className="logo"
              onClick={handleLogoClick}
            />
          </div>
          <div className="name-container">
            <span className="sidebar-name">Nozomu Iwai</span>
          </div>
        </div>
        <nav className="nav-list">
          <ul>
            {navItems.map((item) => (
              <li
                key={item.id}
                className={activeSection === item.id ? 'active' : ''}
                onClick={() => handleNavClick(item.id)}
              >
                {item.text}
              </li>
            ))}
          </ul>
        </nav>
        <div className="social_icons">
          <a href="https://github.com/NI-yy" target="_blank" rel="noopener noreferrer">
            <img src={github_icon} alt="Github" className="github-icon" />
          </a>
          <a href="https://x.com/yy88804046" target="_blank" rel="noopener noreferrer">
            <img src={x_icon} alt="X" className="x-icon" />
          </a>
          <a href="https://www.linkedin.com/in/nozomu-iwai-b3a218325/" target="_blank" rel="noopener noreferrer">
            <img src={linkedin_icon} alt="LinkedIn" className="linkedin-icon" />
          </a>
        </div>
      </div>

      {/* ハンバーガーメニューが開いた時のサイドバー */}
      <div className={`sidebar-open ${isMenuOpen ? 'open' : ''}`}>
        <nav className="nav-list">
          <ul>
            {navItems.map((item) => (
              <li
                key={item.id}
                className={activeSection === item.id ? 'active' : ''}
                onClick={() => handleNavClick(item.id)}
              >
                {item.text}
              </li>
            ))}
          </ul>
        </nav>
        <div className="social_icons">
          <a href="https://github.com/NI-yy" target="_blank" rel="noopener noreferrer">
            <img src={github_icon} alt="Github" className="github-icon" />
          </a>
          <a href="https://x.com/yy88804046" target="_blank" rel="noopener noreferrer">
            <img src={x_icon} alt="X" className="x-icon" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <img src={linkedin_icon} alt="LinkedIn" className="linkedin-icon" />
          </a>
        </div>
      </div>

      {/* オーバーレイ */}
      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}
    </>
  );
});

export default Sidebar;