+++
date = '2025-07-22T12:22:36+02:00'
draft = false
title = 'Inicio rapido'
weight = 1
+++

Esta guia ofrece un recorrido paso a paso para poner en marcha una aplicacion basica con el SDK de Lens. Al terminar, habras inicializado el servicio, creado un nuevo `Site`, llenado sus categorias de contenido predeterminadas, anadido contenido y recuperado ese contenido.

### Requisitos previos

* Node.js, se recomienda la version 18 o superior
* Un entorno de proyecto preparado para TypeScript

### Paso 1: instalacion

Primero, anade el SDK de Lens a las dependencias de tu proyecto.

```bash
pnpm install @riffcc/lens-sdk
```

### Paso 2: inicializar `LensService`

`LensService` es el punto de entrada principal para toda la funcionalidad del SDK. El primer paso consiste en crear una instancia e inicializar su cliente P2P subyacente.

```typescript
import { LensService } from '@riffcc/lens-sdk';
import { Site } from '@riffcc/lens-sdk/programs';

async function main() {
  console.log("Initializing Lens Service...");
  // We enable 'debug' for verbose logging during development.
  const lens = new LensService({ debug: true });
  
  // The init() method creates and starts the Peerbit client.
  // We provide a directory to persist the user's identity and data.
  await lens.init('./my-first-site-data');

  console.log("Service Initialized.");

  // We'll add more code here in the next steps...
  
  // Always remember to stop the service gracefully.
  await lens.stop();
  console.log("Service Stopped.");
}

main().catch(console.error);
```

### Paso 3: crear y abrir un `Site`

Un `Site` es tu centro de contenido descentralizado. Para crear uno nuevo, instancias el programa `Site` con tu clave publica como administracion raiz y luego pides al servicio que lo abra.

```typescript
// Inside your main() function, after lens.init()

// 1. Get the public key of the current user from the initialized client.
const myPublicKey = lens.peerbit.identity.publicKey;

// 2. Create a new Site instance, making yourself the root administrator.
const mySite = new Site(myPublicKey);

// 3. Open the site. This registers it on the network and creates default roles.
console.log("Opening a new Site...");
await lens.openSite(mySite);

const siteAddress = lens.siteProgram.address;
console.log(`Site created and opened successfully! Address: ${siteAddress}`);
```

> **Usar una identidad personalizada:** el ejemplo anterior utiliza la identidad predeterminada generada automaticamente para el nodo Peerbit. Para aplicaciones orientadas a personas usuarias, el enfoque recomendado es usar la propia cartera de la persona usuaria, como MetaMask, como identidad. Para aprender a implementarlo, consulta la seccion **Usar una cartera para la identidad de usuario** en nuestra [guia de temas avanzados](/es/docs/lens-sdk/advanced-topics/#1-using-a-wallet-for-user-identity).

### Paso 4: inicializar las categorias de contenido del sitio

Un `Site` nuevo esta vacio por defecto. Como administracion raiz, debes inicializarlo con un conjunto de documentos `ContentCategory`. Es una operacion unica que rellena el sitio con las plantillas necesarias para publicar contenido.

```typescript
// Inside your main() function, after lens.openSite()

console.log("Initializing site with default content categories...");
// This is a privileged, direct interaction with the Site program.
await lens.siteProgram.initializeDefaultContentCategories();
console.log("Default categories initialized successfully.");
```

### Paso 5: anadir contenido (crear una `Release`)

Ahora que el `Site` se ha inicializado con categorias, puedes anadir contenido. Vamos a anadir tu primera `Release`, vinculandola con la categoria predeterminada `"music"`.

```typescript
// Inside your main() function, after initializing categories

console.log("Adding a new Release to the Site...");

const releaseData = {
  name: "Hello, Decentralized World!",
  categoryId: "music", // Link to the 'music' category we just created
  contentCID: "bafybeigdyrzt5sfp7vu572pausrk236q2762rqcbqcnwqwixituoxuejm4" // Example CID
};

const response = await lens.addRelease(releaseData);

if (response.success) {
  console.log(`Release added successfully! ID: ${response.id}`);
} else {
  console.error(`Failed to add release: ${response.error}`);
}
```

### Paso 6: recuperar contenido

Por ultimo, verifiquemos que el contenido se ha guardado recuperando todas las releases del sitio.

```typescript
// Inside your main() function, after adding the release

console.log("Retrieving all releases...");
const allReleases = await lens.getReleases();

console.log(`Found ${allReleases.length} release(s):`);
allReleases.forEach(release => {
  console.log(`- ID: ${release.id}, Name: "${release.name}"`);
});
```

Enhorabuena. Has creado correctamente un `Site` descentralizado, lo has inicializado, has gestionado permisos, has anadido contenido y lo has recuperado. A partir de aqui puedes explorar los [Conceptos fundamentales](./core-concepts) o consultar la [Referencia de API](./api-reference).
