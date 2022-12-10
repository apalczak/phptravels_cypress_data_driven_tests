///<reference types="cypress"/>

const tests = require("../fixtures/user_login.json");

describe("User login", () => {
    beforeEach(() => {
        cy.visit("/login");
    });

    tests.forEach((test) => {
        it(test.description, () => {
            cy.typeLoginFormField(
                '//form[@id="loginfrm"]//input[@name="username"]',
                test.username
            ).should("have.attr", "required");

            if (test.password) {
                cy.typeLoginFormField(
                    '//form[@id="loginfrm"]//input[@name="password"]',
                    test.password
                )
                .should("have.attr", "required");
            }

            cy.xpath('//form[@id="loginfrm"]//button[text()="Login"]')
                .scrollIntoView()
                .click();

            if (test.shouldLogin) {
                cy.xpath('//div[@id="body-section"]//h3').should(
                    "contain",
                    test.expectedMessage
                );
            } else {
                cy.xpath('//div[@id="body-section"]//form/div[1]/div[2]/div')
                    .should("have.class", test.expectedAlertStyle)
                    .and("contain", test.expectedMessage);
            }
            cy.xpath('//nav//ul[@class="dropdown-menu"]').should(
                "contain",
                test.expectedDropdownOption
            );
        });
    });
});
