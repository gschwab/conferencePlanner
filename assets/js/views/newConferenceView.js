/*jslint indent: 2, nomen: true, maxlen: 100, sloppy: true, vars: true, white: true, plusplus: true */
/*global require, exports, Backbone, EJS, $*/

var app = app || {};

app.NewConferenceView = Backbone.View.extend({
    el: '#content',

    initialize: function () {
        var self = this;
    },

    events: {
        'change #conferencesSelection' : 'setConference',
        'click #newConferenceButton'   : 'newConference'
    },

    template: _.template(new EJS({url: 'templates/newConferenceView.ejs'}).text),

    render: function() {
        this.$el = $(this.el);
        this.$el.html(
            this.template(
                {
//                    conferences: this.collection.models
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
        console.log("KLICK!!!!");
        app.router.navigate(
            "newConference",
            {trigger: true}
        );
    }

});


