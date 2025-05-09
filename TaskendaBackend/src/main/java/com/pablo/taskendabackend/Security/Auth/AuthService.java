package com.pablo.taskendabackend.Security.Auth;

import com.pablo.taskendabackend.Entity.Role;
import com.pablo.taskendabackend.Entity.User;
import com.pablo.taskendabackend.Repository.UserRepository;
import com.pablo.taskendabackend.Security.Jwt.JwtService;
import com.pablo.taskendabackend.Security.Payload.JwtResponse;
import com.pablo.taskendabackend.Security.Payload.LoginRequest;
import com.pablo.taskendabackend.Security.Payload.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository repository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;

    public JwtResponse login(LoginRequest request) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        User user = repository.findByUsername(request.getUsername()).orElseThrow();
        String token = jwtService.getToken(user);

        JwtResponse.UserResponse userResponse = JwtResponse.UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .build();

        return JwtResponse.builder()
                .token(token)
                .user(userResponse)
                .build();
    }

    public JwtResponse register(RegisterRequest request) {
        // Verificar si el email ya existe
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("El email " + request.getEmail() + " ya está registrado");
        }

        // Verificar si el username ya existe
        if (repository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("El nombre de usuario " + request.getUsername() + " ya está registrado");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .role(Role.USER)
                .build();

        try {
            User savedUser = repository.save(user);
            String token = jwtService.getToken(savedUser);

            JwtResponse.UserResponse userResponse = JwtResponse.UserResponse.builder()
                    .id(savedUser.getId())
                    .username(savedUser.getUsername())
                    .email(savedUser.getEmail())
                    .firstname(savedUser.getFirstname())
                    .lastname(savedUser.getLastname())
                    .build();

            return JwtResponse.builder()
                    .token(token)
                    .user(userResponse)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Error al registrar el usuario: " + e.getMessage());
        }
    }
}
