package jjk.sst.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jjk.sst.domain.Todo;
import jjk.sst.exception.TodoNotFoundException;
import jjk.sst.repository.TodoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TodoService {
    private final TodoRepository todoRepository;

    private Sort createSort(String sort) {
        Sort.Direction direction = "asc".equalsIgnoreCase(sort) ? Sort.Direction.ASC : Sort.Direction.DESC;

        return Sort.by(direction, "id");
    }

    @Transactional
    public Todo create(String title) {
        Todo todo = new Todo(title, false);
        return todoRepository.save(todo);
    }

    @Transactional(readOnly = true)
    public List<Todo> findAll(String sort) {
        return todoRepository.findAll(createSort(sort));
    }

    @Transactional(readOnly = true)
    public Todo findById(Long id) {
        return todoRepository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException(id));
    }

    @Transactional
    public Todo update(Long id, String title, boolean completed) {
        Todo todo = findById(id);
        todo.update(title, completed);
        return todo;
    }

    @Transactional
    public void delete(Long id) {
        Todo todo = findById(id);
        todoRepository.deleteById(todo.getId());
    }

    @Transactional
    public Todo toggle(Long id) {
        Todo todo = findById(id);
        todo.toggle();

        return todo;
    }

    @Transactional(readOnly = true)
    public List<Todo> findByCompleted(boolean completed, String sort) {
        return todoRepository.findByCompleted(completed, createSort(sort));
    }

    @Transactional(readOnly = true)
    public List<Todo> searchByTitle(String keyword, String sort) {
        return todoRepository.findByTitleContaining(keyword, createSort(sort));
    }
}
