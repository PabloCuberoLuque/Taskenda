import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Tabs,
    Tab,
    Alert,
} from '@mui/material';
import { login, register } from '../services/api';

interface AuthProps {
    onAuthSuccess: (userId: number) => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                const response = await login(username, password);
                localStorage.setItem('token', response.token);
                onAuthSuccess(response.user.id);
            } else {
                const response = await register(username, email, password, firstname, lastname);
                localStorage.setItem('token', response.token);
                onAuthSuccess(response.user.id);
            }
        } catch (error: any) {
            console.error('Error detallado:', error);
            setError(error.message || 'Error en la autenticación. Por favor, intenta de nuevo.');
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Tabs
                    value={isLogin ? 0 : 1}
                    onChange={(_, newValue) => setIsLogin(newValue === 0)}
                    sx={{ mb: 3 }}
                >
                    <Tab label="Iniciar Sesión" />
                    <Tab label="Registrarse" />
                </Tabs>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        margin="normal"
                        required
                    />
                    {!isLogin && (
                        <>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Nombre"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Apellido"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                margin="normal"
                                required
                            />
                        </>
                    )}
                    <TextField
                        fullWidth
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}; 