package jjk.sst.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jjk.sst.domain.TodoPriority;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class TodoCreateRequest {

    @NotBlank(message = "제목을 입력해주세요.")
    @Size(max = 100, message = "제목은 100자 이하로 입력해주세요.")
    private String title;

    private LocalDateTime dueDate;
    private boolean dueTimeSet;

    private TodoPriority priority;
}
