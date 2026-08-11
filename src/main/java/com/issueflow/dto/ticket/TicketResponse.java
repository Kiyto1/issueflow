package com.issueflow.dto.ticket;

import com.issueflow.enums.TicketPriority;
import com.issueflow.enums.TicketStatus;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class TicketResponse {

    private Long id;

    private String title;

    private String description;

    private TicketStatus status;

    private TicketPriority priority;

    private Long customerId;

    private String customerName;

    private Long departmentId;

    private String departmentName;

    private Long assignedAgentId;

    private String assignedAgentName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}