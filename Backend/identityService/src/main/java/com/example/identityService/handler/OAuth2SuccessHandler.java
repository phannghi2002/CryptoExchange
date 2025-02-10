package com.example.identityService.handler;

import com.example.identityService.entity.OAuthUser;
import com.example.identityService.exception.AppException;
import com.example.identityService.exception.ErrorCode;
import com.example.identityService.repository.OAuthUserRepository;
import com.example.identityService.repository.RoleRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;

import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;


import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

import org.springframework.util.CollectionUtils;

@Slf4j
@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;


    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    @Autowired
    private OAuthUserRepository oAuthUserRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        DefaultOAuth2User oAuth2User = (DefaultOAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        OAuthUser oAuthUser = oAuthUserRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        String token = generateOAuthToken(oAuthUser);
        log.info("Generated OAuth Token: " + token);

        // Lưu token vào cookie HttpOnly
        Cookie cookie = new Cookie("OAUTH_TOKEN", token);


        cookie.setHttpOnly(false);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60); // 1 giờ

        response.addCookie(cookie);

        // Lưu trạng thái twoAuth vào cookie (không HttpOnly để frontend truy cập)
        Cookie twoAuthCookie = new Cookie("TWO_AUTH", String.valueOf(oAuthUser.getTwoAuth()));
        //cai nay cho phep ben frontend co quyen thay doi nhu xoa cookies
        twoAuthCookie.setHttpOnly(false); // Frontend có thể truy cập
        twoAuthCookie.setPath("/");
        twoAuthCookie.setMaxAge(60 * 60); // 1 giờ
        response.addCookie(twoAuthCookie);

        log.info("khó vcl ở chỗ này {}", String.valueOf(oAuthUser.getTwoAuth()));
        // Redirect về frontend
        getRedirectStrategy().sendRedirect(request, response,
                "http://localhost:5173/overview");
    }

    private String buildOAuthScope(OAuthUser oAuthUser) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        log.info("loi no nam day ne"+ oAuthUser);
        if (!CollectionUtils.isEmpty(oAuthUser.getRoles())){
            log.info("loi no nam day ne");
            oAuthUser.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_" + role.getName());
                if (!CollectionUtils.isEmpty(role.getPermissions()))
                    role.getPermissions().forEach(permission -> stringJoiner.add(permission.getName()));
            }) ;
        }

        return stringJoiner.toString();
    }
    private String generateOAuthToken(OAuthUser oAuthUser) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(oAuthUser.getEmail())  // OAuth2 user email
                .issuer("phannghi")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildOAuthScope(oAuthUser))  // Scope từ OAuth provider
                .claim("userId", oAuthUser.getId())
                .claim("providerId", oAuthUser.getProviderId())
                .claim("twoAuth", oAuthUser.getTwoAuth())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create OAuth token", e);
            throw new RuntimeException(e);
        }
    }
}

