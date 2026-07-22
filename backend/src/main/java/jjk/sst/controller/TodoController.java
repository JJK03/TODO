package jjk.sst.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import jjk.sst.domain.Todo;
import jjk.sst.dto.TodoCreateRequest;
import jjk.sst.dto.TodoResponse;
import jjk.sst.dto.TodoUpdateRequest;
import jjk.sst.service.TodoService;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequiredArgsConstructor
@RequestMapping("/todos")
public class TodoController {

    private final TodoService todoService;

    @PostMapping
    public TodoResponse create(@Valid @RequestBody TodoCreateRequest request) {
        Todo todo = todoService.create(request.getTitle());
        return new TodoResponse(todo);
    }

    @GetMapping
    public List<TodoResponse> findAll(
            @RequestParam(name = "completed", required = false) Boolean completed,
            @RequestParam(name = "sort", defaultValue = "desc") String sort) {

        List<Todo> todos;

        if (completed == null) {
            todos = todoService.findAll(sort);
        } else {
            todos = todoService.findByCompleted(completed, sort);
        }

        return todos.stream()
                .map(TodoResponse::new)
                .toList();
    }

    @GetMapping("/search")
    public List<TodoResponse> search(
            @RequestParam(name = "keyword") String keyword,
            @RequestParam(name = "sort", defaultValue = "desc") String sort) {
        return todoService.searchByTitle(keyword, sort).stream().map(TodoResponse::new).toList();
    }

    @GetMapping("/{id}")
    public TodoResponse findById(@PathVariable(name = "id") Long id) {
        Todo todo = todoService.findById(id);
        return new TodoResponse(todo);
    }

    @PutMapping("/{id}")
    public TodoResponse update(
            @PathVariable(name = "id") Long id,
            @Valid @RequestBody TodoUpdateRequest request) {
        Todo todo = todoService.update(id, request.getTitle());
        return new TodoResponse(todo);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable(name = "id") Long id) {
        todoService.delete(id);
    }

    @PatchMapping("/{id}/toggle")
    public TodoResponse toggle(@PathVariable(name = "id") Long id) {
        Todo todo = todoService.toggle(id);
        return new TodoResponse(todo);
    }

}