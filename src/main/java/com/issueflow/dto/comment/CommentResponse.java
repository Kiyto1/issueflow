package com.issueflow.dto.comment;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CommentResponse {

    private Long id;

    private String content;

    private Long authorId;

    private String authorName;

    private String authorRole;

    private LocalDateTime createdAt;
}