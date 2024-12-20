@Data
public class QuestionCreateRequest {
    @NotBlank(message = "제목은 필수입니다")
    private String subject;
    
    @NotBlank(message = "내용은 필수입니다")
    @Size(min = 10, message = "내용은 최소 10자 이상이어야 합니다")
    private String content;
    
    @NotNull(message = "카테고리는 필수입니다")
    private Category category;
} 