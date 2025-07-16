import { useState } from 'react';
import styles from '../styles/DailyRoutines.module.css';

const mockRoutines = [
  { id: 1, text: 'Morning Workout', interval: 'Everyday' },
  { id: 2, text: 'Review Weekly Goals', interval: 'Mondays' },
  { id: 3, text: 'Clean the house', interval: 'Saturdays' },
];

const mockTodaysTasks = [
  { id: 1, text: 'Morning Workout', completed: true },
  { id: 2, text: 'Check Emails', completed: false },
];

export default function DailyRoutines() {
  const [routines, setRoutines] = useState(mockRoutines);
  const [todaysTasks, setTodaysTasks] = useState(mockTodaysTasks);

  const handleToggleTask = (taskId: number) => {
    setTodaysTasks(tasks =>
      tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className={styles.container}>
      {/* Left Column: Define Routines */}
      <div className={`${styles.column} ${styles.glassPanel}`}>
        <h2 className={styles.header}>Define Routines</h2>
        <form className={styles.form}>
          <input type="text" placeholder="New routine name..." className={styles.input} />
          <select className={styles.select}>
            <option>Everyday</option>
            <option>Weekdays</option>
            <option>Weekends</option>
            <option>Mondays</option>
            <option>Tuesdays</option>
          </select>
          <button type="submit" className={styles.button}>Add Routine</button>
        </form>
        <ul className={styles.list}>
          {routines.map(routine => (
            <li key={routine.id} className={styles.listItem}>
              <span>{routine.text} <span className={styles.intervalTag}>{routine.interval}</span></span>
              <button className={styles.deleteButton}>&times;</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Column: Today's Checklist */}
      <div className={`${styles.column} ${styles.glassPanel}`}>
        <h2 className={styles.header}>Today's Checklist</h2>
        <ul className={styles.list}>
          {todaysTasks.map(task => (
            <li key={task.id} className={`${styles.checklistItem} ${task.completed ? styles.completed : ''}`} onClick={() => handleToggleTask(task.id)}>
              <div className={styles.checkbox}>
                {task.completed && '✔'}
              </div>
              <span>{task.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}