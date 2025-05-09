import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Auth } from './components/Auth';
import { TaskList } from './components/TaskList';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        if (token && storedUserId) {
            setIsAuthenticated(true);
            setUserId(parseInt(storedUserId));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setIsAuthenticated(false);
        setUserId(null);
    };

    const handleAuthSuccess = (userId: number) => {
        setIsAuthenticated(true);
        setUserId(userId);
        localStorage.setItem('userId', userId.toString());
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Taskenda
                    </Typography>
                    {isAuthenticated && (
                        <Button color="inherit" onClick={handleLogout}>
                            Cerrar Sesión
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
            <Container>
                {isAuthenticated && userId ? (
                    <TaskList onLogout={handleLogout} userId={userId} />
                ) : (
                    <Auth onAuthSuccess={handleAuthSuccess} />
                )}
            </Container>
        </ThemeProvider>
    );
}

export default App;
