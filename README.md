# deboca
Recordly code challenge for DEvBOotCAmp

# Architecture Overview
For a proof of concept project, we try to minimize the number of moving
parts.  In practical terms, this means minimizing the number of servers.
This strategy thus emphasizes services rather than servers.  Serverless, if possible.

## Language/Frameworks
Being serverless means only a client. For web applications, this means Javascript (or coffeescript).  D3.js is used to manipulate DOM objects (form controls and processing), rather than JQuery.  D3.js is used to query and search through the user's collections.

## Authentication
The [oauth.io](http://oauth.io/) proxies for other oauth providers.  Thus we enable login via social media (they support many, many different ones, and enabling multiple providers is a straightforward task). For maximum simplicity, we choose github.

## Data
Being serverless, data is also stored on github: specifically, we make use of github's [gist functionality](https://gist.github.com).

### storage
Rather than use centralized storage, the application:

 * forks a template gist
 * commits changes per interval
 * pushes changes on save/exit

### Search
There are two searches possible:

 * Searching through "my" collection
 * Searching through everyone's collections

While it would be trivial enough to load the user's records and search through the resultant Objects, both searches are performed via [gist's search api](https://gist.github.com/search#search_cheatsheet_pane).

# Application Flow
