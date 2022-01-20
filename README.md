# Apartment Navigator

## Development

To get started with contributing to the repo, follow the steps below:

1. Clone the repository
2. Install dependencies
   1. `cd backend && pipenv install --dev -r dev-requirements.txt && pipenv install -r requirements.txt`
   2. `cd frontend && npm install`
3. In `backend`, create a `.env` file based on the `.env.example` with the proper settings for your development environment
4. Set up your PostgreSQL user and database and make sure it matches the information in the `.env`
5. Get into pipenv and get the database up to date:
   1. `pipenv shell`
   2. `flask db upprade`
   3. `flask seed all`
6. Start development servers
   1. `flask run`
   2. `npm start`

### Installing new dependencies

If you add any python dependencies to your pipfiles (using `pipenv install`), you'll need to regenerate the `requirements.txt` before deployment.

For production dependencies, run `pipenv lock -r > requirements.txt`.

For development dependencies, run `pipenv lock -r --dev-only > dev-requirements.txt`.

**Note**: `psycopg2-binary` MUST remain a dev dependency because you can't install it on apline-linux. There is a layer in the Dockerfile that will install psycopg2 (not binary) for us.
