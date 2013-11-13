var app = app || {};

app.Configuration = Backbone.Model.extend({
  idAttribute: "_key",

  defaults: {
      numberOfDays: 1
  },

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