# Task Service

## ⚠ Not fit for production use.

This is project is meant for learning, practicing and trying out things, not for use in a productive environment.

## Requirements

- Node 22.17.1

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

### Build container

This repository contains a Dockerfile to build a container with the task service. To build the container, run the following

    docker build -t task-service .

To run the container, use the following command:

In Bash

```bash
docker run \
    --rm \
    --detach \
    --name task-service \
    --publish 3000:3000 \
    --volume tasks:/usr/local/lib/task-service/data \
    --volume ${PWD}/tasks.json:/etc/task-service/tasks.json:ro \
    --volume ${PWD}/localhost.key:/usr/local/lib/task-service/localhost.key:ro \
    --volume ${PWD}/localhost.crt:/usr/local/lib/task-service/localhost.crt:ro \
    task-service
```

In PowerShell

```powershell
docker run `
    --rm `
    --detach `
    --name task-service `
    --publish 3000:3000 `
    --volume tasks:/usr/local/lib/task-service/data `
    --volume ${PWD}/tasks.json:/etc/task-service/tasks.json:ro `
    --volume ${PWD}/localhost.key:/usr/local/lib/task-service/localhost.key:ro `
    --volume ${PWD}/localhost.crt:/usr/local/lib/task-service/localhost.crt:ro `
    task-service
```

The container will be available on port 3000.

## Features

- Supports HTTPS
- Authentication
  - Basic
- Not much more yet 😃

## Testing

This describes some tests I'm running

### Unit Tests

```shell
node --test "**/*.test.js"
```

### PowerShell

Credentials are stored in a SecureString, I create one per session interactively with Get-Credential.

```powershell
$credential = Get-Credential
```

Create a minimal new task

```powershell
Invoke-WebRequest "http://localhost:3000/task" -Credential $credential -AllowUnencryptedAuthentication -Method Post -Body '{"title": "New Task"}'
```

Get all tasks

```powershell
Invoke-WebRequest "http://localhost:3000/task" -Credential $credential -AllowUnencryptedAuthentication
```

Get a task

```powershell
Invoke-WebRequest "http://localhost:3000/task/99e587e6-6550-4601-9e2a-d40d2a2dce7b" -Credential $credential -AllowUnencryptedAuthentication
```

Update a task

```powershell
Invoke-WebRequest "http://localhost:3000/task/99e587e6-6550-4601-9e2a-d40d2a2dce7b" -Credential $credential -AllowUnencryptedAuthentication -Method Put -Body '{"done": true}'
```

Delete a task

```powershell
Invoke-WebRequest "http://localhost:3000/task/99e587e6-6550-4601-9e2a-d40d2a2dce7b" -Credential $credential -AllowUnencryptedAuthentication -Method Delete
```
