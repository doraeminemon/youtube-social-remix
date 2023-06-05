import { faker } from "@faker-js/faker";

describe("smoke tests", () => {
  it("should allow you to register and login", () => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
    };
    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visitAndCheck("/");
    cy.findByRole("link", { name: /sign up/i }).click();

    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /create account/i }).click();

    cy.findByRole("link", { name: /videos/i }).click();

    const testNote = {
      title: faker.lorem.words(1),
      link: faker.lorem.sentences(1),
    };
    // cy.visitAndCheck("/videos");

    cy.findByRole("link", { name: /videos/i }).click();
    cy.findByText("No videos yet");

    cy.findByRole("link", { name: /Share a new video/i }).click();

    cy.findByRole("textbox", { name: /title/i }).type(testNote.title);
    cy.findByRole("textbox", { name: /link/i }).type(testNote.link);
    cy.findByRole("button", { name: /share/i }).click();

    cy.get("h1").should('contain.text', testNote.title);
  });
});
