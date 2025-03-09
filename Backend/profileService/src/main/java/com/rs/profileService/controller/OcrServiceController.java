package com.rs.profileService.controller;

import com.rs.profileService.dto.response.ApiResponse;
import com.rs.profileService.service.OcrService;
import com.rs.profileService.service.QrCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


@RestController
public class OcrServiceController {

    @Autowired
    private OcrService ocrService;

    private final String uploadDir = "D:/uploaded-images/";

    // API đọc OCR từ hình ảnh (đọc đường dẫn file từ tham số)
    @PostMapping("/info-image")
    public ApiResponse<String> extractTextFromImage(@RequestParam("file") MultipartFile file,
                                                    @RequestParam("imageId") String imageId) {
        return ocrService.extractTextFromImage(file,imageId);
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file,
                                                          @RequestParam("imageId") String imageId,
                                                          @RequestParam("userId") String userId
                                                          ) {
        try {
            // Tạo tên file mới theo định dạng {imageId}_{userId}.{extension}
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf(".")); // Lấy phần mở rộng file
            String newFilename = imageId + "_" + userId + extension; // Tạo tên file mới

            // Lưu file vào thư mục
            String filePath = uploadDir + newFilename;
            file.transferTo(new File(filePath));

            // Trả về đường dẫn file trên server
            Map<String, String> response = new HashMap<>();
            response.put("path", filePath);
            response.put("filename", newFilename); // Trả về tên file mới
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi upload file"));
        }
    }
}
