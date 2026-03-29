+++
date = '2025-07-07T15:37:53+01:00'
draft = false
title = 'उत्पादन सेटअप'
weight = 3
+++

### **उत्पादन: लेंस नोड के साथ एक प्रमुख उदाहरण लागू करना**

यह गाइड आपको एक उत्पादन के लिए तैयार प्रमुख उदाहरण तैनात करने के माध्यम से चलेगा, जिसमें एक सर्वर की स्थापना, डीएनएस का विन्यास, इसे एसएसएल के साथ सुरक्षित करना, और एक निरंतर टर्मिनल सत्र में लेंस नोड चलाना शामिल है।

### **प्रीरेक्वज़ट**

*   एक सर्वर इंस्टैंस (जैसे, aws ec2 या digitalocean droopplet) जो उबुन्टू 22.04 जैसे आधुनिक लिनक्स वितरण का संचालन करता है    *   **अनुशंसित स्पेसिफिकेशन:** 2+ CPU Cores, 4GB+ RAM.
*   एक पंजीकृत डोमेन नाम(e.g., `your-domain.com`).
*   अपने डोमेन के dns प्रबंधन पैनल तक पहुँच।.
*   आपके सर्वर पर संस्थापित निम्न सॉफ्टवेयर:
    *   [Node.js](https://nodejs.org/)
    *   [pnpm](https://pnpm.io/installation)
    *   [Git](https://git-scm.com/downloads)
    *   [Nginx](https://www.nginx.com/)
    *   [Screen](https://www.gnu.org/software/screen/) (`sudo apt install screen`)

---

### **पार्ट 1: सर्वर और डोमेन कॉन्फ़िगरेशन**

यह अनुभाग आपके सर्वर, dns और ssl प्रमाणपत्र के आरंभिक सेटअप को कवर करता है.

#### **स्टेप 1: अपने डोमेन को सर्वर पर इंगित करें**

अपने डीएनएस प्रदाता नियंत्रण पैनल में, अपने सर्वर के सार्वजनिक आईपी पते की ओर इंगित करने वाले दो `a `. रिकॉर्ड बनाएं:

1. आपके मुख्य डोमेन के लिए एक `A` रिकॉर्ड:
* **प्रकार:** `A`
* **नाम/होस्ट:** `@` (या `your-domain.com`)
* **मान/इसकी ओर इंगित करता है:** `your-server-ip`

2. लेंस नोड उपडोमेन के लिए एक `A` रिकॉर्ड:
* **प्रकार:** `A`
* **नाम/होस्ट:** `lens`
* **मान/इसकी ओर इंगित करता है:** `your-server-ip`

> **टिप्पणी:** डीएनएस परिवर्तन को प्रचारित करने में कुछ समय लग सकता है।.

#### **step 2: nginx इंस्टॉल करें और ssl प्रमाणपत्र प्राप्त करें**

1.  **nginx और certbot संस्थापित करें:**
   ```बैश
 sudo apt update
 sudo apt install nginx certbot python3-certbot-nginx
 ```

2. ssl प्रमाणपत्र हम अपने दोनों डोमेन के लिए प्रमाणपत्र प्राप्त करने के लिए सीईआरटी का उपयोग करेंगे। यह कमांड अस्थायी रूप से nginx को सत्यापन के लिए पोर्ट 80 को मुक्त करने के लिए रोक देगा।
    ```बैश
    sudo systemctl stop nginx
    sudo certbot certonly --standalone -d your-domain.com -d lens.your-domain.com
    ```
    प्रक्रिया पूरी करने के लिए प्रांप्ट्स का पालन करें। एक बार समाप्त हो जाने के बाद, certbot आपके प्रमाणपत्र फ़ाइलें बना देगा।.

#### **स्टेप 3: nginx कॉन्फ़िगर करें**

अब हम आपके फ्लैगशिप साइट और लेंस नोड के प्रॉक्सी अनुरोध को पूरा करने के लिए nginx विन्यास फ़ाइलें बनाएंगे।.

1.  **अपने प्रमुख साइट के लिए nginx विन्यास बनाएँ:**
    ```बैश
    sudo nano /etc/nginx/sites-available/your-domain.com
    ```
    your-domain.com` को अपने वास्तविक डोमेन से बदलकर निम्नलिखित पेस्ट करें:  
      ```nginx
    सर्वर {
       listen 80;
       server_name your-domain.com;
       # सभी HTTP अनुरोधों को HTTPS पर रीडायरेक्ट करें
       return 301 https://$host$request_uri;
    }

    सर्वर {
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

2.  **प्रमुख साइट के लिए वेब रूट निर्देशिका बनाएँ:**
    ```बैश
    sudo mkdir -p /var/www/your-domain.com/html
    ```

3.  **अपने लेंस नोड उप-डोमैन के लिए एनगिनएक्स कॉन्फिग बनाएँ:**
    ```बैश
    sudo nano /etc/nginx/sites-available/lens.your-domain.com
    ```
    फ़ाइल में नीचे पूरे कॉन्फ़िगरेशन ब्लॉक को चिपकाएँ.
    > **महत्वपूर्ण:** आपको **`$YOUR_SUBDOMAIN`** के प्रत्येक उदाहरण को अपने वास्तविक उपडोमेन (जैसे, `lens.your-domain.com`) से प्रतिस्थापित करना होगा।

    ```nginx
    server_names_hash_bucket_size 128;

    सर्वर {
        server_name $YOUR_SUBDOMAIN;
        listen [::]:4002 ssl ipv6only=on;
        listen 4002 ssl;

        # प्रमाणपत्र फ़ाइल लोड करें.
        ssl_certificate         /etc/letsencrypt/live/$YOUR_SUBDOMAIN/fullchain.pem;
        ssl_certificate_key     /etc/letsencrypt/live/$YOUR_SUBDOMAIN/privkey.pem;
        ssl_trusted_certificate /etc/letsencrypt/live/$YOUR_SUBDOMAIN/chain.pem;

        # diffie-heelman पैरामीटर लोड करें.
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

        location / {
            proxy_pass http://127.0.0.1:8001;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }

    सर्वर {
        server_name $YOUR_SUBDOMAIN;
        listen [::]:4003 ssl ipv6only=on;
        listen 4003 ssl;

        # प्रमाणपत्र फ़ाइल लोड करें.
        ssl_certificate         /etc/letsencrypt/live/$YOUR_SUBDOMAIN/fullchain.pem;
        ssl_certificate_key     /etc/letsencrypt/live/$YOUR_SUBDOMAIN/privkey.pem;
        ssl_trusted_certificate /etc/letsencrypt/live/$YOUR_SUBDOMAIN/chain.pem;

        # diffie-heelman पैरामीटर लोड करें.
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

        location / {
            proxy_pass http://127.0.0.1:8002;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }

    सर्वर {
        server_name $YOUR_SUBDOMAIN;
        listen [::]:4004 ssl ipv6only=on;
        listen 4004 ssl;

        # प्रमाणपत्र फ़ाइल लोड करें.
        ssl_certificate         /etc/letsencrypt/live/$YOUR_SUBDOMAIN/fullchain.pem;
        ssl_certificate_key     /etc/letsencrypt/live/$YOUR_SUBDOMAIN/privkey.pem;
        ssl_trusted_certificate /etc/letsencrypt/live/$YOUR_SUBDOMAIN/chain.pem;

        # diffie-heelman पैरामीटर लोड करें.
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

        location / {
            proxy_pass http://127.0.0.1:8083;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }


    सर्वर {
        server_name $YOUR_SUBDOMAIN;
        listen [::]:4005 ssl ipv6only=on;
        listen 4005 ssl;

        # प्रमाणपत्र फ़ाइल लोड करें.
        ssl_certificate         /etc/letsencrypt/live/$YOUR_SUBDOMAIN/fullchain.pem;
        ssl_certificate_key     /etc/letsencrypt/live/$YOUR_SUBDOMAIN/privkey.pem;
        ssl_trusted_certificate /etc/letsencrypt/live/$YOUR_SUBDOMAIN/chain.pem;

        # diffie-heelman पैरामीटर लोड करें.
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

        location / {
            proxy_pass http://127.0.0.1:8084;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }

    सर्वर {
        server_name $YOUR_SUBDOMAIN; # managed by Certbot

        root /usr/share/nginx/html;
        index index.html index.htm;

        location / {
            try_files $uri $uri/ =404;
        }

        listen [::]:443 ssl; # managed by Certbot
        listen 443 ssl; # managed by Certbot

        # प्रमाणपत्र फ़ाइल लोड करें.
        ssl_certificate         /etc/letsencrypt/live/$YOUR_SUBDOMAIN/fullchain.pem;
        ssl_certificate_key     /etc/letsencrypt/live/$YOUR_SUBDOMAIN/privkey.pem;
        ssl_trusted_certificate /etc/letsencrypt/live/$YOUR_SUBDOMAIN/chain.pem;

        # Load the Diffie-Hellman parameter.
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    }
    सर्वर {
        server_name $YOUR_SUBDOMAIN;
        listen [::]:9002 ssl ipv6only=on;
        listen 9002 ssl;

        # प्रमाणपत्र फ़ाइल लोड करें.
        ssl_certificate         /etc/letsencrypt/live/$YOUR_SUBDOMAIN/fullchain.pem;
        ssl_certificate_key     /etc/letsencrypt/live/$YOUR_SUBDOMAIN/privkey.pem;
        ssl_trusted_certificate /etc/letsencrypt/live/$YOUR_SUBDOMAIN/chain.pem;

        # diffie-heelman पैरामीटर लोड करें.
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

        location / {
            proxy_pass http://127.0.0.1:8082;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }

    सर्वर {
        listen 80;
        listen [::]:80 ;
        server_name $YOUR_SUBDOMAIN;

        # इस विशेष यूआरएल का अनुरोध करने वाली कुछ भी सामग्री परोसी जानी चाहिए
        # certbot का फ़ोल्डर तो http-01 एसीएमई चुनौती को पूरा किया जा सकता है
        # https प्रमाणपत्र.
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

4.  **सिंबालिक लिंक बनाने के द्वारा दोनों साइटों को सक्षम करें:**
    ```बैश
    sudo ln -s /etc/nginx/sites-available/your-domain.com /etc/nginx/sites-enabled/
    sudo ln -s /etc/nginx/sites-available/lens.your-domain.com /etc/nginx/sites-enabled/
    ```

5.  **अपने nginx विन्यास जाँचें और सेवा फिर आरंभ करें:**
    ```बैश
    sudo nginx -t
    sudo systemctl restart nginx
    ```

---

### **भाग 2: लेंस नोड सेट और चलाने**

हम पृष्ठभूमि में लेंस नोड प्रक्रिया को चलाने के लिए 'स्क्रीन' का उपयोग करेंगे, जिससे यह आपके एसएसएच सत्र से अलग होने के बाद भी जारी रहने की अनुमति देगा।
1.  **लेंस नोड को वैश्विक स्तर पर संस्थापित करें:**
    ```बैश
    pnpm install -g @riffcc/lens-node
    ```

2.  **आरंभिक सेटअप प्रक्रिया चलाएँ:**
    ```बैश
    lens-node setup
    ```

3.  **नया `स्क्रीन` सत्र प्रारंभ करें:**
    ```बैश
    screen -S lens-node
    ```
    आपका टर्मिनल साफ हो जाएगा, और आप अब `lens-node' नामक एक नए आभासी सत्र के अंदर हैं।.

4.  स्क्रीन सत्र के अंदर नोड आरंभ करें। `lens. your-domain.com' को आपके वास्तविक subdomain से बदलें।.
    ```बैश
    लेंस-नोड रन --domain लेंस. yourdomain.com --relay
    ```

5.  एक बार नोड चल रहा है, तो आप इस के समान आउटपुट देखेंगे। अपने 'साइट एड्रेस' और 'ऑन ऑन' एड्रेस की सूची जिसमें '/wss' होता है।.

    ```बैश
    Node Directory: /root/.lens-node
    Peer ID: 12D3KooWFzrhasG7pouxZSsSP3bHP45C3TCq2MYirTPC5oA9Lj2v
    Site Address: zb2rhoGguxQaNZy47DvRPLRmpT84mwvwuvekUhmCgF7nkhTCn
    Listening on: [
      "/dns4/lens.your-domain.com/tcp/4002/p2p/12D3KooWFzrhasG7pouxZSsSP3bHP45C3TCq2MYirTPC5oA9Lj2v",
      "/dns4/lens.your-domain.com/tcp/4003/wss/p2p/12D3KooWFzrhasG7pouxZSsSP3bHP45C3TCq2MYirTPC5oA9Lj2v"
    ]
    ```

6.  **स्क्रीन सत्र से अलग करें**, नोड चला जा रहा है. **`Ctrl+A`** दबाएँ, फिर **`D`** दबाएँ.

अब आपके पास एक लेंस नोड है जो पृष्ठभूमि में सफलतापूर्वक चल रहा है।

> **नोड प्रबंधित करने के लिए:**
> * **लॉग देखने या प्रक्रिया रोकने के लिए सत्र से पुनः जुड़ें**: `screen -r lens-node`
> * **नोड रोकने के लिए**, पुनः जुड़ें और `Ctrl+C` दबाएँ।
> * **चेतावनी:** यह विधि सर्वर रीबूट के बाद काम नहीं करती। यदि सर्वर पुनः आरंभ होता है, तो आपको नए स्क्रीन सत्र में नोड को मैन्युअल रूप से पुनः आरंभ करना होगा।

---

### **भाग 3: प्रमुख उदाहरण तैनात करें**

अंत में, फ्लैगशिप फ्रंटेंड एप्लिकेशन को कॉन्फ़िगर, बिल्ड और तैनात करें।

1.  **रिपोजिटरी क्लोन करें और निर्देशिका में नेविगेट करें:**
    ```बैश
    git clone https://github.com/riffcc/flagship
    cd flagship
    ```

2.  **एनवायरनमेंट फ़ाइल बनाएँ:**
    ```बैश
    cp .env.example .env
    ```

3. एनवायरनमेंट वेरिएबल(environment variable) का विश्लेषण करें। `.env` फ़ाइल को खोलो और आपके चल रहे लेंस नोड से मूल्यों का उपयोग करके निम्न वेरिएबल सेट करेंः
    ```dotenv
    # Paste the "Site Address" from your node's output here
    VITE_SITE_ADDRESS=zb2rhoGguxQaNZy47DvRPLRmpT84mwvwuvekUhmCgF7nkhTCn

    # Paste the secure "/wss" listening address here
    VITE_BOOTSTRAPPERS=/dns4/lens.your-domain.com/tcp/4003/wss/p2p/12D3KooWFzrhasG7pouxZSsSP3bHP45C3TCq2MYirTPC5oA9Lj2v
    ```

4.  **निर्भरता संस्थापित करें और अनुप्रयोग का निर्माण करें:**
    ```बैश
    pnpm install
    pnpm compile:web
    ```

5.  **अपने nginx वेब रूट पर निर्मित फ़ाइलों को तैनात करें.**
    ```बैश
    sudo cp -r packages/renderer/dist/web/* /var/www/your-domain.com/html/
    ```

6.  **वेब फ़ाइलों के लिए सही स्वामित्व नियत करें:**
    ```बैश
    sudo chown -R www-data:www-data /var/www/your-domain.com/html
    ```

आपका प्रमुख उदाहरण अब लाइव है! आप इसे अपने ब्राउज़र में `https://your-domain.com ' तक पहुंचा सकते हैं।