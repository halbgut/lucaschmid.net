# Let's encrypt Express

Since [_Let's Encrypt_](https://letsencrypt.org/)_ will be comming out [soon](https://letsencrypt.org/2015/11/12/public-beta-timing.html), I thought I'd try it on my Site. _Let's Encrypts_ Infrastructure is actually fully operational already. They actually still label it as beeing in beta, because the client still has some ([around 400](https://github.com/letsencrypt/letsencrypt/issues)) bugs. My Site runs on Node.js using Express on [_Alpine Linux_](https://alpinelinux.org/). The guide should work on pretty much any Linux System, since both _Node.js_ and _Let's encrypt_ are made to be compatible as cross-platform-compatible as possible.

I'll be covering three things in this guide. **Requesting the Certificate**, **Installing it to the Express App** and **A simple Express-App running over TLS**.

## Requesting the certificate

First of all lets get our certificate. I basically just followed the [README in Let's Encrypt's Github repo](https://github.com/letsencrypt/letsencrypt/blob/master/README.rst).

Install the utility. This will become easier one it's released. You'll then be able to use your package-manager.

```
git clone https://github.com/letsencrypt/letsencrypt
cd letsencrypt
./letsencrypt-auto --help
```

Then we can request the certificate. Here's what I did for this site

```
./letsencrypt-auto certonly --standalone --email not_an_email_address@lucaschmid.net -d lucaschmid.net
```

This threw an error on my server because I had IPv6 enabled. If [this issue](https://github.com/letsencrypt/boulder/issues/1046) hasn't been resolved yet, **you might need to do deactivate IPv6**, before running the last command.

```
sysctl -w net.ipv6.conf.all.disable_ipv6=1
```

Then after you have received the certificate, you can enable it again.

```
sysctl -w net.ipv6.conf.all.disable_ipv6=0
```

## Installing it to the Express-App

Inside my app's directory I created a directory called `tls`. Then I created some symlinks for the certificate and the key.

```
mkdir tls
cd tls
ln -s /etc/letsencrypt/live/lucaschmid.net/cert.pem
ln -s /etc/letsencrypt/live/lucaschmid.net/privkey.pem key.pem
```

(I'm using Docker to run this site, so the symlinks won't work inside the container. To fix this, I had to make copies of the files instead of only symlinking them. This has the disadvantage, that letsencrypt can't manage them.)

## A simple Express-App running over TLS

Now we can integrate the `https` module into our Express server. Here's a simple example:

```
var express = require('express')
var fs = require('fs')
var https = require('https')

var ports = process.env.NODE_ENV === 'production'
  ? [80, 443]
  : [3442, 3443]

var app = express()

var server = https.createServer(
  {
    key: fs.readFileSync('./tls/key.pem'),
    cert: fs.readFileSync('./tls/cert.pem')
  },
  app
)

server.listen(ports[1])
app.listen(ports[0])

app.use('/', (req, res) => {
  res.end('Hi')
})

```

This script simply serves 'Hi' on all routes both over HTTP and HTTPS. It might be a good idea to redirect HTTP to HTTPS. I just wanted to keep it as simple as possible here.

When you run this and go to your Website via HTTPS, you should see something like this:
![Image of the certificate opened in Firefox](/_img/certificate.png)

Now go on!

**ENCRYPT ALL THE THINGS!!**

