package com.motoaffinity.pacakgebulider.Controller;

import com.motoaffinity.pacakgebulider.Dto.CreateFeatureRequestDto;
import com.motoaffinity.pacakgebulider.Dto.FeatureResponseDto;
import com.motoaffinity.pacakgebulider.Service.FeatureService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/features")
public class FeatureController {

    private final FeatureService featureService;

    @Autowired
    public FeatureController(FeatureService featureService) {
        this.featureService = featureService;
    }

    @PostMapping
    public ResponseEntity<FeatureResponseDto> createFeature(@Valid @RequestBody CreateFeatureRequestDto requestDto) {
        FeatureResponseDto responseDto = featureService.createFeature(requestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }
}
