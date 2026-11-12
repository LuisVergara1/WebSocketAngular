# WebSocketAngular

This frontend uses Angular and Angular CLI 22.2.6. Use Node.js 22.22.3 or later on the 22.x line, 24.15.0 or later on the 24.x line, or Node.js 26.x. Install the locked dependencies with `npm ci`.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to build the project. Deploy the contents of `dist/web-socket-angular/browser`.

## Running unit tests

Run `npm test -- --watch=false --browsers=ChromeHeadless` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Dependency checks

Run `npm audit` for the full dependency tree and `npm audit --omit=dev` for production dependencies. The Angular 22 migration resolved the previous `websocket-driver` advisory by locking version 0.7.5.

The production build still reports that `sockjs-client` is CommonJS, which limits bundle optimization. SockJS is retained for compatibility with the backend transport. The chat component stylesheet also exceeds its 2 kB warning budget by 43 bytes. Both diagnostics are build warnings.
