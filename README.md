# This project is no longer maintained!

Please refer to this library to cast to your google homes instead:

https://flows.nodered.org/node/node-red-contrib-cast



# node-red-contrib-google-home-notify

These nodes are based on a fork of the google-home-notifier-library:
<a href="https://github.com/nabbl/google-home-notifier">google-home-notifier Fork</a>

## What it does:

Send any string up to 200 Characters (API limitation) to your Google Home (or Chromecast) and it will happily respond.
Great for telling us about finished Home Automation tasks.

## How it works:

### Text Notification

Hook up an Inject-Node to the Input channel and send a simple text phrase. This node will send the text to the google translation API which returns an MP3 file which then gets casted to your chosen Google device.

### Play MP3

If the input text is an mp3 url start with **http** and end up with **.mp3**, Google device can directly play it. You can host some mp3 files on your own server. For example.

> http://yourhost/xyz.mp3

## To install: 

Install node-red.

Install this package with "npm install node-red-contrib-google-home-notify --save" in ~./node-red or via the Palette Manager in node-red.

If everything was successfull you should see a new node in the output category in node-red after a restart.

You can adress your Google Home by specifying its IP address and choose a language (Default is English).

## Node-red Flows

Visit example subfolder (coming soon)
