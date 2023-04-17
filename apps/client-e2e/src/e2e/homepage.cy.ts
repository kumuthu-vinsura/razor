describe('Razor: client homepage', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.viewport(1920, 1080);
  });

  it('should load the home page', () => {
    cy.contains('Home');
  });

  it('should load the all the assests on the home page', () => {
    cy.get('img').then($img => {
      const imgSrc = $img.attr('src');
      expect(imgSrc).to.equal('http://localhost:4207/logo.png');
    });

    cy.get('input[type="text"]').should('have.length', 2);
    cy.get('input[type="text"]')
      .first()
      .should('have.attr', 'placeholder', 'Your Handle');
    cy.get('input[type="text"]')
      .eq(1)
      .should('have.attr', 'placeholder', '#ROOM_ID');

    cy.contains('span', 'Create').parents('button');
    cy.contains('span', 'Join a room').parents('button');

    //continue the implementation of the test to test the presence of the information panel
  });

  it.skip('should focused on the handle input when the user pressed any key', () => {
    cy.get('input[type="text"]').first().should('not.be.focused');

    cy.document().then(doc => {
      const event = new KeyboardEvent('keydown', { key: 'a' });
      doc.dispatchEvent(event);
    });
    cy.focused().should('have.attr', 'placeholder', 'Your Handle');
  });

  it('should focused on the handle input when the user clicked on the input', () => {
    cy.get('input[type="text"]').first().should('not.be.focused');
    cy.get('input[type="text"]').first().click();
    cy.focused().should('have.attr', 'placeholder', 'Your Handle');
  });

  it.skip('should focused on the room id input when the user clicked on the input', () => {
    cy.get('input[type="text"]').eq(1).should('not.be.focused');
    cy.get('input[type="text"]').eq(1).click();
    cy.focused().should('have.attr', 'placeholder', '#ROOM_ID');
    cy.get('input[type="text"]').eq(1).type('123');
  });

  it('should accepts the handle inputs that match with the ^[a-zA-Z0-9]+$ regex', () => {
    cy.get('input[type="text"]').first().should('not.be.focused');
    cy.get('input[type="text"]').first().click();
    cy.focused().should('have.attr', 'placeholder', 'Your Handle');
    cy.get('input[type="text"]').first().type('theEagle410');
    cy.get('input[type="text"]').first().should('have.value', 'theEagle410');
  });

  it('should not accepts the handle inputs that not match the ^[a-zA-Z0-9]+$ regex', () => {
    cy.get('input[type="text"]').first().should('not.be.focused');
    cy.get('input[type="text"]').first().click();
    cy.focused().should('have.attr', 'placeholder', 'Your Handle');
    cy.get('input[type="text"]').first().type('the_eagle410');

    //implement the test accrding to the scenario that the platform should not accept the name that doesn't match the regex
  });

  it('should only accepts the names with 2 to 16 characters', () => {
    cy.get('input[type="text"]').first().type('E');
    //implement the test with the scenario that the platform should not accept the name with 1 character
    cy.get('input[type="text"]').first().clear();

    cy.get('input[type="text"]').first().type('tE');
    cy.get('input[type="text"]').first().should('have.value', 'tE');
    cy.get('input[type="text"]').first().clear();

    cy.get('input[type="text"]').first().type('theEagleExceeds1');
    cy.get('input[type="text"]')
      .first()
      .should('have.value', 'theEagleExceeds1');
    cy.get('input[type="text"]').first().clear();

    cy.get('input[type="text"]').first().type('theEagleExceeds16');
    cy.get('input[type="text"]')
      .first()
      .should('have.value', 'theEagleExceeds1');
    cy.get('input[type="text"]').first().clear();
  });

  it('should scrollPanel scrollable when user hover on the scrollPanel', () => {
    cy.get('#scrollPanel').should('have.class', 'overflow-y-hidden');
    cy.contains('div', 'Show Panel').click();
    cy.get('#scrollPanel').should('have.class', 'overflow-y-auto');
    cy.get('#scrollPanel').trigger('mouseover');
    cy.get('#scrollPanel').scrollTo('bottom');
    cy.get('#scrollPanel').scrollTo('top');
    cy.get('#scrollPanel').scrollTo(50, 50);
  });

  it('should allow resizing to a minimum size', () => {
    cy.setMinWindowHeight(1366);
    cy.setMinWindowWidth(768);
    cy.viewport(600, 350);
  });
});
