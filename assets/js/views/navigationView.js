/*jslint indent: 2, nomen: true, maxlen: 100, sloppy: true, vars: true, white: true, plusplus: true */
/*global require, exports, Backbone, EJS, $*/

var app = app || {};

app.navigationView = Backbone.View.extend({
    el: '#header',

    events: {
        "click li"            : "switchToTab",
        "click #logoutButton" : "logout"
    },

    initialize: function () {
        this.collection = new app.Sessions();
    },

    //  template: new EJS({url: 'templates/navigationView.ejs'}),
    template: _.template(new EJS({url: 'templates/navigationView.ejs'}).text),

    switchToTab: function(e) {
        app.router.navigate(
            e.currentTarget.id,
            {trigger: true}
        );
    },

    setActive: function(id) {
        $("li", $(this.el)).toggleClass("active", false);
        $("#" + id).toggleClass("active", true);
    },

    render: function() {
        if (typeof this.conference === 'undefined') {
            this.conference = {
                conferenceName: 'undefined',
                conferenceKey: 'undefined'
            };
        }

        //    $(this.el).html(this.template.text);
        this.$el.html(
            this.template(
                {
                    conferenceName: this.conference.conferenceName,
                    conferenceKey: this.conference.conferenceKey
                }
            )
        );
        return this;
    },

    logout: function() {
        var response = this.collection.logout();
        if (response === true) {
            app.router.navigate('/login', true);
        }
        else {
            alert("Logout error");
        }
    }

});
