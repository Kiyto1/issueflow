package com.issueflow.controller;

import com.issueflow.dto.ticket.TicketResponse;

import com.issueflow.dto.user.CreateAgentRequest;
import com.issueflow.dto.user.DashboardResponse;
import com.issueflow.dto.user.UserResponse;

import com.issueflow.service.TicketService;
import com.issueflow.service.UserService;

import jakarta.validation.Valid;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;

    private final TicketService ticketService;

    public AdminController(
            UserService userService,
            TicketService ticketService) {

        this.userService = userService;

        this.ticketService =
                ticketService;
    }

    @GetMapping("/users")
    public List<UserResponse> getUsers() {

        return userService.getAllUsers();
    }

    @PostMapping("/agents")
    public UserResponse createAgent(
            @Valid
            @RequestBody
            CreateAgentRequest request) {

        return userService
                .createAgent(request);
    }

    @GetMapping("/tickets")
    public List<TicketResponse> getTickets() {

        return ticketService
                .getAllTickets();
    }

    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {

        return ticketService
                .getDashboard();
    }
}