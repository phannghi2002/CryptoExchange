package com.rs.profileService.service;

import com.google.zxing.*;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.HybridBinarizer;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.EnumSet;
import java.util.Map;

@Service
public class QrCodeService {

    public String decodeQRCode(String imagePath) {
        try {
            // Đọc file ảnh từ đường dẫn chỉ định
            File imageFile = new File(imagePath);
            BufferedImage bufferedImage = ImageIO.read(imageFile);

            // Chuyển đổi ảnh thành đối tượng LuminanceSource
            LuminanceSource source = new BufferedImageLuminanceSource(bufferedImage);
            BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));

            // Cấu hình chỉ tìm mã QR
            Map<DecodeHintType, Object> hints = Map.of(
                    DecodeHintType.POSSIBLE_FORMATS, EnumSet.of(BarcodeFormat.QR_CODE)
            );

            // Trình đọc mã QR
            Reader reader = new MultiFormatReader();
            Result result = reader.decode(bitmap, hints);

            // Trả về nội dung mã QR
            return result.getText();
        } catch (NotFoundException e) {
            return "Không tìm thấy mã QR trong hình ảnh.";
        } catch (IOException e) {
            return "Lỗi khi đọc file ảnh: " + e.getMessage();
        } catch (ChecksumException e) {
            throw new RuntimeException(e);
        } catch (FormatException e) {
            throw new RuntimeException(e);
        }
    }
}



