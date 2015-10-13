# Contributors Guide

We are in Gitter and Slack every day, come join us

[![Gitter](https://badges.gitter.im/anvilresearch/connect.svg)](https://gitter.im/anvilresearch/connect) or 
[![Slack](http://slackin.anvil.io/badge.svg)](http://slackin.anvil.io/) 

## Working Together to Create Great Code

### What We Value
Our work affects not only our direct users, but their users as well. To some extent, our code impacts users across multiple functions in their organization. As contributors we need to take responsibility to ensure our impact is positive. 

### A desire for accessibilty
We're willing go to great pains to ensure the accessibility of our code to users and other contributors. A healthy codebase is easy to contribute to, because it's easy to understand. It lends itself to debugging, invites reading, and simplifies auditing.

## Ready to jump in?
Anvil Connect is a highly collaborative project. We welcome all questions and input, regardless of your area of interest. Here's our thoughts on contribution:

- Make it readable
- Be explicit before you are clever 
- Engineering = quality  
- Interoperability is key - play well with others      
- Be agile, flexible and consistent
      

## Submitting your code: Issues and Pull Requests

### Issue contributions
You are welcome to open issues relating directly to the development of Anvil Connect. Discussion of docs and philosophical chat should be posted to [Anvil Research Connect Docs] (https://github.com/anvilresearch/connect-docs).

#### For main project contributions: 

- Check open issues before you open a new one to avoid duplicate work
- When you're working on something, if it's not a substantial addition, file an issue and let us know

### Code Contributions
We welcome code contributions and participation in bug fixes and issues.
 
- New features
  - check first to make sure you aren't duplicating work
  - before you submit we'll have a code review hangout
  - consider pairing with a core team member  

- All contributions
  - Make small commits and pull requests
  - Separate features and improvements
  - Verify that dependencies are listed in manifest
  - Features must include test coverage and code review to be accepted

#### Style guidelines
##### Javascript
We follow [Javascript Standard Style](https://github.com/feross/standard#rules).

##### Other
- **Indents are 2 spaces; no tab characters** (unless required by the language).  
  <table>
  <tr><th>Not OK</th><th>OK</th></tr>
  <tr><td><pre lang="html">
&lt;html&gt;
&nbsp;   &lt;head&gt;&lt;/head&gt;
&nbsp;   &lt;body&gt;
&nbsp;       &lt;div&gt;Hello world&lt;/div&gt;
&nbsp;   &lt;/body&gt;
&lt;/html&gt;
</pre></td>
  <td><pre lang="html">
&lt;html&gt;
&nbsp; &lt;head&gt;&lt;/head&gt;
&nbsp; &lt;body&gt;
&nbsp;   &lt;div&gt;Hello world&lt;/div&gt;
&nbsp; &lt;/body&gt;
&lt;/html&gt;
</pre></td></tr>
  </table>


- **Non-binary files must end with a new-line character.**  
  <table>
  <tr><th>Not OK</th><th>OK</th></tr>
  <tr><td><img src="https://cloud.githubusercontent.com/assets/9868643/10029550/5f7d2a8e-6127-11e5-85bd-e59e6a048f2a.png" alt="Missing new-line character" width="200"></td>
  <td><img src="https://cloud.githubusercontent.com/assets/9868643/10029556/6750fbfa-6127-11e5-8283-85124cc119dd.png" alt="New-line character" width="200"></td></tr>
  </table>


- **No trailing whitespace** (unless required by the language).  
  <table>
  <tr><th>Not OK</th><th>OK</th></tr>
  <tr><td><img src="https://cloud.githubusercontent.com/assets/9868643/10030416/6ead5010-612c-11e5-9093-f96e32ca53af.png" alt="Trailing whitespace" width="225"></td>
  <td><img src="https://cloud.githubusercontent.com/assets/9868643/10030415/6dad6470-612c-11e5-89a7-607fe49620f4.png" alt="No trailing whitespace" width="225"></td></tr>
  </table>

- **Avoid excess whitespace around code.**  
  <table>
  <tr><th>Not OK</th><th>OK</th></tr>
  <tr><td><code>identifier( param, &nbsp; &nbsp; &nbsp; param )</code></td>
  <td><code>identifier(param, param)</code></td></tr>
  <tr><td><pre lang="yaml">
prop:    value
prop1:   value
prop1a:  value
</pre></td>
  <td><pre lang="yaml">
prop: value
prop1: value
prop1a: value
</pre></td></tr>
  </table>
- **No more than one empty line at a time.**  
  <table>
  <tr><th>Not OK</th><th>OK</th></tr>
<tr><td>
  <pre lang="css">
  /* Special Classes */
  .fancy { ... }
  .jumbotron { ... }
  
  
  /* Other Classes */
  .floaty-boaty { ... }
  </pre>
</td>
<td>
  <pre lang="css">
  /* Special Classes */
  .fancy { ... }
  .jumbotron { ... }
  
  /* Other Classes */
  .floaty-boaty { ... }
  </pre>
</td></tr>
  </table>

### How to submit new code:

#### Fork
- Fork the project [on Github](https://github.com/anvilresearch) and check out your copy locally.
  - For new features and bug fixes, use the master branch.
	
#### Branch
- Create a branch and hack away!
	
#### Commit
- When you commit make sure you include your name and address.

    ```
    $ git config --global user.name "I. CanCode"
    $ git config --global user.email "icancode@example.com"
    ```
- Be sure and include a commit log, including a title and relevant changes.

#### Vet
- We use [Javascript Standard Style] (https://github.com/feross/standard) to keep the code standardized

#### Push
- Select your feature branch. Click the 'Pull Request' button and fill out the form.

- Pull requests are usually reviewed right away. 
  - If there are comments to address, apply your changes in a separate commit and push that to your branch. 
  - Post a comment in the pull request afterwards; GitHub does not send out notifications when you add commits.
