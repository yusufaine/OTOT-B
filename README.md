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

I chose to use Google Cloud Platform as some free credits were given for it, and I chose to use Cloud Run as I did not *need* to have this service up and running 24/7.

I followed along with the [official documentation from Google](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service) to assist me with the deployment but I would go over some of the steps that I took to deploy the application.

#### GCP Requirements

1. Google account
2. Google Cloud CLI installed (recommended, but it's possible to do this via web GUI)

#### Deployment Steps

1. Create a [Google Cloud project](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
2. Ensure that billing is enabled
   1. It is quite unlikely that we would be billed as [the first 180,000 vCPU seconds are free](https://cloud.google.com/run/pricing#tables), though I recommend to delete the instance just to be safe.
3. Set the project ID (project name is NOT project ID) for the deployment

    ```bash
    # get project ID
    gcloud projects list 
    gcloud config set project <projectId>

    # setting defaults
    gcloud config set run/region asia-southeast1 # deploy to Singapore by default

    # deploy to Cloud Run at the root of the project directory
    gcloud run deploy --source .

    # provide the service name when prompted

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
  * `PATCH/PUT`: updates a specific field given an ID
  * `DELETE`: removes the specified contact from the database
* `contacts/clear/all`: helper endpoint to wipe the entire contacts database

Note:

* `params` and `body` would need to be updated manually, where they are necessary.
* The default mongo ID is used for demonstration purposes. Realisitically, the entries would likely be indexed by phone number and checked for uniqueness.

## Task B2.1: Testing through Continuous Integration

## Task B2.2: Deployiung through Continuous Deployment

## Task B3: Implement a Frontend

## Task B4: Pulling data from Serverless Function to Frontend
