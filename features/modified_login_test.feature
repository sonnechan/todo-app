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

    Scenario: Logout
        Given I am on the Todo List homepage
        When I click at User dropdown
        Then I should see Sign out button
        When I click Sign out button
        Then I should see Confirm Sign out popup
        #If I have modify todo list
        #After click sign out button it show "Save" button which is not making any sense
        #When I click "Save" button
        #Unsaved changes popup will be displayed
        #I have to click "Leave button in order to log out"
        When I click Leave button
        Then It should take me back to login page

    Scenario: Cancel Logout    
        Given I am on the Todo List homepage
        When I click at User dropdown
        Then I should see Sign out button
        When I click Sign out button
        Then I should see Confirm Sign out popup
        When I click "Cancel"
        Then Popup should be closed

    Scenario: Cancel Logout with X button   
        Given I am on the Todo List homepage
        When I click at User dropdown
        Then I should see Sign out button
        When I click Sign out button
        Then I should see Confirm Sign out popup
        When I click "X" button
        Then Popup should be closed

    Scenario: Lockout after multiple failed login attempts
        Given I am on the log-in page
        When I enter a valid email address
        And I enter an incorrect password
        And I click on the "Log in" button
        Then I should see an error message "Invalid password"
        When I repeat this process 5 times
        Then I should see an error message "Account locked due to multiple failed login attempts"
        And I should be unable to attempt another log-in
    #This test covers an important security feature 
    #to prevent brute-force attacks by locking the account after multiple failed attempts. 
    #It’s also helpful for validating the user experience and messaging when account lockouts occur.
