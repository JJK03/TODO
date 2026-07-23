package jjk.sst.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
    }

    public Todo(String title, boolean completed, LocalDateTime dueDate, boolean dueTimeSet) {
        this.title = title;
        this.completed = completed;
        this.dueDate = dueDate;
        this.dueTimeSet = dueTimeSet;
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
}
