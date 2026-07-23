package jjk.sst.controller;

import org.springframework.data.domain.Page;
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

    @GetMapping
    public Page<TodoResponse> findAll(
            @RequestParam(name = "completed", required = false) Boolean completed,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "6") int size,
            @RequestParam(name = "sort", defaultValue = "desc") String sort) {

        Page<Todo> todos;

        if (completed == null) {
            todos = todoService.findAllWithPaging(page, size, sort);
        } else {
            todos = todoService.findByCompletedWithPaging(completed, page, size, sort);
        }

        return todos.map(TodoResponse::new);
    }

    @GetMapping("/search")
    public Page<TodoResponse> search(
            @RequestParam(name = "keyword") String keyword,
            @RequestParam(name = "completed", required = false) Boolean completed,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "6") int size,
            @RequestParam(name = "sort", defaultValue = "desc") String sort) {

        Page<Todo> todos;

        if (completed == null) {
            todos = todoService.searchByTitleWithPaging(keyword, page, size, sort);
        } else {
            todos = todoService.searchByTitleAndCompletedWithPaging(keyword, completed, page, size, sort);
        }

        return todos.map(TodoResponse::new);
    }

}
