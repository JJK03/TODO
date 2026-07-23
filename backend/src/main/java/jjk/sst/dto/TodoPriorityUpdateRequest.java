package jjk.sst.dto;

import jjk.sst.domain.TodoPriority;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class TodoPriorityUpdateRequest {

    private TodoPriority priority;
}
