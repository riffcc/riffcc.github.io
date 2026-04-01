+++
date = '2025-07-07T15:37:53+01:00'
draft = false
title = 'Crear una Lens (Inicio rapido)'
weight = 2
+++

Para crear tu propia Lens, necesitaras un nombre de dominio (tambien puede servir un subdominio) y un proveedor de alojamiento.

El proceso es sencillo y suele tardar entre 10 y 30 minutos, segun tu comodidad con la linea de comandos.

{{< callout type="info"emoji="🌐" >}}
  Planeamos ofrecer mas adelante servicios de alojamiento Lens asequibles.

  Tambien vamos a liberar como codigo abierto el software para que cualquiera pueda operar su propio proveedor de alojamiento Lens.
{{< /callout >}}

Sugerimos usar Hetzner o DigitalOcean, pero practicamente cualquier proveedor funcionara.

Tambien puedes autoalojar tu propia Lens, pero necesitaras sentirte comodo con la linea de comandos y tener una comprension basica de como configurar un servidor.

## Configurar tu dominio

Haz que tu dominio o subdominio apunte a la direccion IP de tu servidor mediante un registro DNS `A` o `AAAA`.

Puedes consultar a tu proveedor de hosting para saber como hacerlo, o pedirnos ayuda.

## Preparacion

Necesitaras hacer un poco de trabajo previo antes de empezar.

### Dependencias
Antes de instalar Flagship, debes instalar las siguientes dependencias:

```sh
sudo apt install libnss3-dev libgtk-3-0 libgbm1 libasound2-dev libatk1.0-0 node-pre-gyp git curl
```

### Node.js

Tambien necesitaras instalar Node.js.

Te sugerimos usar la [guia de instalacion de NodeSource](https://github.com/nodesource/distributions#installation-instructions).

1. Descarga e importa la clave GPG de NodeSource

```sh
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
```

2. Crea el repositorio Debian

```sh
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
```

3. Ejecuta `apt update` e instala el paquete Node.js

```sh
sudo apt-get update
sudo apt-get install nodejs -y
```

4. Descarga el script oficial de instalacion de pnpm:

```sh
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

5. Recarga tu archivo `.bashrc` para que el sistema reconozca correctamente la ruta de pnpm (o `zshrc` para usuarios de Zsh, etc.):

```sh
source ~/.bashrc
```

### Git

Necesitaras instalar Git. La mayoria de los sistemas ya lo incluyen, pero si no es asi puedes instalarlo con:

```sh
sudo apt-get install git -y
```

## Instalar el nodo Lens

Usa `pnpm` para instalar el nodo Lens.

```sh
pnpm install -g @riffcc/lens-node
```

Si se te solicita, ejecuta tambien `pnpm approve-builds -g` para permitir que las dependencias se compilen correctamente.

```
wings@blackberry:~$ pnpm approve-builds -g
✔ Choose which packages to build (Press <space> to select, <a> to toggle all, <i> to invert selection) · @ipshipyard/node-datachannel, better-sqlite3, classic-level
✔ The next packages will now be built: @ipshipyard/node-datachannel, better-sqlite3, classic-level.
Do you approve? (y/N) · true
.pnpm/@ipshipyard+node-datachannel@0.26.6/node_modules/@ipshipyard/node-datachannel: Running install script, done in 98ms
.pnpm/better-sqlite3@11.10.0/node_modules/better-sqlite3: Running install script, done in 71ms
.pnpm/classic-level@3.0.0/node_modules/classic-level: Running install script, done in 46ms
```

## Configurar tu Lens

1. **Configura tu nodo Lens:**
   El primer paso es inicializar tu nodo. Esto creara un directorio de datos, generara las identidades criptograficas necesarias y creara un archivo de configuracion.

   ```bash
   lens-node setup
   ```

   Este comando:
   - crea un directorio en `~/.lens-node` (o una ruta personalizada si especificas `--dir`);
   - si el directorio ya existe, te pedira que confirmes la reconfiguracion;
   - inicializa un cliente Peerbit y un sitio Lens;
   - guarda la configuracion, incluida la direccion del sitio Lens, en `config.json` dentro del directorio de datos;
   - muestra detalles importantes como tu Peer ID, tu clave publica y la direccion del sitio.

   {{< callout emoji="🐉" >}}
     Puede que veas una advertencia sobre "The node directory \"/home/$USER/.lens-node\" already exists" incluso si nunca has creado una Lens antes.

     Es un error del nodo Lens y se puede ignorar con seguridad al crear una Lens por *primera* vez. Se corregira en una version futura.

     Simplemente responde "Yes" al mensaje y la configuracion continuara.
   {{< /callout >}}

   Aqui tienes un ejemplo de la salida:

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

   Guarda la direccion del sitio, porque la necesitaras mas adelante. Siempre puedes encontrarla en `~/.lens-node/config.json` si la olvidas.

2. **Inicia tu nodo Lens:**
   Para arrancar tu nodo, ejecuta:

   ```bash
   lens-node run
   ```

   Esto iniciara el daemon del nodo, se conectara a la red Peerbit y abrira tu sitio Lens. Se abrira un terminal interactivo y podras usarlo para administrar tu nodo.

   Sugerimos ejecutar el nodo dentro de una sesion `screen` o `tmux`, para que siga funcionando en segundo plano si cierras el terminal.

   Copia la direccion de escucha `ws` para usarla mas adelante, por ejemplo `/ip4/127.0.0.1/tcp/8002/ws/p2p/12D3KooWAo2AC2Aga6gxon6Fd8jXMoxRtBkQrBBK3hsuQs3wtnNT`.

## Instalar Flagship

1. Clona el repositorio de GitHub de Flagship:
   ```sh
   git clone https://github.com/riffcc/flagship.git
   ```

2. Entra en el directorio de Flagship e instala sus dependencias:
   ```sh
   cd flagship
   pnpm install
   ```

3. Copia el archivo `.env.example` a `.env`:
   ```sh
   cp .env.example .env
   ```

4. Edita el archivo `.env` para establecer `VITE_SITE_ADDRESS` con la direccion del sitio que guardaste antes. Establece `VITE_BOOTSTRAPPERS` con la direccion de escucha `ws` que copiaste antes.

5. Ejecuta la aplicacion en modo desarrollo (con hot reloading):
   ```sh
   pnpm watch:web
   ```

6. Visita la aplicacion en tu navegador en `http://localhost:5175/#/account`.

7. Ahora deberias ver la aplicacion Flagship.

   ![Aplicacion Flagship](/images/docs/flagship/installing-flagship-account.png)

   {{< callout emoji="🐉" >}}
     Puedes ignorar con seguridad la advertencia "Not implemented" al pie de la pagina.
   {{< /callout >}}

8. Haz clic en la clave publica bajo el encabezado "Public Key" para copiarla al portapapeles.

## Crear una cuenta de administrador

En el servidor que aloja tu Lens, ve a la accion ` > Authorise an account`.

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

Pulsa Intro y pega la clave publica que copiaste antes:

```
✔ Actions: Authorise an account
✔ Enter the string public key of the account: ed25119p/1a1b2a241f1734f6088fa4715bc763f448dbbf0d1ab8c100a959dec765ba5a58
? Select the account type (Use arrow keys)
❯ Member
  Admin
```

Selecciona "Admin" con las flechas y luego pulsa Intro.

Deberias ver un mensaje de exito:
```
2025-07-15 23:13:41.822 [info] Account authorized successfully
{
  "publicKey": "ed25119p/1a1b2a241f1734f6088fa4715bc763f448dbbf0d1ab8c100a959dec765ba5a58",
  "accountType": "Admin"
}
```

Actualiza la aplicacion Flagship en tu navegador. Ahora deberias ser "Admin" y ver la pestana "Admin".

## Administrar tu Lens
### Anadir contenido a tu Lens

Es hora de subir tu primera pieza de contenido. Como ejemplo, subiremos la pelicula **RiP: A Remix Manifesto**, un documental legalmente libre sobre la cultura del remix.

1. Haz clic en el boton "Upload" del menu superior.
2. Introduce un nombre, como "RiP: A Remix Manifesto".
3. Introduce un CID de contenido; en este caso `QmTWWUmvC9txvE7aHs9xHd541qLx3ax58urvx3Kb3SFK2Q`.
4. Selecciona la categoria "Movies".
5. Establece el CID de miniatura en `Qmb3eeESRoX5L6NhTYLEtFFUS1FZgqe1e7hdBk2f57DUGh`.
6. Haz clic en el boton "Upload".

Ahora deberias ver la pelicula en tu Lens si vas a la pestana "Movies".

### Destacar contenido

Puedes destacar contenido para que aparezca en la pagina principal de tu Lens.

1. Haz clic en la pestana "Admin" del menu superior.
2. Haz clic en la pestana "Content" del menu lateral del panel de administracion.
3. Haz clic en el boton "Feature" junto a la pelicula que subiste (la estrella con un signo mas).

Iras a la pagina *New Featured Releases*.

El control "Promoted" estara en "Yes" por defecto. El contenido promocionado aparecera en el hero slider de la portada, mientras que el contenido solo destacado seguira apareciendo en la portada pero con menos protagonismo.

4. Haz clic en el boton "Create" para crear la entrada destacada.

Ahora deberias ver la pelicula en la pagina principal de tu Lens.

![Portada de una Lens](/images/docs/flagship/frontpage-generic.png)

### Anadir detalles a una publicacion destacada

{{< callout emoji="🚧" >}}
Esta seccion esta en construccion.
{{< /callout >}}

Puedes anadir mas detalles a la publicacion destacada haciendo clic en el boton "Edit" junto a la entrada destacada y luego en la pestana "Advanced".

Esto te permitira anadir una descripcion, etiquetas y otros detalles a la publicacion destacada.

Tambien puedes anadir una imagen de banner para que se muestre en lugar del CID de miniatura cuando la publicacion se promocione en el hero slider.

## Siguientes pasos

### Unete a nuestra comunidad

Tenemos un servidor de Discord donde puedes hacer preguntas, compartir tu Lens y recibir ayuda de la comunidad.

[Unete a nuestro servidor de Discord](https://discord.gg/cvYgQSfCrQ)

### Seguir una Lens (Opcional)

Una de las mejores partes de gestionar una Lens es poder seguir otras Lenses y ver su contenido.

Solo copia el Site ID de la Lens que quieras seguir y ve a la seccion *Admin* de tu Lens, luego a *Subscriptions*.

Pega el Site ID de la Lens que quieras seguir y haz clic en *Subscribe*.

{{< callout type="info" emoji="ℹ️" >}}
El Site ID de la Lens actual de Riff.CC es `zb2rhoGguxQaNZy47DvRPLRmpT84mwvwuvekUhmCgF7nkhTCn`, por si quieres algo que seguir.
{{< /callout >}}

![Anadir una suscripcion](/images/docs/concepts/follow-a-lens.png)

Despues de anadirla, la veras aparecer en la lista de suscripciones.

Una vez anadida la suscripcion, el contenido de la Lens seguida aparecera en tu Lens.

![Anadir una suscripcion](/images/docs/concepts/follow-a-lens-2.png)

Para dejar de seguir una Lens, solo haz clic en el icono de papelera junto a la Lens que quieras dejar de seguir.
