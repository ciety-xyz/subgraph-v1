# Omnuum-v1 Subgraph

The Official Omnuum v1 subgraph

## Project Setup
```bash
npm install
```

## Manifest Generation
```bash
npm run prepare:mainnet
npm run prepare:rinkeby
```

## Generate codes for schema graphql
```bash
npm run codegen:mainnet
npm run codegen:rinkeby
```

## Compile WASM files
```bash
npm run build:mainnet
npm run build:rinkeby
```

## Create Event Selectors
```bash
npm run createEventSelector
```

## Deploy Subgraph (Hosted Service)
```bash
npm run deploy:hosting:mainnet
npm run deploy:hosting:rinkeby
npm run deploy:hosting:staging:rinkeby

```