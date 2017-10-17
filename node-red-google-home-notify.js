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

    //Build an API for config node HTML to use
    RED.httpAdmin.get('/languages', function(req, res) {
      res.json(languages || []);
    });

    //Known issue: when 'language' is Default/Auto, this will fail & return undefined
    this.googlehomenotifier = require('google-home-notify')(this.ipaddress, this.language, 1);
  };

  RED.nodes.registerType("googlehome-config-node", GoogleHomeConfig);

  //--------------------------------------------------------

  function GoogleHomeNotifier(n) {
    RED.nodes.createNode(this, n);
    var node = this;

    //Validate config node
    var config = RED.nodes.getNode(n.server);
    if (config === null || config === undefined) {
      node.status({fill:"red", shape:"ring", text:"please create & select a config node"});
      return;
    }

    //On Input
    node.on('input', function (msg) {
      //Validate config node
      if (config === null || config === undefined) {
        node.status({fill:"red", shape:"ring", text:"please create & select a config node"});
        return;
      }

      // we can trigger a learning function
      config.googlehomenotifier.notify(msg.payload);
      node.status({fill:"green", shape:"dot", text:"text sent to Google device"});
    });

    //Workaround for a known issue
    if (config.googlehomenotifier === null || config.googlehomenotifier === undefined) {
      node.status({fill:"red", shape:"ring", text:"please select a non-Default language"});
      return;
    }

    node.status({fill:"blue", shape:"dot", text:"ready"});
    config.googlehomenotifier.setMaxListeners(Infinity);
  };

  RED.nodes.registerType("googlehome-notify", GoogleHomeNotifier);

};
