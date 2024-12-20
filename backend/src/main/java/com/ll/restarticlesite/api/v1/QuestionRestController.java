@GetMapping("/{id}")
@Cacheable(value = "questions", key = "#id")
public ResponseEntity<QuestionDetailResponse> getQuestionDetail(...) 