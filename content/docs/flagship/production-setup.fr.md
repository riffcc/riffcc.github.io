+++
date = '2025-07-07T15:37:53+01:00'
draft = false
title = 'Configuration de production'
weight = 3
+++

### **Production : deploiement d'une instance Flagship avec un noeud Lens**

Ce guide vous accompagne dans le deploiement d'une instance Flagship prete pour la production, y compris la mise en place d'un serveur, la configuration DNS, la securisation avec SSL et l'execution du noeud Lens dans une session de terminal persistante.

### **Prerequis**

* Une instance de serveur (par exemple AWS EC2 ou DigitalOcean Droplet) executant une distribution Linux recente comme Ubuntu 22.04.
  * **Specifications recommandees :** 2 coeurs CPU ou plus, 4 Go de RAM ou plus.
* Un nom de domaine enregistre (par exemple `your-domain.com`).
* Un acces au panneau de gestion DNS de votre domaine.
* Les logiciels suivants installes sur votre serveur :
  * [Node.js](https://nodejs.org/)
  * [pnpm](https://pnpm.io/installation)
  * [Git](https://git-scm.com/downloads)
  * [Nginx](https://www.nginx.com/)
  * [Screen](https://www.gnu.org/software/screen/) (`sudo apt install screen`)

---

### **Partie 1 : configuration du serveur et du domaine**

Cette section couvre la configuration initiale de votre serveur, du DNS et des certificats SSL.

#### **Etape 1 : faire pointer votre domaine vers le serveur**

Dans le panneau de controle de votre fournisseur DNS, creez deux enregistrements `A` pointant vers l'adresse IP publique de votre serveur :

1. Un enregistrement `A` pour votre domaine principal :
   * **Type :** `A`
   * **Nom/Hote :** `@` (ou `your-domain.com`)
   * **Valeur/Pointe vers :** `your-server-ip`

2. Un enregistrement `A` pour le sous-domaine du noeud Lens :
   * **Type :** `A`
   * **Nom/Hote :** `lens`
   * **Valeur/Pointe vers :** `your-server-ip`

> **Remarque :** la propagation des changements DNS peut prendre un peu de temps.

#### **Etape 2 : installer Nginx et obtenir des certificats SSL**

1. **Installez Nginx et Certbot :**
   ```bash
   sudo apt update
   sudo apt install nginx certbot python3-certbot-nginx
   ```

2. **Obtenez les certificats SSL.** Nous utiliserons Certbot pour obtenir des certificats pour vos deux domaines. Cette commande arretera temporairement Nginx afin de liberer le port 80 pour la validation.
   ```bash
   sudo systemctl stop nginx
   sudo certbot certonly --standalone -d your-domain.com -d lens.your-domain.com
   ```
   Suivez les invites pour terminer le processus. Une fois termine, Certbot aura cree vos fichiers de certificat.

#### **Etape 3 : configurer Nginx**

Nous allons maintenant creer les fichiers de configuration Nginx pour servir votre site Flagship et proxyfier les requetes vers le noeud Lens.

1. **Creez la configuration Nginx pour votre site principal Flagship :**
   ```bash
   sudo nano /etc/nginx/sites-available/your-domain.com
   ```
   Collez ce qui suit en remplacant `your-domain.com` par votre domaine reel :
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       # Redirect all HTTP requests to HTTPS
       return 301 https://$host$request_uri;
   }

   server {
       listen 443 ssl;
       server_name your-domain.com;

       root /var/www/your-domain.com/html;
       index index.html;

       # SSL configuration
       ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
       include /etc/letsencrypt/options-ssl-nginx.conf;
       ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

2. **Creez le repertoire racine web du site Flagship :**
   ```bash
   sudo mkdir -p /var/www/your-domain.com/html
   ```

3. **Creez la configuration Nginx pour le sous-domaine du noeud Lens :**
   ```bash
   sudo nano /etc/nginx/sites-available/lens.your-domain.com
   ```
   Collez dans le fichier l'integralite du bloc de configuration ci-dessous.

   > **IMPORTANT :** vous devez remplacer chaque occurrence de **`$YOUR_SUBDOMAIN`** par votre sous-domaine reel (par exemple `lens.your-domain.com`).

   ```nginx
   server_names_hash_bucket_size 128;

   server {
       server_name $YOUR_SUBDOMAIN;
       listen [::]:4002 ssl ipv6only=on;
       listen 4002 ssl;

       # Load the certificate files.
       ssl_certificate         /etc/letsencrypt/live/$YOUR_SUBDOMAIN/fullchain.pem;
       ssl_certificate_key     /etc/letsencrypt/live/$YOUR_SUBDOMAIN/privkey.pem;
       ssl_trusted_certificate /etc/letsencrypt/live/$YOUR_SUBDOMAIN/chain.pem;

       # Load the Diffie-Hellman parameter.
       ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

       location / {
           proxy_pass http://127.0.0.1:8001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
       }
   }

   server {
       server_name $YOUR_SUBDOMAIN;
       listen [::]:4003 ssl ipv6only=on;
       listen 4003 ssl;

       # Load the certificate files.
       ssl_certificate         /etc/letsencrypt/live/$YOUR_SUBDOMAIN/fullchain.pem;
       ssl_certificate_key     /etc/letsencrypt/live/$YOUR_SUBDOMAIN/privkey.pem;
       ssl_trusted_certificate /etc/letsencrypt/live/$YOUR_SUBDOMAIN/chain.pem;

       # Load the Diffie-Hellman parameter.
       ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

       location / {
           proxy_pass http://127.0.0.1:8002;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
       }
   }

   server {
       server_name $YOUR_SUBDOMAIN;
       listen [::]:4004 ssl ipv6only=on;
       listen 4004 ssl;

       # Load the certificate files.
       ssl_certificate         /etc/letsencrypt/live/$YOUR_SUBDOMAIN/fullchain.pem;
       ssl_certificate_key     /etc/letsencrypt/live/$YOUR_SUBDOMAIN/privkey.pem;
       ssl_trusted_certificate /etc/letsencrypt/live/$YOUR_SUBDOMAIN/chain.pem;

       # Load the Diffie-Hellman parameter.
       ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

       location / {
           proxy_pass http://127.0.0.1:8083;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
       }
   }

   server {
       server_name $YOUR_SUBDOMAIN;
       listen [::]:4005 ssl ipv6only=on;
       listen 4005 ssl;

       # Load the certificate files.
       ssl_certificate         /etc/letsencrypt/live/$YOUR_SUBDOMAIN/fullchain.pem;
       ssl_certificate_key     /etc/letsencrypt/live/$YOUR_SUBDOMAIN/privkey.pem;
       ssl_trusted_certificate /etc/letsencrypt/live/$YOUR_SUBDOMAIN/chain.pem;

       # Load the Diffie-Hellman parameter.
       ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

       location / {
           proxy_pass http://127.0.0.1:8084;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
       }
   }

   server {
       server_name $YOUR_SUBDOMAIN; # managed by Certbot

       root /usr/share/nginx/html;
       index index.html index.htm;

       location / {
           try_files $uri $uri/ =404;
       }

       listen [::]:443 ssl; # managed by Certbot
       listen 443 ssl; # managed by Certbot

       # Load the certificate files.
       ssl_certificate         /etc/letsencrypt/live/$YOUR_SUBDOMAIN/fullchain.pem;
       ssl_certificate_key     /etc/letsencrypt/live/$YOUR_SUBDOMAIN/privkey.pem;
       ssl_trusted_certificate /etc/letsencrypt/live/$YOUR_SUBDOMAIN/chain.pem;

       # Load the Diffie-Hellman parameter.
       ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
   }
   server {
       server_name $YOUR_SUBDOMAIN;
       listen [::]:9002 ssl ipv6only=on;
       listen 9002 ssl;

       # Load the certificate files.
       ssl_certificate         /etc/letsencrypt/live/$YOUR_SUBDOMAIN/fullchain.pem;
       ssl_certificate_key     /etc/letsencrypt/live/$YOUR_SUBDOMAIN/privkey.pem;
       ssl_trusted_certificate /etc/letsencrypt/live/$YOUR_SUBDOMAIN/chain.pem;

       # Load the Diffie-Hellman parameter.
       ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

       location / {
           proxy_pass http://127.0.0.1:8082;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
       }
   }

   server {
       listen 80;
       listen [::]:80 ;
       server_name $YOUR_SUBDOMAIN;

       # Anything requesting this particular URL should be served content from
       # Certbot's folder so the HTTP-01 ACME challenges can be completed for the
       # HTTPS certificates.
       location '/.well-known/acme-challenge' {
           default_type "text/plain";
           root /var/www/letsencrypt;
       }

       if ($host = $YOUR_SUBDOMAIN) {
           return 301 https://$host$request_uri;
       } # managed by Certbot

       return 404; # managed by Certbot
   }
   ```

4. **Activez les deux sites en creant des liens symboliques :**
   ```bash
   sudo ln -s /etc/nginx/sites-available/your-domain.com /etc/nginx/sites-enabled/
   sudo ln -s /etc/nginx/sites-available/lens.your-domain.com /etc/nginx/sites-enabled/
   ```

5. **Testez votre configuration Nginx puis redemarrez le service :**
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

### **Partie 2 : configurer et executer le noeud Lens**

Nous utiliserons `screen` pour executer le processus du noeud Lens en arriere-plan, afin qu'il continue de tourner meme apres votre deconnexion SSH.

1. **Installez globalement le noeud Lens :**
   ```bash
   pnpm install -g @riffcc/lens-node
   ```

2. **Lancez la configuration initiale :**
   ```bash
   lens-node setup
   ```

3. **Demarrez une nouvelle session `screen` :**
   ```bash
   screen -S lens-node
   ```
   Votre terminal sera efface et vous serez alors dans une nouvelle session virtuelle nommee `lens-node`.

4. **Demarrez le noeud dans la session screen.** Remplacez `lens.your-domain.com` par votre vrai sous-domaine.
   ```bash
   lens-node run --domain lens.your-domain.com --relay
   ```

5. Une fois le noeud demarre, vous verrez une sortie semblable a celle-ci. **Notez bien votre `Site Address` ainsi que l'adresse `Listening on` contenant `/wss`**.

   ```bash
   Node Directory: /root/.lens-node
   Peer ID: 12D3KooWFzrhasG7pouxZSsSP3bHP45C3TCq2MYirTPC5oA9Lj2v
   Site Address: zb2rhoGguxQaNZy47DvRPLRmpT84mwvwuvekUhmCgF7nkhTCn
   Listening on: [
     "/dns4/lens.your-domain.com/tcp/4002/p2p/12D3KooWFzrhasG7pouxZSsSP3bHP45C3TCq2MYirTPC5oA9Lj2v",
     "/dns4/lens.your-domain.com/tcp/4003/wss/p2p/12D3KooWFzrhasG7pouxZSsSP3bHP45C3TCq2MYirTPC5oA9Lj2v"
   ]
   ```

6. **Detachez-vous de la session screen** en laissant le noeud tourner. Appuyez sur **`Ctrl+A`**, puis sur **`D`**.

Vous avez maintenant un noeud Lens qui fonctionne en arriere-plan.

> **Pour gerer le noeud :**
> * **Reattachez-vous a la session** pour voir les journaux ou arreter le processus : `screen -r lens-node`
> * **Pour arreter le noeud**, reattachez-vous et appuyez sur `Ctrl+C`.
> * **Avertissement :** cette methode ne survit pas a un redemarrage du serveur. Vous devrez relancer manuellement le noeud dans une nouvelle session screen si le serveur redemarre.

---

### **Partie 3 : deployer l'instance Flagship**

Enfin, configurez, construisez et deployez l'application frontend Flagship.

1. **Clonez le depot et entrez dans le repertoire :**
   ```bash
   git clone https://github.com/riffcc/flagship
   cd flagship
   ```

2. **Creez le fichier d'environnement :**
   ```bash
   cp .env.example .env
   ```

3. **Configurez les variables d'environnement.** Ouvrez le fichier `.env` et definissez les variables suivantes en utilisant les valeurs de votre noeud Lens actif :

   ```dotenv
   # Paste the "Site Address" from your node's output here
   VITE_SITE_ADDRESS=zb2rhoGguxQaNZy47DvRPLRmpT84mwvwuvekUhmCgF7nkhTCn

   # Paste the secure "/wss" listening address here
   VITE_BOOTSTRAPPERS=/dns4/lens.your-domain.com/tcp/4003/wss/p2p/12D3KooWFzrhasG7pouxZSsSP3bHP45C3TCq2MYirTPC5oA9Lj2v
   ```

4. **Installez les dependances et construisez l'application :**
   ```bash
   pnpm install
   pnpm compile:web
   ```

5. **Deployez les fichiers construits dans la racine web de Nginx.**
   ```bash
   sudo cp -r packages/renderer/dist/web/* /var/www/your-domain.com/html/
   ```

6. **Attribuez les bons droits de propriete aux fichiers web :**
   ```bash
   sudo chown -R www-data:www-data /var/www/your-domain.com/html
   ```

Votre instance Flagship est maintenant en ligne. Vous pouvez y acceder en allant sur `https://your-domain.com` dans votre navigateur.
