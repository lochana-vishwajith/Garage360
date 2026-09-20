package com.motoaffinity.pacakgebulider.Service.Impl;

import com.motoaffinity.pacakgebulider.Dto.CreateFeatureRequestDto;
import com.motoaffinity.pacakgebulider.Dto.FeatureResponseDto;
import com.motoaffinity.pacakgebulider.Model.Feature;
import com.motoaffinity.pacakgebulider.Repository.FeatureRepository;
import com.motoaffinity.pacakgebulider.Service.FeatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FeatureServiceImpl implements FeatureService {

    private final FeatureRepository featureRepository;

    @Autowired
    public FeatureServiceImpl(FeatureRepository featureRepository) {
        this.featureRepository = featureRepository;
    }


    @Override
    @Transactional
    public FeatureResponseDto createFeature(CreateFeatureRequestDto requestDto) {
        if (featureRepository.existsByFeatureKey(requestDto.getFeatureKey())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Feature with key '" + requestDto.getFeatureKey() + "' already exists"
            );
        }

        if (featureRepository.existsByName(requestDto.getName())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Feature with name '" + requestDto.getName() + "' already exists"
            );
        }

        Feature feature = Feature.builder()
                .name(requestDto.getName())
                .featureKey(requestDto.getFeatureKey())
                .description(requestDto.getDescription())
                .isActive(requestDto.getIsActive() != null ? requestDto.getIsActive() : true)
                .unitPrice(requestDto.getUnitPrice())
                .build();

        Feature savedFeature = featureRepository.save(feature);

        return mapToResponseDto(savedFeature);
    }

    private FeatureResponseDto mapToResponseDto(Feature feature) {
        return FeatureResponseDto.builder()
                .id(feature.getId())
                .name(feature.getName())
                .featureKey(feature.getFeatureKey())
                .description(feature.getDescription())
                .isActive(feature.getIsActive())
                .createdAt(feature.getCreatedAt())
                .updatedAt(feature.getUpdatedAt())
                .build();
    }
}
