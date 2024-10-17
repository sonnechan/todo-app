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

1. **Task 1:** Analyze the existing feature files and identify any missing scenarios.
2. **Task 2:** Write new feature files to cover untested or missing functionalities.
3. **Task 3:** Prepare and execute the automated API tests and provide a summary of the results.
4. **Task 4:** Prepare and execute the automated E2E tests and provide a summary of the results.
5. **Task 5:** (Optional): Propose and setup CI integration

## Grading Criteria

- **25%:** Completeness and clarity in analyzing and identifying missing scenarios.
- **25%:** Quality and correctness of the newly written feature files.
- **30%:** Proper implementation of step definitions and their accuracy in automating the scenarios.
- **15%:** Correct execution and reporting of test results.
- **5%:** Successful CI integration.
