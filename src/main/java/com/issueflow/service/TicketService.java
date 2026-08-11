package com.issueflow.service;

import com.issueflow.dto.ticket.CreateTicketRequest;
import com.issueflow.dto.ticket.TicketResponse;
import com.issueflow.dto.ticket.UpdateTicketStatusRequest;

import com.issueflow.dto.user.DashboardResponse;

import com.issueflow.entity.Department;
import com.issueflow.entity.Ticket;
import com.issueflow.entity.User;

import com.issueflow.enums.Role;
import com.issueflow.enums.TicketStatus;

import com.issueflow.exception.BadRequestException;
import com.issueflow.exception.ForbiddenException;
import com.issueflow.exception.ResourceNotFoundException;

import com.issueflow.repository.DepartmentRepository;
import com.issueflow.repository.TicketRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    private final DepartmentRepository departmentRepository;

    private final UserService userService;

    public TicketService(
            TicketRepository ticketRepository,
            DepartmentRepository departmentRepository,
            UserService userService) {

        this.ticketRepository = ticketRepository;

        this.departmentRepository =
                departmentRepository;

        this.userService = userService;
    }

    public TicketResponse createTicket(
            CreateTicketRequest request) {

        User customer =
                userService.getCurrentUser();

        if (customer.getRole()
                != Role.CUSTOMER) {

            throw new ForbiddenException(
                    "Only customers can create tickets"
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

        Ticket ticket = Ticket.builder()
                .title(request.getTitle())
                .description(
                        request.getDescription()
                )
                .priority(
                        request.getPriority()
                )
                .status(TicketStatus.OPEN)
                .customer(customer)
                .department(department)
                .assignedAgent(null)
                .build();

        return mapTicket(
                ticketRepository.save(ticket)
        );
    }

    public List<TicketResponse> getMyTickets() {

        User customer =
                userService.getCurrentUser();

        if (customer.getRole()
                != Role.CUSTOMER) {

            throw new ForbiddenException(
                    "Only customers can use this endpoint"
            );
        }

        return ticketRepository
                .findByCustomerIdOrderByCreatedAtDesc(
                        customer.getId()
                )
                .stream()
                .map(this::mapTicket)
                .toList();
    }

    public List<TicketResponse> getDepartmentTickets() {

        User agent =
                userService.getCurrentUser();

        if (agent.getRole() != Role.AGENT) {

            throw new ForbiddenException(
                    "Only agents can view department tickets"
            );
        }

        if (agent.getDepartment() == null) {

            throw new BadRequestException(
                    "Agent has no department"
            );
        }

        return ticketRepository
                .findByDepartmentIdOrderByCreatedAtDesc(
                        agent.getDepartment().getId()
                )
                .stream()
                .map(this::mapTicket)
                .toList();
    }

    public TicketResponse takeTicket(Long ticketId) {

        User agent =
                userService.getCurrentUser();

        if (agent.getRole() != Role.AGENT) {

            throw new ForbiddenException(
                    "Only agents can take tickets"
            );
        }

        Ticket ticket =
                findTicket(ticketId);

        if (!ticket.getDepartment()
                .getId()
                .equals(
                        agent.getDepartment().getId()
                )) {

            throw new ForbiddenException(
                    "Ticket belongs to another department"
            );
        }

        if (ticket.getAssignedAgent() != null) {

            throw new BadRequestException(
                    "Ticket is already assigned"
            );
        }

        if (ticket.getStatus()
                == TicketStatus.RESOLVED
                || ticket.getStatus()
                == TicketStatus.CLOSED) {

            throw new BadRequestException(
                    "Ticket cannot be taken"
            );
        }

        ticket.setAssignedAgent(agent);

        ticket.setStatus(
                TicketStatus.IN_PROGRESS
        );

        return mapTicket(
                ticketRepository.save(ticket)
        );
    }

    public TicketResponse updateStatus(
            Long ticketId,
            UpdateTicketStatusRequest request) {

        User currentUser =
                userService.getCurrentUser();

        Ticket ticket =
                findTicket(ticketId);

        if (currentUser.getRole() == Role.ADMIN) {

            ticket.setStatus(
                    request.getStatus()
            );

            return mapTicket(
                    ticketRepository.save(ticket)
            );
        }

        if (currentUser.getRole() == Role.AGENT) {

            if (ticket.getAssignedAgent() == null
                    || !ticket.getAssignedAgent()
                    .getId()
                    .equals(currentUser.getId())) {

                throw new ForbiddenException(
                        "Ticket is not assigned to you"
                );
            }

            if (request.getStatus()
                    == TicketStatus.CLOSED) {

                throw new BadRequestException(
                        "Agent cannot close the ticket"
                );
            }

            ticket.setStatus(
                    request.getStatus()
            );

            return mapTicket(
                    ticketRepository.save(ticket)
            );
        }

        if (currentUser.getRole()
                == Role.CUSTOMER) {

            boolean ownsTicket =
                    ticket.getCustomer()
                            .getId()
                            .equals(
                                    currentUser.getId()
                            );

            if (!ownsTicket) {

                throw new ForbiddenException(
                        "This is not your ticket"
                );
            }

            if (ticket.getStatus()
                    != TicketStatus.RESOLVED
                    || request.getStatus()
                    != TicketStatus.CLOSED) {

                throw new BadRequestException(
                        "Customer can only close a resolved ticket"
                );
            }

            ticket.setStatus(
                    TicketStatus.CLOSED
            );

            return mapTicket(
                    ticketRepository.save(ticket)
            );
        }

        throw new ForbiddenException(
                "You cannot update this ticket"
        );
    }

    public TicketResponse getTicketById(
            Long ticketId) {

        return mapTicket(
                getAccessibleTicket(ticketId)
        );
    }

    public Ticket getAccessibleTicket(
            Long ticketId) {

        User currentUser =
                userService.getCurrentUser();

        Ticket ticket =
                findTicket(ticketId);

        if (currentUser.getRole()
                == Role.ADMIN) {

            return ticket;
        }

        if (currentUser.getRole()
                == Role.CUSTOMER) {

            if (!ticket.getCustomer()
                    .getId()
                    .equals(
                            currentUser.getId()
                    )) {

                throw new ForbiddenException(
                        "You cannot access this ticket"
                );
            }

            return ticket;
        }

        if (currentUser.getRole()
                == Role.AGENT) {

            if (currentUser.getDepartment()
                    == null
                    || !ticket.getDepartment()
                    .getId()
                    .equals(
                            currentUser
                                    .getDepartment()
                                    .getId()
                    )) {

                throw new ForbiddenException(
                        "Ticket belongs to another department"
                );
            }

            return ticket;
        }

        throw new ForbiddenException(
                "You cannot access this ticket"
        );
    }

    public List<TicketResponse> getAllTickets() {

        return ticketRepository
                .findAll()
                .stream()
                .map(this::mapTicket)
                .toList();
    }

    public DashboardResponse getDashboard() {

        return new DashboardResponse(
                ticketRepository.count(),
                ticketRepository.countByStatus(
                        TicketStatus.OPEN
                ),
                ticketRepository.countByStatus(
                        TicketStatus.IN_PROGRESS
                ),
                ticketRepository.countByStatus(
                        TicketStatus.RESOLVED
                ),
                ticketRepository.countByStatus(
                        TicketStatus.CLOSED
                )
        );
    }

    private Ticket findTicket(Long id) {

        return ticketRepository
                .findById(id)
                .orElseThrow(
                        () ->
                                new ResourceNotFoundException(
                                        "Ticket not found"
                                )
                );
    }

    private TicketResponse mapTicket(
            Ticket ticket) {

        return TicketResponse.builder()
                .id(ticket.getId())
                .title(ticket.getTitle())
                .description(
                        ticket.getDescription()
                )
                .status(ticket.getStatus())
                .priority(ticket.getPriority())

                .customerId(
                        ticket.getCustomer().getId()
                )
                .customerName(
                        ticket.getCustomer().getName()
                )

                .departmentId(
                        ticket.getDepartment().getId()
                )
                .departmentName(
                        ticket.getDepartment().getName()
                )

                .assignedAgentId(
                        ticket.getAssignedAgent()
                                == null
                                ? null
                                : ticket
                                .getAssignedAgent()
                                .getId()
                )

                .assignedAgentName(
                        ticket.getAssignedAgent()
                                == null
                                ? null
                                : ticket
                                .getAssignedAgent()
                                .getName()
                )

                .createdAt(
                        ticket.getCreatedAt()
                )
                .updatedAt(
                        ticket.getUpdatedAt()
                )
                .build();
    }
}