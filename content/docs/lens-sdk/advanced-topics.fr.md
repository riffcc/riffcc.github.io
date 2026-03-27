+++
date = '2025-07-22T12:25:02+02:00'
draft = false
title = 'Sujets avances'
weight = 3
+++

Cette section couvre des concepts avances et des bonnes pratiques pour construire des applications robustes, evolutives et securisees avec le SDK Lens. Elle s'adresse aux developpeurs qui maitrisent deja les sujets presentes dans le guide de demarrage rapide et les concepts fondamentaux.

### 1. Utiliser un portefeuille pour l'identite utilisateur

La fonctionnalite la plus puissante pour construire des dApps avec le SDK Lens est la possibilite d'utiliser un portefeuille externe, comme MetaMask, comme identite de l'utilisateur. Cela permet a l'utilisateur de signer directement toutes ses actions, ce qui garantit qu'il ou elle reste le veritable proprietaire de son contenu.

Pour cela, vous devez creer un objet `Identity` compatible Peerbit a partir d'un signataire `ethers.js`.

#### Etape 1 : ajouter les dependances

Vous aurez besoin de `ethers` pour interagir avec les portefeuilles du navigateur.

```bash
pnpm install ethers
```

#### Etape 2 : creer l'identite a partir d'un signataire

Le SDK fournit une fonction utilitaire, `createIdentityFromSigner`, pour simplifier cela. Dans une application web, vous recupererez generalement le signataire depuis le fournisseur `window.ethereum`.

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

#### Etape 3 : creer un site avec l'identite du portefeuille

Si l'utilisateur est la premiere personne a creer un `Site`, la cle publique de son portefeuille doit etre utilisee comme administrateur racine. Vous pouvez passer directement `walletIdentity.publicKey` au constructeur `Site`.

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

Ce modele est fondamental pour creer des applications non custodiales dans lesquelles les utilisateurs gardent un controle complet.

### 2. Gerer le client Peerbit en externe

Dans certaines applications complexes, il peut etre necessaire de gerer vous-meme le cycle de vie du client P2P Peerbit, en particulier si votre application utilise d'autres programmes Peerbit en plus du programme `Site`.

Le constructeur `LensService` accepte en option une instance de client `peerbit`. Lorsqu'un client est fourni de cette maniere, le service ne tente pas d'en gerer le cycle de vie.

**Cas d'usage :** votre application doit executer un programme `Site` et un autre programme personnalise `Chat` sur le meme noeud Peerbit.

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

### 3. Personnaliser la replication (`SiteArgs`)

Par defaut, un programme `Site` tente de repliquer ses magasins de donnees avec un faible facteur de replication afin d'economiser des ressources. Pour les applications qui exigent une meilleure disponibilite ou de meilleures performances, vous pouvez fournir des arguments de replication personnalises lors de l'ouverture d'un site.

L'objet `SiteArgs` vous permet de definir les options `replicate` de chaque magasin de donnees dans le `Site`.

**Cas d'usage :** vous exploitez un noeud de "pinning" dedie qui doit conserver une copie complete de toutes les donnees pour une disponibilite maximale.

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

Pour des options de replication detaillees, reportez-vous a la documentation Peerbit sur `ReplicationOptions`.

### 4. Comprendre les performances de federation

Le `FederationManager` est concu pour etre efficace, mais dans les reseaux de grande taille, il est utile d'en comprendre le comportement :

* **Synchronisation historique :** c'est la partie la plus gourmande en ressources de la federation. Lorsqu'un site contenant des milliers de releases est abonne, la synchronisation initiale peut prendre du temps et consommer de la bande passante. Ce processus s'execute en arriere-plan et ne bloque pas les autres operations.
* **Synchronisation live :** les mises a jour live via pub/sub sont tres legeres. Un message `FederationUpdate` contient uniquement les hachages cryptographiques et les metadonnees des entrees modifiees, et non les donnees completes, ce qui rend les mises a jour en temps reel tres rapides.
* **Topologie reseau :** les performances de federation dependent du reseau libp2p sous-jacent. Pour des performances optimales, veillez a ce que les noeuds, surtout ceux qui se federent frequemment entre eux, soient bien connectes. Vous pouvez utiliser `peerbit.dial()` pour etablir manuellement des connexions si necessaire.

### 5. Moderation de contenu de niveau production (`BlockedContent` et listes de refus)

Le SDK Lens est concu autour d'une architecture puissante de moderation de contenu qui va au-dela du simple filtrage applicatif et touche l'infrastructure elle-meme. Cette section expose la vision d'ensemble, en distinguant ce qui est deja disponible de ce qui est en cours ou prevu.

#### Suppressions logiques vs suppressions dures

Il est important de distinguer les deux formes de retrait de contenu :

* **`deleteRelease()` (suppression logique) :** il s'agit d'une fonctionnalite standard. Lorsqu'un administrateur appelle `deleteRelease()`, cela retire le document `Release` de la base de donnees du site. C'est une suppression "douce" ou logique du point de vue de l'application. Le fichier de donnees sous-jacent sur IPFS n'est pas immediatement affecte.

* **`BlockedContent` (fondation pour une suppression dure) :** ce schema sert de base a un processus de "hard delete". Il est concu pour creer un enregistrement permanent et verifiable indiquant qu'un contenu identifie par son CID doit etre purge non seulement de l'application, mais aussi de toute l'infrastructure de stockage.

#### Le modele de moderation "Bad Bits" : etat actuel et vision future

Le modele recommande pour une moderation robuste suit les principes de formats etablis de listes de refus comme la denylist ["Bad Bits"](https://badbits.dwebops.pub/).

Voici le flux de travail, avec l'etat de chaque composant :

1. **Action de l'administrateur :** un administrateur identifie un contenu, via son identifiant IPFS CID, qui doit etre bloque.

2. **Double hachage et creation d'enregistrement (en cours) :**
    * **Fonctionnalite :** pour proteger la vie privee, le CID original est **doublement hache**, par exemple SHA256(SHA256(CID)), avant d'etre stocke. Cela empeche un observateur occasionnel d'identifier directement le contenu sur la liste de blocage.
    * **Etat :** les methodes de haut niveau `LensService` pour realiser cette operation, comme `blockContent()`, sont **actuellement en cours de developpement**. Elles offriront aux administrateurs un moyen simple et securise d'ajouter des entrees dans le magasin `blockedContent` sans interagir directement avec le programme.

3. **Synchronisation avec l'infrastructure (implementation future) :**
    * **Vision :** a long terme, un service backend de confiance, ou "Operator", surveillera le magasin `blockedContent` du `Site`. Cet Operator generera un fichier de denylist standard a partir des hachages stockes et le distribuera a toute l'infrastructure centrale.
    * **Etat :** l'implementation de ce **service Operator est prevue pour plus tard**. Une fois terminee, elle permettra au magasin `blockedContent` d'agir comme source de verite decentralisee capable d'ordonner aux noeuds IPFS, clusters et CDN de refuser de servir un contenu bloque et de le supprimer definitivement.

#### Resume des fonctionnalites de moderation

| Feature                                   | Status            | Description                                                                                             |
|-------------------------------------------|-------------------|---------------------------------------------------------------------------------------------------------|
| **Logical Deletion** (`deleteRelease`)      | ✅ **Implemented** | Removes content metadata from the `Site`'s database.                                                      |
| **Blocklist Schema** (`BlockedContent`)   | ✅ **Implemented** | The on-chain data structure for recording moderation decisions exists.                                    |
| **Service API for Blocking** (`blockContent`) | ⏳ **In Progress**  | High-level `LensService` methods for easy and secure management of the `blockedContent` store.          |
| **Operator for Infrastructure Sync**        | 🗺️ **Future**       | A service to automate the syncing of the on-chain blocklist to IPFS nodes, clusters, and CDNs.        |

Cette feuille de route trace un chemin clair entre les capacites actuelles et un systeme complet de moderation de contenu de bout en bout, a la fois puissant et respectueux de la vie privee.

### 6. Interaction directe avec le programme (pour cas avances)

Bien que `LensService` doive couvrir 99 % des interactions, il existe de rares cas ou une interaction directe avec le programme `Site` s'impose, par exemple dans des scripts administratifs cote serveur.

L'instance active du programme `Site` est disponible via `lensService.siteProgram`.

**Cas d'usage :** un script doit inspecter l'etat de replication bas niveau d'une base de donnees specifique.

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

**Avertissement :** en contournant `LensService`, vous perdez ses verifications de securite, sa gestion des erreurs et la stabilite de son contrat d'API. Cela ne doit etre fait que si vous avez une tres bonne connaissance de Peerbit et de la logique interne du programme `Site`.
