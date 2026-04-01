+++
date = '2025-07-07T15:37:53+01:00'
draft = false
title = 'Configuracion de produccion'
weight = 3
+++

### **Produccion: desplegar una instancia de Flagship con un nodo Lens**

Esta guia te llevara paso a paso por el despliegue de una instancia de Flagship lista para produccion, incluida la configuracion de un servidor, DNS, SSL y la ejecucion del nodo Lens en una sesion persistente de terminal.

### **Requisitos previos**

* Una instancia de servidor (por ejemplo, AWS EC2 o DigitalOcean Droplet) con una distribucion Linux moderna como Ubuntu 22.04.
  * **Especificaciones recomendadas:** 2 o mas nucleos de CPU, 4 GB o mas de RAM.
* Un nombre de dominio registrado (por ejemplo, `your-domain.com`).
* Acceso al panel de gestion DNS de tu dominio.
* El siguiente software instalado en tu servidor:
  * [Node.js](https://nodejs.org/)
  * [pnpm](https://pnpm.io/installation)
  * [Git](https://git-scm.com/downloads)
  * [Nginx](https://www.nginx.com/)
  * [Screen](https://www.gnu.org/software/screen/) (`sudo apt install screen`)

---

### **Parte 1: configuracion del servidor y del dominio**

Esta seccion cubre la configuracion inicial del servidor, DNS y certificados SSL.

#### **Paso 1: apuntar tu dominio al servidor**

En el panel de control de tu proveedor DNS, crea dos registros `A` que apunten a la IP publica de tu servidor:

1. Un registro `A` para tu dominio principal:
   * **Tipo:** `A`
   * **Nombre/Host:** `@` (o `your-domain.com`)
   * **Valor/Apunta a:** `your-server-ip`

2. Un registro `A` para el subdominio del nodo Lens:
   * **Tipo:** `A`
   * **Nombre/Host:** `lens`
   * **Valor/Apunta a:** `your-server-ip`

> **Nota:** los cambios DNS pueden tardar un poco en propagarse.

#### **Paso 2: instalar Nginx y obtener certificados SSL**

1. **Instala Nginx y Certbot:**
   ```bash
   sudo apt update
   sudo apt install nginx certbot python3-certbot-nginx
   ```

2. **Obtén los certificados SSL.** Usaremos Certbot para obtener certificados para ambos dominios. Este comando detendra temporalmente Nginx para liberar el puerto 80 durante la validacion.
   ```bash
   sudo systemctl stop nginx
   sudo certbot certonly --standalone -d your-domain.com -d lens.your-domain.com
   ```
   Sigue las indicaciones para completar el proceso. Al terminar, Certbot habra creado tus archivos de certificado.

#### **Paso 3: configurar Nginx**

Ahora crearemos los archivos de configuracion de Nginx para servir tu sitio Flagship y hacer proxy de las peticiones al nodo Lens.

1. **Crea la configuracion Nginx para tu sitio principal de Flagship:**
   ```bash
   sudo nano /etc/nginx/sites-available/your-domain.com
   ```
   Pega lo siguiente, sustituyendo `your-domain.com` por tu dominio real:
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

2. **Crea el directorio raiz web para el sitio Flagship:**
   ```bash
   sudo mkdir -p /var/www/your-domain.com/html
   ```

3. **Crea la configuracion Nginx para el subdominio del nodo Lens:**
   ```bash
   sudo nano /etc/nginx/sites-available/lens.your-domain.com
   ```
   Pega en el archivo todo el bloque de configuracion de abajo.

   > **IMPORTANTE:** debes sustituir cada instancia de **`$YOUR_SUBDOMAIN`** por tu subdominio real (por ejemplo `lens.your-domain.com`).

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

4. **Activa ambos sitios creando enlaces simbolicos:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/your-domain.com /etc/nginx/sites-enabled/
   sudo ln -s /etc/nginx/sites-available/lens.your-domain.com /etc/nginx/sites-enabled/
   ```

5. **Prueba tu configuracion de Nginx y reinicia el servicio:**
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

### **Parte 2: configurar y ejecutar el nodo Lens**

Usaremos `screen` para ejecutar el proceso del nodo Lens en segundo plano, permitiendo que siga funcionando incluso despues de cerrar tu sesion SSH.

1. **Instala globalmente el nodo Lens:**
   ```bash
   pnpm install -g @riffcc/lens-node
   ```

2. **Ejecuta el proceso de configuracion inicial:**
   ```bash
   lens-node setup
   ```

3. **Inicia una nueva sesion `screen`:**
   ```bash
   screen -S lens-node
   ```
   Tu terminal se limpiara y ahora estaras dentro de una nueva sesion virtual llamada `lens-node`.

4. **Inicia el nodo dentro de la sesion screen.** Sustituye `lens.your-domain.com` por tu subdominio real.
   ```bash
   lens-node run --domain lens.your-domain.com --relay
   ```

5. Una vez en marcha, veras una salida parecida a esta. **Toma nota de tu `Site Address` y de la direccion `Listening on` que contiene `/wss`**.

   ```bash
   Node Directory: /root/.lens-node
   Peer ID: 12D3KooWFzrhasG7pouxZSsSP3bHP45C3TCq2MYirTPC5oA9Lj2v
   Site Address: zb2rhoGguxQaNZy47DvRPLRmpT84mwvwuvekUhmCgF7nkhTCn
   Listening on: [
     "/dns4/lens.your-domain.com/tcp/4002/p2p/12D3KooWFzrhasG7pouxZSsSP3bHP45C3TCq2MYirTPC5oA9Lj2v",
     "/dns4/lens.your-domain.com/tcp/4003/wss/p2p/12D3KooWFzrhasG7pouxZSsSP3bHP45C3TCq2MYirTPC5oA9Lj2v"
   ]
   ```

6. **Desacoplate de la sesion screen** dejando el nodo en ejecucion. Pulsa **`Ctrl+A`** y luego **`D`**.

Ahora tienes un nodo Lens funcionando correctamente en segundo plano.

> **Para administrar el nodo:**
> * **Vuelve a adjuntarte a la sesion** para ver logs o detener el proceso: `screen -r lens-node`
> * **Para detener el nodo**, vuelve a adjuntarte y pulsa `Ctrl+C`.
> * **Advertencia:** este metodo no sobrevive a un reinicio del servidor. Tendras que reiniciar manualmente el nodo en una nueva sesion `screen` si el servidor se reinicia.

---

### **Parte 3: desplegar la instancia de Flagship**

Por ultimo, configura, compila y despliega la aplicacion frontend de Flagship.

1. **Clona el repositorio y entra en el directorio:**
   ```bash
   git clone https://github.com/riffcc/flagship
   cd flagship
   ```

2. **Crea el archivo de entorno:**
   ```bash
   cp .env.example .env
   ```

3. **Configura las variables de entorno.** Abre el archivo `.env` y establece las siguientes variables usando los valores de tu nodo Lens en ejecucion:

   ```dotenv
   # Paste the "Site Address" from your node's output here
   VITE_SITE_ADDRESS=zb2rhoGguxQaNZy47DvRPLRmpT84mwvwuvekUhmCgF7nkhTCn

   # Paste the secure "/wss" listening address here
   VITE_BOOTSTRAPPERS=/dns4/lens.your-domain.com/tcp/4003/wss/p2p/12D3KooWFzrhasG7pouxZSsSP3bHP45C3TCq2MYirTPC5oA9Lj2v
   ```

4. **Instala las dependencias y compila la aplicacion:**
   ```bash
   pnpm install
   pnpm compile:web
   ```

5. **Despliega los archivos compilados en la raiz web de Nginx.**
   ```bash
   sudo cp -r packages/renderer/dist/web/* /var/www/your-domain.com/html/
   ```

6. **Establece la propiedad correcta para los archivos web:**
   ```bash
   sudo chown -R www-data:www-data /var/www/your-domain.com/html
   ```

Tu instancia de Flagship ya esta en linea. Puedes acceder a ella navegando a `https://your-domain.com` en tu navegador.
