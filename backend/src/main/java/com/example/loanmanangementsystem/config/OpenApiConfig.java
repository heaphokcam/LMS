package com.example.loanmanangementsystem.config;

import com.example.loanmanangementsystem.controller.AuthController;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.HandlerMethod;

import java.util.Collections;
import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.port:8080}")
    private String serverPort;

    @Bean
    public OpenAPI customOpenAPI() {
        final String bearerAuth = "bearerAuth";
        return new OpenAPI()
                .info(new Info()
                        .title("Loan Management System API")
                        .version("1.0")
                        .description("REST API for managing roles, users, customers, loan products, and loan applications. Use POST /api/auth/login to get a JWT, then use Authorize to send Bearer token for secured endpoints.")
                        .contact(new Contact()
                                .name("Loan Management System")
                                .email("support@example.com")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:" + serverPort)
                                .description("Local server")))
                .components(new Components()
                        .addSecuritySchemes(bearerAuth,
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("JWT from POST /api/auth/login")))
                .addSecurityItem(new SecurityRequirement().addList(bearerAuth));
    }

    /**
     * Centralized OpenAPI operation customization: auth endpoints are public (no security),
     * response descriptions are set here instead of in controllers.
     */
    @Bean
    public OperationCustomizer operationCustomizer() {
        return (operation, handlerMethod) -> {
            Class<?> controllerClass = handlerMethod.getBeanType();
            String methodName = handlerMethod.getMethod().getName();

            if (controllerClass == AuthController.class) {
                operation.setSecurity(Collections.emptyList());
                setResponseDescription(operation.getResponses(), "register".equals(methodName) ? "Registered successfully" : "Login successful");
            } else if (controllerClass.getSimpleName().equals("UserController")) {
                setUserResponseDescriptions(operation, methodName);
            }
            return operation;
        };
    }

    private static void setResponseDescription(ApiResponses responses, String description) {
        if (responses != null && description != null) {
            responses.forEach((code, apiResponse) -> apiResponse.setDescription(description));
        }
    }

    private static void setUserResponseDescriptions(io.swagger.v3.oas.models.Operation operation, String methodName) {
        ApiResponses responses = operation.getResponses();
        if (responses == null) return;
        String description = switch (methodName) {
            case "findAll" -> "List of users";
            case "findById" -> "User by id";
            case "create" -> "Created user";
            case "update" -> "Updated user";
            default -> null;
        };
        if (description != null) {
            responses.forEach((code, apiResponse) -> {
                if (apiResponse.getDescription() == null || apiResponse.getDescription().isBlank()) {
                    apiResponse.setDescription(description);
                }
            });
        }
    }
}
