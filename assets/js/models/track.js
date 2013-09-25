var app = app || {};

app.Track = Backbone.Model.extend({
  idAttribute: "_key",
  
  isNew: function() {
    return !this.has("_key");
  },
  
  url: function() {
    var key = this.get("_key");
    console.log("blub1");
    if (!!key) {
        console.log(key);
      return "track/" + key;
    }
    return "track";
  }
  
});