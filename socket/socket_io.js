module.exports = function(io){
    console.log("io constructor initialization done");
}

module.exports.sendMessage = function(message){
  io.sockets.on("connection", function(socket){
      socket.on("message", function(data) {
        /*This event is triggered at the server side when client sends the data using socket.send() method */
        data = JSON.parse(data);

        console.log(data);
        /*Printing the data */
        var ack_to_client = {
          data: "Server Received the message"
        }
        socket.send(JSON.stringify(ack_to_client));
        /*Sending the Acknowledgement back to the client , this will trigger "message" event on the clients side*/
      });
  });

       /*Associating the callback function to be executed when client visits the page and
        websocket connection is made */

      var message_to_client = {
        data: message
      }
      
      io.sockets.send(JSON.stringify(message_to_client));
      /*sending data to the client , this triggers a message event at the client side */
      console.log('Socket.io send message to the client');
}