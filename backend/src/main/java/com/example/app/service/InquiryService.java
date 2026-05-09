package com.example.app.service;

import com.example.app.dto.request.InquiryRequest;
import com.example.app.dto.response.InquiryResponse;

import org.springframework.lang.NonNull;

import java.util.List;

public interface InquiryService {
    InquiryResponse submitInquiry(InquiryRequest request);
    List<InquiryResponse> getAllInquiries();
    InquiryResponse getInquiryById(@NonNull Long id);
    void deleteInquiry(@NonNull Long id);
}
