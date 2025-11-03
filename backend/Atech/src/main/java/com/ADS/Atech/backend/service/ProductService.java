package com.ADS.Atech.backend.service;

import com.ADS.Atech.backend.model.Product;
import com.ADS.Atech.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@Service
@Transactional
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public List<Product> findAll() {
        return repo.findAll();
    }

    public Product findById(Long id) {
        return repo.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
    }

    public Product create(Product product) {
        product.setId(null);
        return repo.save(product);
    }

    public Product update(Long id, Product product) {
        Product existing = findById(id);
        existing.setTitulo(product.getTitulo());
        existing.setDescripcion(product.getDescripcion());
        existing.setEstado(product.getEstado());
        existing.setPrecio(product.getPrecio());
        existing.setCantidad(product.getCantidad());
        existing.setImagen(product.getImagen());
        return repo.save(existing);
    }

    public void delete(Long id) {
        Product existing = findById(id);
        repo.delete(existing);
    }
}
