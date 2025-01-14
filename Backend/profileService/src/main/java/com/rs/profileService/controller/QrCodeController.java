package com.rs.profileService.controller;


import com.rs.profileService.service.QrCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class QrCodeController {

    @Autowired
    private QrCodeService qrCodeService;

    // API đọc mã QR từ đường dẫn file
    @GetMapping("/decode-qr")
    public String decodeQRCode(@RequestParam String imagePath) {
        return qrCodeService.decodeQRCode(imagePath);
    }
}

