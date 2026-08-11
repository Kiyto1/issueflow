package com.issueflow.controller;

import com.issueflow.dto.comment.CommentResponse;
import com.issueflow.dto.comment.CreateCommentRequest;

import com.issueflow.service.CommentService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(
        "/api/tickets/{ticketId}/comments"
)
public class CommentController {

    private final CommentService commentService;

    public CommentController(
            CommentService commentService) {

        this.commentService =
                commentService;
    }

    @PostMapping
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long ticketId,
            @Valid
            @RequestBody
            CreateCommentRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        commentService.addComment(
                                ticketId,
                                request
                        )
                );
    }

    @GetMapping
    public List<CommentResponse> getComments(
            @PathVariable Long ticketId) {

        return commentService
                .getComments(ticketId);
    }
}