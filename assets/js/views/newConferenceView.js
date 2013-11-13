/*jslint indent: 2, nomen: true, maxlen: 100, sloppy: true, vars: true, white: true, plusplus: true */
/*global require, exports, Backbone, EJS, $*/

var app = app || {};

app.NewConferenceView = Backbone.View.extend({
    el: '#content',

    initialize: function () {
        var self = this;
    },

    events: {
        'click #createNewConferenceButton'   : 'createConference'
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

    createConference: function(e) {
        $.ajax({
            url: "createConference/" + $("#newConferenceName").val() + "/" + $("#numberOfDays").val(),
            method: "POST",
            success: function(){
//                var name = $("#newConferenceName").find('option:selected').text();
                app.router.navigate('conferences', { trigger: true });
            }
        });

    }


});


