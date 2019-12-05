<h1>COMP1930 - SubscriptionTracker</h1>
SubcriptionTracker is a web application that allows users to track their subscription usage using a manual timer.
The application stores the usage logs in the database, and displays them in chronological order for the user to view.
Users can also set a limit for a subscription to track how much of their budget they've used.

<h2>Features</h2>
<ul>
  <li>Timer - Allows users to log their usage</li>
  <li>Limit - Allows users to set a limit to view how much of their budget they've used</li>
  <li>Usage logs - Shows the user their historical usage</li>
</ul>

<h2>Tips</h2>
<ul>
  <li>Deleting subscriptions will erase all existing data</li>
  <li>Star subscriptions to access the timer feature</li>
  <li>Clicking on the header image will take you back to the home page</li>
</ul>

<h2>Disclaimer</h2>
The logos for available subscriptions is hardcoded, so not every subscription has a logo. However, the core functionalities
still work.

<h2>Files</h2>
The top-level files and their descriptions.
<h3>HTML</h3>
<ul>
  <li>
    index.html - The landing page when users first go to the website.
  </li>
  <li>
    Login.html - The login page.
  </li>
  <li>
    home.html - The main page that contains the timers, the starred subscriptions, and the subscription logos. Users can add subscriptions on this page.
  </li>
  <li>
    subscriptions.html - The page that loads subscription information dynamically. Users can set a limit and reset logs. Displays usage logs, usage limit and the amount of time they've spent towards their budget.
  </li>
  <li>
    404.html - Error page.
  </li>
</ul>

<h3>CSS</h3>
<ul>
  <li>
    style.css - Contains all the styling for the website.
  </li>
</ul>

<h3>JavaScript</h3>
<ul>
  <li>
    app.js - Contains all the functions used in the website
  </li>
  <li>
    firebase_setup.js - Loads Firebase on each page.
  </li>
</ul>

<h2>Built With</h2>
<ul>
  <li>
    HTML, CSS, JavaScript
  </li>
  <li>
    <a href="https://getbootstrap.com/">Bootstrap</a> - Styling and responsive design
  </li>
  <li>
    <a href="https://firebase.google.com/">Firebase</a> - Database and deployment
  </li>
</ul>

<h2>Authors</h2>
<ul>
  <li>
    <a href="https://github.com/jsylew">Jasmine Lew</a>
  </li>
  <li>
    <a href="https://github.com/jstyle5">Jaewhee Seo</a>
  </li>
  <li>
    <a href="https://github.com/jason-lui">Jason Lui</a>
  </li>
</ul>

<h2>Acknowledgements</h2>
<ul>
  <li>
    Special thanks to <a href="https://www.linkedin.com/in/nedachangizi/">Neda Changizi</a> for knowledge, encouragement, and troubleshooting
  </li>
</ul>
