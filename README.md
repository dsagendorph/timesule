# Timesule Project CSC 478 C. 
Tile based 2D game
Authors: Denise S., Malka L., Samson K., Mariana H. 

### How do I get set up? ###

* Summary of set up
    * Install [nodejs](https://nodejs.org/en/) locally
    * `git clone https://samsonkoshy@bitbucket.org/samsonkoshy/timesule.git -b staging`
    * `cd timesule`
    * `sudo npm install` # this installs all packages in package.json
    
* contributing to the source code    
    * `git pull origin staging` # points to staging branch
    * `git branch <yourBranch>` # create a local branch that you are working on
    * `git checkout <yourBranch>` # points to your local branch now. 
    * make changs to <yourBranch>
    * `git push origin <yourBranch>` # creates your branch on the repo.    
    * `git commit -a` # commit your changes to your branch 
    * `git push origin <yourBranch>` # push your commits to <yourBranch> on the repo
    * When you are ready do a pull request to staging branch.
    
    
* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions
   * Under the timesule directory
   * `browserify timesuleMain.js > timesuleMainBundle.js  `
   * load inde.html from your browser

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines
