package com.rs.profileService.service;


import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class OcrService {

    // Hàm xử lý OCR từ một file hình ảnh
    public String extractTextFromImage(String imagePath) {
        Tesseract tesseract = new Tesseract();
        tesseract.setDatapath("C:/Program Files/Tesseract-OCR/tessdata"); // Thay bằng đường dẫn tessdata của bạn
        tesseract.setLanguage("vie"); // Ngôn ngữ sử dụng OCR (VD: "eng" cho tiếng Anh, "vie" cho tiếng Việt)

        try {
            // Đọc file từ đường dẫn cố định
            File imageFile = new File(imagePath);
            if (!imageFile.exists()) {
                return "File không tồn tại: " + imagePath;
            }

            // Gọi Tesseract để xử lý OCR
            return tesseract.doOCR(imageFile);
        } catch (TesseractException e) {
            e.printStackTrace();
            return "Lỗi khi xử lý OCR: " + e.getMessage();
        }
    }
}

