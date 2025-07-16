import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import styles from '../styles/Boards.module.css';
import { Plus } from 'lucide-react';
import TaskModal from './TaskModal';

// --- TYPE DEFINITIONS (No Changes) ---
interface Task {
  id: string;
  content: string;
  description?: string;
}
interface Column {
  id: string;
  title: string;
  taskIds: string[];
}
interface Board {
    id:string;
    name: string;
    tasks: Record<string, Task>;
    columns: Record<string, Column>;
    columnOrder: string[];
}

// --- MOCK DATA (No Changes) ---
const mockBoards: Record<string, Board> = {
    'board-1': {
        id: 'board-1', name: 'Project Phoenix',
        tasks: { 
            'task-1': { id: 'task-1', content: 'Design new logo' },
            'task-2': { id: 'task-2', content: 'Develop user auth flow' }
        },
        columns: { 'col-1': { id: 'col-1', title: 'To Do', taskIds: ['task-1', 'task-2'] } },
        columnOrder: ['col-1']
    },
    'board-2': {
        id: 'board-2', name: 'Personal Goals',
        tasks: { 'task-5': { id: 'task-5', content: 'Read 5 new books' } },
        columns: { 'col-5': { id: 'col-5', title: 'Q3 Goals', taskIds: ['task-5'] } },
        columnOrder: ['col-5']
    },
};

export default function Boards() {
  const [boards, setBoards] = useState<Record<string, Board>>(mockBoards);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const selectedBoard = selectedBoardId ? boards[selectedBoardId] : null;

  // --- FULLY CORRECTED onDragEnd FUNCTION ---
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // 1. Guard clauses to exit if the drag is invalid
    if (!destination || !selectedBoardId) {
        return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return;
    }

    const board = boards[selectedBoardId];
    const startColumn = board.columns[source.droppableId];
    const finishColumn = board.columns[destination.droppableId];

    // 2. Handling reordering within the same column
    if (startColumn === finishColumn) {
        const newTaskIds = Array.from(startColumn.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);

        const newColumn = {
            ...startColumn,
            taskIds: newTaskIds,
        };

        setBoards(prev => ({
            ...prev,
            [selectedBoardId]: {
                ...board,
                columns: {
                    ...board.columns,
                    [newColumn.id]: newColumn,
                },
            },
        }));
        return;
    }

    // 3. Handling moving a card to a different column
    const startTaskIds = Array.from(startColumn.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStartColumn = {
        ...startColumn,
        taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finishColumn.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinishColumn = {
        ...finishColumn,
        taskIds: finishTaskIds,
    };

    setBoards(prev => ({
        ...prev,
        [selectedBoardId]: {
            ...board,
            columns: {
                ...board.columns,
                [newStartColumn.id]: newStartColumn,
                [newFinishColumn.id]: newFinishColumn,
            },
        },
    }));
  };

  // --- CRUD Functions (Unchanged, they were already correct) ---
  const addColumn = () => {
    if (!selectedBoardId) return;
    const newColumnId = `col-${Date.now()}`;
    const newColumn: Column = { id: newColumnId, title: 'New Column', taskIds: [] };
    
    setBoards(prev => ({
        ...prev,
        [selectedBoardId]: {
            ...prev[selectedBoardId],
            columns: { ...prev[selectedBoardId].columns, [newColumnId]: newColumn },
            columnOrder: [...prev[selectedBoardId].columnOrder, newColumnId]
        }
    }));
  };

  const addTask = (columnId: string) => {
    if (!selectedBoardId) return;
    const newTaskId = `task-${Date.now()}`;
    const newTask: Task = { id: newTaskId, content: 'New Task' };

    setBoards(prev => {
        const board = prev[selectedBoardId];
        const column = board.columns[columnId];
        return {
            ...prev,
            [selectedBoardId]: {
                ...board,
                tasks: { ...board.tasks, [newTaskId]: newTask },
                columns: {
                    ...board.columns,
                    [columnId]: { ...column, taskIds: [...column.taskIds, newTaskId] }
                }
            }
        };
    });
  };


  // --- RENDER LOGIC (Unchanged) ---
  if (!selectedBoard) {
    return (
        <div className={styles.boardListContainer}>
            {Object.values(boards).map(board => (
                <div key={board.id} className={styles.boardCard} onClick={() => setSelectedBoardId(board.id)}>
                    <h3>{board.name}</h3>
                </div>
            ))}
            <div className={`${styles.boardCard} ${styles.newBoardCard}`}>
                <Plus size={32} />
                <span>Create New Board</span>
            </div>
        </div>
    );
  }

  return (
    <>
        {editingTask && <TaskModal task={editingTask} onClose={() => setEditingTask(null)} />}
        <div className={styles.boardHeader}>
            <h2>{selectedBoard.name}</h2>
            <button onClick={() => setSelectedBoardId(null)} className={styles.backButton}>&larr; Back to Boards</button>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className={styles.boardContainer}>
            {selectedBoard.columnOrder.map(columnId => {
              const column = selectedBoard.columns[columnId];
              const tasks = column.taskIds.map(taskId => selectedBoard.tasks[taskId]);
              return (
                <Droppable key={column.id} droppableId={column.id}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className={styles.column}>
                      <h3 className={styles.columnTitle}>{column.title}</h3>
                      <div className={styles.taskList}>
                        {tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`${styles.taskCard} ${snapshot.isDragging ? styles.dragging : ''}`}
                                onClick={() => setEditingTask(task)}
                              >
                                {task.content}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                      <button onClick={() => addTask(column.id)} className={styles.addTaskButton}>
                        <Plus size={16} /> Add a card
                      </button>
                    </div>
                  )}
                </Droppable>
              );
            })}
            <button onClick={addColumn} className={styles.addColumnButton}>
                <Plus size={16} /> Add another list
            </button>
          </div>
        </DragDropContext>
    </>
  );
}