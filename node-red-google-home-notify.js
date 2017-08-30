'use strict';

module.exports = function (RED) {
  // Configuration node
  function GoogleHomeConfig(n) {
    RED.nodes.createNode(this, n);

    this.ipaddress = n.ipaddress;
    this.language = n.language;

    //Prepare language Select Box
    var obj = require('./languages');
    //map to Array:
    var languages = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            languages.push({
              key: key,
              value: obj[key]
            });
        }
    };

    RED.httpAdmin.get('/languages', function(req, res) {
      res.json(languages || []);
    });

    this.googlehomenotifier = {};

    this.googlehomenotifier = require('google-home-notify')(
      this.ipaddress, this.language, 1);

    var node = this;

  };

  RED.nodes.registerType("googlehome-config-node", GoogleHomeConfig);

  function GoogleHomeNotifier(n) {
    RED.nodes.createNode(this, n);

    var config = RED.nodes.getNode(n.server);

    var node = this;

    node.on('input', function (msg) {
      // we can trigger a learning function
      config.googlehomenotifier.notify(msg.payload);
      node.status({
        fill: 'green',
        shape: "ring",
        text: "Text sent to Google Device"
      });
    });

    config.googlehomenotifier.setMaxListeners(Infinity);

  };

  RED.nodes.registerType("googlehome-notify", GoogleHomeNotifier);

};
