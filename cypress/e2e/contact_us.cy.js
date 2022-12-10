///<reference types="cypress"/>

const tests = require("../fixtures/contact_us.json");

describe("Contact Us form", () => {
    beforeEach(() => {
        cy.visit("/contact-us");
    });

    tests.forEach((test) => {
        it(test.description, () => {
            cy.xpath(
                '//div[@id="body-section"]//form//input[@name="contact_name"]'
            )
                .scrollIntoView()
                .clear()
                .type(test.name)
                .should("have.attr", "required");
            cy.xpath(
                '//div[@id="body-section"]//form//input[@name="contact_email"]'
            )
                .scrollIntoView()
                .clear()
                .type(test.email)
                .should("have.attr", "required");
            cy.xpath(
                '//div[@id="body-section"]//form//input[@name="contact_subject"]'
            )
                .scrollIntoView()
                .clear()
                .type(test.subject)
                .should("have.attr", "required");
            if (test.message) {
                cy.xpath(
                    '//div[@id="body-section"]//form//textarea[@name="contact_message"]'
                )
                    .scrollIntoView()
                    .clear()
                    .type(test.message);
            }
            cy.xpath(
                '//div[@id="message-contact"]/../..//*[@name="submit_contact"]'
            )
                .scrollIntoView()
                .click();
            cy.xpath('//div[@id="body-section"]//form/div[1]/div[1]')
                .should("have.class", test.expectedAlertStyle)
                .and("contain", test.expectedMessage);
        });
    });
});
