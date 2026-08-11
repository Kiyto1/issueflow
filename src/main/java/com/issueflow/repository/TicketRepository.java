package com.issueflow.repository;

import com.issueflow.entity.Ticket;
import com.issueflow.enums.TicketStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository
        extends JpaRepository<Ticket, Long> {

    List<Ticket> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    List<Ticket> findByDepartmentIdOrderByCreatedAtDesc(Long departmentId);

    List<Ticket> findByAssignedAgentIdOrderByCreatedAtDesc(Long agentId);

    long countByStatus(TicketStatus status);
}