+++
draft = false
title = 'Defederation'
weight = 1
+++

Defederation (or decentralized federation) is our system for managing decentralized networks of content and communities.

It allows Lenses to follow each other, instantly replicating all of their content from the followed lenses.

## Examples
Site D might build its library by following site B (and site C by extension). Site D can also have content of its own.

<img src="/images/docs/concepts/defederation.svg" class="light-svg" alt="A diagram showing the architecture of Flagship" />
<img src="/images/docs/concepts/defederation-dark.svg" class="dark-svg" alt="A diagram showing the architecture of Flagship" />

In this example, Site D would have 9 pieces of content, and they would all be displayed in a unified experience - as though they were all part of the same library.

## Technical details

Peerbit is used to synchronise and federate between Lenses, and is the core technology that makes this possible.

Our Lens SDK is used to extend Peerbit to enable this functionality.

Each Lens gets its own Site ID, which is used to identify it on the network as well as allow other Lenses to follow it.
