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
            .then(function(resp) { gist = resp; console.log(gist); })
        ;
    }
    else createCollection();
} // openCollection

function createCollection() {
    var template = {
          description: "My DeBoCa record collection.",
          public: false,
          files: {
                "deboca.json": { content: "blah" }
            }
        }
    ;
    var api = github.getGist();
    api.create(template)
        .then(function(resp) { gist = resp; console.log(gist); })
    ;
} // createCollection()
