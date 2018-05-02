# Automatic Linting & Code Styling

Keeping code convention helps to focus on code changes but can become tedious job if done manually. 


## Eslint

Eslint is an excellent tool that can integrate into popular integrated development environments and can be run from command line or as part of a test automation script. Our project has been updated with the necessary files to run eslint to support current codebase requirements (legacy es5 syntax and dojo framework). These files include eslintrc.json and .eslintigore and the npm packages (package.json). Two scripts were added to package.json for incorporation into a test automation script as follows:

``npm run test:eslint``	tests the entire codebase

``Npm run eslint:fix``	fixes the entire codebase (but not all linter problems can be automatically fixed)
<br><br>
If not using a testing script, the developer can simply install eslint globally and run it as follows

``npm install -g eslint@latest``

``eslint <filename>``		tests a particular file

``Eslint --fix <filename>``	fixes a particular file (but not all linter problems can be automatically fixed)
<br><br>
*Note HTML hint is also added to our package.json for use with your prefered editor.*

The following links provide more information about these helpful linting tools:

[https://www.npmjs.com/package/eslint-config-airbnb-base#eslint-config-airbnb-baselegacy](https://www.npmjs.com/package/eslint-config-airbnb-base#eslint-config-airbnb-baselegacy)

[https://eslint.org/docs/rules/indent](https://eslint.org/docs/rules/indent)

[https://www.npmjs.com/package/htmlhint](https://www.npmjs.com/package/htmlhint)
