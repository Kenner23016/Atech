package com.ADS.Atech.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    @NotBlank
    @Size(max = 100)
    private String titulo;

    @Column(length = 500, nullable = false)
    @NotBlank
    @Size(max = 500)
    private String descripcion;

    @Column(length = 10, nullable = false)
    @NotNull
    @Enumerated(EnumType.STRING)
    private ProductState estado;

    @Column(nullable = false)
    @NotNull
    private Double precio;

    @Column(nullable = false)
    @NotNull
    @Min(0)
    private Integer cantidad;

    @Column(length = 255, nullable = false)
    @NotBlank
    @Size(max = 255)
    private String imagen;

}
