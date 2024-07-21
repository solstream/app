This project was generated with [Angular CLI](https://github.com/angular/angular-cli)

## Development server

Run `npm run start:dev` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Development server with production config

Run `npm run start:gtvprod` for a dev server with the production config, see environments/environment.gtvprod.ts. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng g c component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Versioning

We are following normal semantics for versioning.


MAJOR.MINOR.PATCH

*MAJOR*

A change can be termed as MAJOR if it is :

- A breaking change, not a backward compatible change

- major uplift in the design or angular versions


Before raising the Pull Request run the script
npm run release:major

This will create a changelog and update the major version of the app


*MINOR*

A change can be termed as MINOR if it is :

- a new feature

- a backward compatible change


Before raising the Pull Request run the script
npm run release:minor

This will create a changelog and update the minor version of the app


*PATCH*

A change can be termed as PATCH if it is :

- a text change

- a hotfix

- styling fix

- code quality fixes

- anything that can be termed as a fix or improvement


Before raising the Pull Request run the script
npm run release:patch

This will create a changelog and update the patch version of the app

## Code Commit Messages Semantics

Code Commits should be followed by a meaningful description. Use the below format for
commit messages:


type(category): description

<type> can be one of following:
- breaking: Any breaking change like angular upgrade. This type should only be used for a major release.
- docs: If you are simply committing a documentation update
- feat: Commiting a feature. Most commonly used. Used with release:minor
- fix: Bugfixes or hotfixes. Mostly used with release:patch
- revert: Code reverts
- style: only Styling fixes
- test: Unit test or end to end test updates

<category> = User story number or incident number

<description> = Free text message


Below are few examples


git commit -am "breaking: Upgraded Angular version from ng9 to ng11"

git commit -am "docs: Updated the README with code commit semantics"

git commit -am "feat: Added Changelog to the project"

git commit -am "fix: Added Changelog to the project"

git commit -am "revert: Reverted the file download changes for documents"

git commit -am "style: Styling fixes for bot"

git commit -am "test: Added unit test for more coverage"

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

useful for changing size streaming
.chart-container {
height: 100%;
width: 30%; // useful for closing chat
}
.channel-container {
height: 100%;
width: 15rem; // useful for closing chat
}

node version 14.17.0

npm install -g npm@6.14.13
# stream
# stream # Creates or appends to the README.md file
