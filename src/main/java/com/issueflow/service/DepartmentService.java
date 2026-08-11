package com.issueflow.service;

import com.issueflow.dto.department.CreateDepartmentRequest;

import com.issueflow.entity.Department;

import com.issueflow.exception.BadRequestException;

import com.issueflow.repository.DepartmentRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository repository;

    public DepartmentService(
            DepartmentRepository repository) {

        this.repository = repository;
    }

    public List<Department> getAllDepartments() {

        return repository.findAll();
    }

    public Department createDepartment(
            CreateDepartmentRequest request) {

        if (repository.existsByNameIgnoreCase(
                request.getName())) {

            throw new BadRequestException(
                    "Department already exists"
            );
        }

        Department department =
                Department.builder()
                        .name(request.getName())
                        .build();

        return repository.save(department);
    }
}