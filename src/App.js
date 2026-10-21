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
// React Component
import Burger from '@animated-burgers/burger-squeeze' 
// don't forget the styles
import '@animated-burgers/burger-squeeze/dist/styles.css' 
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// カスタムブレークポイントを定義
const theme = createTheme({
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
    <div className="App">
      <Sidebar
        activeSection={activeSection}
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        ref={sidebarRef}
      />
      <div className="content-wrapper">
        <div className="hamburger-menu-container">
          <div className="burger-icon-container">
          <Burger onClick={toggleMenu} className={`${isMenuOpen ? 'open' : ''}`} />
          </div>
        </div>
        <div className="main-content-container">
          <div className="main-content">
            <section id="about" ref={(el) => (sectionRefs.current.about = el)}>
              <Header />
              <LandscapeHero />
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
  );
}

export default App;
