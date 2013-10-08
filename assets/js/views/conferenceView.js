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
        'change #conferencesSelection' : 'setConference',
        'click #newConferenceButton'   : 'newConference'
    },

    template: _.template(new EJS({url: 'templates/conferenceView.ejs'}).text),

    render: function() {
        this.collection.fetch({async:false});
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
            method: "POST",
            success: function(){
                var key = $("#conferencesSelection").val();
                var name = $("#conferencesSelection").find('option:selected').text();
                app.router.naviView.conference = {conferenceName: name, conferenceKey: key}
                app.router.naviView.render();
            }
        });

    },

    newConference: function(e) {
        app.router.navigate(
            "newConference",
            {trigger: true}
        );
    }

});


