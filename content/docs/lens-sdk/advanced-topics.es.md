+++
date = '2025-07-22T12:25:02+02:00'
draft = false
title = 'Temas avanzados'
weight = 3
+++

Esta seccion cubre conceptos avanzados y buenas practicas para crear aplicaciones robustas, escalables y seguras con el SDK de Lens. Esta pensada para desarrolladores que ya estan familiarizados con los temas tratados en la guia de inicio rapido y en los conceptos fundamentales.

### 1. Usar una cartera para la identidad de usuario

La caracteristica mas potente para crear dApps con el SDK de Lens es la capacidad de utilizar una cartera externa, como MetaMask, como identidad de la persona usuaria. Esto permite que las personas usuarias firmen directamente todas sus acciones, garantizando que sean las verdaderas propietarias de su contenido.

Para hacerlo, necesitas crear un objeto `Identity` compatible con Peerbit a partir de un firmante de `ethers.js`.

#### Paso 1: anadir dependencias

Necesitaras `ethers` para interactuar con carteras del navegador.

```bash
pnpm install ethers
```

#### Paso 2: crear la identidad a partir de un firmante

El SDK proporciona una funcion utilitaria, `createIdentityFromSigner`, para facilitar este paso. En una aplicacion de navegador, normalmente obtendrias el firmante desde el proveedor `window.ethereum`.

```typescript
import { ethers } from 'ethers';
import { LensService, createIdentityFromSigner } from '@riffcc/lens-sdk';

async function setupWithWallet() {
  // In a browser environment:
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // Create a Peerbit-compatible identity from the ethers signer.
  const walletIdentity = await createIdentityFromSigner(signer);

  // Instantiate the LensService, passing the custom identity.
  const lens = new LensService({
    identity: walletIdentity,
    debug: true,
  });

  // Now, all calls like `lens.addRelease()` will trigger a signature
  // request in the user's wallet.
  await lens.init();
  // ... rest of your application logic
}
```

#### Paso 3: crear un sitio con la identidad de la cartera

Si la persona usuaria es la primera en crear un `Site`, la clave publica de su cartera debe usarse como administracion raiz. Puedes pasar `walletIdentity.publicKey` directamente al constructor de `Site`.

```typescript
import { Site } from '@riffcc/lens-sdk/programs';
// ... assuming lens and walletIdentity are set up from the previous step

// The user's wallet public key becomes the root of trust for the new Site.
const rootAdminKey = walletIdentity.publicKey;
const newSite = new Site(rootAdminKey);

// Open the site. The user's wallet will sign for this action.
await lens.openSite(newSite);

console.log(`Site created successfully! Address: ${lens.siteProgram.address}`);
```

Este patron es fundamental para crear aplicaciones no custodiales en las que las personas usuarias tienen control total.

### 2. Gestionar externamente el cliente Peerbit

En algunas aplicaciones complejas, puede que necesites gestionar por tu cuenta el ciclo de vida del cliente P2P Peerbit, especialmente si tu aplicacion usa otros programas Peerbit ademas del programa `Site`.

El constructor de `LensService` acepta opcionalmente una instancia cliente `peerbit`. Cuando se proporciona un cliente de esta forma, el servicio no intentara gestionar su ciclo de vida.

**Caso de uso:** tu aplicacion necesita ejecutar un programa `Site` y un programa personalizado `Chat` en el mismo nodo Peerbit.

```typescript
import { Peerbit } from 'peerbit';
import { LensService } from '@riffcc/lens-sdk';
import { ChatProgram } from './my-chat-program'; // Your custom program

async function setup() {
  // 1. Create and manage the Peerbit client yourself.
  const peerbit = await Peerbit.create({ directory: './shared-p2p-node' });

  // 2. Pass the external client to the LensService.
  const lens = new LensService({ peerbit: peerbit, debug: true });
  
  // 3. You can now open a Site...
  await lens.openSite('EXISTING_SITE_ADDRESS');
  
  // 4. ...and also open your other custom programs on the same node.
  const chat = await peerbit.open(new ChatProgram());

  // ... application logic ...

  // 5. You are responsible for stopping the client.
  // The lens.stop() call will NOT stop the external client.
  await lens.stop(); // Only stops the Site program and FederationManager
  await peerbit.stop();
}
```

### 3. Personalizar la replicacion (`SiteArgs`)

Por defecto, un programa `Site` intenta replicar sus almacenes de datos con un factor de replicacion bajo para ahorrar recursos. En aplicaciones que requieren mayor disponibilidad o mejor rendimiento, puedes proporcionar argumentos de replicacion personalizados al abrir un sitio.

El objeto `SiteArgs` te permite especificar opciones `replicate` para cada almacen de datos dentro del `Site`.

**Caso de uso:** estas ejecutando un nodo dedicado de "pinning" que debe almacenar una copia completa de todos los datos para ofrecer la maxima disponibilidad.

```typescript
import { Site } from '@riffcc/lens-sdk/programs';

const dedicatedPinningNodeArgs = {
  // Setting 'replicate: true' means "replicate everything you can find."
  releasesArgs: { replicate: true },
  featuredReleasesArgs: { replicate: true },
  contentCategoriesArgs: { replicate: true },
  // ACLs and Subscriptions should always be fully replicated on an admin node.
  membersArg: { replicate: true },
  administratorsArgs: { replicate: true },
  subscriptionsArgs: { replicate: true }
};

const site = new Site(myPublicKey);
await lens.openSite(site, { siteArgs: dedicatedPinningNodeArgs });
```

Para conocer opciones detalladas de replicacion, consulta la documentacion de Peerbit sobre `ReplicationOptions`.

### 4. Entender el rendimiento de la federacion

`FederationManager` esta disenado para ser eficiente, pero en redes a gran escala resulta util comprender su comportamiento:

* **Sincronizacion historica:** es la parte de la federacion que mas recursos consume. Cuando se suscribe un sitio con miles de releases, la sincronizacion inicial puede tardar tiempo y consumir ancho de banda. Este proceso se ejecuta en segundo plano y no bloquea otras operaciones.
* **Sincronizacion en vivo:** las actualizaciones en vivo mediante pub/sub son extremadamente ligeras. Un mensaje `FederationUpdate` solo contiene hashes criptograficos y metadatos de las entradas modificadas, no los datos completos, lo que hace que las actualizaciones en tiempo real sean muy rapidas.
* **Topologia de red:** el rendimiento de la federacion depende de la red libp2p subyacente. Para un rendimiento optimo, asegurate de que los nodos, especialmente aquellos que se federan con frecuencia entre si, esten bien conectados. Puedes usar `peerbit.dial()` para establecer conexiones manualmente si es necesario.

### 5. Moderacion de contenido a nivel de produccion (`BlockedContent` y listas de denegacion)

El SDK de Lens esta disenado con una potente arquitectura de moderacion de contenido que va mas alla del simple filtrado dentro de la aplicacion y se extiende hasta la infraestructura central. Esta seccion describe la vision completa, separando lo que ya esta disponible de las funciones que estan en curso o previstas para el futuro.

#### Eliminaciones logicas frente a eliminaciones duras

Es importante distinguir entre las dos formas de eliminar contenido:

* **`deleteRelease()` (eliminacion logica):** esta es una funcion estandar. Cuando un administrador llama a `deleteRelease()`, elimina el documento `Release` de la base de datos del sitio. Es una eliminacion "suave" o logica dentro de la vista de la aplicacion. El archivo de datos subyacente en IPFS no se ve afectado de inmediato.

* **`BlockedContent` (base para la eliminacion dura):** este esquema es la base de un proceso de "hard delete". Esta disenado para crear un registro permanente y verificable de que una pieza de contenido, identificada por su CID, debe purgarse no solo de la aplicacion, sino de toda la infraestructura de almacenamiento.

#### El patron de moderacion "Bad Bits": estado actual y vision futura

El patron recomendado para una moderacion robusta sigue los principios de formatos de listas de denegacion ya consolidados, como la denylist ["Bad Bits"](https://badbits.dwebops.pub/).

Este es el flujo de trabajo, incluyendo el estado de cada componente:

1. **Accion del administrador:** una persona administradora identifica una pieza de contenido por su IPFS CID que debe bloquearse.

2. **Doble hash y creacion del registro (en progreso):**
    * **Funcionamiento:** para proteger la privacidad, el CID original se **hashea dos veces**, por ejemplo SHA256(SHA256(CID)), antes de almacenarse. Esto evita que observadores casuales identifiquen directamente el contenido en la lista de bloqueo.
    * **Estado:** los metodos de alto nivel de `LensService` para realizar esta accion, como `blockContent()`, estan **actualmente en desarrollo**. Esto proporcionara una forma simple y segura para que las personas administradoras anadan entradas al almacen `blockedContent` sin interactuar directamente con el programa.

3. **Sincronizacion con la infraestructura (implementacion futura):**
    * **Vision:** la vision a largo plazo es que un servicio backend de confianza, u "Operator", supervise el almacen `blockedContent` del `Site`. Este Operator generara un archivo de denylist estandar a partir de los hashes almacenados y lo distribuira a toda la infraestructura principal.
    * **Estado:** la implementacion de este **servicio Operator esta prevista para el futuro**. Cuando este terminada, permitira que el almacen `blockedContent` actue como una fuente de verdad descentralizada capaz de indicar a nodos IPFS, clusters y CDN que se nieguen a servir y eliminen permanentemente el contenido bloqueado.

#### Resumen de las funciones de moderacion

| Feature                                   | Status            | Description                                                                                             |
|-------------------------------------------|-------------------|---------------------------------------------------------------------------------------------------------|
| **Logical Deletion** (`deleteRelease`)      | ✅ **Implemented** | Removes content metadata from the `Site`'s database.                                                      |
| **Blocklist Schema** (`BlockedContent`)   | ✅ **Implemented** | The on-chain data structure for recording moderation decisions exists.                                    |
| **Service API for Blocking** (`blockContent`) | ⏳ **In Progress**  | High-level `LensService` methods for easy and secure management of the `blockedContent` store.          |
| **Operator for Infrastructure Sync**        | 🗺️ **Future**       | A service to automate the syncing of the on-chain blocklist to IPFS nodes, clusters, and CDNs.        |

Esta hoja de ruta proporciona un camino claro desde las capacidades actuales hasta un sistema completo de moderacion de contenido de extremo a extremo que sea potente y al mismo tiempo respete la privacidad.

### 6. Interaccion directa con el programa (para casos avanzados)

Aunque `LensService` deberia cubrir el 99 % de las interacciones, puede haber casos raros en los que sea necesario interactuar directamente con el programa `Site`, por ejemplo en scripts administrativos del lado del servidor.

La instancia activa del programa `Site` esta disponible en `lensService.siteProgram`.

**Caso de uso:** un script necesita inspeccionar el estado de replicacion de bajo nivel de una base de datos concreta.

```typescript
// This is NOT a typical application pattern. Use with caution.
const site: Site | null = lens.siteProgram;

if (site) {
  // Accessing the underlying log of a store
  const releaseLog = site.releases.log;

  // Get the cryptographic heads of the log
  const heads = await releaseLog.log.getHeads().all();
  console.log('Current release log heads:', heads.map(h => h.hash));

  // Directly interacting with ACLs
  await site._authorise(AccountType.MEMBER, 'some_public_key');
}
```

**Advertencia:** al omitir `LensService`, pierdes sus comprobaciones de seguridad, su gestion de errores y la estabilidad de su contrato de API. Esto solo debe hacerse si tienes una comprension profunda de Peerbit y de la logica interna del programa `Site`.
