---
---
# deboca
Design document for the "Recordly" code challenge for DevBootCamp.

## Architecture Overview
For this proof of concept project, the number of servers is minimized as much as
possible. This strategy thus emphasizes services over servers: outsourcing as
many parts to different services.

### Storage
Since the ideal is serverless, this includes storage (configuration and data).
Instead of employing a central database to store a user's record collection,
we'll rely on GitHub's Gist for storage.  Thus each user will have a gist
representing their recordly data.  As a side-effect users gain the ability to
make their record collection private/secret or available for others to browse.

### Authentication
GitHub's security model requires the use of a "client secret" key sent as a
parameter to the login's POST method (GitHub then returns an access token to be
used in subsequent API interactions).  There is no ability client-side
applications to safely send the client secret.

To get around this, we need to use a small proxy server, where the client secret
can be stored, and which runs the actual login request. It simply returns the
same access token that GitHub sends it.  Such a server is available as
"gatekeeper", developed by prose.io. So, we had break the serverless rule, in order to launch a service.

The "gatekeeper" server is available as a one-click-deploy onto heroku. Ours
is at [http://ghgate.herokuapp.com](http://ghgate.herokuapp.com).

### Languages & Frameworks
Being serverless means only a client. For web applications, this means
Javascript (or coffeescript).  D3.js is used to manipulate DOM objects (form
controls and processing), rather than JQuery.  D3.js is used to query and search
through the user's collections.

### Data
Being serverless, data is also stored on GitHub: specifically, we make use of
GitHub's [gist functionality](https://gist.github.com).

### Search
There are two searches possible:

  * Searching through "my collection"
    * in-memory JSON object representing user's collection
  * Searching through everyone's collection
    * performed via [gist's search api](https://gist.github.com/search#search_cheatsheet_pane).

## Application Flow

### Login
We use [oauth.io](http://oauth.io/) to simplify login via GitHub. Thus, the user
is redirected to GitHub to login, whereupon they receive a temporary code.
Oauth passes that back to us, to send to the 'gatekeeper' server, which
authenticates the app with GitHub, and passes the session token back to us.

The permissions requested will be to read and write gists (private and open).

### Retrieve User's Collection
Using the Gist API, we search through a user's gists to find their
recordly/deboca data.  If found, we can display info about the collection.

### Create a New Collection
If this is  a first time user, then we'll need to guide the user through
creating a new collection.  This is done through form input fields. Each new
entry results in an object like:
```
    {
        artist: Name of Artist or Band
      , album: Name of Album by that Artist/Band
      , tracks: [list, of songs, on the album]
    }
```

Thus the user's collection is simply an array of such objects.  This array gets
saved into a gist and committed.  For convenience we'll have skeleton object in
a pre-existing gist.  The act of creating a new collection for the logged in
user will result in forking that pre-existing gist.

The user will have the choice to keep their collection secret or make it
available to other users to search through.

### Search My Collection
Since the user's collection is parsed into memory upon login, searching through
the collection is a matter of filtering/searching through the array of objects.

### Search All Collections
Using Gist's Search API, we find all the public forks of our skeleton gist, and
search for the relevant information in them.

### Starring favourite albums, artists and songs
The list of starred artists, albums, and songs are stored in the gist as well.
