/*jslint indent: 2, nomen: true, maxlen: 100, sloppy: true, vars: true, white: true, plusplus: true*/
/*global window, $, Backbone */

var app = app || {};
var login = false;

app.Router = Backbone.Router.extend({

    routes: {
        ""        : "main",
        "home"    : "main",
        "talks"   : "talks",
        "speaker" : "speaker",
        "tracks"  : "tracks",
        "conferences"  : "conferences",
        "login"   : "login"
    },

    initialize: function () {
        var self = this;
        this.loginView = new app.loginView();

        $(document).ajaxError(function(err1, err2) {
            if (err2.status === 401) {
            login = true;
                if (app.router) {
                    self.loginView.backToLogin();
                }
            }
        });

        this.overView = new app.overView();
        this.naviView = new app.navigationView("blub");
        this.speakerView = new app.SpeakerView();
        this.talkView = new app.TalkView();
        this.trackView = new app.TrackView();
        this.conferenceView = new app.ConferenceView();
    },

    checkConference: function () {
        var result;

        $.ajax({
            async: false,
            url: "checkConference",
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                result = data.conference;
            },
            error: function (data) {
                result = null;
            }
        })

        if (result !== null && result !== '') {
            return true;
        }

        this.navigate("conferences", { trigger: true });
        return false;
    },

    main: function () {
        if (! this.checkConference()) {
            return;
        }
        this.overView.render();
        this.naviView.setActive("home");
        this.naviView.render();
    },

    talks: function () {
        if (! this.checkConference()) {
            return;
        }
        this.talkView.render();
        this.naviView.setActive("talks");
        this.naviView.render();
    },

    speaker: function () {
        if (! this.checkConference()) {
            return;
        }
        this.speakerView.render();
        this.naviView.setActive("speaker");
        this.naviView.render();
    },

    tracks: function () {
        if (! this.checkConference()) {
            return;
        }
        this.trackView.render();
        this.naviView.setActive("tracks");
        this.naviView.render();
    },

    conferences: function () {
        this.conferenceView.render();
        this.naviView.setActive("conferences");
        this.naviView.render();
    },

    login: function () {
        this.loginView.render();
    }

});

app.router = new app.Router();
Backbone.history.start();

if (login === true) {
    app.router.navigate('/login', true);
}
else {
    app.router.naviView.render();
}
