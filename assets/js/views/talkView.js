/*jslint indent: 2, nomen: true, maxlen: 100, sloppy: true, vars: true, white: true, plusplus: true */
/*global require, exports, Backbone, EJS, $*/

var app = app || {};

app.TalkView = Backbone.View.extend({
    el: '#content',

    initialize: function () {
        this.collection = new app.Talks();
//        this.loadData();
    },

    loadData: function() {
        var self = this;
        $.ajax({
            url: "list/speakers",
            method: "GET",
            success: function(list) {
                self.didLoad = true;
                self.tbl = new app.LiveEditTable(
                    ["Type", "Speaker", "CoSpeaker", "Tracks", "Title", "Abstract", "Duration", "Category", "Level"],
                    {
                        Type: {
                            type: "selection",
                            list: [
                            {
                                id: "type_talk",
                                text: "Talk"
                            },
                            {
                                id: "type_event",
                                text: "Social Event"
                            }
                            ]
                        },
                        Speaker: {
                            type: "selection",
                            list: list
                        },
                        CoSpeaker: {
                            type: "selection",
                            list: list
                        },
                        Category: {
                            type: "selection",
                            list: [
                            {
                                id: "use_case",
                                text: "Use Case"
                            },
                            {
                                id: "detail",
                                text: "Technical / Algorithmic Detail"
                            },
                            {
                                id: "product",
                                text: "Product Demonstration"
                            },
                            {
                                id: "training",
                                text: "Training"
                            }
                            ]
                        },
                        Tracks: {
                            type: "selection",
                            list: [
                            {
                                id: "single_track",
                                text: "Single track"
                            },
                            {
                                id: "all_tracks",
                                text: "All tracks"
                            }
                            ]
                        },
                        Level: {
                            type: "selection",
                            list: [
                            {
                                id: "beginner",
                                text: "Beginner"
                            },
                            {
                                id: "intermediate",
                                text: "Intermediate"
                            },
                            {
                                id: "advanced",
                                text: "Advanced"
                            },
                            {
                                id: "expert",
                                text: "Expert"
                            }
                            ]
                        },

                        onChange: function(o, row) {
                            self.collection.save(
                                o, function(obj) {
                                    row.id = obj.get("_key");
                                }
                            );
                        },
                        onDelete: function(id) {
                            self.collection.destroy(id);
                        }
                    }
                );
            },
            async: false
        });
    },

    render: function() {
        var self = this;
        if (!this.didLoad) {
            this.loadData();
        }
        if (this.tbl !== undefined) {
            $(this.el).html("");
            $(this.el).append(this.tbl.getTableHTML());
            this.collection.fetch({
                success: function() {
                    self.tbl.clean();
                    self.tbl.insertBulk(self.collection.toArray());
                }
            });
            $.ajax({
                url: "list/speakers",
                method: "GET",
                success: function(list) {
                    self.tbl.updateSelectionList("Speaker", list);
                    self.tbl.updateSelectionList("CoSpeaker", list);
                },
                async: true
            });
        }

        return this;
    }
});
