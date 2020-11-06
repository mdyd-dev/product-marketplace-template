/*
  a very simple implementation of bi-directional chat module for platformOS
  that uses WebSockets and Action Cable library to handle them

  https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
  https://www.npmjs.com/package/actioncable
*/



// imports
// ------------------------------------------------------------------------
import consumer from "./consumer";


// purpose:		handles sending and receiving messages as well as the inbox page
// ************************************************************************
const chat = function(){

  // cache 'this' value not to be overwritten later
  const module = this;

  // purpose:		settings that are being used across the module
  // ------------------------------------------------------------------------
  module.settings = {};
  // do you want to enable debug mode that logs to console (bool)
  module.settings.debug = false;
  // the main container with the chat inbox (dom node)
  module.settings.inbox = document.querySelector('#chat-inbox');
  // the input for typing new message (dom node)
  module.settings.messageInput = document.querySelector('#chat-messageInput');
  // the box that contains the messages list and that can scroll (dom node)
  module.settings.messagesListContainer = document.querySelector('#chat-messagesList-container');
  // the box with all the messages stored (dom node)
  module.settings.messagesList = document.querySelector('#chat-messagesList');
  // the html template for the single message (function that returns template literal);
  module.settings.messageTemplate = data => {
    let date = new Date(data.timestamp);

    return `
    <li class="flex mb-2 break-words ${ data.status === 'sent' ? 'justify-end' : 'justify-start' }">
      <div class="max-w-full rounded py-2 px-3 ${ data.status === 'sent' ? 'bg-indigo-200' : 'bg-gray-300' }">
        <p class="text-sm mt-1">${data.message}</p>
        <p class="text-right text-xs text-gray-500 mt-1">${date.getHours()}:${date.getMinutes()}</p>
      </div>
    </li>
  `
  };
  // the id of the currently logged user (string)
  module.settings.currentUserId = module.settings.messageInput.getAttribute('data-from-id');

  // the channel to send messages through (Action Cable channel)
  module.channel = null;
  // the id for the conversation
  module.conversationId = module.settings.messageInput.getAttribute('data-conversation-id');


  // purpose:		escapes the html to a browser-safe string
  // arguments:	a html string to be escaped (string/html)
  // returns:		a browser-safe string
  // ------------------------------------------------------------------------
  function encodeHtml(string){
    var element = document.createElement('div');
    element.innerText = element.textContent = string;
    string = element.innerHTML;
    return string;
  };


  // purpose:		measures the height of the screen and fits the inbox
  // ------------------------------------------------------------------------
  const resizeInbox = () => {
    module.settings.inbox.style.height = `calc(100vh - ${module.settings.inbox.offsetTop}px - 20px)`;
  };


  // purpose:		scrolls the chat window to the bottom
  // ------------------------------------------------------------------------
  const scrollBottom = () => {
    module.settings.messagesListContainer.scrollTo(0, module.settings.messagesList.scrollHeight);
  };


  // purpose:		creates a subscription to a room between users
  // returns:		triggers a 'message' event on document when new message
  //				appears on the channel (send or received), passess the message details
  // ------------------------------------------------------------------------
  module.createSubscription = () => {
    module.channel = consumer.subscriptions.create(
      {
        channel: 'conversate',
        room_id: module.conversationId,
        sender_name: module.settings.messageInput.getAttribute('data-from-name'),
        from_id: module.settings.messageInput.getAttribute('data-from-id'),
        to_id: module.settings.messageInput.getAttribute('data-to-id'),
      },
      {
        received: function(data){
          document.dispatchEvent(new CustomEvent('message', {detail: Object.assign(data, { status: (module.settings.currentUserId == data.from_id) ? 'sent' : 'received'})}));

          if(module.settings.debug){
            console.log('[Inbox] Message received');
            console.log(data);
          }
        },

        connected: function() {
          if(module.settings.debug){
            console.log(`[Inbox] Connected to channel and joined room ${module.conversationId}`);
          }
        }
      }
    );
  };

  // purpose:		sends the message through the Action Cable
  // arguments:	the message to send (string)
  // ------------------------------------------------------------------------
  module.sendMessage = (message) => {
    let messageData = {
      message: encodeHtml(message),
      from_id: module.settings.messageInput.getAttribute('data-from-id'),
      sender_name: module.settings.messageInput.getAttribute('data-from-name'),
      to_id: module.settings.messageInput.getAttribute('data-to-id'),
      timestamp: new Date()
    };

    module.channel.send(Object.assign(messageData, { create: true }));

    if(module.settings.debug){
      console.log('[Inbox] Message sent');
      console.log(messageData);
    }
  };

  // purpose:		appends a message to the chat box
  // arguments:	all the message data that needs to be shown
  //				according to the template in messageTemplate (object)
  // ------------------------------------------------------------------------
  module.showMessage = (messageData) => {
    module.settings.messagesList.insertAdjacentHTML('beforeend', module.settings.messageTemplate(messageData));

    if(module.settings.debug){
      console.log('[Inbox] Message shown in chat');
    }
  };


  // purpose:		initializes the module
  // ------------------------------------------------------------------------
  module.init = () => {
    // resize the inbox to the screen
    resizeInbox();

    // create subscription for the channel
    module.createSubscription();

    // scroll to bottom after loading the messages
    scrollBottom();

    // handling what will happen on pressing enter in the input
    module.settings.messageInput.addEventListener('keypress', (event) => {
      if(event.key === 'Enter' && module.settings.messageInput.value.trim()){
        module.sendMessage(module.settings.messageInput.value.trim());
        module.settings.messageInput.value = '';
      }
    });

    // what will happen when new message appears in channel
    document.addEventListener('message', event => {
      module.showMessage(event.detail);
      scrollBottom();

      if(event.detail.status === 'sent'){
        document.chatNotifications.send(event.detail.to_id, event.detail);
      }
    });
    
  };

  module.init();

};

document.addEventListener('DOMContentLoaded', () => {
  if(document.querySelector('#chat-inbox')){
    document.chat = Object.freeze(new chat());
  }
});



// purpose:		handles the behavior of 'send message' button
// argumenst: configurable settings (object)
// ************************************************************************
const sendMessageButton = function(userSettings){

	// cache 'this' value not to be overwritten later
	const module = this;


  // purpose:		settings that are being used across the module
  // ------------------------------------------------------------------------
	module.settings = {};
	// the 'send message' button (dom node)
  module.sendMessageButton = userSettings.sendMessageButton ? userSettings.sendMessageButton : document.querySelector('.chat-sendMessage');
  

  // purpose:		blocks the button after first click to prevent
  //            cloning the conversations to a single user
  // ------------------------------------------------------------------------
  module.preventDoubleClick = () => {
    module.sendMessageButton.addEventListener('click', (event) => {
      module.sendMessageButton.setAttribute('disabled', 'disabled');
    });
  };


  // purpose:		initializes the module
  // ------------------------------------------------------------------------
  module.init = () => {
    module.preventDoubleClick();
  };

  module.init();

};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.chat-sendMessage').forEach((item) => {
    new sendMessageButton({
      sendMessageButton: item
    });
  });
});