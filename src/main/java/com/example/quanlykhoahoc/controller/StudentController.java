package com.example.quanlykhoahoc.controller;

import com.example.quanlykhoahoc.dtos.StudentDTO;
import com.example.quanlykhoahoc.service.StudentsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentsService studentsService;

    @GetMapping("/allStudents")
    public ResponseEntity<List<Map<String, Object>>> getAllStudents() {
        List<Map<String, Object>> students = studentsService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/findStudentById/{id}")
    public ResponseEntity<Map<String, Object>> findStudentById(@PathVariable int id) {
        Map<String, Object> students = studentsService.findStudentsById(id);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/findStudents/{name}")
    public ResponseEntity<List<Map<String, Object>>> findStudents(@PathVariable String name) {
        List<Map<String, Object>> students = studentsService.searchStudentsByName(name);
        return ResponseEntity.ok(students);
    }

    @PostMapping("/createStudent")
    public ResponseEntity<?> addStudent(@RequestBody StudentDTO studentDTO) {
        int result = studentsService.addStudent(studentDTO);
        if (result > 0) {
            return ResponseEntity.ok("Thêm sinh viên thành công");
        } else {
            return ResponseEntity.status(500).body("Lỗi khi thêm sinh viên");
        }
    }

    @PutMapping("/updateStudent/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable int id, @RequestBody StudentDTO studentDTO) {
        int result = studentsService.updateStudent(id, studentDTO);
        if (result > 0) {
            return ResponseEntity.ok("Cập nhật sinh viên thành công");
        } else {
            return ResponseEntity.status(404).body("Không tìm thấy sinh viên để cập nhật");
        }
    }

    @DeleteMapping("/deleteStudent/{id}")
    public ResponseEntity<String> deleteStudent(@PathVariable int id) {
        int result = studentsService.deleteStudent(id);
        if (result > 0) {
            return ResponseEntity.ok("Xóa sinh viên thành công");
        } else {
            return ResponseEntity.status(404).body("Không tìm thấy sinh viên để xóa");
        }
    }
}