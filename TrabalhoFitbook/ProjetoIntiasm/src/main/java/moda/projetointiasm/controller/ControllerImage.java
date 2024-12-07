package moda.projetointiasm.controller;

import moda.projetointiasm.config.CloudinaryService;
import moda.projetointiasm.model.Model;
import moda.projetointiasm.repository.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/image")
public class ControllerImage {

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private Repository repository;

    @PostMapping("/upload/{id}")
    public ResponseEntity<Map<String, String>> uploadImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Arquivo está vazio."));
        }
        try {
            Map<String, Object> uploadResult = cloudinaryService.uploadImage(file);
            String imageUrl = (String) uploadResult.get("url");

            Model model = repository.findById(id).orElseThrow(() -> new RuntimeException("Modelo não encontrado com ID: " + id));
            model.setImageURL(imageUrl);
            repository.save(model);

            return ResponseEntity.ok(Map.of("url", imageUrl));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Falha no upload: " + e.getMessage()));
        }
    }
}

