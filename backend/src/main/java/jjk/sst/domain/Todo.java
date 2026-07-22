package jjk.sst.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

    public Todo(String title, boolean completed) {
        this.title = title;
        this.completed = completed;
    }

    public void update(String title, boolean completed) {
        this.title = title;
        this.completed = completed;
    }

    public void toggle() {
        this.completed = !this.completed;
    }
}
