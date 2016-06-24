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
    me.getProfile()
        .then(welcome)
    ;
    me.listGists()
        .then(openCollection)
    ;
} // main()

function welcome(req) {
    d3.select(".welcome")
        .html("Welcome, " + req.data.name)
    ;
} // welcome()

function openCollection(list) {
    var mycoll = list.data.filter(function(g) {
        return ~d3.keys(g.files).indexOf('deboca.json');
      })
    ;
    if(mycoll.length) {
        var api = github.getGist(mycoll[0].id);
        api.read()
            .then(function(resp) { gist = resp; })
            .then(renderCollection)
        ;
    }
    else createCollection();
} // openCollection

function createCollection() {
    var content = [{
              artist: {
                    name: ""
                  , star: false
                }
            , album: {
                    title: ""
                  , star: false
                }
            , songs: [{
                    title: ""
                  , star: false
                }]
          }]
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
        .then(renderCollection)
    ;
} // createCollection()


function renderCollection() {
    var content = JSON.parse(gist.data.files["deboca.json"].content);

    var record = d3.select(".records").selectAll(".record")
        .data(content)
      .enter().append("div")
        .attr("class", "record col-sm-6 col-md-3")
    ;
    record.each(function(d) {
        console.log(d);
          var self = d3.select(this);

          var panel = self
            .append("div")
              .attr("class", "panel panel-default")
          ;
          panel
            .append("div")
              .attr("class", "panel-heading")
            .append("button")
              .attr("type", "button")
              .attr("class", "btn btn-primary")
              .text("Save")
          ;
          var group = panel
            .append("div")
              .attr("class", "panel-body")
          ;
          group
            .append("input")
              .attr("type", "text")
              .attr("class", "artist form-control")
              .attr("placeholder", "Artist")
              .attr("value", d.artist.name)
          ;
          group
            .append("input")
              .attr("type", "text")
              .attr("class", "album form-control")
              .attr("placeholder", "Album")
              .attr("value", d.album.title)
          ;
          var tracks = panel
            .append("div")
              .attr("class", "panel-footer tracks")
          ;
          tracks.selectAll(".track")
              .data(d.songs, function(o, i) { return i; })
            .enter().append("input")
              .attr("type", "text")
              .attr("class", "track form-control")
              .attr("placeholder", function(o, i) {
                  return "Track #" + (i + 1);
                })
              .attr("value", function(o) { return o.title; })
          ;
          tracks
            .append("button")
              .attr("type", "button")
              .attr("class", "btn btn-primary")
              .text("Add next track")
          ;
      })
    ;
} // renderCollection()
