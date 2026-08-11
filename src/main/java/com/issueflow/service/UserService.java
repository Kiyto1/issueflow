package com.issueflow.service;

import com.issueflow.dto.user.CreateAgentRequest;
import com.issueflow.dto.user.UserResponse;

import com.issueflow.entity.Department;
import com.issueflow.entity.User;

import com.issueflow.enums.Role;

import com.issueflow.exception.BadRequestException;
import com.issueflow.exception.ResourceNotFoundException;

import com.issueflow.repository.DepartmentRepository;
import com.issueflow.repository.UserRepository;

import org.springframework.security.core.Authentication;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final DepartmentRepository departmentRepository;

    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            DepartmentRepository departmentRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;

        this.departmentRepository =
                departmentRepository;

        this.passwordEncoder = passwordEncoder;
    }

    public User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null) {

            throw new BadRequestException(
                    "User is not authenticated"
            );
        }

        return userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(
                        () ->
                                new ResourceNotFoundException(
                                        "User not found"
                                )
                );
    }

    public UserResponse createAgent(
            CreateAgentRequest request) {

        if (userRepository.existsByEmail(
                request.getEmail())) {

            throw new BadRequestException(
                    "Email already exists"
            );
        }

        Department department =
                departmentRepository
                        .findById(
                                request.getDepartmentId()
                        )
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Department not found"
                                        )
                        );

        User agent = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .role(Role.AGENT)
                .active(true)
                .department(department)
                .build();

        return mapUser(
                userRepository.save(agent)
        );
    }

    public List<UserResponse> getAllUsers() {

        return userRepository
                .findAll()
                .stream()
                .map(this::mapUser)
                .toList();
    }

    private UserResponse mapUser(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .active(user.isActive())
                .departmentId(
                        user.getDepartment() == null
                                ? null
                                : user.getDepartment().getId()
                )
                .departmentName(
                        user.getDepartment() == null
                                ? null
                                : user.getDepartment().getName()
                )
                .build();
    }
}