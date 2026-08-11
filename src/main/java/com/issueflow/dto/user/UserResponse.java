package com.issueflow.dto.user;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponse {

    private Long id;

    private String name;

    private String email;

    private String role;

    private boolean active;

    private Long departmentId;

    private String departmentName;
}