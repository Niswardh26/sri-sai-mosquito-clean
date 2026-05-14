package com.example.app.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/uploads")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FileUploadController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp"
    );
    private static final Set<String> ALLOWED_VIDEO_TYPES = Set.of(
            "video/mp4", "video/webm", "video/ogg", "video/quicktime"
    );
    private static final long MAX_FILE_SIZE = 100L * 1024 * 1024; // 100MB

    @PostMapping("/media")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> uploadMedia(
            HttpServletRequest request,
            @RequestParam("file") MultipartFile file) throws IOException {

        String contentType = file.getContentType();
        if (contentType == null ||
                (!ALLOWED_IMAGE_TYPES.contains(contentType) && !ALLOWED_VIDEO_TYPES.contains(contentType))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only images and videos are allowed"));
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest().body(Map.of("error", "File size must not exceed 100MB"));
        }

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String filename = UUID.randomUUID().toString() + extension;
        // Prevent path traversal
        Path targetPath = uploadPath.resolve(filename).normalize();
        if (!targetPath.startsWith(uploadPath)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid file name"));
        }

        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        String baseUrl = request.getScheme() + "://" + request.getServerName();
        int port = request.getServerPort();
        if (port != 80 && port != 443) {
            baseUrl += ":" + port;
        }
        String fileUrl = baseUrl + "/api/uploads/" + filename;
        String fileType = ALLOWED_IMAGE_TYPES.contains(contentType) ? "image" : "video";

        Map<String, String> response = new HashMap<>();
        response.put("url", fileUrl);
        response.put("filename", filename);
        response.put("type", fileType);
        return ResponseEntity.ok(response);
    }
}
