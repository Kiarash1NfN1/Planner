import styles from '../styles/TaskModal.module.css'; // Reusing modal styles
import settingStyles from '../styles/Settings.module.css';
import { X } from 'lucide-react';

interface SettingsProps {
  onClose: () => void;
}

export default function SettingsPanel({ onClose }: SettingsProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} ${settingStyles.settingsModal}`} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={styles.closeButton}><X size={24} /></button>
        <h2>Settings</h2>

        <div className={settingStyles.section}>
            <h4>Profile</h4>
            <label>Name</label>
            <input type="text" defaultValue="User" />
            <label>Email</label>
            <input type="email" defaultValue="user@example.com" disabled />
        </div>
        
        <div className={settingStyles.section}>
            <h4>Change Password</h4>
            <label>Current Password</label>
            <input type="password" />
            <label>New Password</label>
            <input type="password" />
        </div>

        <div className={settingStyles.actions}>
            <button className={settingStyles.saveButton}>Save Changes</button>
            <button className={settingStyles.signOutButton}>Sign Out</button>
        </div>
      </div>
    </div>
  );
}