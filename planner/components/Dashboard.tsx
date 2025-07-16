import styles from '../styles/Dashboard.module.css';
import { Repeat, Layers3, Trello } from 'lucide-react';

type Section = 'dashboard' | 'routines' | 'chunks' | 'boards' | 'notes' | 'files' | 'settings';

interface DashboardProps {
    setActiveSection: (section: Section) => void;
}

export default function Dashboard({ setActiveSection }: DashboardProps) {
  return (
    <div>
        <h1 className={styles.header}>Dashboard</h1>
        <div className={styles.grid}>
            <div className={styles.widget} onClick={() => setActiveSection('routines')}>
                <div className={styles.widgetIcon}><Repeat /></div>
                <h3>Daily Routines</h3>
                <p>3 of 5 tasks completed today.</p>
                <div className={styles.progressBarContainer}>
                    <div className={styles.progressBar} style={{ width: '60%' }}></div>
                </div>
            </div>

            <div className={styles.widget} onClick={() => setActiveSection('chunks')}>
                <div className={styles.widgetIcon}><Layers3 /></div>
                <h3>Chunks</h3>
                <p>2 active chunks.</p>
                <p className={styles.subtle}>"Q3 Book List" ends in 45 days.</p>
            </div>

            <div className={styles.widget} onClick={() => setActiveSection('boards')}>
                <div className={styles.widgetIcon}><Trello /></div>
                <h3>Boards</h3>
                <p>2 boards.</p>
                 <p className={styles.subtle}>Recent: Project Phoenix</p>
            </div>
        </div>
    </div>
  );
}