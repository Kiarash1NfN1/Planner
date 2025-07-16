// pages/index.tsx

import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useTheme } from 'next-themes';
import styles from '../styles/Home.module.css';
import SettingsPanel from '../components/Settings';

// Import icons for the sidebar
import { Sun, Moon, LayoutDashboard, Repeat, Layers3, Trello, StickyNote, Settings, Folder } from 'lucide-react';

// Import section components
import Dashboard from '../components/Dashboard';
import DailyRoutines from '../components/DailyRoutines';
import Chunks from '../components/Chunks';
import Boards from '../components/Boards';

type Section = 'dashboard' | 'routines' | 'chunks' | 'boards' | 'notes' | 'files' | 'settings';

const Home: NextPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleMenuClick = (section: Section) => {
    if (section === 'settings') {
        setIsSettingsOpen(true);
    } else {
        setActiveSection(section);
    }
};
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderSection = () => {
    if (isSettingsOpen){
      return <SettingsPanel onClose={() => setIsSettingsOpen(false)} />;
    }
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard setActiveSection={setActiveSection} />;
      case 'routines':
        return <DailyRoutines />;
      case 'chunks':
        return <Chunks />;
      case 'boards':
        return <Boards />;
      // Placeholder for future sections
      case 'notes':
        return <p>Coming soon!</p>
      case 'files':
        return <p>Coming soon!</p>
      default:
        return <Dashboard setActiveSection={setActiveSection} />;
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
            <h2>Planner</h2>
        </div>
        <nav className={styles.menu}>
          <ul>
            <li>
              <button onClick={() => handleMenuClick('dashboard')} className={activeSection === 'dashboard' ? styles.active : ''}>
                <LayoutDashboard size={20} />   <span className={styles.buttonText}>Dashboard</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleMenuClick('routines')} className={activeSection === 'routines' ? styles.active : ''}>
                <Repeat size={20} />   <span className={styles.buttonText}>Daily Routines</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleMenuClick('chunks')} className={activeSection === 'chunks' ? styles.active : ''}>
                <Layers3 size={20} /> <span className={styles.buttonText}>Chunks</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleMenuClick('boards')} className={activeSection === 'boards' ? styles.active : ''}>
                <Trello size={20} /> <span className={styles.buttonText}>Boards</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleMenuClick('notes')} className={activeSection === 'notes' ? styles.active : ''}>
                <StickyNote size={20} /> <span className={styles.buttonText}>Notes</span>
              </button>
            </li>
             <li>
              <button onClick={() => handleMenuClick('files')} className={activeSection === 'files' ? styles.active : ''}>
                <Folder size={20} /> <span className={styles.buttonText}>Files</span>
              </button>
            </li>
          </ul>
        </nav>
        <div className={styles.sidebarFooter}>
            <button onClick={() => handleMenuClick('settings')} className={`${styles.menuButton} ${activeSection === 'settings' ? styles.active : ''}`}>
                <Settings size={20} /> <span className={styles.buttonText}>Settings</span>
            </button>
             <button className={styles.themeToggleBtn} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        {renderSection()}
      </main>
    </div>
  );
};

export default Home;