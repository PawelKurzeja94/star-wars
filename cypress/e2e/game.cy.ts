describe('Game component', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/people/*', { fixture: 'person.json' }).as('getPerson');
    cy.intercept('GET', '**/api/starships/*', { fixture: 'starship.json' }).as('getStarship');
    cy.visit('/game');
  });
  beforeEach(() => {
    cy.visit('/');
  });

  it('has the correct title', () => {
    cy.title().should('equal', 'StarWars');
  });

  it('should start a new game round with people and display results', () => {
    cy.contains('Get people').click();

    cy.wait('@getPerson');

    cy.get('mat-spinner').should('not.exist');

    cy.get('.player-card').first().contains('Name: Luke Skywalker');
    cy.get('.player-card').last().contains('Name: Luke Skywalker');
  });

  it('should start a new game round with starships and display results', () => {
    cy.contains('Get starships').click();

    cy.wait('@getStarship');
    cy.get('mat-spinner').should('not.exist');

    cy.get('.player-card').first().contains('Name: Millennium Falcon');
    cy.get('.player-card').last().contains('Name: Millennium Falcon');
  });
});
