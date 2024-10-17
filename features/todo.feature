Feature: To-Do List Management
    As a user, I want to manage my to-do list so that I can keep track of my tasks.

    Scenario: Add a new task to the to-do list
        Given I am on the home page
        When I add a new task with the my title
        Then I should see the task in the to-do list

    Scenario: Mark a task as completed
        Given I have a task "my task 1" in the to-do list
        When I mark the task "my task 1" as completed
        Then the status of the task "my task 1" should be "Completed"

    Scenario: Delete a task from the to-do list
        Given I have a task "my task 1" in the to-do list
        When I delete the task "my task 1"
        Then I should not see the task "my task 1" in the to-do list

    Scenario: Prevent adding a task without a title
        Given I am on the home page
        When I try to add a task without a title
        Then I should see an error message
