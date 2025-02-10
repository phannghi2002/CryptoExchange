package com.example.identityService.controller;

import java.util.List;


import com.example.identityService.dto.request.*;
import com.example.identityService.dto.response.ApiResponse;
import com.example.identityService.dto.response.UserResponse;
import com.example.identityService.service.UserService;
import org.springframework.web.bind.annotation.*;



import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserController {
    UserService userService;

    @PostMapping("/registration")
    ApiResponse<UserResponse> createUser(@RequestBody UserCreationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.createUser(request))
                .build();
    }

    @PostMapping("/forgotPassword")
    ApiResponse<String> forgotPassword(@RequestBody EmailRequest request) {
        userService.forgotPassword(request.getEmail());
        return ApiResponse.<String>builder()
                .result("Mã code đã được gửi tới email của bạn.")
                .build();
    }

    @PostMapping("/updatePassword")
    ApiResponse<String> updatePassword(@RequestBody UpdatePasswordRequest request) {
        userService.updatePassword(request);
        return ApiResponse.<String>builder()
                .result("Cập nhật mật khẩu thành công")
                .build();
    }

    @PostMapping("/changePassword")
    ApiResponse<UserResponse> changePasswordEnterOldPassword(@RequestBody ChangePasswordEnterOldPasswordRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result( userService.changePasswordEnterOldPassword(request.getOldPassword(), request.getNewPassword()))
                .build();
    }

    @GetMapping
    ApiResponse<List<UserResponse>> getUsers() {
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getUsers())
                .build();
    }

    @GetMapping("/{userId}")
    ApiResponse<UserResponse> getUser(@PathVariable("userId") String userId) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUser(userId))
                .build();
    }

    @GetMapping("/my-info")
    ApiResponse<UserResponse> getMyInfo() {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }

    @DeleteMapping("/{userId}")
    ApiResponse<String> deleteUser(@PathVariable String userId) {
        userService.deleteUser(userId);
        return ApiResponse.<String>builder().result("User has been deleted").build();
    }

    @PutMapping("/{userId}")
    ApiResponse<UserResponse> updateUser(@PathVariable String userId, @RequestBody UserUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateUser(userId, request))
                .build();
    }

    @PutMapping("/convertTwoAuth")
    public ApiResponse<UserResponse> convert2FA() {
        UserResponse updatedUser = userService.convert2FA();
        return ApiResponse.<UserResponse>builder()
                .result(updatedUser)
                .build();
    }

}
