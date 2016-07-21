# Let's encrypt Express

[ctime:1453306073000]

Since [_Let's Encrypt_][1] will be coming out [soon][2], I thought I'd try it on my Site. _Let's Encrypts_ infrastructure is actually fully operational already. They still label it as being in beta, because the client has some ([around 400][3]) bugs. My Site runs on Node.js using Express on [_Alpine Linux_][4]. The guide should work on pretty much any Linux system, since both _Node.js_ and _Let's Encrypt_ are made to be as cross-platform-compatible as possible.

I'll be covering three things in this guide. **Requesting the certificate**, **Installing it to the Express app** and **A simple Express app running over TLS**.

## Requesting the certificate

First of all lets get our certificate. I basically just followed the [README inside Let's Encrypt's Github repo][5].

We'll need to install the utility. This will become easier once it's released as stable. You'll then be able to use your package-manager.

```bash
git clone https://github.com/letsencrypt/letsencrypt
cd letsencrypt
./letsencrypt-auto --help
```

Then we can request the certificate. Here's what I did for this site.

```bash
./letsencrypt-auto certonly --standalone --email not_an_email_address@lucaschmid.net -d lucaschmid.net
```

This threw an error on my server because I had IPv6 enabled. If [this issue][6] hasn't been resolved yet, **you might need to do deactivate IPv6**, before running the last command.

```bash
sysctl -w net.ipv6.conf.all.disable_ipv6=1
```

When you now run the last command again, you should recieve the certificate. After that, you can enable IPv6 again.

```bash
sysctl -w net.ipv6.conf.all.disable_ipv6=0
```

## Installing the certificate to the Express app

Inside my app's directory I created a directory called `tls`. I then created some symlinks for the certificate and the key.

```bash
mkdir tls
cd tls
ln -s /etc/letsencrypt/live/lucaschmid.net/fullchain.pem cert.pem
ln -s /etc/letsencrypt/live/lucaschmid.net/privkey.pem key.pem
```

_I'm using Docker to run this site, so the symlinks won't work inside the container. To fix this, I had to make copies of the files instead of only symlinking them. This has the disadvantage of Let’s Encrypt not being able to manage them. The certificates have a pretty short lifetime (3 months), letsencrypt could renew them itself._

## A simple Express app running over TLS

Now we can integrate the `https` module into our Express server. Here's a simple example:

```js
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
![Image of the certificate opened in Firefox][image-1]

Now go on!

**ENCRYPT ALL THE THINGS!!**

**UPDATE** 21. July 2016:
A while ago I noticed, that some browsers (i.e. IE) marked my certificate as unverified. That didn't make much sense to me, since Let's Encrypts intermediate certificates are cross-signed by IdenTrust and IdenTrust is a well known CA. So any browser that has whitelisted IdenTrusts root certificate should also trust any Let's Encrypt certificate. The certificate this post used to instruct you to use (`/etc/letsencrypt/live/[domain]/cert.pem`) is of course only signed by the Let's Encrypt CA. For a browser to know that the certificate is indirectly cross-signed by IdenTrust we actually need to use `/etc/letsencrypt/live/[domain]/fullchain.pem`, which as the name implies, contains the whole certificate chain. That includes the cross-signed Let's Encrypt intermediate certificates. You can view the changes I made to the post [here](https://github.com/Kriegslustig/lucaschmid.net/commits/master/common/data/blog/letsencrypt-express.md).

[0]: https://lucaschmid.net/anotherblog/letsencrypt-express
[1]: https://letsencrypt.org/
[2]: https://letsencrypt.org/2015/11/12/public-beta-timing.html
[3]: https://github.com/letsencrypt/letsencrypt/issues
[4]: https://alpinelinux.org/
[5]: https://github.com/letsencrypt/letsencrypt/blob/master/README.rst
[6]: https://github.com/letsencrypt/boulder/issues/1046
[7]: https://letsencrypt.org/

[image-1]: https://lucaschmid.net/img/certificate.png

