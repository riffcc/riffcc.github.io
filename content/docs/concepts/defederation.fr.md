+++
draft = false
title = 'Defederation'
weight = 1
+++

La Defederation, ou fédération décentralisée, est notre système de gestion des réseaux décentralisés de contenu et de communautés.

Elle permet aux Lenses de se suivre mutuellement et de répliquer instantanément tout le contenu des Lenses suivis.

## Exemples
Le site D peut construire sa bibliothèque en suivant le site B, et donc le site C par extension. Le site D peut aussi avoir son propre contenu.

<img src="/images/docs/concepts/defederation.webp" class="light-webp" alt="Schéma montrant l'architecture de Flagship" />
<img src="/images/docs/concepts/defederation-dark.webp" class="dark-webp" alt="Schéma montrant l'architecture de Flagship" />

Dans cet exemple, le site D aurait 9 éléments de contenu, tous présentés dans une expérience unifiée, comme s'ils faisaient partie d'une seule et même bibliothèque.

## Détails techniques

Peerbit est utilisé pour synchroniser et fédérer les Lenses, et constitue la technologie centrale qui rend cela possible.

Notre Lens SDK étend Peerbit pour fournir cette fonctionnalité.

Chaque Lens reçoit son propre identifiant de site, utilisé à la fois pour l'identifier sur le réseau et pour permettre aux autres Lenses de le suivre.
