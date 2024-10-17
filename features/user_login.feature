Feature: User Log-In
    As a registered user
    I want to Log in to my account
    So that I can access the application

    Scenario: Successful log-in
        Given I am on the log-in page
        When I enter a valid email address
        And I enter the correct password
        And I click on the "Log in" button
        Then I should be redirected to the home page

    Scenario: log-in with an incorrect password
        Given I am on the log-in page
        When I enter a valid email address
        And I enter an incorrect password
        And I click on the "Log in" button
        Then I should see an error message "Invalid password"

    Scenario: log-in with a non-registered email
        Given I am on the log-in page
        When I enter a non-registered email address
        And I enter a password
        And I click on the "Log in" button
        Then I should see an error message "Email not found"

    Scenario: log-in with an empty email field
        Given I am on the log-in page
        When I leave the email field empty
        And I enter a password
        And I click on the "Log in" button
        Then I should see an error message "Email is required"

    Scenario: log-in with an empty password field
        Given I am on the log-in page
        When I enter a valid email address
        And I leave the password field empty
        And I click on the "Log in" button
        Then I should see an error message "Password is required"
