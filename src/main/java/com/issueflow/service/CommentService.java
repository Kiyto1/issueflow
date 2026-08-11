package com.issueflow.service;

import com.issueflow.dto.comment.CommentResponse;
import com.issueflow.dto.comment.CreateCommentRequest;

import com.issueflow.entity.Comment;
import com.issueflow.entity.Ticket;
import com.issueflow.entity.User;

import com.issueflow.enums.Role;

import com.issueflow.exception.ForbiddenException;

import com.issueflow.repository.CommentRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;

    private final TicketService ticketService;

    private final UserService userService;

    public CommentService(
            CommentRepository commentRepository,
            TicketService ticketService,
            UserService userService) {

        this.commentRepository =
                commentRepository;

        this.ticketService =
                ticketService;

        this.userService =
                userService;
    }

    public CommentResponse addComment(
            Long ticketId,
            CreateCommentRequest request) {

        Ticket ticket =
                ticketService
                        .getAccessibleTicket(
                                ticketId
                        );

        User user =
                userService.getCurrentUser();

        if (user.getRole()
                == Role.CUSTOMER) {

            if (!ticket.getCustomer()
                    .getId()
                    .equals(user.getId())) {

                throw new ForbiddenException(
                        "This is not your ticket"
                );
            }
        }

        if (user.getRole()
                == Role.AGENT) {

            if (ticket.getAssignedAgent()
                    == null
                    || !ticket
                    .getAssignedAgent()
                    .getId()
                    .equals(user.getId())) {

                throw new ForbiddenException(
                        "You must take the ticket before commenting"
                );
            }
        }

        Comment comment =
                Comment.builder()
                        .content(
                                request.getContent()
                        )
                        .ticket(ticket)
                        .author(user)
                        .build();

        return mapComment(
                commentRepository.save(comment)
        );
    }

    public List<CommentResponse> getComments(
            Long ticketId) {

        ticketService
                .getAccessibleTicket(ticketId);

        return commentRepository
                .findByTicketIdOrderByCreatedAtAsc(
                        ticketId
                )
                .stream()
                .map(this::mapComment)
                .toList();
    }

    private CommentResponse mapComment(
            Comment comment) {

        return CommentResponse.builder()
                .id(comment.getId())
                .content(
                        comment.getContent()
                )
                .authorId(
                        comment.getAuthor()
                                .getId()
                )
                .authorName(
                        comment.getAuthor()
                                .getName()
                )
                .authorRole(
                        comment.getAuthor()
                                .getRole()
                                .name()
                )
                .createdAt(
                        comment.getCreatedAt()
                )
                .build();
    }
}