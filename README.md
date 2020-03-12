# reQuest2 web frontend

## Development

Init: install node+npm, then run:
```
npm install
```

Run the dev server:
```
node_modules/webpack-dev-server/bin/webpack-dev-server.js
```
(By default, it runs on http://localhost:3000/ and connects to the API on http://localhost:9080/ as defined in `src/Api.js`. CORS needs to be enabled.)

Build the javascript (in `public/js`):
```
node_modules/webpack-cli/bin/cli.js
```
(also accepts `--help`)

## Deployment&production
(todo)
