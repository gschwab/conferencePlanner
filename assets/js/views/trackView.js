/*jslint indent: 2, nomen: true, maxlen: 100, sloppy: true, vars: true, white: true, plusplus: true */
/*global require, exports, Backbone, EJS, $*/

var app = app || {};

app.TrackView = Backbone.View.extend({
    el: '#content',

    initialize: function () {
        var self = this;
        this.collection = new app.Tracks();
        this.tbl = new app.LiveEditTable(
            ["TrackNumber", "RoomName"],
            {
                TrackNumber: {
                    type: "selection",
                    list: [
                        {
                            id: "t001",
                            text: "Track 1"
                        },
                        {
                            id: "t002",
                            text: "Track 2"
                        },
                        {
                            id: "t003",
                            text: "Track 3"
                        },
                        {
                            id: "t004",
                            text: "Track 4"
                        },
                        {
                            id: "t005",
                            text: "Track 5"
                        }
                    ]
                },

                onChange: function(o, row) {
                    self.collection.save(o,
                        function(obj) {
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

    render: function() {
        var self = this;
        $(this.el).html("");
        $(this.el).append(this.tbl.getTableHTML());
        this.collection.fetch({
            success: function() {
                self.tbl.clean();
                self.tbl.insertBulk(self.collection.toArray());
            }
        })
        return this;
    }

});
