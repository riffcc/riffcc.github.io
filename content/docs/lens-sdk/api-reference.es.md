+++
date = '2025-07-22T05:45:03+02:00'
draft = false
title = 'Referencia de API'
weight = 5
+++

Este documento proporciona una referencia detallada de la API publica del SDK de Lens, centrada principalmente en la clase `LensService`. `LensService` es el unico punto de entrada previsto para desarrolladores que construyen aplicaciones con el SDK.

## `LensService`

La clase `LensService` proporciona una interfaz asincrona y de alto nivel para todas las funcionalidades del SDK. Gestiona el cliente Peerbit, el ciclo de vida del programa `Site` y todas las operaciones orientadas a las personas usuarias.

### Constructor

```typescript
new LensService(options?: {
  peerbit?: ProgramClient;
  debug?: boolean;
  customPrefix?: string;
  identity?: Identity<Secp256k1PublicKey>;
})
```

Inicializa una nueva instancia del servicio.

| Parameter      | Type            | Optional | Description                                                                                             |
|----------------|-----------------|:--------:|---------------------------------------------------------------------------------------------------------|
| `options`      | `object`        | **Yes**  | Configuracion de la instancia del servicio.                                                             |
| `options.peerbit`| `ProgramClient` | **Yes**  | Un cliente Peerbit gestionado externamente. Si se proporciona, `init()` y `stop()` no afectaran a su ciclo de vida. |
| `options.debug`| `boolean`       | **Yes**  | Activa el registro diagnostico detallado en la consola. El valor predeterminado es `false`.            |
| `options.customPrefix`| `string` | **Yes**  | Establece un prefijo personalizado para los mensajes de registro. El valor predeterminado es `'[LensService]'`. |
| `options.identity`| `Identity`   | **Yes**  | Una identidad personalizada centrada en la persona usuaria, por ejemplo procedente de una cartera, para todas las operaciones de firma. Si se omite, el servicio usa la identidad predeterminada del nodo Peerbit. |

---

## Metodos de ciclo de vida

Estos metodos controlan la conexion con la red Peerbit y con el programa `Site` activo.

### `init()`

```typescript
init(directory?: string): Promise<void>
```

Inicializa y arranca un nuevo cliente Peerbit gestionado internamente. Este metodo debe llamarse antes de cualquier otra operacion si el servicio no se construyo con un cliente externo.

| Parameter   | Type     | Optional | Description                                                                                |
|-------------|----------|:--------:|--------------------------------------------------------------------------------------------|
| `directory` | `string` | **Yes**  | Ruta del sistema de archivos para almacenar la identidad del peer y los datos. Si se omite, los datos se almacenan en memoria. |

### `stop()`

```typescript
stop(): Promise<void>
```

Detiene el servicio de forma ordenada, cerrando el `Site` activo y deteniendo el cliente Peerbit si esta gestionado internamente.

### `openSite()`

```typescript
openSite(
  siteOrAddress: Site | string, 
  options?: { siteArgs?: SiteArgs, federate?: boolean }
): Promise<void>
```

Abre un programa `Site`, convirtiendolo en el contexto activo para todas las llamadas API posteriores.

| Parameter         | Type                | Optional | Description                                                                                                |
|-------------------|---------------------|:--------:|------------------------------------------------------------------------------------------------------------|
| `siteOrAddress`   | `Site \| string`      | No       | Para crear un nuevo `Site`, pasa una instancia `new Site(rootTrust)`. Para abrir uno existente, pasa su direccion. |
| `options`         | `object`            | **Yes**  | Configuracion adicional.                                                                                   |
| `options.siteArgs`| `SiteArgs`          | **Yes**  | Configuracion avanzada para la replicacion de base de datos.                                              |
| `options.federate`| `boolean`           | **Yes**  | Si es `true`, inicia `FederationManager` para ese sitio y gestiona las subscriptions. El valor predeterminado es `true`. |

---

## Metodos de cuenta y estado

Metodos para recuperar informacion sobre la persona usuaria actual.

### `getAccountStatus()`

```typescript
getAccountStatus(): Promise<AccountStatusResponse>
```

Determina el estado completo de permisos de la **identidad activa** actual, ya sea una identidad personalizada de cartera o la identidad predeterminada del nodo, para el `Site` activo. Este es el metodo principal para obtener la informacion necesaria para renderizar una interfaz de usuario adaptada a sus capacidades.

```typescript
interface AccountStatusResponse {
  isAdmin: boolean;      // True if the user is a top-level administrator
  roles: string[];       // An array of role names assigned to the user (e.g., ["moderator", "member"])
  permissions: string[]; // A flattened, unique list of all permissions granted by the user's roles
}
```

---

### Tipos de entrada de la API

Para simplificar las interacciones, `LensService` utiliza dos patrones principales de entrada para crear y editar documentos.

* **`AddInput<T>`**: se utiliza para crear documentos nuevos, por ejemplo en `addRelease`. El tipo `AddInput<T>` es simplemente un alias de `T`. Tu proporcionas solo las propiedades de datos principales del documento que quieres crear. `LensService` se encarga de anadir automaticamente los campos requeridos `id`, `postedBy` y `siteAddress`.

* **`EditInput<T>`**: se utiliza para actualizar documentos existentes, por ejemplo en `editRelease`. Este tipo es un alias de `T & ImmutableProps`. Debes proporcionar todos los datos del documento, incluidos `id`, `postedBy` y `siteAddress` del documento existente. El servicio comprobara que las propiedades inmutables, `postedBy` y `siteAddress`, no hayan cambiado.

---

## Gestion de contenido (`Releases`)

Metodos para crear y gestionar el tipo principal de contenido, `Release`.

### `addRelease()`

```typescript
addRelease(data: AddInput<ReleaseData>): Promise<HashResponse>
```

Crea y guarda un nuevo documento `Release`. Requiere que la persona usuaria tenga un rol con el permiso `release:create`, por ejemplo `Member`, `Moderator` o `Admin`.

| Parameter | Type                | Description                                                                                             |
|-----------|---------------------|---------------------------------------------------------------------------------------------------------|
| `data`    | `AddInput<ReleaseData>` | Un objeto con las propiedades de la release, como `name`, `categoryId`, etc. |

### `editRelease()`

```typescript
editRelease(data: EditInput<ReleaseData>): Promise<HashResponse>
```

Actualiza una `Release` existente. El permiso requerido depende de la accion:

* Una persona usuaria con el permiso `release:edit:own` puede editar una release en la que sea `postedBy`.
* Una persona usuaria con el permiso `release:edit:any` puede editar cualquier release.

| Parameter | Type                | Description                                                                                                                               |
|-----------|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| `data`    | `EditInput<ReleaseData>` | Los datos completos de la `Release`, incluido el `id` del documento que se va a actualizar. El servicio rechazara la edicion si se modifican `postedBy` o `siteAddress`. |

Actualiza una `Release` existente. El objeto `data` debe incluir el `id`. Requiere privilegios `ADMIN`.

### `deleteRelease()`

```typescript
deleteRelease(id: string): Promise<IdResponse>
```

Elimina una `Release` por su identificador. Requiere el permiso `release:delete`, por ejemplo `Moderator` o `Admin`.

### `getRelease()`

```typescript
getRelease(id: string): Promise<WithContext<Release> | undefined>
```

Recupera una sola `Release` por su identificador.

### `getReleases()`

```typescript
getReleases(options?: SearchOptions): Promise<WithContext<Release>[]>
```

Recupera un array de documentos `Release`.

---

## Gestion de contenido destacado

Metodos para gestionar entradas `FeaturedRelease`. Estas operaciones requieren un rol con el permiso `featured:manage`, por ejemplo `Moderator` o `Admin`.

### `addFeaturedRelease()`

```typescript
addFeaturedRelease(data: AddInput<FeaturedReleaseData>): Promise<HashResponse>
```

Crea una `FeaturedRelease` para destacar una `Release` existente.

### `editFeaturedRelease()`

```typescript
editFeaturedRelease(data: EditInput<FeaturedReleaseData>): Promise<HashResponse>
```

Actualiza una `FeaturedRelease` existente. El `id` debe estar presente y las propiedades principales `postedBy` y `siteAddress` no pueden modificarse.

### `deleteFeaturedRelease()`

```typescript
deleteFeaturedRelease(id:string): Promise<IdResponse>
```

Elimina una `FeaturedRelease` por su identificador.

*(Los metodos `getFeaturedRelease` y `getFeaturedReleases` siguen el mismo patron que sus equivalentes de `Release`.)*

---

## Gestion de categorias de contenido

Metodos para gestionar documentos `ContentCategory`. Estas operaciones requieren un rol con el permiso `category:manage`, por ejemplo `Moderator` o `Admin`.

### `addContentCategory()`

```typescript
addContentCategory(data: AddInput<ContentCategoryData>): Promise<HashResponse>
```

Crea una nueva `ContentCategory`. `categoryId` debe ser unico.

### `editContentCategory()`

```typescript
editContentCategory(data: EditInput<ContentCategoryData>): Promise<HashResponse>
```

Actualiza una `ContentCategory` existente. El servicio rechazara la actualizacion si se modifican campos inmutables como `postedBy`, `siteAddress` o `categoryId`.

### `deleteContentCategory()`

```typescript
deleteContentCategory(id: string): Promise<IdResponse>
```

Elimina una `ContentCategory` por su identificador.

### `getContentCategory()`

```typescript
getContentCategory(id: string): Promise<WithContext<ContentCategory> | undefined>
```

Recupera una sola `ContentCategory` por su identificador.

### `getContentCategories()`

```typescript
getContentCategories(options?: SearchOptions): Promise<WithContext<ContentCategory>[]>
```

Recupera un array de todos los documentos `ContentCategory`.

---

## Gestion de federacion (`Subscription`)

Metodos para gestionar relaciones de federacion. Estas operaciones requieren un rol con el permiso `subscription:manage`, por ejemplo `Moderator` o `Admin`.

### `addSubscription()`

```typescript
addSubscription(data: AddInput<SubscriptionData>): Promise<HashResponse>
```

Se suscribe a otro `Site`, iniciando la federacion.

| Parameter | Type       | Description                                                 |
|-----------|------------|-------------------------------------------------------------|
| `data`    | `AddInput<SubscriptionData>`   | Objeto con las propiedades de la subscription. `SubscriptionData` es `{ to: string }`. |

### `deleteSubscription()`

```typescript
deleteSubscription(data: { id?: string; to?: string }): Promise<IdResponse>
```

Cancela la suscripcion a un `Site`, detiene la federacion y purga su contenido.

| Parameter | Type     | Description                                                          |
|-----------|----------|----------------------------------------------------------------------|
| `data`    | `object` | Objeto que contiene el `id` de la subscription o la direccion `to` del sitio objetivo que debe eliminarse. |

### `getSubscriptions()`

```typescript
getSubscriptions(options?: SearchOptions): Promise<Subscription[]>
```

Recupera una lista de todos los documentos `Subscription` actuales.

## Gestion del control de acceso

Metodos para gestionar permisos de personas usuarias en el `Site` activo. Estas operaciones son privilegiadas y **solo puede realizarlas un Administrator**.

### `addAdmin()`

```typescript
addAdmin(publicKey: string | PublicSignKey): Promise<BaseResponse>
```

Promociona a otra persona usuaria a Administrator completo, anadiendola al `TrustedNetwork` raiz del sitio.

| Parameter   | Type                   | Description                                                |
|-------------|------------------------|------------------------------------------------------------|
| `publicKey` | `string \| PublicSignKey` | La clave publica de la persona usuaria que se va a promocionar. |

### `assignRole()`

```typescript
assignRole(publicKey: string | PublicSignKey, roleId: string): Promise<BaseResponse>
```

Asigna un rol especifico a una persona usuaria.

| Parameter   | Type                   | Description                                                                 |
|-------------|------------------------|-----------------------------------------------------------------------------|
| `publicKey` | `string \| PublicSignKey` | La clave publica de la persona usuaria.                                     |
| `roleId`    | `string`               | El identificador de cadena del rol que se va a asignar, por ejemplo `"member"` o `"moderator"`. |

### `revokeRole()`

```typescript
revokeRole(publicKey: string | PublicSignKey, roleId: string): Promise<BaseResponse>
```

Revoca un rol especifico a una persona usuaria.

| Parameter   | Type                   | Description                                                                 |
|-------------|------------------------|-----------------------------------------------------------------------------|
| `publicKey` | `string \| PublicSignKey` | La clave publica de la persona usuaria.                                     |
| `roleId`    | `string`               | El identificador de cadena del rol que se va a revocar.                     |

## Objetos de respuesta comunes

La mayoria de metodos de `LensService` devuelven uno de los siguientes objetos de respuesta estandarizados para garantizar un manejo coherente de errores y una retroalimentacion consistente.

### `BaseResponse`

El objeto de respuesta mas simple, que solo indica exito o fracaso.

| Field     | Type      | Description                                           |
|-----------|-----------|-------------------------------------------------------|
| `success` | `boolean` | `true` si la operacion fue exitosa; de lo contrario `false`. |
| `error`   | `string`  | Mensaje de error si `success` es `false`.             |

### `IdResponse`

Amplia `BaseResponse` para incluir el identificador unico del documento afectado.

| Field | Type     | Description                                               |
|-------|----------|-----------------------------------------------------------|
| `id`  | `string` | El identificador unico del documento creado o modificado. |
| *(...inherits from `BaseResponse`)* | | |

### `HashResponse`

Amplia `IdResponse` para incluir tambien el hash criptografico de la entrada de log de la operacion, que puede usarse para verificacion.

| Field | Type     | Description                                          |
|-------|----------|------------------------------------------------------|
| `hash`| `string` | El hash criptografico de la entrada subyacente del log P2P. |
| *(...inherits from `IdResponse`)* | | |
