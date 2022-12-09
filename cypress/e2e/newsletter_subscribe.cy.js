const tests = require("../fixtures/newsletter_subscribe.json");

describe("Newsletter subscribe", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    tests.forEach((test) => {
        it(test.description, () => {
            let emailAddress = test.emailAddress;
            if (test.randomizeAddress) {
                const substring = (Math.random() + 1).toString(36).substring(7);
                emailAddress = emailAddress.replace("@", `${substring}@`);
            }
            cy.get("#exampleInputEmail1")
                .scrollIntoView()
                .clear()
                .type(emailAddress);
            cy.xpath('//footer//button[text()=" Subscribe"]')
                .scrollIntoView()
                .click();
            cy.xpath('//footer//div[@class="subscriberesponse"]').should(
                "have.text",
                test.expectedMessage
            );
        });
    });
});
