package com.ll.restarticlesite.global.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Builder
@AllArgsConstructor
public class ErrorResponse {
    private final int status;
    private final String message;
    private final Map<String, String> errors;
    private final LocalDateTime timestamp;
}
