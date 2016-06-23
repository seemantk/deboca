OAuth.initialize('-j9tNW6PT2GcyCmnZ8fydDyUV3Y');
OAuth
  .popup('github', {cache: true})
    .done(main)
    .fail(function(err) { console.log("no", err); })
;

var github
  , gist
  , me
;

function main(token) {
    github = new GitHub({ token: token.access_token });
    me = github.getUser();
    me.listGists()
        .then(openCollection)
    ;
} // main()


function openCollection(list) {
    var mycoll = list.data.filter(function(g) {
        return ~d3.keys(g.files).indexOf('deboca.json');
      })
    ;
    if(mycoll.length) {
        var api = github.getGist(mycoll[0].id);
        api.read()
            .then(function(resp) { gist = resp; })
        ;
    }
    else createCollection();
} // openCollection

function createCollection() {
    var content = {
          collection: [{
              artist: "",
              album: "",
              songs: []
            }],
        faves: {
              artists: [],
              albums: [],
              songs: []
            }
      }
    ;
    var template = {
          description: "My DeBoCa record collection.",
          public: false,
          files: {
                "deboca.json": {
                    content: JSON.stringify(content) 
                  }
            }
        }
    ;
    var api = github.getGist();
    api.create(template)
        .then(function(resp) { gist = resp; })
    ;
} // createCollection()
