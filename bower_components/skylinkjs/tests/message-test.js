(function() {

'use strict';

// Depedencies
var test = require('tape');
window.io = require('socket.io-client');
window.AdapterJS = require('./../node_modules/adapterjs/source/adapter.js');
var skylink  = require('./../publish/skylink.debug.js');
var sw = new skylink.Skylink();

// Testing attributes
var apikey = '5f874168-0079-46fc-ab9d-13931c2baa39';


console.log('API: Tests the messaging in send message functions');
console.log('===============================================================================================');

sw.init(apikey, function(){
  sw.joinRoom();
});

test('_sendChannelMessage(): Jamming signaling messages', function(t){
  t.plan(40);

  var count = 0;

  sw.on('iceConnectionState', function(state) {
    if (state === sw.ICE_CONNECTION_STATE.COMPLETED) {
      for(var i = 0; i < 40; i++){
        sw.sendMessage('jam' + i);
      }
    }
  });

  sw.on('incomingMessage', function(message){
    if (message.content === ('jam' + count) ) {
      count += 1;
      t.pass('Tested jammed message ' + count);
    }

    if (count === 40) {
      sw.off('peerJoined');
      sw.off('incomingMessage');
      t.end();
    }
  });

  setTimeout(function(){
    sw.off('peerJoined');
    sw.off('incomingMessage');
    t.end();
  }, 100000);
});

test('sendMessage(): Testing signalling message', function (t) {
  t.plan(2);

  var received = 0;

  // ice connection state means the peer is connected,
  // datachannel should be connected by then

  // Start test signaling message
  sw.sendMessage('SIG-SEND-PUBLIC');
  console.log('Sending sig public');

  setTimeout(function () {
    sw.sendMessage('SIG-SEND-PRIVATE');
    console.log('Sending sig private');
  }, 1000);

  sw.on('incomingMessage', function (message, peerId, peerInfo, isSelf) {
    if (!isSelf) {
      if (message.content === 'SIG-PUBLIC') {
        if (message.isPrivate === false && message.isDataChannel === false) {
          t.pass('Signaling public message is correctly send and received');
        } else {
          t.fail('Signaling public message sending and receiving failed');
        }
        received += 1;
      }
      if (message.content === 'SIG-PRIVATE') {
        if (message.isPrivate === true && message.isDataChannel === false) {
          t.pass('Signaling private message is correctly send and received');
        } else {
          t.fail('Signaling private message sending and receiving failed');
        }
        received += 1;
      }
    }
  });

  setTimeout(function () {
    if (received === 0) {
      t.fail('Signaling public message sending and receiving failed - timeout');
      t.fail('Signaling private message sending and receiving failed - timeout');
    }
    if (received === 1) {
      t.fail('Signaling private message sending and receiving failed - timeout');
    }
    sw.off('peerJoined');
    sw.off('incomingMessage');
    t.end();
  }, 25000);
});

test('sendP2PMessage(): Testing datachannel message', function (t) {
  t.plan(2);

  var received = 0;

  setTimeout(function () {
    sw.sendP2PMessage('DC-SEND-PUBLIC');
    console.log('Sending dc public');
  }, 1000);

  setTimeout(function () {
    sw.sendP2PMessage('DC-SEND-PRIVATE');
    console.log('Sending dc private');
  }, 2000);

  sw.on('incomingMessage', function (message, peerId, peerInfo, isSelf) {
    if (!isSelf) {
      if (message.content === 'DC-PUBLIC') {
        if (message.isPrivate === false && message.isDataChannel === true) {
          t.pass('Datachannel public message is correctly send and received');
        } else {
          t.fail('Datachannel public message sending and receiving failed');
        }
        received += 1;
      }
      if (message.content === 'DC-PRIVATE') {
        if (message.isPrivate === true && message.isDataChannel === true) {
          t.pass('Datachannel private message is correctly send and received');
        } else {
          t.fail('Datachannel private message sending and receiving failed');
        }
        received += 1;
      }
    }
  });

  setTimeout(function () {
    if (received === 0) {
      t.fail('Datachannel public message sending and receiving failed - timeout');
      t.fail('Datachannel private message sending and receiving failed - timeout');
    }
    if (received === 1) {
      t.fail('Datachannel private message sending and receiving failed - timeout');
    }
    sw.off('peerJoined');
    sw.off('incomingMessage');
    t.end();
  }, 25000);
});

})();