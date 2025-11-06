# OAuth NgRx Demo

This project was started in order to demonstrate (as part of another project) a minimal way to implement [Microsoft OAuth with MSAL](https://www.npmjs.com/package/@azure/msal-angular) authentication in combination with [NgRx state management](https://ngrx.io/).

The purpose of state management is to isolate the authentication mechanism and storage of authentication detail from the application logic and to avoid repetion of code associated with login, logout, checking authentication status and using profile information (obtained from `Microsoft Graph`).

Additional effort was made to cover the state management, services and components with unit tests.

🌟 Credit must be given to [odelattregh](https://github.com/odelattregh/msal-angular20-standalone-demo) - much of the 'AuthService' uses code from that demo, with slight adaptations.

## Set up

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.3.

After cloning or downloading the code, install dependencies:

```bash
npm install
```

## Running the demo

Open `environment.dev.ts` and replace 'YOUR CLIENT ID HERE' and 'TENANT ID HERE' with the appropriate values obtained from your Azure App Registration.

You do not have to do this in order to run the unit tests, but it is necessary if you want to run the web app.

You can also change the authentication behaviour using the `usePopupAuthentication` flag in `environment`: setting it to _true_ will mean the login and logout dialogues will open in a popup window.  Leaving it as _false_ will use redirection for login and logout.

### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.


### Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```
Or install the [Karma Test Explorer](https://github.com/lucono/karma-test-explorer/blob/master/docs/documentation.md#documentation---karma-test-explorer) in Visual Studio Code.
