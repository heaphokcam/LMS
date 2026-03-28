package com.example.loanmanangementsystem.bootstrap;

import com.example.loanmanangementsystem.dto.RegisterRequest;
import com.example.loanmanangementsystem.exception.BadRequestException;
import com.example.loanmanangementsystem.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Startup hook that seeds data via {@link AuthService#register(RegisterRequest)}.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class LoadData implements ApplicationRunner {

    private final AuthService authService;

    @Value("${app.load-data.enabled:true}")
    private boolean enabled;

    @Value("${app.load-data.admin.username:admin}")
    private String adminUsername;

    @Value("${app.load-data.admin.password:password}")
    private String adminPassword;

    @Value("${app.load-data.admin.email:admin@localhost}")
    private String adminEmail;

    @Value("${app.load-data.admin.role-id:4}")
    private long adminRoleId;

    @Override
    public void run(ApplicationArguments args) {
        if (!enabled) {
            return;
        }

        RegisterRequest request = RegisterRequest.builder()
                .username(adminUsername)
                .email(adminEmail)
                .password(adminPassword)
                .roleIds(List.of(adminRoleId))
                .build();

        try {
            authService.register(request);
            log.info("LoadData: registered user '{}' via AuthService.", adminUsername);
        } catch (BadRequestException e) {
            log.debug("LoadData: register skipped — {}", e.getMessage());
        }
    }
}
