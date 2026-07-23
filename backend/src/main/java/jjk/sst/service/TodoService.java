package jjk.sst.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    public Todo create(String title, LocalDateTime dueDate, boolean dueTimeSet) {
        Todo todo = new Todo(title, false, dueDate, dueTimeSet);
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
    public Todo update(Long id, String title, LocalDateTime dueDate, boolean dueTimeSet) {
        Todo todo = findById(id);
        todo.updateTitle(title, dueDate, dueTimeSet);
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

    @Transactional(readOnly = true)
    public Page<Todo> findAllWithPaging(int page, int size, String sort) {
        Pageable pageable = PageRequest.of(page, size, createSort(sort));
        return todoRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Page<Todo> findByCompletedWithPaging(boolean completed, int page, int size, String sort) {
        Pageable pageable = PageRequest.of(page, size, createSort(sort));
        return todoRepository.findByCompleted(completed, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Todo> searchByTitleWithPaging(String keyword, int page, int size, String sort) {
        Pageable pageable = PageRequest.of(page, size, createSort(sort));
        return todoRepository.findByTitleContaining(keyword, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Todo> searchByTitleAndCompletedWithPaging(
            String keyword,
            boolean completed,
            int page,
            int size,
            String sort) {
        Pageable pageable = PageRequest.of(page, size, createSort(sort));
        return todoRepository.findByTitleContainingAndCompleted(keyword, completed, pageable);
    }
}
