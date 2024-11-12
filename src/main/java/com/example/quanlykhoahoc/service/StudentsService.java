package com.example.quanlykhoahoc.service;

import com.example.quanlykhoahoc.dtos.StudentDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StudentsService {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> getAllStudents() {
        String sql = "SELECT * FROM Students";
        return jdbcTemplate.queryForList(sql);
    }

    public Map<String, Object> findStudentsById(int id) {
        String sql = "SELECT * FROM Students where StudentID = ?";
        return jdbcTemplate.queryForMap(sql,id);
    }

    public int addStudent(StudentDTO studentDTO) {
        String sql = "INSERT INTO Students (Name, Email, Phone, Address) VALUES (?, ?, ?,?)";
        return jdbcTemplate.update(sql, studentDTO.getName(), studentDTO.getEmail(), studentDTO.getPhone(),studentDTO.getAddress());
    }

    public int updateStudent(int studentId, StudentDTO studentDTO) {
        String sql = "UPDATE Students SET Name = ?, Email = ?, Phone = ?, Address = ? WHERE StudentID = ?";
        return jdbcTemplate.update(sql, studentDTO.getName(), studentDTO.getEmail(), studentDTO.getPhone(),studentDTO.getAddress(), studentId);
    }

    public int deleteStudent(int studentId) {
        String sql = "DELETE FROM Students WHERE StudentID = ?";
        return jdbcTemplate.update(sql, studentId);
    }

    public List<Map<String, Object>> searchStudentsByName(String name) {
        String sql = "SELECT * FROM Students WHERE Name LIKE ? OR Email LIKE ? OR Phone LIKE ?";
        String searchPattern = "%" + name + "%"; // Thêm ký tự % vào trước và sau chuỗi tìm kiếm
        // Truy vấn và truyền searchPattern ba lần, một lần cho mỗi cột
        return jdbcTemplate.queryForList(sql, searchPattern, searchPattern, searchPattern);
    }


    public Map<String, Object> findStudentByEmail(String email) {
        String sql = "SELECT * FROM Students WHERE Email = ?";
        return jdbcTemplate.queryForMap(sql,email);
    }
}