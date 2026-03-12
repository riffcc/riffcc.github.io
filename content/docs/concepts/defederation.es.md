+++
draft = false
title = 'Defederation'
weight = 1
+++

Defederation, o federación descentralizada, es nuestro sistema para gestionar redes descentralizadas de contenido y comunidades.

Permite que los Lenses se sigan entre sí y repliquen instantáneamente todo el contenido de los Lenses seguidos.

## Ejemplos
El sitio D podría construir su biblioteca siguiendo al sitio B, y por extensión al sitio C. El sitio D también puede tener contenido propio.

<img src="/images/docs/concepts/defederation.webp" class="light-webp" alt="Diagrama que muestra la arquitectura de Flagship" />
<img src="/images/docs/concepts/defederation-dark.webp" class="dark-webp" alt="Diagrama que muestra la arquitectura de Flagship" />

En este ejemplo, el sitio D tendría 9 piezas de contenido, y todas se mostrarían en una experiencia unificada, como si formaran parte de una sola biblioteca.

## Detalles técnicos

Peerbit se utiliza para sincronizar y federar entre Lenses, y es la tecnología central que hace esto posible.

Nuestro Lens SDK amplía Peerbit para habilitar esta funcionalidad.

Cada Lens obtiene su propio Site ID, que se usa tanto para identificarlo en la red como para permitir que otros Lenses lo sigan.
