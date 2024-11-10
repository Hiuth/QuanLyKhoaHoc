package com.example.quanlykhoahoc.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InstructorDTO {
    //private int id;
    private String name;
    private String email;
    private String phone;
    private String expertise;
}
