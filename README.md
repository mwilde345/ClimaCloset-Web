
Run the server and client in two different terminals. see https://stackoverflow.com/questions/42895585/hooking-up-express-js-with-angular-cli-in-dev-environment

start the server: Run `npm run express`. your app will be running at localhost:3000. using stuff from the front-end in the dist directory. this is what your teacher wants to see.

see server/server.js

ideally, ng build spits out the dist directory into the server directory.

start the client: Run `npm run start-dev`. your app will be running on port 4200 and will show your current front-end changes. Do this to update the UI and use the data from the server. When things look good, run `npm run build` and now the server.js app will show the updated UI. To make api calls to the server from the front-end, make the calls to the port the server is running on. in this case 3000.

only for dev environment: https://stackoverflow.com/questions/47608247/fetch-data-from-different-localhost-in-angular/47612832

also see https://stackoverflow.com/questions/39807666/different-ports-for-frontend-and-backend-how-to-make-a-request

https://github.com/angular/angular-cli/blob/master/docs/documentation/stories/proxy.md


you need a proxy to make api calls to localhost. Otherwise you would use a custom server endpoint and would fetch as normal.

example of putting an express app on the cloud, serverless: https://www.freecodecamp.org/news/express-js-and-aws-lambda-a-serverless-love-story-7c77ba0eaa35/

notice how app.listen will only run when testing locally. Otherwise we export the logic to run on lambda and don't do app.listen.

# Climacloset

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.12.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
