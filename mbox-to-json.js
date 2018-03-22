#!/usr/bin/env node
# This code is forked from https://github.com/brysonian/mbox-to-json
# - Forked because original version did not work as-is
# - Change made to how messageCount is calculated and handled
# - Added allMessagesParsed() function
# - Timeout below is to ensure that most messages are enqueued before the check occurs

var MailParser  = require('mailparser-mit').MailParser;
var fs          = require('fs');
var Mbox        = require('node-mbox');
var util        = require('util')
var argv        = require('yargs')
                  .alias('i', 'input')
                  .alias('o', 'output')
                  .demand(['i'])
                  .argv;

function main() {
  var messages = [];
  var mbox = new Mbox();
  var messageCount = 0;
  mbox.on('message', function(msg) {
    let msgCur=(messageCount++)+1
    
    // parse message using MailParser
    var mailparser = new MailParser({ streamAttachments : true });
    mailparser.on("headers", function(headers){
        //console.log(`\n\nheader: ${headers.received}`);
    });
    mailparser.on('end', function(mail) {
        messages.push(mail);
        setTimeout(()=>{
          // console.log(`msgCur: ${msgCur}, messageCount: ${messageCount}`)
          if(msgCur===messageCount){// we are done
            // console.log('Finished parsing messages');
             allMessagesParsed(messages)
          }
        }, 100)
    })
    mailparser.write(msg);
    mailparser.end();
  })

  mbox.on('end', function() {});

  if (fs.existsSync(argv.input)) {
    var handle = fs.createReadStream(argv.input);
    handle.pipe(mbox);
  }
}

function allMessagesParsed(messages) {
  if (argv.o) {
    fs.writeFile(argv.output, JSON.stringify(obj), function(err) {
      if(err)
        return console.log(`Failure while writing to file: ${util.inspect(err)}`);
    });
  } else {
    let iMsg=1
    messages.forEach((msg)=>{
        console.log(`Msg ${iMsg++} of ${messages.length}: ${msg['receivedDate']} - ${msg['subject']}\n - keys Avail: ${Object.keys(msg)}\n~`)
    })
  }
}

main();
