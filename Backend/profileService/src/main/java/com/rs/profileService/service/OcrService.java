package com.rs.profileService.service;

import com.rs.profileService.dto.response.ApiResponse;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;

@Service
@Slf4j
public class OcrService {

    // Hàm chuẩn hóa văn bản OCR
    public String cleanOCRText(String text) {
        if (text == null || text.isEmpty()) return "";

        text = text.replaceAll("[^\\p{L}\\p{N}\\s]", ""); // Chỉ giữ chữ cái & số
        text = text.replaceAll("\\s+", " ").trim(); // Xóa khoảng trắng thừa
        text = text.toUpperCase(); // Chuyển về chữ hoa để tránh lỗi so sánh

        return text;
    }

    // Hàm trích xuất số CCCD nếu có
    private String extractCCCDNumber(String text) {
        Pattern pattern = Pattern.compile("\\d{12}"); // Tìm 12 chữ số liên tục
        Matcher matcher = pattern.matcher(text);
        return matcher.find() ? matcher.group() : null;
    }

    public ApiResponse<String> extractTextFromImage(MultipartFile file, String imageId) {
        Tesseract tesseract = new Tesseract();
        tesseract.setDatapath("C:/Program Files/Tesseract-OCR/tessdata"); // Đường dẫn tessdata
        tesseract.setLanguage("vie");

        try {
            // Chuyển file thành BufferedImage để OCR
            BufferedImage bufferedImage = ImageIO.read(file.getInputStream());
            if (bufferedImage == null) {
                return ApiResponse.<String>builder()
                        .code(1111)
                        .message("File ảnh không hợp lệ!")
                        .build();
            }

            // Nhận diện văn bản từ ảnh
            String rawText = tesseract.doOCR(bufferedImage);
            log.info("Kết quả OCR (thô): {}", rawText);

            // Chuẩn hóa văn bản
            String cleanedText = cleanOCRText(rawText);
            log.info("Kết quả OCR (đã chuẩn hóa): {}", cleanedText);

            // Kiểm tra theo loại ảnh
            if ("id-front".equalsIgnoreCase(imageId)) {
                // Kiểm tra mặt trước: Phải có "CĂN CƯỚC CÔNG DÂN" hoặc "CITIZEN IDENTITY CARD"
                boolean containsCCCD = cleanedText.matches(".*(CĂN CƯỚC CÔNG DÂN|CITIZEN IDENTITY CARD).*");
                String cccdNumber = extractCCCDNumber(cleanedText);

                if (containsCCCD && cccdNumber != null) {
                    return ApiResponse.<String>builder()
                            .code(1000)
                            .message("Hợp lệ")
                            .result(cccdNumber)
                            .build();
                } else {
                    return ApiResponse.<String>builder()
                            .code(1111)
                            .message("Ảnh mặt trước không hợp lệ! Vui lòng chụp lại.")
                            .build();
                }
            } else if ("id-back".equalsIgnoreCase(imageId)) {
                // Kiểm tra mặt sau: Phải có "IDVNM"
                boolean containsIDVNM = cleanedText.contains("IDVNM");

                if (containsIDVNM) {
                    return ApiResponse.<String>builder()
                            .code(1000)
                            .message("Hợp lệ")
                            .build();
                } else {
                    return ApiResponse.<String>builder()
                            .code(1111)
                            .message("Ảnh mặt sau không hợp lệ! Vui lòng chụp lại.")
                            .build();
                }
            } else {
                return ApiResponse.<String>builder()
                        .code(1111)
                        .message("Loại ảnh không hợp lệ!")
                        .build();
            }

        } catch (TesseractException | IOException e) {
            log.error("Lỗi khi xử lý OCR", e);
            return ApiResponse.<String>builder()
                    .code(1111)
                    .message("Lỗi khi xử lý OCR: " + e.getMessage())
                    .build();
        }
    }

}


