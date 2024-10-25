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
   
    Scenario: Sign-up with spacebar username
        Given I am on the sign-up page
        When I enter spacebar in username field
        And I enter a valid data in email, password, confirm password
        And I click on the "Sign Up" button
        Then I should not be able to sign up

    Scenario: Sign-up with null username
        Given I am on the sign-up page
        When I am not filling username field
        And I enter a valid data in email, password, confirm password
        And I click on the "Sign Up" button
        Then I should not be able to sign up

    Scenario: Sign-up with spacebar email
        Given I am on the sign-up page
        When I enter spacebar in email field
        And I enter a valid data in username, password, confirm password
        And I click on the "Sign Up" button
        Then I should not be able to sign up

    Scenario: Sign-up with null email
        Given I am on the sign-up page
        When I am not filling email field
        And I enter a valid data in username, password, confirm password
        And I click on the "Sign Up" button
        Then I should not be able to sign up

    Scenario: Sign-up with spacebar password
        Given I am on the sign-up page
        When I enter spacebar in password field
        And I enter a valid data in username, email, confirm password
        And I click on the "Sign Up" button
        Then I should not be able to sign up

    Scenario: Sign-up with null password
        Given I am on the sign-up page
        When I am not filling password field
        And I enter a valid data in username, email, confirm password
        And I click on the "Sign Up" button
        Then I should not be able to sign up

    Scenario: Sign-up with spacebar confirm password
        Given I am on the sign-up page
        When I enter spacebar in confirm password field
        And I enter a valid data in username, email, password
        And I click on the "Sign Up" button
        Then I should not be able to sign up

    Scenario: Sign-up with null confirm password
        Given I am on the sign-up page
        When I am not filling confirm password field
        And I enter a valid data in username, email, password
        And I click on the "Sign Up" button
        Then I should not be able to sign up

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

    Scenario: Verify password is masked by default
        Given I am on the sign-up page
        When I enter a password
        Then I should see masked password
        And When I click visibility icon
        Then I should see actual password

    Scenario: Verify confirm password is masked by default
        Given I am on the sign-up page
        When I enter a confirm password
        Then I should see masked password
        And When I click visibility icon
        Then I should see actual confirm password

    Scenario: Verify visibility icon toggle in password field
        Given I am on the sign-up page
        When I enter a password
        Then I should see masked password
        And When I click visibility icon
        Then I should see actual password
        And When I click visibility icon again
        Then I should see password masked

    Scenario: Verify visibility icon toggle in confirm password field
        Given I am on the sign-up page
        When I enter a confirm password
        Then I should see masked confirm password
        And When I click visibility icon
        Then I should see actual confirm password
        And When I click visibility icon again
        Then I should see confirm password masked

    Scenario: Edit match password to not match again using password field
        Given I am on the sign-up page
        When I will valid username and email
        And Password and Confirm password are matched
        Then Sign up button should not be disabled
        When I edit password to not matched with confirm password
        Then I should not be able to sign up

    Scenario: Edit match password to not match again using confirm password field
        Given I am on the sign-up page
        When I will valid username and email
        And Password and Confirm password are matched
        Then Sign up button should not be disabled
        When I edit confirm password to not matched with password
        Then I should not be able to sign up

    Scenario: Username contains special characters
        Given I am on the sign-up page 
        When I enter a username with special characters (e.g., user@name)
        And I enter valid data in email, password, and confirm password
        Then I should not be able to sign up

    Scenario: Password does not meet complexity requirements
        Given I am on the sign-up page
        When I enter a valid email address
        And I enter a password that does not meet complexity (e.g., less than 6 characters)
        And I confirm the password
        Then I should see an error message "Password must contain at least 6 characters, one uppercase letter, one lowercase letter, and one number"

    Scenario: Username exceeds maximum length
        Given I am on the sign-up page
        When I enter a username that exceeds the maximum length (e.g., 151 characters)
        And I enter valid data in email, password, and confirm password
        Then I should not be able to sign up
    
    Scenario: Email exceeds maximum length
        Given I am on the sign-up page
        When I enter an email that exceeds the maximum length (e.g., 254 characters)
        And I enter valid data in username, password, and confirm password
        Then I should not be able to sign up
    
    Scenario: User tries to sign up multiple times quickly
        Given I am on the sign-up page
        When I enter a valid username, email, and password
        And I attempt to sign up multiple times in quick succession
        Then I should see a message "Please wait before trying again" or similar

    Scenario: Check for XSS vulnerabilities in input fields
        Given I am on the sign-up page
        When I enter a script tag in the username field (e.g., <script>alert('XSS')</script>)
        And I enter valid data in email, password, and confirm password
        Then I should not be able to sign up and should see an error message

    Scenario: Sign-up button disabled during processing
        Given I am on the sign-up page
        When I enter valid data in all fields and click "Sign Up"
        Then the sign-up button should be disabled while processing the request

    



