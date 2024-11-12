package com.example.quanlykhoahoc.controller;

import com.example.quanlykhoahoc.dtos.EnrollmentDTO;
import com.example.quanlykhoahoc.service.EnrollmentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/enrollments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EnrollmentController {
    EnrollmentService enrollmentService;

    @GetMapping("/get-all")
    public ResponseEntity<List<Map<String, Object>>> getAllEnrollments() {
        List<Map<String, Object>> courses = enrollmentService.getAllEnrollment();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/findStudentAndCourse/{name}")
    public ResponseEntity<List<Map<String, Object>>> findStudentAndCourse(@PathVariable String name) {
        List<Map<String, Object>> courses = enrollmentService.searchStudentsAndCourses(name);
        return ResponseEntity.ok(courses);
    }

    @PostMapping("/create")
    public ResponseEntity<String> createEnrollments(@RequestBody EnrollmentDTO enrollment) {
        String status = enrollmentService.addEnrollments(enrollment);
        if (status.contains("thành công")) {
            return ResponseEntity.ok(status);
        } else {
            return ResponseEntity.status(500).body(status);
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<String> deleteEnrollment(@RequestBody EnrollmentDTO enrollment) {
        String status = enrollmentService.deleteEnrollment(enrollment);

        if (status.contains("thành công")) {
            return ResponseEntity.ok(status);
        } else {
            return ResponseEntity.status(500).body(status);
        }
    }
}
