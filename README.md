# Elemental Gauge Simulator (EGS)
Simulates how the different elements from Genshin react based on [Elemental Gauge Theory](https://library.keqingmains.com/combat-mechanics/elemental-effects/elemental-gauge-theory).

## Hosted website
The simulator is hosted on GitHub Pages. You can access it [here](https://veggissss.github.io/ElementalGaugeSim/).

## Running locally
To get started, follow these steps:

1. Run the development server:
    ```bash
    npm run dev
    ```

2. Open your browser and go to [http://localhost:3000](http://localhost:3000).

## Simulator
The simulator, located in `src/simulator`, was initially developed using [Jest](https://jestjs.io/) for testing. 
Later, the React website was built on top of it and uses [Cypress](https://www.cypress.io/) for E2E testing.

[![Jest Node.js](https://github.com/Veggissss/ElementalGaugeSim/actions/workflows/nodejs.yml/badge.svg)](https://github.com/Veggissss/ElementalGaugeSim/actions/workflows/nodejs.yml)
[![Cypress End-to-end tests](https://github.com/Veggissss/ElementalGaugeSim/actions/workflows/cypress-e2e.yml/badge.svg)](https://github.com/Veggissss/ElementalGaugeSim/actions/workflows/cypress-e2e.yml)
