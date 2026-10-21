import React, { forwardRef } from 'react';
import pandaLogo from '../img/panda-logo.png';
import '../styles/Sidebar.css';
const items = ['About', 'Works', 'Skills', 'Publications', 'Awards', 'History'];
const Sidebar = forwardRef(({ activeSection, isMenuOpen, toggleMenu }, ref) => <header className="site-header" ref={ref}>
  <a className="site-brand" href="#about"><img src={pandaLogo} alt="" /><span>Nozomu Iwai</span></a>
  <button className="menu-toggle" type="button" aria-expanded={isMenuOpen} aria-controls="site-navigation" onClick={toggleMenu}>{isMenuOpen ? '閉じる' : 'メニュー'}</button>
  <nav id="site-navigation" className={isMenuOpen ? 'is-open' : ''} aria-label="ページ内の移動">
    {items.map((name) => <a key={name} href={`#${name.toLowerCase()}`} aria-current={activeSection === name.toLowerCase() ? 'location' : undefined} onClick={() => { if (isMenuOpen) toggleMenu(); }}>{name}</a>)}
  </nav>
  <a className="header-github" href="https://github.com/NI-yy" target="_blank" rel="noreferrer">GitHub ↗</a>
</header>);
export default Sidebar;
