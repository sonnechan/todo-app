Feature: Modify To-Do List Management Test
  As a user, I want to manage my to-do list so that I can keep track of my tasks.

  #Currently, there is no edit feature in the current application
  #And I cannot verify any description in UI level

  #Add
  Scenario: Add a new task to the to-do list without description
    Given I am on the home page
    When I add a new task with the title
    Then I should see the task in the to-do list

  Scenario: Add a new task to the to-do list with description
    Given I am on the home page
    When I add a new task with the title with description
    Then I should see the task with correct title in the to-do list
    When I click at the added task
    Then I should see the correct task description

  Scenario: Title cannot be more than 120 characters
    Given I am on the homepage
    When I try to add a new task with the title with 121 characters
    Then I should see error popup "Request failed with status code 400"

  Scenario: Description cannot be more than 255 characters  
    Given I am on the homepage
    When I try to add a new task with description with 256 characters
    Then I should not be able to type the 256th character

  Scenario: Mark a task as completed
    Given I have a task "my task 1" in the to-do list
    When I mark the task "my task 1" as completed
    Then the status of the task "my task 1" should be "Completed"

  Scenario: Unchecked the completed task
    Given the status of the task "my task 1" is "Completed"
    When I uncheck the checkbox
    Then the status of the task "my task 1" should be "Incompleted"

  #Delete
  Scenario: Delete a task from the to-do list
    Given I have a task "my task 1" in the to-do list
    When I delete the task "my task 1"
    Then I should not see the task "my task 1" in the to-do list

  #Negative
  Scenario: Adding a task title with the spacebar
    Given I am on the home page
    When I tap space bar in title and save
    Then I should see an error message "Request failed with status code 400"

  #Edit
  Scenario: Edit a task title in a to-do list
    Given I have a task "my task 1" in the to-do list
    When I edit the task "my task 1" to have the title "my updated task"
    Then I should see the task with the updated title "my updated task" in the to-do list
  
  Scenario: Edit a task title into invalid title
    Given I have a task "my task 1" in the to-do list
    When I edit the task "my task 1" to have the title ""
    Then I should not be able to edit title

  #Update
  Scenario: Update a task description in a to-do list
    Given I have a task "my task 1" in the to-do list
    When I edit the task "my task 1" to have the description "my updated description#0123@!"
    Then I should see the task with the updated description "my updated description#0123@!" in the to-do list

  Scenario: Update a task description in a to-do list
    Given I have a task "my task 1" in the to-do list
    When I edit the task "my task 1" to have the description "my updated description#0123@!"
    Then I should see the task with the updated description "my updated description#0123@!" in the to-do list

  Scenario: Update a task description in a to-do list in to null
    Given I have a task "my task 1" in the to-do list
    When I edit the task "my task 1" to have the description ""
    Then I should see the task with the updated description "" in the to-do list
    
    #Cannot Edit task sequence