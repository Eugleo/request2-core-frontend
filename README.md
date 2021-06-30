# Request2 frontend

This is a part of a larger project of Request2. See https://github.com/Eugleo/request2-service for details.

## Development info

To run this as a standalone app, you first need to populate the directory with the form definitions. Preferably find one in the [main repository](https://github.com/Eugleo/request2-service) and copy it into this repository as `src/Request/RequestTypes`.

After that, you can start the dev environment as follows:

```
cp sample-env .env  # edit the location of the API server in this file
yarnpkg start
```

To build a static site for production, use `build`:

```
yarnpkg build
ls -R build/ #see the result
```
