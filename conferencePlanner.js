/*jslint indent: 2, nomen: true, maxlen: 100, white: true, plusplus: true, unparam: true */
/*global todos*/
/*global require, applicationContext, repositories*/

////////////////////////////////////////////////////////////////////////////////
/// @brief 
///
/// @file
///
/// DISCLAIMER
///
/// Copyright 2010-2012 triagens GmbH, Cologne, Germany
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// Copyright holder is triAGENS GmbH, Cologne, Germany
///
/// @author Michael Hackstein
/// @author Copyright 2011-2013, triAGENS GmbH, Cologne, Germany
////////////////////////////////////////////////////////////////////////////////

(function () {
    "use strict";

    // Initialise a new Application called app under the urlPrefix: "ayeaye".
    var FoxxController = require("org/arangodb/foxx").Controller,
        app = new FoxxController(applicationContext);
    var internal = require("internal");
    var foxxAuthentication = require("org/arangodb/foxx/authentication");

    //read the configuration config.json
    var fs = require("fs");
    var config = JSON.parse(fs.read(fs.join(applicationContext.basePath, "config.json")));


    function setupAuthentication() {
        app.activateAuthentication({
            type: config.authentication.type,
            cookieLifetime: config.authentication.cookieLifetime,
            cookieName: config.authentication.cookieName,
            sessionLifetime: config.authentication.sessionLifetime
        });


        /*
        var sessions = new foxxAuthentication.Sessions(applicationContext, {
            lifetime: config.authentication.sessionLifetime
        });

        var cookieAuth = new foxxAuthentication.CookieAuthentication(applicationContext, {
            lifetime: config.authentication.cookieLifetime,
            name: config.authentication.cookieName
        });

        var auth = new foxxAuthentication.Authentication(applicationContext, sessions, cookieAuth);

        return auth;*/
    }

    var auth = setupAuthentication();

    var _ = require("underscore");

    var currentConferenceKey = null;

    var Conferences = require("repositories/conferences").Repository;
    var conferences = new Conferences(app.collection("conferences"), {
        prefix: app.collectionPrefix
    });

    // will be assigned in app.before, when conference is set
    var Speakers = null;
    var speakers = null;

    var Talks = null;
    var talks = null;

    var Tracks = null;
    var tracks = null;

    var Gives = null;
    var gives = null;

    var InConf = null;
    var inConf = null;

    var arangodb = require("org/arangodb");
    var db = arangodb.db;

    var createCollection = function(name) {
        var handle = applicationContext.collectionName(name);
        if (db._collection(handle) === null) {
            db._create(handle);
        } else {
            console.warn("collection '%s' already exists. Leaving it untouched.", handle);
        }
    };

    var createEdgeCollection = function(name) {
        var handle = applicationContext.collectionName(name);
        if (db._collection(handle) === null) {
            db._createEdgeCollection(handle);
        } else {
            console.warn("collection '%s' already exists. Leaving it untouched.", handle);
        }
    };

    app.before("/*", function (req, res) {

        if (req.currentSession == null) {
            return;
        }
        var conferenceKey = req.currentSession.get("conferenceKey");
        if (conferenceKey !== "" && typeof conferenceKey !== "undefined") {
            currentConferenceKey = conferenceKey;

            Tracks = require("repositories/tracks").Repository;
            tracks = new Tracks(app.collection("tracks_" + conferenceKey), {
                prefix: app.collectionPrefix
            });
            Gives = require("repositories/gives").Repository;
            gives = new Gives(app.collection("gives_" + conferenceKey), {
                prefix: app.collectionPrefix,
                suffix: conferenceKey
            });

            InConf = require("repositories/inConf").Repository;
            inConf = new InConf(app.collection("inConf_" + conferenceKey), {
                prefix: app.collectionPrefix,
                suffix: conferenceKey
            });
            Speakers = require("repositories/speakers").Repository;
            speakers = new Speakers(app.collection("speakers_" + conferenceKey), {
                prefix: app.collectionPrefix
            });

            Talks = require("repositories/talks").Repository;
            talks = new Talks(app.collection("talks_" + conferenceKey), {
                prefix: app.collectionPrefix
            });
        }
    });

    app.get("/checkConference", function (req, res) {
        if (req.currentSession !== null &&  typeof req.currentSession !== "undefined") {
            res.json(
                {
                    conferenceKey: req.currentSession.get("conferenceKey"),
                    conferenceName: req.currentSession.get("conferenceName")
                }
            );
        }
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.after("/*", function (req, res) {
        var session = req.currentSession;
        if (session == null) {
            // we don't have any session
            return;
        }
        session.update();
    });

    app.logout("/logout");

    app.login(
        "/login", {
            onSuccess: function (req, res) {
                res.json({
                    msg: "Logged in!",
                    user: req.user.identifier,
                    key: req.currentSession._key
                });
                return;
            }
        }
    );

    app.get("conference", function (req, res) {
        res.json(conferences.list());
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.get("conference/:id", function (req, res) {
        var id = req.params("id");
        res.json(conferences.show(id));
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.post("conference", function (req, res) {
        res.json(conferences.save(JSON.parse(req.requestBody)));
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.put("conference/:id", function (req, res) {
        var id = req.params("id");
        res.json(conferences.update(id, JSON.parse(req.requestBody)));
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.del("conference/:id", function (req, res) {
        var id = req.params("id");
        res.json(conferences.del(id));
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.get("tracks", function (req, res) {
        res.json(tracks.list());
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.get("tracks/:id", function (req, res) {
        var id = req.params("id");
        res.json(tracks.show(id));
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.get("list/tracks", function (req, res) {
        res.json(tracks.head());
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.post("tracks", function (req, res) {
        res.json(tracks.save(JSON.parse(req.requestBody)));
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.put("tracks/:id", function (req, res) {
        var id = req.params("id");
        res.json(tracks.update(id, JSON.parse(req.requestBody)));
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.del("tracks/:id", function (req, res) {
        var id = req.params("id");
        res.json(tracks.del(id));
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.get("speaker", function (req, res) {
        res.json(speakers.list());
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.get("speaker/:id", function (req, res) {
        var id = req.params("id");
        res.json(speakers.show(id));
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.get("list/speakers", function (req, res) {
        res.json(speakers.head());
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.post("speaker", function (req, res) {
        res.json(speakers.save(JSON.parse(req.requestBody)));
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.put("speaker/:id", function (req, res) {
        var id = req.params("id");
        res.json(speakers.update(id, JSON.parse(req.requestBody)));
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.del("speaker/:id", function (req, res) {
        var id = req.params("id");
        res.json(speakers.del(id));
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.get("talk", function (req, res) {
        res.json(talks.list());
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.get("talk/:id", function (req, res) {
        var id = req.params("id");
        talks.show(id);
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.post("talk", function (req, res) {
        var content = JSON.parse(req.requestBody),
            ret = talks.save(content);
        if (content.Speaker_key) {
            gives.save(content.Speaker_key, ret._key);
        }
        res.json(ret);
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.put("talk/:id", function (req, res) {
        var id = req.params("id"),
            content = JSON.parse(req.requestBody),
            ret = talks.update(id, content);
        gives.update(content.Speaker_key, ret._key);
        res.json(ret);
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.del("talk/:id", function (req, res) {
        var id = req.params("id");
        inConf.removeTalk(id)
        res.json(talks.del(id));
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.get("track", function (req, res) {
        res.json(tracks.list());
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.get("track/:id", function (req, res) {
        var id = req.params("id");
        tracks.show(id);
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.post("track", function (req, res) {
        tracks.save(req.body());
        res.json("OK");
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.put("track/:id", function (req, res) {
        var id = req.params("id"),
            content = req.body();
        tracks.update(id, content);
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.del("track/:id", function (req, res) {
        var id = req.params("id");
        res.json(tracks.del(id));
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.post("gives/:speakerId/:talkId", function (req, res) {
        var sId = req.params("speakerId");
        var tId = req.params("talkId");
        res.json(gives.save(sId, tId));
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.get("gives/:speakerId", function (req, res) {
        var sId = req.params("speakerId");
        var edges = gives.listTalksOf(sId);
        res.json(_.map(edges, function (e) {
            return talks.show(e._to);
        }));
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.del("gives/:edgeId", function (req, res) {
        var id = req.params("edgeId");
        res.json(gives.del(id));
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.get("inTrack/:trackId", function (req, res) {
        var tId = req.params("trackId");
        res.json(inTrack.listTalksIn(tId));
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.get("html/:confId/:day", function (req, res) {
        var confId = req.params("confId");
        var day = req.params("day");
        var TG = require("lib/templateGenerator").TemplateGenerator;
        var tg = new TG(applicationContext.basePath);

        var test = tg.createTable("Home");

        res.body = test;
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.post("inTrack/:trackId/:talkId", function (req, res) {
        var talkId = req.params("talkId");
        var trackId = req.params("trackId");
        res.json(inTrack.save(talkId, trackId));
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.del("inTrack/:edgeId", function (req, res) {
        var id = req.params("edgeId");
        res.json(inTrack.del(id));
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.get("talksInConf/:confId", function (req, res) {
        var id = req.params("confId");
        res.json(inConf.talksInConf(id));
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.post("inConf/:talkId/:confId", function (req, res) {
        var talkId = req.params("talkId"),
            confId = req.params("confId"),
            content = JSON.parse(req.requestBody);
        res.json(inConf.save(talkId, confId, content));
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.del("inConf/:talkId/:confId", function (req, res) {
        var talkId = req.params("talkId"),
            confId = req.params("confId");
        inConf.collection.outEdges("dev_conferencePlanner_talks_" + currentConferenceKey + "/" + talkId).forEach(
            function(doc) {
                inConf.collection.remove(doc._key);
            }
        );
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.get("conferences", function (req, res) {
        res.json(conferences.list());
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.post("setConference/:conferenceKey", function (req, res) {
        var conferenceKey = req.params("conferenceKey");
        var conference = conferences.show(conferenceKey);
        req.currentSession.set("conferenceKey", conferenceKey);
        req.currentSession.set("conferenceName", conference.conference);
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.post("createConference/:conferenceName", function (req, res) {
        var conferenceName = req.params("conferenceName");
        var conference = conferences.save({conference: conferenceName});
        var collectionNameSuffix = "_" + conference._key;
        createCollection("speakers" + collectionNameSuffix);
        createCollection("talks" + collectionNameSuffix);
        createCollection("tracks" + collectionNameSuffix);
        createEdgeCollection("gives" + collectionNameSuffix);
        createEdgeCollection("inConf" + collectionNameSuffix);
    }).onlyIfAuthenticated(401, "You need to be authenticated");

    app.get("blub", function (req, res) {
        conferences._show
        res.json({blub: "BLUBBER", blubber: "foxxxxxxxx"});
    }).onlyIfAuthenticated(401, "You need to be authenticated");

}());
