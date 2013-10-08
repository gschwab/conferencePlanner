var app = app || {};

app.Tracks = Backbone.Collection.extend({
    model: app.Track,
    url: "tracks",

    save: function(o, cb) {
        var mod = this.get(o._key);
        if (mod) {
            mod.save(o);
        } else {
            mod = this.create(o, {
                success: function(r) {
                    cb(r);
                }
            });
        }
    },

    destroy: function(key) {
        var mod = this.get(key);
        if (mod) {
            mod.destroy();
            this.remove(mod);
        }
    },

    toArray: function() {
        return this.models.map(function(m) {
            return m.attributes;
        });
    }
});