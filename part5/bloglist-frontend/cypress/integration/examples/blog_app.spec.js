describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    cy.createUser({
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'peach'
    });
  });

  it('Login form is shown', function() {
    cy.contains('Login');
    cy.contains('username');
    cy.contains('password');
    cy.get('#login-button').contains('Log in');
  });

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mluukkai');
      cy.get('#password').type('peach');
      cy.get('#login-button').click();

      cy.contains('Matti Luukkainen logged in');
    });

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai');
      cy.get('#password').type('watermelon');
      cy.get('#login-button').click();

      cy.get('.message')
        .should('contain', 'Wrong username or password')
        .and('has.css', 'color', 'rgb(255, 0, 0)');
    });
  });

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'peach' });
    });

    it('a blog can be created', function() {
      cy.createBlog({
        title: 'React Patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com'
      });
      cy.get('html').should('contain', 'React Patterns');
    });

    it('a blog can be liked', function() {
      cy.createBlog({
        title: 'React Patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com'
      });
      cy.get('#show-hide').click();
      cy.get('#like').click();
      cy.get('html').should('contain', 'Likes: 1');
    });

    it('a blog can be deleted by the user who created it', function() {
      cy.createBlog({
        title: 'React Patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com'
      });
      cy.get('#show-hide').click();
      cy.get('#delete').click();
      cy.get('html').should('not.contain', 'React Patterns');
    });

    it('a blog cannot be deleted by a user who has not created it', function() {
      cy.createBlog({
        title: 'React Patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com'
      });
      // log out current user
      cy.get('#logout').click();
      // create new user
      cy.createUser({
        name: 'Arto Hellas',
        username: 'ahellas',
        password: 'banana'
      });
      // log in new user
      cy.login({ username: 'ahellas', password: 'banana' });
      // expand blog entry
      cy.get('#show-hide').click();
      // Delete button is not available
      cy.get('html').should('not.contain', '#delete');
    });
  });
});