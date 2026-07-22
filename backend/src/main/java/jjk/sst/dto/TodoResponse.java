package jjk.sst.dto;

import java.time.LocalDateTime;

import jjk.sst.domain.Todo;
import lombok.Getter;

@Getter
public class TodoResponse {

    private Long id;
    private String title;
    private boolean completed;
    private LocalDateTime createdAt;

    public TodoResponse(Todo todo) {
        this.id = todo.getId();
        this.title = todo.getTitle();
        this.completed = todo.isCompleted();
        this.createdAt = todo.getCreatedAt();
    }
}
