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
   * Verify that secrets are loaded in: `Cloud Run` > `SERVICE_NAME` >`Revisions` > Select running revision > `Containers` > `Environment variables`
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

### Screenshots

#### `GET`: get contacts given empty database

![get data from empty database](https://i.ibb.co/7RffN9t/image.png)

#### `POST`: invalid contact (missing name)

![post invalid contact](https://i.ibb.co/sVDLJ8Q/image.png)

#### `POST`: valid contact

![post valid contact](https://i.ibb.co/sRT13JB/image.png)

#### `PATCH`/`PUT`: update value of contact

![patch in action](https://i.ibb.co/4pzdfZS/image.png)

#### `DELETE`: remove specified contact

![delete in action](https://i.ibb.co/rFDp5rs/image.png)

## Task B2.1: Testing through Continuous Integration

This section briefly goes over how Jest and Supertest were used to test the application locally as well as through CI tools (Github Action).

### Summary of CI

* For testing, [Jest](https://jestjs.io/) was used along with [Supertest](https://github.com/visionmedia/) to test the REST endpoints.
* For these series of tests, the actual database that is deployed is being used as there were issues with using a mock or in-memory database.
  * As such, the `--forceExit` flag was needed as the database connection was still open.
* While `PATCH`, and `PUT` serves provides only the modified and full data with the modified values respectively, they serve the same function in this task (as I only found out the difference after the fact).
* The Postman collection can be found [here](https://www.getpostman.com/collections/5d4bca11ee5b837a69a9) with the variables already set as well as some helper endpoints that can be used to populate the database.
* The Github Action yaml file can be viewed [here](https://github.com/yusufaine/OTOT-B/blob/main/.github/workflows/ci-cd.yaml).

### Local test output

![Jest output](https://i.ibb.co/5s1M7Nm/image.png)

### Testing via [Github Action](https://github.com/yusufaine/OTOT-B/runs/8274401733?check_suite_focus=true)

![Github Actions output](https://i.ibb.co/WkcHnRF/image.png)

## Task B2.2: Deploying through Continuous Deployment

Building from the previos sections, this section briefly goes over how Github Action is used as a CD tool, paired with Google's Cloud Run to ensure that the latest (tested) version is deployed live.

### Summary of CD

* With reference to the [Github Action yaml](https://github.com/yusufaine/OTOT-B/blob/main/.github/workflows/ci-cd.yaml), the deployment step had to somehow execute after all the tests ran successfully, and build and/or deploy the repo/`Dockerfile`.
* While Google Cloud Run allows to setup continous deployment fairly easily, deployment via `Dockerfile` was preferred as the process was more straight-forward.
  * Cloud Run's CD creates a Cloud Build trigger that can launch when something is being pushed to the monitored branch of the repo (requires Github authorisation).
  * The build step is not able to be observed from Github's interface, only through GCP Cloud Build.
  * There was not a clear way to conditionally build -- if the testing step fails, it still gets built and deploys to Cloud Run.
* CD via Github Actions is also a little invovled as it requires setting up a few resources that allows Github to access the GCP project so that it can deploy the `Dockerfile` accordingly.
  * This [Google community tutorial](https://cloud.google.com/community/tutorials/cicd-cloud-run-github-actions) was used to setup the GCP Deploy account and obtain the necessary credential.
  * The [official Github Action from Google](https://github.com/marketplace/actions/deploy-to-cloud-run#credentials) was also referenced.


### Continuous Deployment Screenshots

#### Deploy only after successful test

![deploy after test](https://i.ibb.co/TT0tpD2/image.png)

#### Github Action CD Logs

![Github Action CD Logs](https://i.ibb.co/184wn5h/image.png)

#### Deployed via Google's Service Account

![deployed via Google's Service Account](https://i.ibb.co/rm9yTHF/image.png)

## Task B3: Implement a Frontend

For this task, a simple frontend was made using React and MUI's datagrid component to make it easier to see. The website is deployed on Vercel and can be accessed through this link [https://otot-b.vercel.app/](https://otot-b.vercel.app/).

To use the website, click on "Refresh list" to load the contacts that are saved on the database. It takes a while to load as the backend is hosted on Cloud Run and would take a few seconds to spin up before being able to respond to any of the REST endpoint.

Below the table, there is an action dropdown menu where the CRUD operations can occur by providing the necessary information.
Note that the `update` action requires the ID of the contact that wants to be updated and functions similar to `PATCH`. This means that in order to remove a field, an empty string (" ") can be provided to simulate that. The table does _not_ automatically updated upon the execution of an action, but a user would only need to click on `Refresh list` and the table would reflect the changes without needing to re-navigate to the right page.

<div style="page-break-after: always"></div>

### Screenshot of Contact List frontend

![Simple frontend](https://i.ibb.co/3sGR8ys/image.png)

<div style="page-break-after: always"></div>

## Task B4: Pulling data from Serverless Function to Frontend

In this section, I would be pulling data from [Coingecko's API](https://www.coingecko.com/en/api/documentation) of the top 250 cryptocurrencies and display them on a table.

For this, I would be using pulling the data from Google's Cloud Functions which gets the data from the relevant endpoints. The frontend has been deployed here  [https://otot-b4.vercel.app/](https://otot-b4.vercel.app/).

### Screenshot of B4

#### Deployed Cloud Function

![Cloud Function](https://i.ibb.co/b3rfMJH/image.png)

<div style="page-break-after: always"></div>

#### Default view

![default view](https://i.ibb.co/pKYj9jd/image.png)

<div style="page-break-after: always"></div>

#### Sort by decreasing price

![sorted view](https://i.ibb.co/8zY1j8g/image.png)

<div style="page-break-after: always"></div>

#### Filter by Market Cap (>5 billion)

![filtered view](https://i.ibb.co/92QFtTr/image.png)

### Potential improvements

In the future, [Exchange Rates API](https://exchangeratesapi.io/) can be integrated to allow toggling between different currencies so that users would not need to re-request from Coingecko's API multiple times if they choose to view the performance of the top 250 cryptocurrencies in a FIAT currency that they are familiar with (USD/SGD/GBP/etc.).
