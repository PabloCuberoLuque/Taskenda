package com.pablo.taskendabackend.Security.Auth;

import com.pablo.taskendabackend.Security.Payload.ErrorResponse;
import com.pablo.taskendabackend.Security.Payload.JwtResponse;
import com.pablo.taskendabackend.Security.Payload.LoginRequest;
import com.pablo.taskendabackend.Security.Payload.RegisterRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Authentication API")
public class AuthController {
    private final AuthService authService;

    @Operation(summary = "Login to the application")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Logged in successfully", content = @Content(schema = @Schema(implementation = JwtResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid username or password"),
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            JwtResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ErrorResponse.builder()
                            .message(e.getMessage())
                            .status(400)
                            .build());
        }
    }

    @Operation(summary = "Register a new user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Registered successfully", content = @Content(schema = @Schema(implementation = JwtResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid registration data"),
    })
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            JwtResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ErrorResponse.builder()
                            .message(e.getMessage())
                            .status(400)
                            .build());
        }
    }
}
