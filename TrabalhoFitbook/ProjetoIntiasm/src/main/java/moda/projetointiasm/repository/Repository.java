package moda.projetointiasm.repository;

import moda.projetointiasm.model.Model;
import org.springframework.data.jpa.repository.JpaRepository;

public interface Repository extends JpaRepository<Model, Long> {
}
