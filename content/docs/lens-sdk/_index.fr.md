---
date: '2025-07-22T04:50:31+02:00'
draft: false
title: 'SDK Lens'
sidebar:
  open: true
---

## Vue d'ensemble

Le SDK Lens est un kit de developpement logiciel complet, robuste et adapte aux usages d'entreprise, concu pour construire des reseaux sophistiques de federation et de distribution de contenu decentralises. En s'appuyant sur la puissance du cadre P2P Peerbit, le SDK Lens fournit une architecture complete en couches pour creer des applications de contenu souveraines, interoperables et resilientes.

Ce SDK s'adresse aux developpeurs et aux organisations qui veulent creer des applications ou l'integrite des donnees, la propriete par les utilisateurs et la collaboration decentralisee sont essentielles. Il abstrait la complexite du reseautage pair a pair, de la synchronisation de base de donnees et de l'identite cryptographique, en offrant une API claire et de haut niveau pour un developpement rapide et securise.

## Philosophie centrale

La conception du SDK Lens repose sur plusieurs principes fondamentaux :

1. **Souverainete des donnees :** les utilisateurs et les communautes gardent le controle ultime de leurs donnees et de leurs espaces numeriques. Chaque instance du programme `Site` est une entite souveraine, gouvernee par ses propres regles et administrateurs.

2. **Federation structuree :** la communication inter-applications n'est pas arbitraire. Il s'agit d'un processus structure et autorise, fonde sur des "subscriptions" explicites. Ce modele garantit que le partage de donnees est intentionnel et securise, empeche l'injection de donnees non sollicitee et cree un reseau fonde sur la confiance.

3. **Architecture modulaire et en couches :** le SDK impose une separation stricte des responsabilites, de la logique P2P bas niveau jusqu'a l'API de service haut niveau. Cette architecture en couches renforce la securite, simplifie la maintenance et favorise des pratiques de developpement evolutives.

4. **Provenance verifiable :** toutes les donnees creees et partagees sur le reseau sont signees cryptographiquement et marquees avec l'adresse de leur `Site` d'origine. Cela fournit une piste d'audit immuable et verifiable pour tout contenu, garantissant que son authenticite peut toujours etre confirmee.

## Fonctionnalites principales

* **Application decentralisee prete a l'emploi (programme `Site`) :** le SDK inclut un programme P2P puissant et complet, le `Site`. Il prend en charge nativement les publications de contenu, les categories, les mises en avant et les outils de moderation.

* **Controle d'acces flexible base sur les roles (RBAC) :** un systeme d'autorisations sophistique, securise et extensible. Il fournit une hierarchie claire de roles par defaut (`Admin`, `Moderator`, `Member`) et permet de creer des roles personnalises avec des autorisations fines pour controler precisement la creation, la gestion de contenu et l'administration du site.

* **Federation et synchronisation automatisees :** un `FederationManager` sophistique gere tous les aspects de la communication inter-sites, notamment :
  * **Synchronisation historique :** reconstitue automatiquement le contenu lorsqu'une nouvelle subscription est etablie.
  * **Mises a jour live via pub/sub :** assure une synchronisation en temps reel entre les sites federes.
  * **Gestion d'etat des connexions :** gere intelligemment le cycle de vie des connexions federatives, y compris le nettoyage automatise des donnees lors d'un desabonnement.

* **API de service haut niveau (`LensService`) :** une interface conviviale qui sert de point d'entree unique pour l'integration applicative. Elle fournit une API stable basee sur des promesses qui masque toute la complexite P2P sous-jacente.

* **Schemas extensibles :** toutes les structures de donnees sont definies via des schemas fortement types, ce qui garantit la coherence et l'integrite des donnees a travers le reseau tout en restant extensible pour les besoins futurs.

## A qui s'adresse ce SDK ?

Le SDK Lens convient parfaitement aux developpeurs et aux organisations qui construisent :

* **Des plateformes de contenu decentralisees :** pour les createurs independants, journalistes ou artistes qui ont besoin d'outils de publication resistants a la censure.
* **Des forums et archives detenus par la communaute :** ou les membres contribuent ensemble a un depot partage de connaissances ou de donnees et le gouvernent.
* **Des applications de reseaux sociaux federes :** permettant aux utilisateurs d'exploiter leurs propres noeuds tout en participant a un graphe social plus large et interconnecte.
* **Des reseaux de partage de donnees pour l'entreprise :** des reseaux prives et securises pour partager des donnees versionnees et des artefacts entre partenaires de confiance.

## Pour commencer

Pour debuter avec le SDK Lens, nous vous recommandons de lire les sections suivantes :

1. **[Concepts fondamentaux](/fr/docs/lens-sdk/core-concepts) :** une explication detaillee du programme `Site`, de la federation et des principes architecturaux du SDK.
2. **[Demarrage rapide](/fr/docs/lens-sdk/quick-start) :** un tutoriel pas a pas pour mettre en route une application de base.
3. **[Reference d'API](/fr/docs/lens-sdk/api-reference) :** une documentation complete de `LensService`, de ses methodes et de ses types de donnees.
