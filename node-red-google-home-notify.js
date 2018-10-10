'use strict';

module.exports = function (RED) {
  // Configuration node
  function GoogleHomeConfig(n) {
    RED.nodes.createNode(this, n);

    this.ipaddress = n.ipaddress;
    this.language = n.language;
    this.name = n.name;

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
    RED.httpAdmin.get('/languages', function (req, res) {
      res.json(languages || []);
    });

    //Known issue: when 'language' is Default/Auto, this will fail & return undefined
    this.googlehomenotifier = require('google-home-notify')(this.ipaddress, this.language, 1);

    //Build another API to auto detect IP Addresses
    discoverIpAddresses('googlecast', function (ipaddresses) {
      RED.httpAdmin.get('/ipaddresses', function (req, res) {
        res.json(ipaddresses);
      });
    });
  };

  function discoverIpAddresses(serviceType, discoveryCallback) {
    var ipaddresses = [];
    var bonjour = require('bonjour')();
    var browser = bonjour.find({
      type: serviceType
    }, function (service) {
      service.addresses.forEach(function (element) {
        if (element.split(".").length == 4) {
          var label = "" + service.txt.md + " (" + element + ")";
          ipaddresses.push({
            label: label,
            value: element
          });
        }
      });

      //Add a bit of delay for all services to be discovered
      if (discoveryCallback)
        setTimeout(function () {
          discoveryCallback(ipaddresses);
        }, 2000);
    });
  }

  RED.nodes.registerType("googlehome-config-node", GoogleHomeConfig);

  //--------------------------------------------------------

  function GoogleHomeNotifier(n) {
    RED.nodes.createNode(this, n);
    var node = this;

    //Validate config node
    var config = RED.nodes.getNode(n.server);
    this.configname = config.name;
    if (config === null || config === undefined) {
      node.status({
        fill: "red",
        shape: "ring",
        text: "please create & select a config node"
      });
      return;
    }

    //On Input
    node.on('input', function (msg) {
      //Validate config node
      if (config === null || config === undefined) {
        node.status({
          fill: "red",
          shape: "ring",
          text: "please create & select a config node"
        });
        return;
      }

      //play music if it is a mp3 url
      var expression = /^https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\/([-a-zA-Z0-9@:%_\+.~#?&//=]*).mp3$/;
      var regex = new RegExp(expression);
      if(msg.payload.toLowerCase().match(regex)){
        config.googlehomenotifier.play(msg.payload, function (result) {
          node.status({
            fill: "green",
            shape: "ring",
            text: "Successfully played mp3"
          });
        });
        return;
      }

      config.googlehomenotifier.notify(msg.payload, function (result) {
          node.status({
            fill: "green",
            shape: "ring",
            text: "Successfully sent voice command"
          });
      });
    });

    config.googlehomenotifier.on('error', function (error) {
      node.status({
        fill: "red",
        shape: "ring",
        text: error.message
      });
    });

    //Workaround for a known issue
    if (config.googlehomenotifier === null || config.googlehomenotifier === undefined) {
      node.status({
        fill: "red",
        shape: "ring",
        text: "please select a non-Default language"
      });
      return;
    }

    node.status({
      fill: "blue",
      shape: "dot",
      text: "ready"
    });
    config.googlehomenotifier.setMaxListeners(Infinity);
  };

  RED.nodes.registerType("googlehome-notify", GoogleHomeNotifier);

};
