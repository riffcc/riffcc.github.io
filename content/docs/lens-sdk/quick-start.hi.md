+++
date = '2025-07-22T12:22:36+02:00'
draft = false
title = 'Quick Start'
weight = 1
+++

यह गाइड Lens SDK के साथ एक मूल एप्लिकेशन चलाने के लिए चरण-दर-चरण मार्गदर्शन प्रदान करता है। इस गाइड के अंत तक, आप सेवा को प्रारंभ कर चुके होंगे, एक नया `साइट` बनाया होगा, इसे डिफ़ॉल्ट सामग्री श्रेणियों से भरा होगा, सामग्री जोड़ी होगी, और उसे पुनः प्राप्त किया होगा।

### प्रीरेक्वज़ट

* Node.js (v18 या उससे ऊपर की अनुशंसित)
* एक TypeScript-तैयार प्रोजेक्ट वातावरण

### चरण 1: इंस्टॉलेशन

पहले, अपने प्रोजेक्ट निर्भरताओं में Lens SDK जोड़ें।

```bash
pnpm install @riffcc/lens-sdk
```

### चरण 2: `एलेंस सर्विस`  शुरू करना

`एलेंस सर्विस` सभी SDK कार्यक्षमताओं के लिए मुख्य प्रवेश बिंदु है। पहला कदम एक उदाहरण बनाना और इसके अंतर्निहित P2P क्लाइंट को प्रारंभ करना है।

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

### चरण 3: `साइट` तैयार करना और उसे खोलना

`साइट` आपका विकेन्द्रित सामग्री केंद्र है। नया साइट बनाने के लिए, आप `साइट` प्रोग्राम को अपने सार्वजनिक कुंजी के साथ मुख्य प्रशासक के रूप में आरंभ करते हैं और फिर सेवा से इसे खोलने के लिए कहते हैं।

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

> **कस्टम पहचान का उपयोग करना:** ऊपर दिया गया उदाहरण Peerbit नोड के लिए स्वचालित रूप से उत्पन्न डिफ़ॉल्ट पहचान का उपयोग करता है। उपयोगकर्ता-सामना करने वाले अनुप्रयोगों के लिए, अनुशंसित तरीका यह है कि उपयोगकर्ता की अपनी वॉलेट (जैसे MetaMask) को पहचान के रूप में उपयोग किया जाए। इसे लागू करने के तरीके को जानने के लिए, कृपया हमारे [उन्नत विषय गाइड](/docs/lens-sdk/advanced-topics/#1-using-a-wallet-for-user-identity) में **उपयोगकर्ता पहचान के लिए वॉलेट का उपयोग करना** अनुभाग देखें।

### चरण 4: साइट सामग्री श्रेणियां आरंभ करना

एक नया `साइट` डिफ़ॉल्ट रूप से खाली होता है। रूट व्यवस्थापक के रूप में, आपको इसे `ContentCategory` दस्तावेज़ों के एक सेट के साथ प्रारंभ करना चाहिए। यह एक एकमुश्त ऑपरेशन है जो साइट को सामग्री पोस्ट करने के लिए आवश्यक टेम्पलेट से भर देता है।

```typescript
// Inside your main() function, after lens.openSite()

console.log("Initializing site with default content categories...");
// This is a privileged, direct interaction with the Site program.
await lens.siteProgram.initializeDefaultContentCategories();
console.log("Default categories initialized successfully.");
```

### चरण 5: सामग्री जोड़ना (`रिलीज़` बनाना)

अब जब कि `Site` को श्रेणियों के साथ शुरू कर दिया गया है, आप सामग्री जोड़ सकते हैं। आइए आपका पहला `Release` जोड़ें और इसे डिफ़ॉल्ट `"music"` श्रेणी से जोड़ें।

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

### चरण 6: सामग्री पुनःप्राप्त करना

अंत में, आइए यह सत्यापित करें कि सामग्री सहेजी गई थी या नहीं, साइट से सभी रिलीज़ प्राप्त करके।

```typescript
// Inside your main() function, after adding the release

console.log("Retrieving all releases...");
const allReleases = await lens.getReleases();

console.log(`Found ${allReleases.length} release(s):`);
allReleases.forEach(release => {
  console.log(`- ID: ${release.id}, Name: "${release.name}"`);
});
```

बधाई हो! आपने सफलतापूर्वक एक विकेंद्रीकृत `Site` बनाई, इसे प्रारंभ किया, अनुमतियों का प्रबंधन किया, सामग्री जोड़ी, और उसे पुनः प्राप्त किया। यहां से, [मुख्य अवधारणाओं](./core-concepts) का अन्वेषण करें या [API संदर्भ](./api-reference) की सलाह लें।