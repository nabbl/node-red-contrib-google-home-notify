# node-red-contrib-google-home-notify

These nodes are based on a fork of the google-home-notifier-library:
<a href="https://github.com/nabbl/google-home-notifier">google-home-notifier Fork</a>

## What it does:

Send any string up to 200 Characters (API limitation) to your Google Home (or Chromecast) and it will happily respond.
Great for telling us about finished Home Automation tasks.

## How it works:

Hook up an Inject-Node to the Input channel and send a simple text phrase. This node will send the text to the google translation API which returns an MP3 file which then gets casted to your chosen Google device.

## To install: 

Install node-red.

Install this package with "npm install node-red-contrib-google-home-notify --save" in ~./node-red or via the Palette Manager in node-red.

If everything was successfull you should see a new node in the output category in node-red after a restart.

You can adress your Google Home by specifying its IP address and choose a language (Default is English).

## Node-red Flows

Visit example subfolder (coming soon)
