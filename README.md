# TODO App

## Installation

### Pre-requisites

- [docker compose](https://docs.docker.com/compose/install/)

### Run

1. Pull images and deploy

```sh
docker compose up -d
```

2. Enter web frontend

```
http://localhost:3000
```

3. Enter user/pwd

```
user: admin
pwd: test1234
```

### API Docs

```sh
http://localhost:8000/docs
```

### Cleanup

```sh
docker compose down
```

## Assignments

You will find a set of feature files located in the features directory of this project.
Based on these feature files, complete the following tasks:
Task 1: Analyze the existing feature files and identify any missing scenarios.
Task 2: Write new feature files to cover untested or missing functionalities.
Task 3: Run the automated API tests and provide a summary of the results.
Task 4: Run the automated E2E tests and provide a summary of the results.
