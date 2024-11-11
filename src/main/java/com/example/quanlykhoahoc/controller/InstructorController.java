package com.example.quanlykhoahoc.controller;

import com.example.quanlykhoahoc.dtos.InstructorDTO;
import com.example.quanlykhoahoc.service.InstructorsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/instructor")
@RequiredArgsConstructor
public class InstructorController {

    private final InstructorsService instructorsService;

    @GetMapping("/allInstructor")
    public ResponseEntity<List<Map<String, Object>>> getAllInstructors() {
        List<Map<String, Object>> instructors = instructorsService.getAllInstructors();
        return ResponseEntity.ok(instructors);
    }

    @GetMapping("/searchInstructor/{name}")
    public ResponseEntity<List<Map<String, Object>>> searchInstructors(@PathVariable String name) {
        List<Map<String, Object>> instructors = instructorsService.searchInstructorsByName(name);
        return ResponseEntity.ok(instructors);
    }

    @PostMapping("/createInstructor")
    public ResponseEntity<?> addInstructor(@RequestBody InstructorDTO instructorDTO) {
        int result = instructorsService.addInstructor(instructorDTO);
        if (result > 0) {
            return ResponseEntity.ok("Thêm giảng viên thành công");
        } else {
            return ResponseEntity.status(500).body("Lỗi khi thêm giảng viên");
        }
    }

    @PutMapping("/updateInstructor/{id}")
    public ResponseEntity<?> updateInstructor(@PathVariable int id, @RequestBody InstructorDTO instructorDTO) {
        int result = instructorsService.updateInstructor(id, instructorDTO);
        if (result > 0) {
            return ResponseEntity.ok("Cập nhật giảng viên thành công");
        } else {
            return ResponseEntity.status(404).body("Không tìm thấy giảng viên để cập nhật");
        }
    }

    @DeleteMapping("/deleteInstructor/{id}")
    public ResponseEntity<String> deleteInstructor(@PathVariable int id) {
        int result = instructorsService.deleteInstructor(id);
        if (result > 0) {
            return ResponseEntity.ok("Xóa giảng viên thành công");
        } else {
            return ResponseEntity.status(404).body("Không tìm thấy giảng viên để xóa");
        }
    }
}
