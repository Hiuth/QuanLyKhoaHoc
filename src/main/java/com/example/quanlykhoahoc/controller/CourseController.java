package com.example.quanlykhoahoc.controller;

import com.example.quanlykhoahoc.dtos.CourseDTO;
import com.example.quanlykhoahoc.service.CoursesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/course")
@RequiredArgsConstructor
public class CourseController {

    private final CoursesService coursesService;

    @GetMapping("/allCourses")
    public ResponseEntity<List<Map<String, Object>>> getAllCourses() {
        List<Map<String, Object>> courses = coursesService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/findCourseById/{id}")
    public ResponseEntity<Map<String, Object>>findCourseById(@PathVariable int id) {
        Map<String, Object> courses = coursesService.findCourseById(id);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/findCourses/{key}")
    public ResponseEntity<List<Map<String, Object>>> findCourses(@PathVariable String key) {
        List<Map<String, Object>> courses = coursesService.searchCoursesByName(key);
        return ResponseEntity.ok(courses);
    }

    @PostMapping("/createCourse")
    public ResponseEntity<String> addCourse(@RequestBody CourseDTO courseDTO) {
        String status = coursesService.addCourse(courseDTO);
        if (status.contains("thành công")) {
            return ResponseEntity.ok(status);
        } else {
            return ResponseEntity.status(500).body(status);
        }
    }

    @PutMapping("/updateCourse/{id}")
    public ResponseEntity<String> updateCourse(@PathVariable int id, @RequestBody CourseDTO courseDTO) {
        String status = coursesService.updateCourse(id, courseDTO);
        if (status.contains("thành công")) {
            return ResponseEntity.ok(status);
        } else if (status.contains("Không tìm thấy")) {
            return ResponseEntity.status(404).body(status);
        } else {
            return ResponseEntity.status(500).body(status);
        }
    }

    @DeleteMapping("/deleteCourse/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable int id) {
        int result = coursesService.deleteCourse(id);
        if (result > 0) {
            return ResponseEntity.ok("Xóa khóa học thành công");
        } else {
            return ResponseEntity.status(404).body("Không tìm thấy khóa học để xóa");
        }
    }
}