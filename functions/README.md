# `cron-jobs`

## Installing

```sh
# clone this repository and all submodules:
git clone --recurse-submodules git@github.com:coinhall/cron-jobs.git
# change into the `cron-jobs` directory:
cd cron-jobs
# install all dependencies
yarn
```

To develop locally, create a `~/.secret.local` file and fill it up appropriately with the following contents:

```sh
MONGO_URI=""
```

## Developing

```sh
# setup Firebase first
firebase login
# manually start a local functions emulator
yarn serve
```

## Deploying

```sh
yarn deploy
```

## Secrets Manager

- **Important**: explicitly allow functions to access needed secrets in the `runWith` parameter (secrets will be `undefined` otherwise)
- Whenever a new value for a secret is set, redeploy all functions that reference that secret for them to pick up the latest value
- Ensure that no deployed functions reference a secret before deleting the secret; functions that use a secret value that has been deleted will fail silently

```sh
# Set the value of an existing secret
firebase functions:secrets:set SECRET_NAME

# View the value of a secret
firebase functions:secrets:access SECRET_NAME

# Destroy a secret
firebase functions:secrets:destroy SECRET_NAME

# View all secret versions and their state
firebase functions:secrets:get SECRET_NAME

# Automatically clean up all secrets that aren't referenced by any of your functions
firebase functions:secrets:prune
```
