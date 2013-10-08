/*jslint indent: 2, nomen: true, maxlen: 100, sloppy: true, vars: true, white: true, plusplus: true*/
/*global window, $, Backbone */

var app = app || {};

app.Router = Backbone.Router.extend({

    routes: {
        ""              : "main",
        "home"          : "main",
        "talks"         : "talks",
        "speaker"       : "speaker",
        "tracks"        : "tracks",
        "conferences"   : "conferences",
        "newConference" : "newConference",
        "login"         : "login"
    },

    initialize: function () {
        this.loginView         = new app.loginView();
        this.overView          = new app.overView();
        this.naviView          = new app.navigationView();
        this.speakerView       = new app.SpeakerView();
        this.talkView          = new app.TalkView();
        this.trackView         = new app.TrackView();
        this.conferenceView    = new app.ConferenceView();
        this.newConferenceView = new app.NewConferenceView();
    },

    getConferenceName: function () {
        var result;

        $.ajax({
            async: false,
            url: "checkConference",
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                result = {
                    conferenceName: data.conferenceName,
                    conferenceKey: data.conferenceKey
                };
            },
            error: function (data) {
                result = null;
            }
        });
        return result;

    },

    checkConference: function () {
        var result = this.getConferenceName();
        this.naviView.conference = result;

        if (
            result
            && result.hasOwnProperty("conferenceKey")
            && typeof result.conferenceKey !== 'undefined'
            && result.conferenceKey !== ''
            ) {
            return true;
        }

        if (result && result.hasOwnProperty("conferenceKey")) {
            this.navigate("conferences", { trigger: true });
            return false;
        }

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

    newConference: function () {
        this.newConferenceView.render();
        this.naviView.setActive("conferences");
        this.naviView.render();
    },

    login: function () {
        this.loginView.render();
    }

});

$.ajaxSetup({
    statusCode: {
        401: function(){
            if(app.router)
            app.router.navigate('login', { trigger: true });
// window.location.replace('/#login');
        }
    }
});
app.router = new app.Router();
Backbone.history.start();

//app.router.naviView.render();
