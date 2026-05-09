package com.example.app.service.impl;

import com.example.app.dto.request.InquiryRequest;
import com.example.app.dto.response.InquiryResponse;
import com.example.app.entity.Inquiry;
import com.example.app.exception.ResourceNotFoundException;
import com.example.app.repository.InquiryRepository;
import com.example.app.service.InquiryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InquiryServiceImpl implements InquiryService {

    @Autowired
    private InquiryRepository inquiryRepository;

    @Override
    public InquiryResponse submitInquiry(InquiryRequest request) {
        Inquiry inquiry = new Inquiry();
        inquiry.setCustomerName(request.getCustomerName());
        inquiry.setPhone(request.getPhone());
        inquiry.setAddress(request.getAddress());
        inquiry.setMessage(request.getMessage());
        inquiry.setProductInterest(request.getProductInterest());
        inquiry.setCreatedAt(LocalDateTime.now());
        return mapToResponse(inquiryRepository.save(inquiry));
    }

    @Override
    public List<InquiryResponse> getAllInquiries() {
        return inquiryRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public InquiryResponse getInquiryById(@NonNull Long id) {
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found with id: " + id));
        return mapToResponse(inquiry);
    }

    @Override
    @SuppressWarnings("null")
    public void deleteInquiry(@NonNull Long id) {
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found with id: " + id));
        inquiryRepository.delete(inquiry);
    }

    private InquiryResponse mapToResponse(Inquiry inquiry) {
        return new InquiryResponse(
                inquiry.getId(),
                inquiry.getCustomerName(),
                inquiry.getPhone(),
                inquiry.getAddress(),
                inquiry.getMessage(),
                inquiry.getProductInterest(),
                inquiry.getCreatedAt()
        );
    }
}
