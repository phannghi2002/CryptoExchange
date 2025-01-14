package com.rs.profileService.controller;

import com.rs.profileService.service.OcrService;
import com.rs.profileService.service.QrCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class OcrServiceController {

    @Autowired
    private OcrService ocrService;

    // API đọc OCR từ hình ảnh (đọc đường dẫn file từ tham số)
    @GetMapping("/info-image")
    public String extractTextFromImage(@RequestParam String imagePath) {
        // Gọi hàm extractTextFromImage từ service và trả về kết quả
        return ocrService.extractTextFromImage(imagePath);
    }
}
