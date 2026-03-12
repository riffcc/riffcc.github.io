---
date: '2025-07-22T04:50:31+02:00'
draft: false
title: 'SDK de Lens'
sidebar:
  open: true
---

## Resumen

El SDK de Lens es un kit de desarrollo de software completo, robusto y preparado para entornos empresariales, disenado para crear redes sofisticadas de distribucion de contenido y federacion descentralizada. Aprovechando la potencia del framework P2P Peerbit, el SDK de Lens proporciona una arquitectura completa por capas para construir aplicaciones de contenido soberanas, interoperables y resilientes.

Este SDK esta pensado para desarrolladores y organizaciones que buscan crear aplicaciones donde la integridad de los datos, la propiedad por parte de las personas usuarias y la colaboracion descentralizada sean fundamentales. Abstrae la complejidad de las redes peer-to-peer, la sincronizacion de bases de datos y la identidad criptografica, ofreciendo una API limpia y de alto nivel para un desarrollo rapido y seguro.

## Filosofia central

El diseno del SDK de Lens esta guiado por varios principios fundamentales:

1. **Soberania de los datos:** las personas usuarias y las comunidades mantienen el control ultimo sobre sus propios datos y espacios digitales. Cada instancia del programa `Site` es una entidad soberana, gobernada por sus propias reglas y administradores.

2. **Federacion estructurada:** la comunicacion entre aplicaciones no es arbitraria. Es un proceso estructurado y autorizado basado en "subscriptions" explicitas. Este modelo garantiza que el intercambio de datos sea intencional y seguro, evita la inyeccion de datos no solicitados y crea una red basada en la confianza.

3. **Arquitectura modular y por capas:** el SDK impone una separacion estricta de responsabilidades, desde la logica P2P de bajo nivel hasta la API de servicio de alto nivel. Este diseno por capas mejora la seguridad, simplifica el mantenimiento y promueve practicas de desarrollo escalables.

4. **Procedencia verificable:** todos los datos creados y compartidos a traves de la red se firman criptograficamente y quedan marcados con la direccion de su `Site` de origen. Esto proporciona un rastro de auditoria inmutable y verificable para todo el contenido, garantizando que su autenticidad pueda confirmarse siempre.

## Funcionalidades clave

* **Aplicacion descentralizada lista para usar (programa `Site`):** el SDK incluye un programa P2P potente y completo, `Site`. Ofrece compatibilidad inmediata con publicaciones de contenido, categorias, elementos destacados y herramientas de moderacion.

* **Control de acceso flexible basado en roles (RBAC):** un sistema de permisos sofisticado, seguro y extensible. Proporciona una jerarquia clara de roles predeterminados (`Admin`, `Moderator`, `Member`) y permite crear roles personalizados con permisos granulares para controlar con precision la creacion de contenido, su gestion y la administracion del sitio.

* **Federacion y sincronizacion automatizadas:** un `FederationManager` sofisticado se encarga de todos los aspectos de la comunicacion entre sitios, incluidos:
  * **Sincronizacion historica:** rellena automaticamente el contenido cuando se establece una nueva subscription.
  * **Actualizaciones en vivo con pub/sub:** garantiza la sincronizacion en tiempo real entre sitios federados.
  * **Gestion del estado de las conexiones:** gestiona de forma inteligente el ciclo de vida de las conexiones federadas, incluida la limpieza automatica de datos al cancelar una suscripcion.

* **API de servicio de alto nivel (`LensService`):** una interfaz amigable para desarrolladores que sirve como punto de entrada unico para integrar aplicaciones. Proporciona una API estable basada en promesas que abstrae toda la complejidad P2P subyacente.

* **Esquemas extensibles:** todas las estructuras de datos se definen mediante esquemas fuertemente tipados, lo que garantiza la coherencia e integridad de los datos en toda la red, manteniendose a la vez extensibles para necesidades futuras.

## Quien deberia usar este SDK?

El SDK de Lens es ideal para desarrolladores y organizaciones que construyen:

* **Plataformas de contenido descentralizadas:** para creadores independientes, periodistas o artistas que necesitan herramientas de publicacion resistentes a la censura.
* **Foros y archivos propiedad de la comunidad:** donde las personas miembros contribuyen y gobiernan de forma colaborativa un repositorio compartido de conocimiento o datos.
* **Aplicaciones de redes sociales federadas:** aplicaciones que permiten a las personas usuarias ejecutar sus propios nodos mientras siguen participando en un grafo social mas amplio e interconectado.
* **Redes empresariales de intercambio de datos:** redes privadas y seguras para compartir datos versionados y artefactos entre socios corporativos de confianza.

## Primeros pasos

Para empezar a trabajar con el SDK de Lens, recomendamos revisar las siguientes secciones:

1. **[Conceptos fundamentales](/es/docs/lens-sdk/core-concepts):** una explicacion detallada del programa `Site`, la federacion y los principios arquitectonicos del SDK.
2. **[Inicio rapido](/es/docs/lens-sdk/quick-start):** un tutorial paso a paso para poner en marcha una aplicacion basica.
3. **[Referencia de API](/es/docs/lens-sdk/api-reference):** documentacion completa de `LensService`, sus metodos y sus tipos de datos.
