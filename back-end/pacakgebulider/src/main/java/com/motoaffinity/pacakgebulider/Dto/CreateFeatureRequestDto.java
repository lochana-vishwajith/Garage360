package com.motoaffinity.pacakgebulider.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateFeatureRequestDto {

    @NotBlank(message = "Feature name is required")
    @Size(max = 100, message = "Feature name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "Feature key is required")
    @Size(max = 100, message = "Feature key must not exceed 100 characters")
    private String featureKey;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @NotBlank(message = "Active status is required")
    private Boolean isActive;

    @NotBlank(message = "Feature Price is required")
    private Float unitPrice;
}
