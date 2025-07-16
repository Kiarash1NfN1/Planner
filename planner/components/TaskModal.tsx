import styles from '../styles/TaskModal.module.css';
import { X, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  content: string;
  description?: string;
}

interface TaskModalProps {
  task: Task;
  onClose: () => void;
}

export default function TaskModal({ task, onClose }: TaskModalProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={styles.closeButton}><X size={24} /></button>
        
        <input className={styles.titleInput} defaultValue={task.content} />
        
        <div className={styles.section}>
            <h4>Description</h4>
            <textarea 
              className={styles.textarea}
              placeholder="Add a more detailed description..."
              defaultValue={task.description || ''}
            />
        </div>

        <div className={styles.actions}>
            <button className={styles.deleteButton}><Trash2 size={16} /> Delete Task</button>
        </div>
      </div>
    </div>
  );
}