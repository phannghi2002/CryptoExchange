package com.example.paymentService.repository.httpclient;


//import com.example.paymentService.config.FeignConfig;
import com.example.paymentService.dto.request.WalletUpdateRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@FeignClient(name="wallet-service", url="${app.services.wallet}")
public interface WalletClient {
    @PostMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    void updateWalletBalance(@RequestBody WalletUpdateRequest request);
}

//@FeignClient(name = "wallet-service", url = "${app.services.wallet}", configuration = FeignConfig.class)
//public interface WalletClient {
//    @PostMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
//    void updateWalletBalance(@RequestBody WalletUpdateRequest request);
//}