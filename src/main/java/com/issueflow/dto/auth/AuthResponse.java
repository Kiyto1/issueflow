package com.issueflow.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private String token;

    private Long userId;

    private String name;

    private String email;

    private String role;
}