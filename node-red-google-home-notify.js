'use strict';

module.exports = function (RED) {
  // Configuration node
  function GoogleHomeConfig(n) {
    RED.nodes.createNode(this, n);

    this.ipaddress = n.ipaddress;
    this.language = n.language;

    this.googlehomenotifier = {};

    this.googlehomenotifier = require('google-home-notify')(
      ipadress, language, 1);

    var node = this;
  };

  RED.nodes.registerType("googlehome-config-node", GoogleHomeConfig);

  function GoogleHomeNotifier(n) {
    RED.nodes.createNode(this, n);
    var jsonObject = require(__dirname + "/knownSensors.json");
    //map to Array:
    var knownsensorarray = Object.keys(jsonObject).map(function (key) {
      return jsonObject[key];
    });

    RED.httpAdmin.get('/knownsensors', function (req, res) {
      res.json(knownsensorarray || []);
    });

    this.knownsensor = n.knownsensor;
    this.devicefilter = n.devicefilter;
    this.devices = n.devices;

    var config = RED.nodes.getNode(n.ipaddress);

    var node = this;

    node.on('input', function (msg) {
      // we can trigger a learning function
      config.googlehomenotifier.notify(msg.payload);
      node.status({
        fill: 'green',
        shape: "ring",
        text: "Text sent"
      });
    });

    config.enocean.setMaxListeners(Infinity);


    node.status({
      fill: 'yellow',
      shape: "ring",
      text: "Connecting..."
    });

  };

  RED.nodes.registerType("enocean-listener", EnOceanListener);

};
