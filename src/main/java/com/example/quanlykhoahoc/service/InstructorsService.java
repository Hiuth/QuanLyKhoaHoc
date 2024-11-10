package com.example.quanlykhoahoc.service;

import com.example.quanlykhoahoc.dtos.InstructorDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InstructorsService {
    @Autowired
    private JdbcTemplate jdbcTemplate;


    public List<Map<String,Object>> getAllInstructors() {
        String sql = "SELECT * FROM instructors";
        return jdbcTemplate.queryForList(sql);
    }

    //Phương thức addInstructor trả về int vì JdbcTemplate.update() sẽ trả về số bản ghi bị ảnh hưởng sau khi thực hiện lệnh SQL.
    //Nếu INSERT thành công và một bản ghi được thêm vào, giá trị trả về sẽ là 1, đại diện cho một hàng mới đã được thêm vào bảng.

    public int addInstructor(InstructorDTO instructorDTO) {
        String sql = "INSERT INTO Instructors (Name, Email, Phone, Expertise) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql, instructorDTO.getName(), instructorDTO.getEmail(), instructorDTO.getPhone(),instructorDTO.getExpertise());
    }

    public int updateInstructor(int instructorId,InstructorDTO instructorDTO) {
        String sql = "UPDATE Instructors SET Name = ?, Email = ?, Phone = ?, Expertise= ? WHERE InstructorID = ?";
        return jdbcTemplate.update(sql, instructorDTO.getName(), instructorDTO.getEmail(), instructorDTO.getPhone(),instructorDTO.getExpertise() ,instructorId);
    }

    // Xóa giảng viên theo InstructorID
    public int deleteInstructor(int instructorId) {
        String sql = "DELETE FROM Instructors WHERE InstructorID = ?";
        return jdbcTemplate.update(sql, instructorId);
    }
}