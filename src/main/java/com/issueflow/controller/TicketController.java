package com.issueflow.controller;

import com.issueflow.dto.ticket.CreateTicketRequest;
import com.issueflow.dto.ticket.TicketResponse;
import com.issueflow.dto.ticket.UpdateTicketStatusRequest;

import com.issueflow.service.TicketService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(
            TicketService ticketService) {

        this.ticketService =
                ticketService;
    }

    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(
            @Valid
            @RequestBody CreateTicketRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ticketService
                                .createTicket(request)
                );
    }

    @GetMapping("/my")
    public List<TicketResponse> getMyTickets() {

        return ticketService.getMyTickets();
    }

    @GetMapping("/department")
    public List<TicketResponse>
    getDepartmentTickets() {

        return ticketService
                .getDepartmentTickets();
    }

    @GetMapping("/{id}")
    public TicketResponse getTicket(
            @PathVariable Long id) {

        return ticketService
                .getTicketById(id);
    }

    @PatchMapping("/{id}/take")
    public TicketResponse takeTicket(
            @PathVariable Long id) {

        return ticketService
                .takeTicket(id);
    }

    @PatchMapping("/{id}/status")
    public TicketResponse updateStatus(
            @PathVariable Long id,
            @Valid
            @RequestBody
            UpdateTicketStatusRequest request) {

        return ticketService.updateStatus(
                id,
                request
        );
    }
}