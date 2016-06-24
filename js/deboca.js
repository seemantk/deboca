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

function template(content) {
    return {
        description: "My DeBoCa record collection."
      , public: false
      , files: {
              "deboca.json": { content: JSON.stringify(content) }
          }
    }
} // template()

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
    var content = [[
              {
                  key: "artist"
                , value: ""
                , star: null
              }
            , {
                  key: "album"
                , value: ""
                , star: null
              }
            , {
                  key: "songs"
                , values: [
                      {
                          key: "track"
                        , value: ""
                        , star: null
                      }
                    ]
              }
          ]]
    ;
    var api = github.getGist();
    api.create(template(content))
        .then(function(resp) { gist = resp; })
        .then(renderCollection)
    ;
} // createCollection()


function renderCollection() {
    var content = JSON.parse(gist.data.files["deboca.json"].content);

    var record = d3.select(".records").selectAll(".record")
        .data(content)
      .enter().append("div")
        .attr("class", "record panel panel-default col-sm-6 col-md-3")
    ;
    record.each(function(rec) {
        var songs = rec.filter(function(d) { return d.key === "songs"; })
                      [0].values
          , notsongs = rec.filter(function(d) { return d.key !== "songs"; })
        ;
        var self = d3.select(this);

        var heading = self
          .append("div")
            .attr("class", "panel-heading")
        ;
        heading.selectAll("input")
            .data(notsongs, function(d) { return d.key; })
          .enter().append("input")
            .attr("type", "text")
            .attr("class", "artist form-control")
            .attr("placeholder", function(d) { return d.key; })
            .attr("value", function(d) { return d.value; })
        ;
        var body = self
          .append("div")
            .attr("class", "panel-body")
        ;
        body.selectAll(".track")
            .data(songs, function(o, i) { return i; })
          .enter().append("input")
            .attr("type", "text")
            .attr("class", "track form-control")
            .attr("placeholder", function(o, i) {
                return o.key + " " + (i + 1);
              })
            .attr("value", function(o) { return o.value; })
        ;
        self
          .append("div")
            .attr("class", "panel-footer text-right")
          .append("button")
            .attr("type", "button")
            .attr("class", "btn btn-primary")
            .text("Add next track")
            .property("disabled", "disabled")
        ;
      })
    ;
    // Autosave form to the data in the dom
    d3.selectAll("input")
      .on("blur", function(d) {
          d.value = this.value;
        })
    ;
    // Save Button
    d3.select("#save")
      .on("click", saveCollection)
    ;
} // renderCollection()


function saveCollection() {
    console.log(github, gist)
    var data = d3.selectAll(".record").data();
    var api = github.getGist(gist.data.id);
    api.update(template(data));
} // saveCollection()
