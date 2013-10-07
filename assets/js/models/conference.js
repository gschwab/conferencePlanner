var app = app || {};

app.Conference = Backbone.Model.extend({
  idAttribute: "_key",
  
  isNew: function() {
    return !this.has("_key");
  },
  
  url: function() {
    var key = this.get("_key");
    if (!!key) {
      return "conference/" + key;
    }
    return "conference";
  }
  
});