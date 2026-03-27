+++
date = '2025-07-22T12:22:36+02:00'
draft = false
title = 'Demarrage rapide'
weight = 1
+++

Ce guide propose un parcours pas a pas pour lancer une application de base avec le SDK Lens. A la fin, vous aurez initialise le service, cree un nouveau `Site`, rempli ses categories de contenu par defaut, ajoute du contenu et recupere ce contenu.

### Prerequis

* Node.js, version 18 ou superieure recommandee
* Un environnement de projet pret pour TypeScript

### Etape 1 : installation

Commencez par ajouter le SDK Lens aux dependances de votre projet.

```bash
pnpm install @riffcc/lens-sdk
```

### Etape 2 : initialiser `LensService`

`LensService` est le point d'entree principal pour toutes les fonctionnalites du SDK. La premiere etape consiste a creer une instance et a initialiser son client P2P sous-jacent.

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

### Etape 3 : creer et ouvrir un `Site`

Un `Site` est votre hub de contenu decentralise. Pour en creer un nouveau, vous instanciez le programme `Site` avec votre cle publique en tant qu'administrateur racine, puis vous demandez au service de l'ouvrir.

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

> **Utiliser une identite personnalisee :** l'exemple ci-dessus utilise l'identite par defaut generee automatiquement pour le noeud Peerbit. Pour les applications destinees aux utilisateurs, l'approche recommandee consiste a utiliser le portefeuille de l'utilisateur, comme MetaMask, comme identite. Pour savoir comment faire, consultez la section **Utiliser un portefeuille pour l'identite utilisateur** dans notre [guide des sujets avances](/fr/docs/lens-sdk/advanced-topics/#1-using-a-wallet-for-user-identity).

### Etape 4 : initialiser les categories de contenu du site

Un nouveau `Site` est vide par defaut. En tant qu'administrateur racine, vous devez l'initialiser avec un ensemble de documents `ContentCategory`. Il s'agit d'une operation unique qui remplit le site avec les modeles necessaires a la publication de contenu.

```typescript
// Inside your main() function, after lens.openSite()

console.log("Initializing site with default content categories...");
// This is a privileged, direct interaction with the Site program.
await lens.siteProgram.initializeDefaultContentCategories();
console.log("Default categories initialized successfully.");
```

### Etape 5 : ajouter du contenu (creer une `Release`)

Maintenant que le `Site` a ete initialise avec ses categories, vous pouvez ajouter du contenu. Ajoutons une premiere `Release` en la reliant a la categorie par defaut `"music"`.

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

### Etape 6 : recuperer le contenu

Enfin, verifions que le contenu a bien ete enregistre en recuperant toutes les releases du site.

```typescript
// Inside your main() function, after adding the release

console.log("Retrieving all releases...");
const allReleases = await lens.getReleases();

console.log(`Found ${allReleases.length} release(s):`);
allReleases.forEach(release => {
  console.log(`- ID: ${release.id}, Name: "${release.name}"`);
});
```

Felicitations. Vous avez cree avec succes un `Site` decentralise, l'avez initialise, avez gere les permissions, ajoute du contenu et l'avez recupere. Vous pouvez maintenant approfondir les [Concepts fondamentaux](./core-concepts) ou consulter la [Reference d'API](./api-reference).
