package com.issueflow.service;

import com.issueflow.dto.auth.AuthResponse;
import com.issueflow.dto.auth.LoginRequest;
import com.issueflow.dto.auth.RegisterRequest;

import com.issueflow.entity.User;

import com.issueflow.enums.Role;

import com.issueflow.exception.BadRequestException;

import com.issueflow.repository.UserRepository;

import com.issueflow.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;

        this.passwordEncoder = passwordEncoder;

        this.jwtService = jwtService;
    }

    public AuthResponse register(
            RegisterRequest request) {

        if (userRepository.existsByEmail(
                request.getEmail())) {

            throw new BadRequestException(
                    "Email already exists"
            );
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .role(Role.CUSTOMER)
                .active(true)
                .build();

        User savedUser =
                userRepository.save(user);

        String token =
                jwtService.generateToken(savedUser);

        return buildResponse(
                savedUser,
                token
        );
    }

    public AuthResponse login(
            LoginRequest request) {

        User user =
                userRepository.findByEmail(
                                request.getEmail()
                        )
                        .orElseThrow(
                                () ->
                                        new BadRequestException(
                                                "Invalid email or password"
                                        )
                        );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new BadRequestException(
                    "Invalid email or password"
            );
        }

        if (!user.isActive()) {

            throw new BadRequestException(
                    "Account is deactivated"
            );
        }

        String token =
                jwtService.generateToken(user);

        return buildResponse(user, token);
    }

    private AuthResponse buildResponse(
            User user,
            String token) {

        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}