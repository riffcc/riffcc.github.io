+++
date = '2025-07-22T06:21:22+02:00'
draft = false
title = 'Referencia de Site'
weight = 4
+++

### Esquemas

Este documento proporciona una referencia detallada de los esquemas de datos que constituyen un programa `Site`. Comprender estos esquemas es fundamental para preparar los datos de las llamadas API y para interpretar los datos devueltos por `LensService`.

Todos los objetos de datos enviados a `LensService` para su creacion o edicion deben ajustarse a las estructuras descritas a continuacion.

#### Propiedades comunes de los documentos

Aunque no existe una clase base rigida, la mayoria de los documentos comparten un conjunto de propiedades fundamentales. Al crear un nuevo elemento de contenido, como una `Release`, los campos `id`, `postedBy` y `siteAddress` son gestionados automaticamente por `LensService`.

| Field         | Type                          | Description                                                                                                                                                             |
|---------------|-------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `id`          | `string`                      | Un identificador unico para el documento. Normalmente un UUID generado automaticamente al crearlo. Obligatorio al editar un documento existente.                     |
| `postedBy`    | `PublicSignKey` or `Uint8Array` | La clave publica criptografica de la identidad asociada al documento. Al crear contenido, este campo se establece automaticamente con la persona usuaria actual salvo que se indique lo contrario. |
| `siteAddress` | `string`                      | La direccion unica del `Site` donde se creo originalmente este documento. Siempre la establece el servicio y es inmutable.                                            |

> **Nota sobre la inmutabilidad:** los campos `postedBy` y `siteAddress` se consideran inmutables. Una vez creado un documento, estos valores no pueden cambiarse mediante una operacion `edit`. El SDK aplica esta regla en la capa de servicio.

---

#### 1. `Release`

`Release` es el objeto principal de contenido. Representa un unico elemento publicable, como un album musical, un video o un articulo.

| Field          | Type     | Required | Description                                                               |
|----------------|----------|:--------:|---------------------------------------------------------------------------|
| `name`         | `string` | **Yes**  | El titulo visible de la release.                                          |
| `categoryId`   | `string` | **Yes**  | El `id` de la `ContentCategory` a la que pertenece esta release, por ejemplo `"music"`. |
| `contentCID`   | `string` | **Yes**  | El identificador de contenido IPFS, o CID, del archivo principal o archivos principales de esta release. |
| `thumbnailCID` | `string` | No       | El CID de IPFS de una miniatura o imagen de portada asociada a la release. |
| `metadata`     | `string` | No       | Una cadena JSON que contiene metadatos adicionales especificos de la categoria. |

#### 2. `ContentCategory`

Una `ContentCategory` define una plantilla para un tipo de contenido, incluido el tipo de metadatos esperado. Normalmente las crea una persona administradora del `Site` o se inicializan a partir de un conjunto predeterminado.

| Field          | Type     | Required | Description                                                                                                   |
|----------------|----------|:--------:|---------------------------------------------------------------------------------------------------------------|
| `categoryId`   | `string` | **Yes**  | Un identificador unico y legible por humanos, por ejemplo `"movies"` o `"tv-shows"`. **Este campo es inmutable.** |
| `displayName`  | `string` | **Yes**  | El nombre legible por humanos de la categoria, por ejemplo `"TV Shows"`.                                      |
| `featured`     | `boolean`| No       | Indica si esta categoria debe mostrarse de forma destacada. Su valor predeterminado es `false`.              |
| `description`  | `string` | No       | Una breve explicacion del tipo de contenido que pertenece a esta categoria.                                   |
| `metadataSchema`| `string` | No       | Una cadena JSON que define la estructura del campo `metadata` para las `Releases` de esta categoria. Consulta [defaults.ts](https://github.com/riffcc/lens-sdk/blob/main/src/programs/site/defaults.ts) para ver ejemplos. |

> **Nota sobre la inmutabilidad de `categoryId`:** el campo `categoryId` funciona como una "business key" estable. Una vez creada una categoria, este identificador no puede cambiarse para garantizar que todas las `Releases` enlazadas a ella sigan siendo validas. El SDK aplica esta regla.

#### 3. `FeaturedRelease`

Una `FeaturedRelease` actua como un "pin" o acceso directo a una `Release` existente, lo que permite destacarla.

| Field       | Type      | Required | Description                                                            |
|-------------|-----------|:--------:|------------------------------------------------------------------------|
| `releaseId` | `string`  | **Yes**  | El `id` del documento `Release` que se esta destacando.                |
| `startTime` | `string`  | **Yes**  | Una cadena de fecha y hora con formato ISO 8601 que indica cuando debe activarse el destacado. |
| `endTime`   | `string`  | **Yes**  | Una cadena de fecha y hora con formato ISO 8601 que indica cuando debe caducar el destacado. |
| `promoted`  | `boolean` | **Yes**  | Un indicador para aplicar estilo o prioridad adicional en una seccion "promoted". |

#### 4. `Subscription`

Una `Subscription` representa una accion unilateral de "seguir", que constituye la base de la federacion. Cuando se crea una `Subscription`, `FederationManager` empieza a sincronizar el contenido del `Site` de destino.

| Field         | Type     | Required | Description                                                                                               |
|---------------|----------|:--------:|-----------------------------------------------------------------------------------------------------------|
| `to`          | `string` | **Yes**  | La direccion unica completa del programa `Site` remoto al que se esta suscribiendo.                      |

>Nota: el `id` de una subscription se genera de forma determinista a partir de una combinacion de las direcciones del sitio suscriptor y del sitio objetivo para evitar suscripciones duplicadas.

#### 5. `BlockedContent`

Un registro `BlockedContent` es una herramienta de moderacion utilizada por las personas administradoras del `Site` para ocultar contenido o impedir que se muestre.

| Field | Type     | Required | Description                                  |
|-------|----------|:--------:|----------------------------------------------|
| `cid` | `string` | **Yes**  | El CID de IPFS del contenido que se debe bloquear. |

---

Esta referencia proporciona el detalle necesario para que las personas desarrolladoras den formato correctamente a los datos en todas las interacciones API. Para obtener informacion sobre como crear, recuperar o gestionar documentos mediante estos esquemas, consulta la [**Referencia de API**](/es/docs/lens-sdk/api-reference).
