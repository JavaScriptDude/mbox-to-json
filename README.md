Easily convert mbox files to json.
Note: This version is a tweaked fork of https://github.com/brysonian/mbox-to-json. At my version of Node, the original mbox-to-json did not function correctly but the tweaks worked. Hopefully someone else may find this code useful.

# USAGE
1. install dependencies with `npm install`
2. run with `./mbox-to-json.js --input FILENAME.mbox`

You can dump the JSON to a file by specifying the --output option:
`./mbox-to-json.js --input FILENAME.mbox --output FILENAME.json`
