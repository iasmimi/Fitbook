package moda.projetointiasm.controller;

import moda.projetointiasm.model.Model;
import moda.projetointiasm.repository.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class Controller {

        @Autowired
        private Repository repository;

        @GetMapping
        public List<Model> listar() {
            List<Model> modelos = repository.findAll();
            System.out.println("Modelos retornados: " + modelos); // Log para verificar os dados
            return modelos;
        }

        @PostMapping
        @ResponseStatus(HttpStatus.CREATED)
        public Model addModel(@RequestBody Model model) {
            return repository.save(model);
        }

        @GetMapping("/{id}")
        public ResponseEntity<Model> buscarPorId(@PathVariable Long id) {
            Optional<Model> model = repository.findById(id);
            if (model.isPresent()) {
                return ResponseEntity.ok(model.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        }

        @PutMapping("/{id}")
        public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Model m) {
            return repository.findById(id)
                    .map(model -> {
                        model.setTitulo(m.getTitulo());
                        model.setOcasiao(m.getOcasiao());
                        model.setDescricao(m.getDescricao());
                        // Não atualizando a imagem aqui, pois ela é tratada separadamente no upload
                        repository.save(model);
                        return ResponseEntity.ok(model);
                    })
                    .orElse(ResponseEntity.notFound().build());
        }

        @DeleteMapping("/{id}")
        @ResponseStatus(HttpStatus.NO_CONTENT)
        public ResponseEntity<Void> deletar(@PathVariable Long id) {
            if (repository.existsById(id)) {
                repository.deleteById(id);
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        }
    }

