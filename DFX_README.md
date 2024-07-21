# Gummy DFX Guide
This project has integrated the Internet Computer's development framework. This guide will help you get started.

## Prerequisites
- [Install DFX](https://sdk.dfinity.org/docs/quickstart/local-quickstart.html). Please keep in mind the dfx cli currently only runs on Linux and Apple based PCs.

## Quick Start
From the project root:

 1. [Follow this guide](https://kyle-peacock.com/blog/dfinity/your-first-canister)
	 - The `canister_id.json` file you need to modify is in the project root. Please update the "motoko" and "www" "ic" properties.
	 - Please do not attempt to deploy until you have executed `npm run init:dfx`.
 2. Execute `npm run init:dfx`.
 3. Execute `npm run deploy:dfx` to deploy the project to your IC canisters.

## NPM Commands

Commands run from the project root

|         `npm run`       |Description                         
|----------------|-------------------------------
|`init:dfx`| Initial bootstrap of the IC.         
|`deploy:dfx`         |Deploy to IC           
|`restart:dfx`         |Restarts the local canister execution environment and web server processes. You can use this to Start the services as well.
|`restart:clean:dfx`|Starts the local canister execution environment and web server processes in a clean state by removing checkpoints from your project cache. You can use this flag to set your project cache to a new state when troubleshooting or debugging.|
|`generate:dfx`| Generate canister type declarations for supported programming languages. This will generate the `src/declarations` folder and remove Typescript conflicts. These generated js files allow you to consume the motoko language service on the front end. i.e `const  ic_service = require('src/declarations/motoko').motoko;`
|`resolve:dfx`| Remove Typescript conflicts.


## Considerations
- The npm `build` command is used by the IC build process. Using it may have conflicts.
- The npm `prebuild` and `prestart` are used by the IC service, respectively.