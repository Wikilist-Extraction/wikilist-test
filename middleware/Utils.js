var Utils = {

  fiber: function(req, res, next) {
    var sync = require("synchronize");
    sync.fiber(next);
  }

}

module.exports = Utils;
