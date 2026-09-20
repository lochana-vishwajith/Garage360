package com.motoaffinity.pacakgebulider.Service;

import com.motoaffinity.pacakgebulider.Dto.CreateFeatureRequestDto;
import com.motoaffinity.pacakgebulider.Dto.FeatureResponseDto;

public interface FeatureService {

    FeatureResponseDto createFeature(CreateFeatureRequestDto requestDto);
}
