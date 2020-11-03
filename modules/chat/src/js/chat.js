import consumer from "./consumer";

const room = document.getElementById('room');
var roomName;
var userId;
var recipientId;
var userName;
const inbox = document.querySelector('#inbox');
const newMessage = document.getElementById('newMessage');
const newConversationMessage = document.getElementById('new-chat-message');
const inboxMainMessagesId = "main-message-window";
const messagesBox = document.querySelector('#main-message-scroll');

// channels on profile page
var senderMessages = null;
var recipientMessages = null;

// channels on inbox page
var senderChannel = null;
var recipientChannel = null;



function appendToSenderMessages(data) {
  const messagesWindow = document.getElementById(inboxMainMessagesId);
  if (messagesWindow != null) {
    const message = `
<div class="flex mb-2 justify-end">
  <div class="rounded py-2 px-3 bg-indigo-200">
    <p class="text-sm mt-1"> ${ data["message"] } </p>
    <p class="text-right text-xs text-gray-500 mt-1"> ${ data["timestamp"] } </p>
  </div>
</div>
`;

	messagesWindow.insertAdjacentHTML('beforeend', message);
	scrollBottom();
  }
}


document.addEventListener("DOMContentLoaded", function(){
  if (room != null) {
    roomName = room.getAttribute('data-room-name');
    userId = room.getAttribute('data-sender-id');
    recipientId = room.getAttribute('data-recipient-id');
    userName = room.getAttribute('data-sender-name');
  }

  // for /profile
  if (newMessage != null) {
    if (senderMessages === null) {
      senderMessages = consumer.subscriptions.create({ channel: "conversate", room_id: roomName, sender_name: userName, from_id: userId, to_id: recipientId, timestamp: new Date() }, {
        received(data) {
          console.log("[Profile] Recived (sender):", data);
          const notifications = document.getElementById('messages');
          if (notifications != null && data.create == true) {
            notifications.insertAdjacentHTML('afterbegin', `<div class="mb-4 text-sm bg-white" >
        <!-- A message -->
        <div class="flex-1 overflow-hidden">
          <div>
            <span class="font-bold"> ${data.sender_name}</span>
            <span class="text-grey text-xs">${data.timestamp}</span>
          </div>
          <p class="text-black leading-normal"> ${data.message} </p>
        </div>
      </div>
             `);
          }
        }

      });
    }

    if (recipientMessages === null) {
      recipientMessages = consumer.subscriptions.create({ channel: "conversate", room_id: userId }, {
        received(data) {
          console.log("[Profile] Recived (recipient):", data);
          const notifications = document.getElementById('messages');

          if (notifications != null && data.create == true) {
            notifications.insertAdjacentHTML('afterbegin', `
      <div class="mb-4 text-sm bg-gray-100" >
        <!-- A message -->
        <div class="flex-1 overflow-hidden border-1 border-gray-600">
          <div>
            <span class="font-bold"> ${data.sender_name}</span>
            <span class="text-grey text-xs">${data.timestamp}</span>
          </div>
          <p class="text-black leading-normal"> ${data.message} </p>
        </div>
      </div>
             `);
          }

        }
      });
    }

    newMessage.addEventListener('keydown', function(event) {
      if (event.keyCode === 13 && userName !== '') {
        const messageData = { message: newMessage.value, from_id: userId, sender_name: userName, to_id: recipientId, timestamp: new Date(), create: true };
        senderMessages.send(Object.assign(messageData, { create: true  }));
        recipientMessages.send(Object.assign(messageData, { create: false }));
        newMessage.value = '';
      }
    });
  }

  // for /inbox
  if (newConversationMessage != null) {
    console.log("[Inbox] Waiting for new messages");

    const roomName = newConversationMessage.getAttribute('data-from-id');
    const userName = newConversationMessage.getAttribute('data-from-name');;
    const userId = newConversationMessage.getAttribute('data-from-id');
    const recipientId = newConversationMessage.getAttribute('data-to-id');

    if (senderChannel === null) {
      senderChannel = consumer.subscriptions.create({ channel: "conversate", room_id: roomName, sender_name: userName, from_id: userId, to_id: recipientId, timestamp: new Date() }, {
        received: function(data) {
          if (data.from_id == userId) {
            appendToSenderMessages(data);
          }
        },

        connected: function(data) {
          console.log("[Inbox] Connected to sender channel");
        }
      });
    }

    if (recipientChannel === null) {
      recipientChannel = consumer.subscriptions.create({ channel: "conversate", room_id: recipientId, sender_name: userName, from_id: userId, to_id: recipientId, timestamp: new Date() }, {
        received: function(data) {
          console.log("[Inbox] Recived:", data);
          const notifications = document.getElementById('messages');

          if (notifications != null) {

            notifications.insertAdjacentHTML('afterbegin', `
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
             `);
		  }
        },

        connected: function(data) {
          console.log("[Inbox] Connected to recipient channel");
        }

      });
    }

    newConversationMessage.addEventListener('keypress', function(event) {
      if (event.code === 'Enter' && userName !== '') {
        const messageData = { message: newConversationMessage.value, from_id: userId, sender_name: userName, to_id: recipientId, timestamp: new Date() };
        senderChannel.send(Object.assign(messageData, { create: true  }));
        recipientChannel.send(Object.assign(messageData, { create: false }));

		newConversationMessage.value = '';
      }
	});


	// purpose:		measures the height of the screen and fits the inbox
	// ------------------------------------------------------------------------
	function resizeInbox(){
		inbox.style.height = `calc(100vh - ${inbox.offsetTop}px - 20px)`;
	};

	resizeInbox();
  }
});

// purpose:		scrolls the chat window to the bottom
// ------------------------------------------------------------------------
function scrollBottom(){
	messagesBox.scrollTo(0, messagesBox.scrollHeight);
};

scrollBottom();