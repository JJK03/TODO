package jjk.sst.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class TodoCreateRequest {

    @NotBlank(message = "제목 빈 칸 ㄴㄴ")
    private String title;
}
