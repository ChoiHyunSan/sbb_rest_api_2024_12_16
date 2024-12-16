package com.ll.restarticlesite.api.dto.request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class QuestionListRequest {
    private int page = 0;
    private String kw = "";
    private String sort = "createdAt";
}
