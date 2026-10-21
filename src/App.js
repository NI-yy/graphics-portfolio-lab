import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Works from './components/Works';
import Skills from './components/Skills';
import Publications from './components/Publications';
import Awards from './components/Awards';
import History from './components/History';
import Footer from './components/Footer';
import LandscapeHero from './components/LandscapeHero';
import { useState, useEffect, useRef } from 'react';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// カスタムブレークポイントを定義
const theme = createTheme({
  palette: { mode: 'dark', primary: { main: '#e2cc8d' }, background: { paper: '#252725' }, text: { primary: '#f3f2ec', secondary: '#c6c9c3' } },
  typography: { fontFamily: 'inherit' },
  breakpoints: {
    values: {
      xs: 0,    // 
      sm: 500,  // 500px以上で適用
      md: 800,  // 800px以上で適用
      lg: 1920, 
      xl: 2560,
    },
  },
});

function App() {
  const [activeSection, setActiveSection] = useState('about');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sceneOnly, setSceneOnly] = useState(false);
  useEffect(() => {
    if (!sceneOnly) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event) => { if (event.key === 'Escape') setSceneOnly(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', onKey); };
  }, [sceneOnly]);
  const sidebarRef = useRef(null);
  const sectionRefs = useRef({
    about: null,
    works: null,
    skills: null,
    publications: null,
    awards: null,
    history: null,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (const [section, ref] of Object.entries(sectionRefs.current)) {
        if (ref) {
          const offsetTop = ref.offsetTop;
          const offsetBottom = offsetTop + ref.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResizeStart = () => {
      if (sidebarRef.current) {
        sidebarRef.current.style.transition = 'none'; // アニメーション無効化
      }
    };

    const handleResizeEnd = () => {
      if (sidebarRef.current) {
        sidebarRef.current.style.transition = ''; // アニメーション復元
      }
    };

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      handleResizeStart();
      resizeTimer = setTimeout(handleResizeEnd, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ThemeProvider theme={theme}>
    <div className={`App ${sceneOnly ? 'scene-only' : ''}`}>
      <LandscapeHero sceneOnly={sceneOnly} onToggleScene={() => setSceneOnly((value) => !value)} />
      <Sidebar
        activeSection={activeSection}
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        ref={sidebarRef}
      />
      <div className="content-wrapper portfolio-content" inert={sceneOnly ? true : undefined}>
        <div className="main-content-container">
          <div className="main-content">
            <section id="about" ref={(el) => (sectionRefs.current.about = el)}>
              <Header />
              <div className="profile-links"><a href="https://github.com/NI-yy" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://x.com/yy88804046" target="_blank" rel="noreferrer">X ↗</a><a href="https://www.linkedin.com/in/nozomu-iwai-b3a218325/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div>

            </section>
            <main>
              <section id="works" ref={(el) => (sectionRefs.current.works = el)}>
              <ThemeProvider theme={theme}>
                <Works />
              </ThemeProvider>
              </section>
              <section id="skills" ref={(el) => (sectionRefs.current.skills = el)}>
                <Skills />
              </section>
              <section id="publications" ref={(el) => (sectionRefs.current.publications = el)}>
                <Publications />
              </section>
              <section id="awards" ref={(el) => (sectionRefs.current.awards = el)}>
                <Awards />
              </section>
              <section id="history" ref={(el) => (sectionRefs.current.history = el)}>
                <History />
              </section>
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </div>
    </ThemeProvider>
  );
}

export default App;
