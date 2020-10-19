import consumer from "./consumer";

document.addEventListener("DOMContentLoaded", function(){
  const room = document.getElementById('room');
  var roomName;
  var userId;
  var recipientId;
  var userName;

  if (room != null) {
    roomName = room.getAttribute('data-room-name');
    userId = room.getAttribute('data-sender-id');
    recipientId = room.getAttribute('data-recipient-id');
    userName = room.getAttribute('data-sender-name');
  }
  const newMessage = document.getElementById('newMessage');
  const newConversationMessage = document.getElementById('new-chat-message');
  var messages = null;

  if (newMessage != null) {
    newMessage.addEventListener('keydown', function(event) {
      if (messages === null) {
        messages = consumer.subscriptions.create({ channel: "conversate", room_id: roomName, sender_name: userName, from_id: userId, to_id: recipientId, timestamp: new Date() }, {
          received(data) {
            const notifications = document.getElementById('messages');
            notifications.innerHTML += `
      <div class="flex items-start mb-4 text-sm bg-gray-400" >
        <!-- A message -->
        <div class="flex-1 overflow-hidden border-1 border-gray-600">
          <div>
            <span class="font-bold"> ${data.sender_name}</span>
            <span class="text-grey text-xs">${data.timestamp}</span>
          </div>
          <p class="text-black leading-normal"> ${data.message} </p>
        </div>
      </div>
             `;
          }
        });
      }

      if (event.keyCode === 13 && userName !== '') {
        const messageData = { message: newMessage.value, from_id: userId, sender_name: userName, to_id: recipientId, timestamp: new Date(), create: true };
        messages.send(messageData);
        newMessage.value = '';
      }
    });
  }

  var senderChannel = null;
  var recipientChannel = null;


  if (newConversationMessage != null) {

    console.log("Waiting for new messages");
    newConversationMessage.addEventListener('keydown', function(event) {

      const roomName = newConversationMessage.getAttribute('data-from-id');
      const userName = newConversationMessage.getAttribute('data-from-name');;
      const userId = newConversationMessage.getAttribute('data-from-id');
      const recipientId = newConversationMessage.getAttribute('data-to-id');

      if (senderChannel === null) {
        senderChannel = consumer.subscriptions.create({ channel: "conversate", room_id: roomName, sender_name: userName, from_id: userId, to_id: recipientId, timestamp: new Date() }, {
          received(data) {
            if (window.location.pathname.startsWith("/inbox")) {
              setTimeout(function () { window.location = window.location }, 500);
            }
          }
        });
      }


      if (recipientChannel === null) {
        recipientChannel = consumer.subscriptions.create({ channel: "conversate", room_id: recipientId, sender_name: userName, from_id: userId, to_id: recipientId, timestamp: new Date() }, {
          received(data) {
            if (window.location.pathname.startsWith("/inbox")) {
              setTimeout(function () { window.location = window.location }, 500);
            }
          }
        });
      }

      if (event.keyCode === 13 && userName !== '') {
        const messageData = { message: newConversationMessage.value, from_id: userId, sender_name: userName, to_id: recipientId, timestamp: new Date() };

        console.log("Sending", senderChannel, recipientChannel);
        senderChannel.send(Object.assign(messageData, { create: true  }));
        recipientChannel.send(Object.assign(messageData, { create: false }));

        newConversationMessage.value = '';
      }
    })
  }



  const id = "main-message-window";
  var conversationWindow = document.getElementById(id);
  if (conversationWindow) {
    conversationWindow.scrollTop = conversationWindow.scrollHeight - conversationWindow.clientHeight;
  }
});
