// *****************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// *****************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login(email: string, password: string): void;
    setMinWindowWidth(size: number): void;
    setMinWindowHeight(size: number): void;
  }
}
//
// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  console.log('Custom command example: Login', email, password);
});

Cypress.Commands.add('setMinWindowWidth', size => {
  cy.window().then(win => {
    Object.defineProperty(win, 'innerWidth', {
      value: size,
    });
  });
});

Cypress.Commands.add('setMinWindowHeight', size => {
  cy.window().then(win => {
    Object.defineProperty(win, 'innerHeight', {
      value: size,
    });
  });
});
