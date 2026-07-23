package jjk.sst.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private boolean completed;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    private LocalDateTime dueDate;
    private boolean dueTimeSet;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TodoPriority priority;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
    }

    public Todo(String title, boolean completed, LocalDateTime dueDate, boolean dueTimeSet, TodoPriority priority) {
        this.title = title;
        this.completed = completed;
        this.dueDate = dueDate;
        this.dueTimeSet = dueTimeSet;
        this.priority = priority;
    }

    public void updateTitle(String title, LocalDateTime dueDate, boolean dueTimeSet) {
        this.title = title;
        this.dueDate = dueDate;
        this.dueTimeSet = dueTimeSet;
        this.updatedAt = LocalDateTime.now();
    }

    public void toggle() {
        this.completed = !this.completed;
    }

    public void updatePriority(TodoPriority priority) {
        this.priority = priority;
        this.updatedAt = LocalDateTime.now();
    }
}
