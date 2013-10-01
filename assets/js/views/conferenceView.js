/*jslint indent: 2, nomen: true, maxlen: 100, sloppy: true, vars: true, white: true, plusplus: true */
/*global require, exports, Backbone, EJS, $*/

var app = app || {};

app.ConferenceView = Backbone.View.extend({
    el: '#content',

    initialize: function () {
        var self = this;
        this.collection = new app.Conferences();
    },

    events: {
        'change #conferencesSelection' : 'setConference'
    },

    template: _.template(new EJS({url: 'templates/conferenceView.ejs'}).text),

    render: function() {
        this.$el = $(this.el);
        this.$el.html(
            this.template(
                {
                    conferences: this.collection.models
                }
            )
        );
        return this;
    },

    setConference: function(e) {
        $.ajax({
            url: "setConference/" + e.currentTarget.value,
            method: "POST"
        });

    }

});


