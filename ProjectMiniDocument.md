## Project Mini Document

This document was made with the intention to elucidate good practices for software development base on this project and to explain some of the changes made in this project.

### Software Engineer - (My) Good practices

A software well made must follow this rules: 

#### 1. Must be documented

Not only the code must be well documented for a easy and fast understand of the project, but also the stack selected must be explaind.

Must include what are the minimal version, what the tech does and why it was selected.

This helps the stakeholders to keep a track on what decisions to do next on the project.

This kind of documents doesn't need to be extensive and full of minimal details (for real, use this type only if you are doing critical software or you are going to validade in something like CMMI).

What these simple type of document must do is: **Help the team to understand fast and keep a track on**.

#### 2. Must be tested

Test in one of the most important part on the software lifecycle, it allows to discover bugs and unwanted behaviors before production, not only that but also encourages the developer to follow guidelines that increases code quality and most important manutenability.

These are some of the tests a developer must do:

1. Unity test, to test functions individually.
2. Integration test, to test integration between interfaces, and to abstract critical components (Like an API for example).
3. Front-end test, to test user actions automatically.

#### 3. Defensive Programing

Defensive programing is the skill to create code able to fail as fast as possible.

This one encourages tests and proper code documentation as well of good code patterns.

The code must fail on the first sign that something is wrong, that way you can track the failure and fix it fast.

#### 4. Must use virtualization tools

This one is critical. The iso IEEE 12207, specifies that one of the quality attibutes a software must have (based on the architecture and their final goal) is **to me able to resist chages**.

Changes means not only code changes, but also architectural ones and the hability to be Installed and Removed with ease.

Virtualization tools, like docker and kubernets, solves this problem creating a consistent (and with almost no footprints) envirovment for test and most impotant deploy.

The idea behind this is simple: Instead of installing (or removing) a whole stack of different tools, why not to install a single one that encapsulates all of this with ease?

#### 5. CI-CD pipeline

This speeds up the development process a lot, but for it to work properly the previous steps must be applied.

You chage the software, and with a proper pipeline, your can automatically: 

```
Test with coverage -> Generate Logs -> Generate a version -> Deploy
```

A good example of tool for CI-CD is **Github Actions**.

### Testing Plan

This plan can be tracked to the Tests Cases on the code.

This plan uses **user story** as a way to detail the test.

#### [Login Component] The user must be able to Authenticate sucssessfully

This can be Tracked on the file "Login.test.jsx"

* I as user, must be able to autenticate on the game
    
    * I enter with my **username** and **password**
    * The System validates if my credentials are correct
        
        * The System returns a error message with status 400 and stay on the page if they are not correct [End of Test]

        * The System returns an personal ID and a jwt Token if they are correct

    * The System redirects to the game page [End of Test]

#### [Registry Component] The user must be able to Registrate sucssessfully

This can be Tracked on the file "Registry.test.jsx"

* I as user, must be able to registrate on the game
    
    * I enter with my **username** and **password**
    * The System validates if already exists some account with the same username

        * The System returns a error message with status 400 and stay on the page if the username is not unique [End of Test]

        * The System show that the account was created correctly

    * The System stays on the page [End of Test]

#### [Instructions Component] The user must be able to read the instructions of the game

This can be Tracked on the file "Instructions.test.jsx"

* I as user, must be able to read the game instructions
    
    * I must be autenticated previously

    * I select the "Instructions" button

    * The System display the game instructions on the screen [End of Test]

#### [Save Game Data] The system must be able to save the user round game data

This can be Tracked on the file "memoryController.test.js"

* I as System, must be able to save the player round game data
    
    * The User must be registered previously

    * The User send the round game data

        * If their data are not valid, I return a status 400 and an error message [End of Test]

    * I save the data on the database [End of Test]

        * If is not possible to save the data, I return a status 500 and an error message [End of Test]

#### [Retrieve Game Data History] The system must be able to retrieve the user history game data

This can be Tracked on the file "memoryController.test.js"

* I as System, must be able to retrieve the player history game data
    
    * The User must be registered previously

    * The User send their **userId** and **difficulty**

        * If their credential are not valid, I return a status 400 and an error message [End of Test]

    * I retrieve the data history from the database [End of Test]

        * If is not possible to retrieve the data, I return a status 500 and an error message [End of Test]

#### [Authenticate User] The system must authenticate the user

This can be Tracked on the file "userController.test.js"

* I as System, must be able to authenticate the user
    
    * The User send their **username** and **password**

        * If their credential are not valid, I return a status 400 and an error message [End of Test]

    * I retrieve the user authentication info from the database [End of Test]

        * If is not possible to retrieve the data, I return a status 500 and an error message [End of Test]

#### [Register new User] The system must regiter the a user

This can be Tracked on the file "userController.test.js"

* I as System, must be able to register a new user
    
    * The User send their **username** and **password**

        * If their credential are not valid, I return a status 400 and an error message [End of Test]

    * I validate their credencial from the database and return "ok" [End of Test]

        * If is not possible to retrieve the data, I return a status 500 and an error message [End of Test]