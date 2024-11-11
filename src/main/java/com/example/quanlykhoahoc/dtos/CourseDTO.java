package com.example.quanlykhoahoc.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseDTO {
    private String courseName;
    private String description;
    private int instructorId;
    private Date startDate;
    private Date endDate;
    private BigDecimal tuition;
    private String status;
}