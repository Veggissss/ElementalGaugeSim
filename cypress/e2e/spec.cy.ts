/// <reference types="cypress" />

describe('gauge unit simulator test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  })

  it('should have a title', () => {
    cy.get('h1').should('have.text', 'Elemental Gauge Simulator');
  })

  it('should add elements and check their presence', () => {
    cy.get('#element-auras').should('be.empty');
    cy.get('#element-reactions').should('be.empty');

    // Add pyro aura
    cy.get('#add-pyro-btn').click();

    // Aura should be added
    cy.get('#element-auras').children().should('have.length', 1);

    // Check that both elements are present    
    cy.get('#add-hydro-btn').click();

    // Pyro and hydro aura reacted and vaporized
    cy.get('#element-auras').children().should('have.length', 0);
    cy.get('#element-reactions').children().should('have.length', 1);
  });

  it('should change element button gauge units text using slider', () => {
    // Set initial button text
    cy.get('#add-pyro-btn').should('have.text', 'Pyro 1.0U');

    // Move the slider to change the button text
    cy.get('#element-unit-slider').click();

    // Verify that the button text has changed
    cy.get('#add-pyro-btn').should('have.text', 'Pyro 4.0U');
  });

  it('should change time slider and see btn text update', () => {
    // Set initial button text
    cy.get('#time-btn').should('have.text', 'Time Step 1.0 seconds');

    // Move the time slider to change the button text
    cy.get('#time-slider').click();

    // Verify that the button text has changed
    cy.get('#time-btn').should('have.text', 'Time Step 4.0 seconds');
  });

  it('should remove all auras when clicking the remove auras button', () => {
    // Add pyro aura
    cy.get('#add-pyro-btn').click();

    // Verify that both auras are added
    cy.get('#element-auras').children().should('have.length', 1);

    // Click the remove auras button
    cy.get('#remove-auras-btn').click();

    // Verify that all auras are removed
    cy.get('#element-auras').children().should('have.length', 0);
  });
})