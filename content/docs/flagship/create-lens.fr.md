+++
date = '2025-07-07T15:37:53+01:00'
draft = false
title = 'Creer une Lens (Demarrage rapide)'
weight = 2
+++

Pour creer votre propre Lens, vous aurez besoin d'un nom de domaine (un sous-domaine peut aussi convenir) et d'un fournisseur d'hebergement.

Le processus est simple et prend environ 10 a 30 minutes selon votre aisance avec la ligne de commande.

{{< callout type="info"emoji="🌐" >}}
  Nous prevoyons de proposer plus tard des services d'hebergement Lens abordables.

  Nous publierons egalement en open source les logiciels permettant a n'importe qui d'exploiter son propre fournisseur d'hebergement Lens.
{{< /callout >}}

Nous suggerons d'utiliser Hetzner ou DigitalOcean, mais presque n'importe quel fournisseur conviendra.

Vous pouvez aussi auto-heberger votre propre Lens, mais vous devrez etre a l'aise avec la ligne de commande et comprendre les bases de la configuration d'un serveur.

## Configurer votre domaine

Faites pointer votre nom de domaine ou votre sous-domaine vers l'adresse IP de votre serveur au moyen d'un enregistrement DNS `A` ou `AAAA`.

Vous pouvez demander a votre hebergeur comment proceder, ou nous demander de l'aide.

## Preparation

Vous devrez effectuer un petit travail preparatoire avant de commencer.

### Dependances
Avant d'installer Flagship, vous devez installer les dependances suivantes :

```sh
sudo apt install libnss3-dev libgtk-3-0 libgbm1 libasound2-dev libatk1.0-0 node-pre-gyp git curl
```

### Node.js

Vous devrez egalement installer Node.js.

Nous vous recommandons le [guide d'installation NodeSource](https://github.com/nodesource/distributions#installation-instructions).

1. Telechargez et importez la cle GPG de NodeSource

```sh
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
```

2. Creez le depot Debian

```sh
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
```

3. Lancez `apt update` puis installez le paquet Node.js

```sh
sudo apt-get update
sudo apt-get install nodejs -y
```

4. Telechargez le script officiel d'installation de pnpm :

```sh
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

5. Rechargez votre fichier `.bashrc` pour que le systeme reconnaisse correctement le chemin de pnpm (ou `zshrc` pour les utilisateurs de Zsh, etc.) :

```sh
source ~/.bashrc
```

### Git

Vous devrez installer Git. La plupart des systemes l'ont deja, sinon vous pouvez l'installer avec :

```sh
sudo apt-get install git -y
```

## Installer le noeud Lens

Utilisez `pnpm` pour installer le noeud Lens.

```sh
pnpm install -g @riffcc/lens-node
```

Si vous y etes invite, lancez aussi `pnpm approve-builds -g` pour permettre la compilation correcte des dependances.

```
wings@blackberry:~$ pnpm approve-builds -g
✔ Choose which packages to build (Press <space> to select, <a> to toggle all, <i> to invert selection) · @ipshipyard/node-datachannel, better-sqlite3, classic-level
✔ The next packages will now be built: @ipshipyard/node-datachannel, better-sqlite3, classic-level.
Do you approve? (y/N) · true
.pnpm/@ipshipyard+node-datachannel@0.26.6/node_modules/@ipshipyard/node-datachannel: Running install script, done in 98ms
.pnpm/better-sqlite3@11.10.0/node_modules/better-sqlite3: Running install script, done in 71ms
.pnpm/classic-level@3.0.0/node_modules/classic-level: Running install script, done in 46ms
```

## Configurer votre Lens

1. **Configurez votre noeud Lens :**
   La premiere etape consiste a initialiser votre noeud. Cela cree un repertoire de donnees, genere les identites cryptographiques necessaires et cree un fichier de configuration.

   ```bash
   lens-node setup
   ```

   Cette commande :
   - cree un repertoire dans `~/.lens-node` (ou un chemin personnalise avec `--dir`) ;
   - si le repertoire existe deja, vous demandera de confirmer la reconfiguration ;
   - initialise un client Peerbit et un site Lens ;
   - enregistre la configuration, y compris l'adresse du site Lens, dans `config.json` du repertoire de donnees ;
   - affiche des informations importantes telles que votre Peer ID, votre cle publique et l'adresse du site.

   {{< callout emoji="🐉" >}}
     Vous pouvez voir un avertissement au sujet de "The node directory \"/home/$USER/.lens-node\" already exists" meme si vous n'avez jamais cree de Lens auparavant.

     C'est un bug du noeud Lens ; il peut etre ignore sans risque lors de la *premiere* creation d'une Lens. Il sera corrige dans une future version.

     Repondez simplement "Yes" a l'invite pour poursuivre.
   {{< /callout >}}

   Voici un exemple de sortie :

   ```
   wings@blackberry:~$ lens-node setup
   ✔ The node directory "/home/wings/.lens-node" already exists. Do you want to reconfigure for setup? This action is irreversible. Yes
   Node directory cleared and ready for new configuration at: /home/wings/.lens-node
   [Site] Access controllers open: 334.832ms
   [Site] Data stores open: 114.121ms
   [Site] Total open time: 449.201ms

   Lens Node setup complete!
   --------------------------------------------------
   Node Directory: /home/wings/.lens-node
   Configuration saved to: /home/wings/.lens-node/config.json
   Peer ID: 12D3KooWAo2AC2Aga6gxon6Fd8jXMoxRtBkQrBBK3hsuQs3wtnNT
   Node Public Key: ed25119p/0e837b3358453b3384ba0a86701e440e79b009fba4f010b0a944f054df21b8c8
   Site Address: zb2rhjCvmPfrgmgjGvnsYLQpzwbLGgvDWs2AsJp5qN4Zxwt7Z
   --------------------------------------------------
   You can now run your node using: lens-node run
   ```

   Conservez l'adresse du site, car vous en aurez besoin plus tard. Vous pourrez toujours la retrouver dans `~/.lens-node/config.json` si besoin.

2. **Demarrez votre noeud Lens :**
   Pour lancer votre noeud, executez :

   ```bash
   lens-node run
   ```

   Cela demarre le demon du noeud, se connecte au reseau Peerbit et ouvre votre site Lens. Un terminal interactif s'ouvrira et vous pourrez l'utiliser pour gerer votre noeud.

   Nous conseillons d'executer le noeud dans une session `screen` ou `tmux`, afin qu'il continue a tourner en arriere-plan si vous fermez le terminal.

   Copiez l'adresse d'ecoute `ws` pour l'utiliser plus tard, par exemple `/ip4/127.0.0.1/tcp/8002/ws/p2p/12D3KooWAo2AC2Aga6gxon6Fd8jXMoxRtBkQrBBK3hsuQs3wtnNT`.

## Installer Flagship

1. Clonez le depot GitHub de Flagship :
   ```sh
   git clone https://github.com/riffcc/flagship.git
   ```

2. Placez-vous dans le repertoire de Flagship et installez les dependances :
   ```sh
   cd flagship
   pnpm install
   ```

3. Copiez le fichier `.env.example` vers `.env` :
   ```sh
   cp .env.example .env
   ```

4. Modifiez le fichier `.env` afin de definir `VITE_SITE_ADDRESS` avec l'adresse du site que vous avez conservee plus tot. Definissez `VITE_BOOTSTRAPPERS` avec l'adresse d'ecoute `ws` copiee plus tot.

5. Lancez l'application en mode developpement (avec rechargement a chaud) :
   ```sh
   pnpm watch:web
   ```

6. Ouvrez l'application dans votre navigateur a l'adresse `http://localhost:5175/#/account`.

7. Vous devriez maintenant voir l'application Flagship.

   ![Application Flagship](/images/docs/flagship/installing-flagship-account.png)

   {{< callout emoji="🐉" >}}
     Vous pouvez ignorer sans risque l'avertissement "Not implemented" en bas de la page.
   {{< /callout >}}

8. Cliquez sur la cle publique sous le titre "Public Key" pour la copier dans votre presse-papiers.

## Creer un compte administrateur

Sur le serveur qui heberge votre Lens, ouvrez l'action ` > Authorise an account`.

```
Lens Node is running. Press Ctrl+C to stop OR use the menu below.
--------------------------------------------------
Node Directory: /home/wings/.lens-node
Peer ID: 12D3KooWAo2AC2Aga6gxon6Fd8jXMoxRtBkQrBBK3hsuQs3wtnNT
Node Public Key: ed25119p/0e837b3358453b3384ba0a86701e440e79b009fba4f010b0a944f054df21b8c8
Site Address: zb2rhjCvmPfrgmgjGvnsYLQpzwbLGgvDWs2AsJp5qN4Zxwt7Z
Listening on: [
  "/ip4/127.0.0.1/tcp/8002/ws/p2p/12D3KooWAo2AC2Aga6gxon6Fd8jXMoxRtBkQrBBK3hsuQs3wtnNT",
  "/ip4/127.0.0.1/tcp/8001/p2p/12D3KooWAo2AC2Aga6gxon6Fd8jXMoxRtBkQrBBK3hsuQs3wtnNT"
]
--------------------------------------------------
? Actions: (Use arrow keys)
❯ Authorise an account
 ──────────────
  Manage Subscriptions
 ──────────────
  Shutdown Node
```

Appuyez sur Entree, puis collez la cle publique copiee plus tot :

```
✔ Actions: Authorise an account
✔ Enter the string public key of the account: ed25119p/1a1b2a241f1734f6088fa4715bc763f448dbbf0d1ab8c100a959dec765ba5a58
? Select the account type (Use arrow keys)
❯ Member
  Admin
```

Selectionnez "Admin" avec les fleches, puis appuyez sur Entree.

Vous devriez voir un message de succes :
```
2025-07-15 23:13:41.822 [info] Account authorized successfully
{
  "publicKey": "ed25119p/1a1b2a241f1734f6088fa4715bc763f448dbbf0d1ab8c100a959dec765ba5a58",
  "accountType": "Admin"
}
```

Rafraichissez l'application Flagship dans votre navigateur. Vous devriez maintenant etre "Admin" et voir l'onglet "Admin".

## Gerer votre Lens
### Ajouter du contenu a votre Lens

Il est temps de televerser votre premier contenu. Comme exemple, nous allons televerser le film **RiP: A Remix Manifesto**, un documentaire legalement libre sur la culture du remix.

1. Cliquez sur le bouton "Upload" dans le menu du haut.
2. Saisissez un nom, par exemple "RiP: A Remix Manifesto".
3. Saisissez un CID de contenu, ici `QmTWWUmvC9txvE7aHs9xHd541qLx3ax58urvx3Kb3SFK2Q`.
4. Selectionnez la categorie "Movies".
5. Definissez le CID de miniature sur `Qmb3eeESRoX5L6NhTYLEtFFUS1FZgqe1e7hdBk2f57DUGh`.
6. Cliquez sur le bouton "Upload".

Vous devriez maintenant voir le film dans votre Lens si vous allez dans l'onglet "Movies".

### Mettre du contenu en avant

Vous pouvez mettre du contenu en avant pour le faire apparaitre sur la page d'accueil de votre Lens.

1. Cliquez sur l'onglet "Admin" dans le menu du haut.
2. Cliquez sur l'onglet "Content" dans le menu lateral du panneau d'administration.
3. Cliquez sur le bouton "Feature" a cote du film que vous avez televerse (l'etoile avec un signe plus).

Vous serez redirige vers la page *New Featured Releases*.

Le curseur "Promoted" sera regle sur "Yes" par defaut. Le contenu promu apparaitra dans le carrousel hero de la page d'accueil, tandis qu'un contenu seulement mis en avant apparaitra lui aussi en page d'accueil mais avec moins d'emphase.

4. Cliquez sur le bouton "Create" pour creer la mise en avant.

Vous devriez maintenant voir le film sur la page d'accueil de votre Lens !

![Page d'accueil d'une Lens](/images/docs/flagship/frontpage-generic.png)

### Ajouter des details a une sortie mise en avant

{{< callout emoji="🚧" >}}
Cette section est en cours de construction.
{{< /callout >}}

Vous pouvez ajouter plus de details a la sortie mise en avant en cliquant sur le bouton "Edit" a cote de cette mise en avant, puis sur l'onglet "Advanced".

Cela vous permettra d'ajouter une description, des etiquettes et d'autres details a la sortie mise en avant.

Vous pouvez egalement ajouter une image de banniere qui sera affichee a la place de la miniature lorsque la sortie est promue dans le carrousel hero.

## Etapes suivantes

### Rejoindre notre communaute

Nous avons un serveur Discord ou vous pouvez poser des questions, partager votre Lens et obtenir de l'aide de la communaute.

[Rejoindre notre serveur Discord](https://discord.gg/cvYgQSfCrQ)

### Suivre une Lens (facultatif)

L'un des meilleurs aspects du fait d'exploiter une Lens est la possibilite de suivre d'autres Lenses et de voir leur contenu.

Copiez simplement l'identifiant du site de la Lens que vous souhaitez suivre, puis allez dans la section *Admin* de votre Lens, ensuite dans *Subscriptions*.

Collez l'identifiant du site de la Lens que vous souhaitez suivre et cliquez sur *Subscribe*.

{{< callout type="info" emoji="ℹ️" >}}
L'identifiant du site de la Lens actuelle de Riff.CC est `zb2rhoGguxQaNZy47DvRPLRmpT84mwvwuvekUhmCgF7nkhTCn`, si vous voulez quelque chose a suivre.
{{< /callout >}}

![Ajouter un abonnement](/images/docs/concepts/follow-a-lens.png)

Apres l'avoir ajoute, vous le verrez apparaitre dans la liste des abonnements.

Une fois l'abonnement ajoute, le contenu de la Lens suivie apparaitra dans votre Lens.

![Ajouter un abonnement](/images/docs/concepts/follow-a-lens-2.png)

Pour ne plus suivre une Lens, cliquez simplement sur l'icone de corbeille a cote de la Lens que vous souhaitez retirer.
