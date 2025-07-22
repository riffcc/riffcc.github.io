+++
date = '2025-07-22T12:22:36+02:00'
draft = true
title = 'Quick Start'
weight = 1
+++

This guide provides a step-by-step walkthrough to get a basic application running with the Lens SDK. By the end of this guide, you will have initialized the service, created a new `Site`, added content, and retrieved it.

### Prerequisites

* Node.js (v18 or higher recommended)
* A TypeScript-ready project environment

### Step 1: Installation

First, add the Lens SDK to your project dependencies.

```bash
pnpm install @riffcc/lens-sdk
```

### Step 2: Initializing the `LensService`

The `LensService` is the primary entry point for all SDK functionality. The first step in any application is to create an instance of the service and initialize its underlying P2P client.

Create a new file, for example `main.ts`, and add the following code:

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

// 2. Create a new Site instance, making yourself the owner/admin.
const mySite = new Site(myPublicKey);

// 3. Open the site. This registers it on the network.
console.log("Opening a new Site...");
await lens.openSite(mySite);

const siteAddress = lens.siteProgram.address;
console.log(`Site created and opened successfully! Address: ${siteAddress}`);
```

### Step 4: Adding Content (Creating a `Release`)

Now that a `Site` is open, you can perform actions as the administrator. Let's add your first piece of content.

```typescript
// Inside your main() function, after lens.openSite()

console.log("Adding a new Release to the Site...");

const releaseData = {
  postedBy: myPublicKey,
  name: "Hello, Decentralized World!",
  categoryId: "posts", // Assuming a 'posts' category exists or will be created
  contentCID: "bafybeigdyrzt5sfp7vu572pausrk236q2762rqcbqcnwqwixituoxuejm4" // Example CID
};

const response = await lens.addRelease(releaseData);

if (response.success) {
  console.log(`Release added successfully! ID: ${response.id}`);
} else {
  console.error(`Failed to add release: ${response.error}`);
}
```

### Step 5: Retrieving Content

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

### Complete Example

Here is the complete `main.ts` file for reference:

```typescript
import { LensService } from '@riffcc/lens-sdk';
import { Site } from '@riffcc/lens-sdk/programs';

async function main() {
  console.log("Initializing Lens Service...");
  const lens = new LensService({ debug: true });
  await lens.init('./my-first-site-data');
  console.log("Service Initialized.");

  try {
    const myPublicKey = lens.peerbit.identity.publicKey;
    const mySite = new Site(myPublicKey);

    console.log("Opening a new Site...");
    await lens.openSite(mySite);
    const siteAddress = lens.siteProgram.address;
    console.log(`Site created and opened successfully! Address: ${siteAddress}`);

    console.log("Adding a new Release to the Site...");
    const releaseData = {
      postedBy: myPublicKey,
      name: "Hello, Decentralized World!",
      categoryId: "posts",
      contentCID: "bafybeigdyrzt5sfp7vu572pausrk236q2762rqcbqcnwqwixituoxuejm4"
    };
    const response = await lens.addRelease(releaseData);

    if (response.success) {
      console.log(`Release added successfully! ID: ${response.id}`);
    } else {
      console.error(`Failed to add release: ${response.error}`);
    }

    console.log("Retrieving all releases...");
    const allReleases = await lens.getReleases();
    console.log(`Found ${allReleases.length} release(s):`);
    allReleases.forEach(release => {
      console.log(`- ID: ${release.id}, Name: "${release.name}"`);
    });

  } finally {
    await lens.stop();
    console.log("Service Stopped.");
  }
}

main().catch(console.error);
```

Congratulations! You have successfully created a decentralized `Site`, added content to it, and retrieved that content. From here, you can explore the [Core Concepts](./core-concepts) to understand the architecture in depth or consult the [API Reference](./api-reference) for a full list of available methods.
