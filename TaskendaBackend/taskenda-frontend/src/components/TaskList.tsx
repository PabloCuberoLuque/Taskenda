import React, { useState, useEffect } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Checkbox,
    TextField,
    Button,
    Typography,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    AppBar,
    Toolbar,
    FormControlLabel,
    Switch,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Logout as LogoutIcon, Star as StarIcon } from '@mui/icons-material';
import { Task } from '../types';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';

interface TaskListProps {
    onLogout: () => void;
    userId: number;
}

export const TaskList: React.FC<TaskListProps> = ({ onLogout, userId }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskImportant, setNewTaskImportant] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [error, setError] = useState('');

    const loadTasks = async () => {
        try {
            const fetchedTasks = await getTasks(userId);
            setTasks(fetchedTasks);
            setError('');
        } catch (error) {
            console.error('Error al cargar las tareas:', error);
            setError('Error al cargar las tareas. Por favor, intenta de nuevo.');
        }
    };

    useEffect(() => {
        loadTasks();
    }, [userId]);

    const handleCreateTask = async () => {
        if (!newTaskTitle.trim()) return;

        try {
            const task = await createTask({
                title: newTaskTitle,
                description: newTaskDescription,
                finished: false,
                important: newTaskImportant,
                date: new Date().toISOString(),
            }, userId);
            setTasks([...tasks, task]);
            setNewTaskTitle('');
            setNewTaskDescription('');
            setNewTaskImportant(false);
            setError('');
        } catch (error) {
            console.error('Error al crear la tarea:', error);
            setError('Error al crear la tarea. Por favor, intenta de nuevo.');
        }
    };

    const handleUpdateTask = async (task: Task) => {
        try {
            const updatedTask = await updateTask(task.id, {
                ...task,
                finished: !task.finished,
            }, userId);
            setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
            setError('');
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
            setError('Error al actualizar la tarea. Por favor, intenta de nuevo.');
        }
    };

    const handleDeleteTask = async (id: number) => {
        try {
            await deleteTask(id);
            setTasks(tasks.filter((task) => task.id !== id));
            setError('');
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
            setError('Error al eliminar la tarea. Por favor, intenta de nuevo.');
        }
    };

    const handleEditTask = async () => {
        if (!editingTask) return;

        try {
            const updatedTask = await updateTask(editingTask.id, editingTask, userId);
            setTasks(tasks.map((t) => (t.id === editingTask.id ? updatedTask : t)));
            setOpenDialog(false);
            setEditingTask(null);
            setError('');
        } catch (error) {
            console.error('Error al editar la tarea:', error);
            setError('Error al editar la tarea. Por favor, intenta de nuevo.');
        }
    };

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Mis Tareas
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Nueva Tarea
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Título"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Descripción"
                            value={newTaskDescription}
                            onChange={(e) => setNewTaskDescription(e.target.value)}
                            multiline
                            rows={3}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={newTaskImportant}
                                    onChange={(e) => setNewTaskImportant(e.target.checked)}
                                    color="warning"
                                />
                            }
                            label="Importante"
                        />
                        <Button
                            variant="contained"
                            onClick={handleCreateTask}
                            disabled={!newTaskTitle.trim()}
                        >
                            Agregar
                        </Button>
                    </Box>
                </Paper>

                <List>
                    {tasks.map((task) => (
                        <ListItem
                            key={task.id}
                            sx={{
                                mb: 1,
                                bgcolor: 'background.paper',
                                borderRadius: 1,
                                borderLeft: task.important ? '4px solid #ff9800' : 'none',
                            }}
                        >
                            <Checkbox
                                checked={task.finished}
                                onChange={() => handleUpdateTask(task)}
                            />
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {task.title}
                                        {task.important && <StarIcon color="warning" />}
                                    </Box>
                                }
                                secondary={
                                    <>
                                        {task.description}
                                        <br />
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(task.date).toLocaleDateString()}
                                        </Typography>
                                    </>
                                }
                                sx={{
                                    textDecoration: task.finished ? 'line-through' : 'none',
                                }}
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    onClick={() => {
                                        setEditingTask(task);
                                        setOpenDialog(true);
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    onClick={() => handleDeleteTask(task.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Editar Tarea</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Título"
                            value={editingTask?.title || ''}
                            onChange={(e) =>
                                setEditingTask(
                                    editingTask
                                        ? { ...editingTask, title: e.target.value }
                                        : null
                                )
                            }
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Descripción"
                            value={editingTask?.description || ''}
                            onChange={(e) =>
                                setEditingTask(
                                    editingTask
                                        ? { ...editingTask, description: e.target.value }
                                        : null
                                )
                            }
                            margin="normal"
                            multiline
                            rows={4}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={editingTask?.important || false}
                                    onChange={(e) =>
                                        setEditingTask(
                                            editingTask
                                                ? { ...editingTask, important: e.target.checked }
                                                : null
                                        )
                                    }
                                    color="warning"
                                />
                            }
                            label="Importante"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                        <Button onClick={handleEditTask} variant="contained">
                            Guardar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}; 