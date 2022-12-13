///<reference types="cypress"/>

const tests = require("../fixtures/user_profile.json");

describe("User profile", () => {
    beforeEach(() => {
        cy.visit("/login");
        cy.typeLoginFormField(
            '//form[@id="loginfrm"]//input[@name="username"]',
            "user@phptravels.com"
        );
        cy.typeLoginFormField(
            '//form[@id="loginfrm"]//input[@name="password"]',
            "demouser"
        );
        cy.xpath('//form[@id="loginfrm"]//button[text()="Login"]')
            .scrollIntoView()
            .click();
        cy.get("#body-section ul li a")
            .eq(1)
            .invoke("removeAttr", "onclick")
            .click();
    });

    afterEach(() => {
        cy.fixture("reset_user_profile").then((resetData) => {
            resetData.inputFields.forEach((field) => {
                cy.xpath(
                    `//form[@id="profilefrm"]//input[@name="${field.name}"]`
                ).clear();
                if (field.previousValue) {
                    cy.xpath(
                        `//form[@id="profilefrm"]//input[@name="${field.name}"]`
                    ).type(field.previousValue, { delay: 0 });
                }
            });
            resetData.dropdowns.forEach((dropdown) => {
                cy.xpath(
                    `//form[@id="profilefrm"]//select[@name="${dropdown.name}"]`
                ).select(dropdown.previousValue);
            });
        });
        cy.xpath(`//form[@id="profilefrm"]//button[text()=" Submit "]`)
            .scrollIntoView()
            .click();
    });

    tests.forEach((test) => {
        it(test.name, () => {
            test.fields.forEach((field) => {
                cy.xpath(
                    `//form[@id="profilefrm"]//input[@name="${field.name}"]`
                ).clear();
                if (field.newValue) {
                    cy.xpath(
                        `//form[@id="profilefrm"]//input[@name="${field.name}"]`
                    ).type(field.newValue);
                }
            });
            test.dropdowns.forEach((dropdown) => {
                cy.xpath(
                    `//form[@id="profilefrm"]//select[@name="${dropdown.name}"]`
                ).select(dropdown.newValue);
            });
            cy.xpath(`//form[@id="profilefrm"]//button[text()=" Submit "]`)
                .scrollIntoView()
                .click();
            cy.get("#profile")
                .find(".alert")
                .should("have.text", test.expectedMessage)
                .and(
                    "have.class",
                    `${test.negativeCase ? "alert-danger" : "alert-success"}`
                );

            cy.reload();
            cy.get("#body-section ul li a")
                .eq(1)
                .invoke("removeAttr", "onclick")
                .click();
            test.fields.forEach((field) => {
                if (field.passwordField == true) return;
                cy.xpath(
                    `//form[@id="profilefrm"]//input[@name="${field.name}"]`
                ).should(
                    `${test.negativeCase ? "not." : ""}have.value`,
                    field.newValue
                );
            });
            test.dropdowns.forEach((dropdown) => {
                cy.get(
                    `#profilefrm select[name="${dropdown.name}"] option:selected`
                ).should("have.text", dropdown.newValue);
            });
        });
    });
});
