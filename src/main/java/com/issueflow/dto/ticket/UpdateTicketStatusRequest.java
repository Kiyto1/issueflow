package com.issueflow.dto.ticket;

import com.issueflow.enums.TicketStatus;

import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateTicketStatusRequest {

    @NotNull
    private TicketStatus status;
}