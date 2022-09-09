# CS3219 OTOT Task B

* **Name**: Yusuf Bin Musa
* **Matric. Number**: A0218228E
* **Repo Link**: [https://github.com/yusufaine/OTOT-B](https://github.com/yusufaine/OTOT-B)

## Task B1: Simple Backend

### Requirements

1. MongoDB (Mongo Atlas was used to host the database),
2. `.env` file that follows the format as shown:

    ```text
    PORT=<number>
    MONGO_URI=mongodb+srv://<user>:<password>@<database_url>
    ```

3. Docker for easy installation -- this would be used.
4. [Postman](https://www.postman.com/) is used to (manually) test CRUD for the API.

### Local Deployment

Build the image from the given `Dockerfile` and map the ports accordingly.

```bash
# create yarn-lock and node_modules
yarn

# build the docker image
docker build . -t otot-b1-demo
docker run -dp <local port>:<exposed port> otot-b1-demo

# verify that it's running correctly 
docker ps -a
```

### Cloud Deployment

Google Cloud Platform was chosen as free credits were given for it.
Cloud Run was the used over App Engine as there was no *need* to have this service up and running 24/7.

The [official documentation from Google](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service) to assist the deployment but some deployment steps are included.

Optionally, Secret Manager was used also used to manage `.env` secrets without explicitly sharing the file.

#### GCP Requirements

1. Google account
2. Google Cloud CLI installed (recommended, but it's possible to do this via web GUI)

#### Deployment Steps

1. Create a [Google Cloud project](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
2. Ensure that billing is enabled
   * It is quite unlikely that we would be billed as [the first 180,000 vCPU seconds are free](https://cloud.google.com/run/pricing#tables), though I recommend to delete the instance just to be safe.
3. Set the project ID (project name is NOT project ID) for the deployment.
4. Create a `.gcloudignore` to ignore unnecessary files that are not needed for deployment.
   * Do NOT add `.env` if Secret Manager is not planned to be used.

    ```bash
    # get project ID
    gcloud projects list 
    gcloud config set project <projectId>

    # setting defaults
    gcloud config set run/region asia-southeast1 # deploy to Singapore by default

    # deploy to Cloud Run at the root of the project directory
    gcloud run deploy <service-name> --source .

    # Alternatively provide the necessary params. 
    # I excluded `.env` as seen in `.gcloudignore` as I was using Secret Manager (optional) 
    
    # gcloud run deploy task-b1-otot --source . \
    #  --update-secrets OTOT_B_MONGO_PORT=OTOT_B_MONGO_PORT:latest \
    #  --update-secrets OTOT_B_MONGO_URI=OTOT_B_MONGO_URI:latest \
    #  --update-secrets OTOT_B_SOURCE=OTOT_B_SOURCE:latest
    ```

#### Troubleshoot Cloud Run Deployment

1. Unable to build container
   * Try to build and run `Dockerfile` locally and ensure that it works.
   * `.dockerignore` file is optional, but ensures that only the necessary files are copied over (non-documentation related).
2. "Successfully deployed on GCP Run but I'm unable to access the link that was generated"
   * Ensure the following settings in `Cloud Run` > `SERVICE_NAME` >`Triggers`
     * `Ingress`: Allow all traffic
     * `Authentication`: Allow unauthenticated invocations
       * This is set to false if the default is chosen in the deployment step.
3. How do I use Secret Manager with GCP Cloud Run?
   * You can refer to the [official documentation](https://cloud.google.com/secret-manager/docs/creating-and-accessing-secrets#secretmanager-add-secret-version-gcloud).
   * Exclude `.env` and other unnecessary files in `.gcloudignore`.
   * TLDR via gcloud CLI:

      ```bash
      # Create secret (no initial value)
      gcloud secrets create <SECRET_NAME>

      # Add initial/update secret
      echo -n "SECRET_VALUE" | gcloud secrets versions add <SECRET_NAME> --data-file=- 

      # Verify
      gcloud secrets versions access <VERSION> --secret="SECRET_NAME"

      # Example
      # gcloud secrets versions access <N> --secret="SECRET_NAME" 
      # gcloud secrets versions access latest --secret="SECRET_NAME" 

      ```

### Testing via Postman

Import the Postman collection via [this link](https://www.getpostman.com/collections/5d4bca11ee5b837a69a9).

Swap the current values of `host` and `deployed` to test the local/deployed environment.

Explanation of HTTP requests:

* `hello world`: test that Express is working
* `router test`: test that `router.use()` is working
* `contacts`: list all contacts (might be empty initially)
* `contacts/add/valid`: adds a valid user as seen in `body`
* `contacts/add/invalid`: tries to add an invalid user as seen in `body`, name is missing
* `contacts/addRandom`: adds a valid random user by using `@fakerjs`, mainly for testing
* `contacts/addRandom/:count`: similar to `addRandom`, but for multiple people
* `contacts/:contact_id`: Throws error if (mongo) ID does not exist
  * `GET`: returns contact with the specified ID -- refer to `contacts`
  * `PATCH` / `PUT`: updates a specific field given an ID
  * `DELETE`: removes the specified contact from the database
* `contacts/clear/all`: helper endpoint to wipe the entire contacts database

Note:

* `params` and `body` would need to be updated manually, where they are necessary.
* The default mongo ID is used for demonstration purposes. Realisitically, the entries would likely be indexed by phone number and checked for uniqueness.

## Task B2.1: Testing through Continuous Integration

[TODO] CI with Jest(?) to test endpoints

## Task B2.2: Deploying through Continuous Deployment

[TODO] CD with GCP Cloud Build + Cloud Run on changes to main via `Dockerfile`.

## Task B3: Implement a Frontend

## Task B4: Pulling data from Serverless Function to Frontend
