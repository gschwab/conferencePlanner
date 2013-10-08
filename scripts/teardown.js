(function() {
  "use strict";

  require("console").log("%s", "tearing down app " + applicationContext.name);

  var f = require("org/arangodb/foxx/authentication");
 
  var users = new f.Users(applicationContext);
  users.teardown();
  
  var sessions = new f.Sessions(applicationContext);
  sessions.teardown();

}());
