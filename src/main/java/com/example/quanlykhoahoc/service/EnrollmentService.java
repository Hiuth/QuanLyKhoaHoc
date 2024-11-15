package com.example.quanlykhoahoc.service;

import com.example.quanlykhoahoc.dtos.EnrollmentDTO;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EnrollmentService {
    final JdbcTemplate jdbcTemplate;
    SimpleJdbcCall createRequest;
    SimpleJdbcCall deleteRequest;

    @PostConstruct
    public void init() {
        createRequest = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("RegisterStudentForCourse");
        deleteRequest = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("UnregisterStudentFromCourse");
    }

    public List<Map<String, Object>> getAllEnrollment() {
        String sql = "SELECT * FROM Enrollments";
        return jdbcTemplate.queryForList(sql);
    }

    public String addEnrollments(EnrollmentDTO enrollmentDTO) {
        Map<String, Object> params = new HashMap<>();
        params.put("StudentID", enrollmentDTO.getStudentId());
        params.put("CourseID", enrollmentDTO.getCourseId());
        params.put("Max", 10);
        params.put("StatusMessage", null);

        Map<String, Object> result = createRequest.execute(params);

        return (String) result.get("StatusMessage");
    }

    public String deleteEnrollment(EnrollmentDTO enrollment) {
        Map<String, Object> params = new HashMap<>();
        params.put("StudentID", enrollment.getStudentId());
        params.put("CourseID", enrollment.getCourseId());
        params.put("Max", 5);
        params.put("StatusMessage", null);

        Map<String, Object> result = deleteRequest.execute(params);
        String statusMessage = (String) result.get("StatusMessage");

        return statusMessage != null ? statusMessage : "Có lỗi xảy ra, vui lòng thử lại.";
    }

    public List<Map<String, Object>> searchStudentsAndCourses(String searchTerm) {
        String sql = "SELECT s.StudentID, s.Name, s.Email, s.Phone, " +
                "c.CourseID, c.CourseName, c.Description, e.EnrollmentDate, e.CompletionStatus " +
                "FROM Students s " +
                "INNER JOIN Enrollments e ON s.StudentID = e.StudentID " +
                "INNER JOIN Courses c ON e.CourseID = c.CourseID " +
                "WHERE s.Name LIKE ? OR c.CourseName LIKE ?";

        // Tạo tham số tìm kiếm và sử dụng dấu `%` cho tìm kiếm gần đúng
        String searchPattern = "%" + searchTerm + "%";
        // Truy vấn cơ sở dữ liệu và trả về kết quả dưới dạng List<Map<String, Object>>
        return jdbcTemplate.queryForList(sql, searchPattern, searchPattern);
    }

}
