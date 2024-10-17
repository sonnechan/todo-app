Feature: User Sign-Up
    As a new user
    I want to sign up for an account
    So that I can access the application

    Scenario: Successful sign-up
        Given I am on the sign-up page
        When I enter a valid email address
        And I enter a valid password
        And I confirm the password
        And I click on the "Sign Up" button
        Then I should see a message "Sign up successful"
        And I should be redirected to the home page

    Scenario: Sign-up with an already registered email
        Given I am on the sign-up page
        When I enter an email address that is already registered
        And I enter a valid password
        And I confirm the password
        And I click on the "Sign Up" button
        Then I should see an error message "Email already in use"

    Scenario: Sign-up with invalid email format
        Given I am on the sign-up page
        When I enter an invalid email format
        And I enter a valid password
        And I confirm the password
        And I click on the "Sign Up" button
        Then I should see an error message "Please enter a valid email address"

    Scenario: Password and confirm password do not match
        Given I am on the sign-up page
        When I enter a valid email address
        And I enter a password
        And I confirm a different password
        And I click on the "Sign Up" button
        Then I should see an error message "Passwords do not match"
