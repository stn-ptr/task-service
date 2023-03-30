# Task Service

Not fit for production use. This is a project for training and trying out things,
please do not use in a productive environment.

## Requirements

- Node 18.15.0
- ~~Node 0.10.48 - Ancient, but this version runs on my NAS, which is ancient as well.~~

## Setup

### Create certificates

Certificates for development can be created with openssl:
    
    openssl req -x509 -out localhost.crt -keyout localhost.key \
        -newkey rsa:2048 -nodes -sha256 \
        -subj '/CN=localhost' -extensions EXT -config <( \
        printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")

From [Let's encrypt: Certificates for localhost](https://letsencrypt.org/docs/certificates-for-localhost/)

### Create config file

Create a file `config.json` in the root directory of the project. The file should contain HttpsOptions with the paths to
the key and certificate files:

    {
        "HttpsOptions": {
            "key": "path/to/localhost.key",
            "cert": "path/to/localhost.crt"
        }
    }

The server will exit immediately if the config file is missing or the paths are invalid.

## Features

Supports HTTPS
