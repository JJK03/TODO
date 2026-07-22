package jjk.sst.dto;

import jjk.sst.domain.Todo;
import lombok.Getter;

@Getter
public class TodoResponse {

    private Long id;
    private String title;
    private boolean completed;

    public TodoResponse(Todo todo) {
        this.id = todo.getId();
        this.title = todo.getTitle();
        this.completed = todo.isCompleted();
    }
}
