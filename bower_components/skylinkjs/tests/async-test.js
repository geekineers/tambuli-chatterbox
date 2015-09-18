(function() {

'use strict';

var test = require('tape');

window.io = require('socket.io-client');

window.AdapterJS = require('./../node_modules/adapterjs/publish/adapter.screenshare.js');
var skylink  = require('./../publish/skylink.debug.js');

var sw = new skylink.Skylink();

var apikey = '5f874168-0079-46fc-ab9d-13931c2baa39';


console.log('API: Tests the all the callbacks in functions');
console.log('===============================================================================================');


test('sendStream() - callback: Testing callback', function(t){
  t.plan(1);

  var stream_callback = function(error,success){
    if (error){
      t.fail('Send stream callback - failure');
    }
    else{
      t.pass('Send stream callback - success');
    }
    t.end();
  };

  sw.init(apikey,function(){
    sw.joinRoom({userData: 'PEER1'});
  });

  setTimeout(function(){
    sw.sendStream({
      audio: true,
      video: true
    },stream_callback);
  },4000);
});

test('getUserMedia() - callback: Testing callback', function(t){
  t.plan(1);

  var media_callback = function(error,success){
    if (error){
      t.fail('Get user media callback - failure');
    }
    else{
      t.pass('Get user media callback - success');
    }
    t.end();
  }

  sw.init(apikey,function(){
    sw.getUserMedia({
      audio: true,
      video: true
    },media_callback);
  });
});

test('Test init callback', function(t){
  t.plan(1);
  var array=[];
  var init_callback = function(error,success){
    if (error){
      console.log('Error init');
      array.push(-1);
    }
    else{
      console.log('Success init');
      array.push(1);
    }
  }

  sw.init(init_callback);
  sw.init(apikey,init_callback);
  setTimeout(function () {
    t.deepEqual(array, [-1,1], 'Test init callback');
    t.end();
  }, 4000);
});

test('sendBlobData() - callback: Testing success callback', function(t){
  t.plan(1);

  var array=[];
  var data = new Blob(['<a id="a"><b id="b">PEER1</b></a>']);
  var file_callback = function(error, success){
    if (error){
      array.push(-1);
    }
    else{
      array.push(1);
    }
  }

  sw.init(apikey,function(){
    sw.joinRoom({userData: 'self'});
  });

  setTimeout(function(){
    sw.sendBlobData(data, {
      name: 'accept',
      size: data.size,
    },file_callback);
  },5000);

  setTimeout(function () {
    t.deepEqual(array, [1], 'Test sendBlobData callback');
    sw.leaveRoom();
    t.end();
  }, 12000);
});

test('sendBlobData() - callback: Testing failure callback', function(t){
  t.plan(1);
  var array=[];
  var data = new Blob(['<a id="a"><b id="b">PEER1</b></a>']);
  var file_callback = function(error, success){
    if (error){
      array.push(-1);
    }
    else{
      array.push(1);
    }
  }

  setTimeout(function(){
    sw.sendBlobData(data, {
      name: 'reject',
      size: data.size,
    },file_callback);
  },5000);

  sw.init(apikey,function(){
    sw.joinRoom({userData: 'self'});
  });

  setTimeout(function () {
    t.deepEqual(array, [-1], 'Test sendBlobData callback rejected');
    sw.leaveRoom();
    t.end();
  }, 20000);
});

test('joinRoom() - callback: Testing callback', function(t){
  t.plan(1);
  var array = [];
  var count = 0;
  var join_callback = function(error, success){
    if (error){
      array.push('error');
    }
    else{
      array.push(count);
      count++;
    }
  }

  sw.init(apikey,function(){
    sw.joinRoom(function(){
      join_callback();
      sw.joinRoom(join_callback);
    });
  });

  setTimeout(function () {
    t.deepEqual(array, [0,1], 'Test joinRoom callback');
    t.end();
  }, 8000);
});

test('leaveRoom() - callback: Testing callback (in joinRoom() callback)', function(t){
  t.plan(1);
  var array = [];
  var leave_callback = function(error, success){
    if (error){
      array.push('leave_error');
      console.log(JSON.stringify(error));
    }
    else{
      array.push('leave_success');
    }
  }

  var join_callback = function(error, success){
    if (error){
      array.push('join_error');
    }
    else{
      array.push('join_success');
      sw.leaveRoom(leave_callback);
    }
  }

  sw.init(apikey,function(){
    sw.joinRoom(join_callback);
  });

  setTimeout(function () {
    t.deepEqual(array, ['join_success','leave_success'], 'Success callback called');
    sw.leaveRoom();
    t.end();
  }, 5000);
});

})();
