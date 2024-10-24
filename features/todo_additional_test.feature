Feature: Modify To-Do List Management Test
  As a user, I want to manage my to-do list so that I can keep track of my tasks.

  #Currently, there is no edit feature in the current application

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

#Field verification
  #Title max 120 to not get error
  #can put 255 characters at most in the field
  #Title max 255, no error, cannot type more
 #Function
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
    Then I should see an error message

  #Edit
  Scenario: Edit a task title in a to-do list
    Given I have a task "my task 1" in the to-do list
    When I edit the task "my task 1" to have the title "my updated task"
    Then I should see the task with the updated title "my updated task" in the to-do list

  #Update
  Scenario: Update a task description in a to-do list
    Given I have a task "my task 1" in the to-do list
    When I edit the task "my task 1" to have the description "my updated description#0123@!"
    Then I should see the task with the updated description "my updated description#0123@!" in the to-do list

  Scenario: Update a task description in a to-do list
    Given I have a task "my task 1" in the to-do list
    When I edit the task "my task 1" to have the description "my updated description#0123@!"
    Then I should see the task with the updated description "my updated description#0123@!" in the to-do list

    #Edit task sequence