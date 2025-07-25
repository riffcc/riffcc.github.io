+++
date = '2025-07-22T12:22:36+02:00'
draft = false
title = 'Quick Start'
weight = 1
+++

This guide provides a step-by-step walkthrough to get a basic application running with the Lens SDK. By the end of this guide, you will have initialized the service, created a new `Site`, populated it with default content categories, added content, and retrieved it.

### Prerequisites

* Node.js (v18 or higher recommended)
* A TypeScript-ready project environment

### Step 1: Installation

First, add the Lens SDK to your project dependencies.

```bash
pnpm install @riffcc/lens-sdk
```

### Step 2: Initializing the `LensService`

The `LensService` is the primary entry point for all SDK functionality. The first step is to create an instance and initialize its underlying P2P client.

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

### Step 3: Creating and Opening a `Site`

A `Site` is your decentralized content hub. To create a new one, you instantiate the `Site` program with your public key as the root administrator and then ask the service to open it.

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

> **Using a Custom Identity:** The example above uses the default identity automatically generated for the Peerbit node. For user-facing applications, the recommended approach is to use the user's own wallet (like MetaMask) as the identity. To learn how to implement this, please see the **Using a Wallet for User Identity** section in our [Advanced Topics guide](./advanced-topics).

### Step 4: Initializing Site Content Categories

A new `Site` is empty by default. As the root administrator, you should initialize it with a set of `ContentCategory` documents. This is a one-time operation that populates the site with the necessary templates for posting content.

```typescript
// Inside your main() function, after lens.openSite()

console.log("Initializing site with default content categories...");
// This is a privileged, direct interaction with the Site program.
await lens.siteProgram.initializeDefaultContentCategories();
console.log("Default categories initialized successfully.");
```

### Step 5: Adding Content (Creating a `Release`)

Now that the `Site` has been initialized with categories, you can add content. Let's add your first `Release`, linking it to the default `"music"` category.

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

### Step 6: Retrieving Content

Finally, let's verify that the content was saved by retrieving all releases from the site.

```typescript
// Inside your main() function, after adding the release

console.log("Retrieving all releases...");
const allReleases = await lens.getReleases();

console.log(`Found ${allReleases.length} release(s):`);
allReleases.forEach(release => {
  console.log(`- ID: ${release.id}, Name: "${release.name}"`);
});
```

Congratulations! You have successfully created a decentralized `Site`, initialized it, managed permissions, added content, and retrieved it. From here, explore the [Core Concepts](./core-concepts) or consult the [API Reference](./api-reference).
