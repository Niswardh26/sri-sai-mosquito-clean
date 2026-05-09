package com.example.app.controller;

import com.example.app.dto.request.InquiryRequest;
import com.example.app.dto.response.InquiryResponse;
import com.example.app.service.InquiryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inquiries")
@CrossOrigin(origins = "*", maxAge = 3600)
public class InquiryController {

    @Autowired
    private InquiryService inquiryService;

    @PostMapping
    public ResponseEntity<InquiryResponse> submitInquiry(@Valid @RequestBody InquiryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inquiryService.submitInquiry(request));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<InquiryResponse>> getAllInquiries() {
        return ResponseEntity.ok(inquiryService.getAllInquiries());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InquiryResponse> getInquiryById(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(inquiryService.getInquiryById(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteInquiry(@PathVariable @NonNull Long id) {
        inquiryService.deleteInquiry(id);
        return ResponseEntity.ok("Inquiry deleted successfully");
    }
}
