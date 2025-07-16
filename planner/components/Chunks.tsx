import { useState } from 'react';
import styles from '../styles/Chunks.module.css';

// Mock Data
const mockChunks = [
  {
    id: 1,
    title: 'Q3 Book List',
    endDate: '2025-09-30',
    items: [
      { id: 1, text: 'The Three-Body Problem', completed: true },
      { id: 2, text: 'Dune Messiah', completed: false },
      { id: 3, text: 'Hyperion', completed: false },
    ]
  },
  {
    id: 2,
    title: 'Movies to Watch',
    endDate: '2025-08-31',
    items: [
      { id: 1, text: 'Oppenheimer', completed: true },
      { id: 2, text: 'Interstellar', completed: true },
    ]
  }
];

export default function Chunks() {
  const [chunks, setChunks] = useState(mockChunks);

  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className={styles.container}>
      {chunks.map(chunk => {
        const completedCount = chunk.items.filter(item => item.completed).length;
        const totalCount = chunk.items.length;
        const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
        const daysLeft = getDaysLeft(chunk.endDate);

        return (
          <div key={chunk.id} className={styles.chunkCard}>
            <div className={styles.cardHeader}>
              <h3>{chunk.title}</h3>
              <span className={styles.daysLeft}>{daysLeft} days left</span>
            </div>
            <div className={styles.progressBarContainer}>
              <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
            </div>
            <ul className={styles.list}>
              {chunk.items.map(item => (
                <li key={item.id} className={`${styles.checklistItem} ${item.completed ? styles.completed : ''}`}>
                  <div className={styles.checkbox}>
                    {item.completed && '✔'}
                  </div>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
            <form className={styles.form}>
              <input type="text" placeholder="Add new item..." className={styles.input} />
              <button type="submit" className={styles.button}>+</button>
            </form>
          </div>
        );
      })}
       {/* Add New Chunk Card - simplified for brevity */}
      <div className={styles.newChunkCard}>
          <h3>+ Create New Chunk</h3>
      </div>
    </div>
  );
}