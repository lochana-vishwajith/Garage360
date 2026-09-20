package com.motoaffinity.pacakgebulider.Repository;

import com.motoaffinity.pacakgebulider.Model.Feature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeatureRepository extends JpaRepository<Feature, Long> {

    boolean existsByFeatureKey(String featureKey);

    boolean existsByName(String name);
}
