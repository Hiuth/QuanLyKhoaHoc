package com.example.quanlykhoahoc.service;

import com.example.quanlykhoahoc.dtos.CourseDTO;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.web.bind.annotation.GetMapping;


import javax.annotation.PostConstruct;
import java.sql.Types;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CoursesService {
    private final JdbcTemplate jdbcTemplate;
    private SimpleJdbcCall getAllCoursesProc;
    private SimpleJdbcCall createCourseProc;

    @PostConstruct
    public void init() {
        createCourseProc = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("CreateNewCourse");
    }


    public List<Map<String, Object>> getAllCourses() {
        String sql = "SELECT * FROM Courses";
        return jdbcTemplate.queryForList(sql);
    }

    public String addCourse(CourseDTO courseDTO) {
        Map<String, Object> params = new HashMap<>();
        params.put("CourseName", courseDTO.getCourseName());
        params.put("InstructorID", courseDTO.getInstructorId());
        params.put("StartDate", courseDTO.getStartDate());
        params.put("EndDate", courseDTO.getEndDate());
        params.put("Tuition", courseDTO.getTuition());
        params.put("Description", courseDTO.getDescription());
        params.put("Status", "Available");
        params.put("StatusMessage", null); // Output parameter

        Map<String, Object> result = createCourseProc.execute(params);
        return (String) result.get("StatusMessage");
    }

    public int updateCourse(int courseId, CourseDTO courseDTO) {
        String sql = "UPDATE Courses SET CourseName = ?, Description = ?, InstructorID = ?, StartDate = ?, EndDate = ?, Tuition = ? WHERE CourseID = ?";
        return jdbcTemplate.update(sql, courseDTO.getCourseName(), courseDTO.getDescription(), courseDTO.getInstructorId(), courseDTO.getStartDate(), courseDTO.getEndDate(), courseDTO.getTuition(), courseId);
    }

    public int deleteCourse(int courseId) {
        String sql = "DELETE FROM Courses WHERE CourseID = ?";
        return jdbcTemplate.update(sql, courseId);
    }

    public List<Map<String, Object>> searchCoursesByName(String name) {
        String sql = "SELECT * FROM courses WHERE CourseName LIKE ?";
        String searchPattern = "%" + name + "%"; // Thêm ký tự % vào trước và sau chuỗi tìm kiếm
        return jdbcTemplate.queryForList(sql, searchPattern);
    }

}

// Gọi stored procedure để hủy đăng ký
//    public void unregisterStudentFromCourse(int studentId, int courseId) {
//        String sql = "{call UnregisterStudentFromCourse(?, ?)}";
//        jdbcTemplate.update(sql, studentId, courseId);
//    }

