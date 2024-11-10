package com.example.quanlykhoahoc.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class CourseService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Gọi stored procedure để hủy đăng ký
    public void unregisterStudentFromCourse(int studentId, int courseId) {
        String sql = "{call UnregisterStudentFromCourse(?, ?)}";
        jdbcTemplate.update(sql, studentId, courseId);
    }
}
