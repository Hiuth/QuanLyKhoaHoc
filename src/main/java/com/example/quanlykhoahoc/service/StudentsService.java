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

    public Map<String, Object> findStudentsByEmail(String id) {
        String sql = "SELECT * FROM Students where Email= ?";
        return jdbcTemplate.queryForMap(sql,id);
    }

    public int addStudent(StudentDTO studentDTO) {
        String sql = "INSERT INTO Students (Name, Email, Phone, Address) VALUES (?, ?, ?,?)";
        return jdbcTemplate.update(sql, studentDTO.getName(), studentDTO.getEmail(), studentDTO.getPhone(),studentDTO.getAddress());
    }

    public int updateStudent(int id, StudentDTO studentDTO) {
        // Lấy thông tin sinh viên hiện tại
        Map<String, Object> currentStudent = findStudentsById(id);

        // Nếu không tìm thấy sinh viên, không thể cập nhật
        if (currentStudent == null) {
            return 0;
        }

        // Kiểm tra xem số điện thoại và email có thay đổi không
        String currentPhone = (String) currentStudent.get("Phone");
        String currentEmail = (String) currentStudent.get("Email");
        boolean isPhoneChanged = !currentPhone.equals(studentDTO.getPhone());
        boolean isEmailChanged = !currentEmail.equals(studentDTO.getEmail());

        // Nếu số điện thoại thay đổi, kiểm tra xem số mới đã tồn tại chưa
        if (isPhoneChanged && isPhoneExists(studentDTO.getPhone())) {
            // Nếu email cũng thay đổi, kiểm tra xem email mới đã tồn tại chưa
            if (isEmailChanged && isEmailExists(studentDTO.getEmail())) {
                // Nếu cả số điện thoại và email đều đã tồn tại, chỉ cập nhật tên và địa chỉ
                String sql = "UPDATE Students SET Name = ?, Address = ? WHERE StudentID = ?";
                return jdbcTemplate.update(sql,
                        studentDTO.getName(),
                        studentDTO.getAddress(),
                        id);
            } else {
                // Nếu số điện thoại đã tồn tại nhưng email chưa, cập nhật email, số điện thoại và tên
                String sql = "UPDATE Students SET Name = ?, Email = ?, Phone = ?, Address = ? WHERE StudentID = ?";
                return jdbcTemplate.update(sql,
                        studentDTO.getName(),
                        studentDTO.getEmail(),
                        studentDTO.getPhone(),
                        studentDTO.getAddress(),
                        id);
            }
        } else if (isEmailChanged && isEmailExists(studentDTO.getEmail())) {
            // Nếu email đã tồn tại nhưng số điện thoại chưa, cập nhật email và tên
            String sql = "UPDATE Students SET Name = ?, Email = ?, Phone = ?, Address = ? WHERE StudentID = ?";
            return jdbcTemplate.update(sql,
                    studentDTO.getName(),
                    studentDTO.getEmail(),
                    studentDTO.getPhone(),
                    studentDTO.getAddress(),
                    id);
        } else {
            // Nếu cả số điện thoại và email đều hợp lệ, cập nhật tất cả thông tin
            String sql = "UPDATE Students SET Name = ?, Email = ?, Phone = ?, Address = ? WHERE StudentID = ?";
            return jdbcTemplate.update(sql,
                    studentDTO.getName(),
                    studentDTO.getEmail(),
                    studentDTO.getPhone(),
                    studentDTO.getAddress(),
                    id);
        }
    }

    private boolean isPhoneExists(String phone) {
        String sql = "SELECT COUNT(*) FROM Students WHERE Phone = ?";
        int count = jdbcTemplate.queryForObject(sql, Integer.class, phone);
        return count > 0;
    }
    private boolean isEmailExists(String email) {
        String sql = "SELECT COUNT(*) FROM Students WHERE Email = ?";
        int count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count > 0;
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