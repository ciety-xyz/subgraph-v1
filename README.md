# Omnuum-v1 Subgraph

The Official Omnuum v1 subgraph

## Project Setup
```bash
npm install
```

## Manifest Generation
```bash
npm run prepare:mainnet
npm run prepare:goerli
```

## Generate codes for schema graphql
```bash
npm run codegen:mainnet
npm run codegen:goerli
```

## Compile WASM files
```bash
npm run build:mainnet
npm run build:goerli
```

## Create Event Selectors
```bash
npm run createEventSelector
```

## Deploy Subgraph (Hosted Service)
```bash
npm run deploy:hosting:mainnet
npm run deploy:hosting:goerli
npm run deploy:hosting:staging:goerli

```