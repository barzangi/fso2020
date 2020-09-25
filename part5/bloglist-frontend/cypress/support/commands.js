Cypress.Commands.add('createUser', ({ name, username, password }) => {
  const user = { name, username, password };
  cy.request('POST', 'http://localhost:3003/api/users', user);
  cy.visit('http://localhost:3000');
});

Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3003/api/login', {
    username, password
  }).then(({ body }) => {
    console.log('successfully logged in');
    localStorage.setItem('loggedBlogsUserApp', JSON.stringify(body));
    cy.visit('http://localhost:3000');
    // frontend login
    cy.get('#username').type(username);
    cy.get('#password').type(password);
    cy.get('#login-button').click();
  });
});

Cypress.Commands.add('createBlog', ({ title, author, url }) => {
  cy.request({
    url: 'http://localhost:3003/api/blogs',
    method: 'POST',
    body: { title, author, url },
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogsUserApp')).token}`
    }
  });
  cy.visit('http://localhost:3000');
});