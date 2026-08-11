package com.issueflow.controller;

import com.issueflow.dto.department.CreateDepartmentRequest;

import com.issueflow.entity.Department;

import com.issueflow.service.DepartmentService;

import jakarta.validation.Valid;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(
            DepartmentService departmentService) {

        this.departmentService =
                departmentService;
    }

    @GetMapping
    public List<Department> getDepartments() {

        return departmentService
                .getAllDepartments();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Department createDepartment(
            @Valid
            @RequestBody
            CreateDepartmentRequest request) {

        return departmentService
                .createDepartment(request);
    }
}