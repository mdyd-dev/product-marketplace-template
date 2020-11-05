/*
	simple tool to handle notifications about new chat messages
	that uses WebSockets and Action Cable library to handle them

	https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
	https://www.npmjs.com/package/actioncable

	please keep in mind that this simple implementation does not
	verify if the user should get the notification in back-end and could
	be easily abused as it is done in front-end only;
	it's serves as an example
*/



// imports
// ------------------------------------------------------------------------
import consumer from "./consumer";



const chatNotifications = function(){

	// cache 'this' value not to be overwritten later
	const module = this;

	// purpose:		settings that are being used across the module
	// ------------------------------------------------------------------------
	module.settings = {};
	// do you want to enable debug mode that logs to console (bool)
	module.settings.debug = true;

	// the channel to receive notifications through (Action Cable channel)
	module.listeningChannel = null;

	module.settings.messageInput = document.querySelector('#chat-messageInput');
	// purpose:		creates a subscription to a room between users
	// returns:		triggers a 'message' event on document when new message
	//				appears on the channel (send or received)
	// ------------------------------------------------------------------------
	module.createSubscription = function(){
		module.listeningChannel = consumer.subscriptions.create(
			{
				channel: 'notifications',
				room_id: 'notifications-' + document.querySelector('#inbox-notifications').getAttribute('data-current-user-id')
			},
			{
				received: function(data){
					console.log('[Notifications] Notification received');
					console.log(data)
				},

				connected: function(data) {
					if(module.settings.debug){
						console.log(`[Notifications] Connected to channel and joined room notifications-${document.querySelector('#inbox-notifications').getAttribute('data-current-user-id')}`);
					}
				}
			}
		);
	};


	// purpose:		sends a notification to user of given id
	// ------------------------------------------------------------------------
	module.send = (userId, notificationData) => {
		let sendingChannel = consumer.subscriptions.create(
			{
				channel: 'notifications',
				room_id: 'notifications-' + userId
			},
			{
				received: function(data){
					if(module.settings.debug){
						console.log(`[Notifications] Notification for user ${userId} was send`);
						console.log(data)
					}
					
				},

				connected: function() {
					if(module.settings.debug){
						console.log(`[Notifications] Connected to channel with user ${userId}`);
					}
				}
			}
		);

		sendingChannel.send({message: 'test'});
	};


	// purpose:		initializes the module
	// ------------------------------------------------------------------------
	module.init = function(){

		// create subscription for the channel
		module.createSubscription();

	};

	module.init();

};


document.addEventListener('DOMContentLoaded', () => {
	document.chatNotifications = Object.freeze(new chatNotifications());
});



// import consumer from "./consumer";

// const inbox = document.getElementById('inbox-notifications');
// var current_user_id;
// if (inbox != null) {
//   current_user_id = inbox.getAttribute('data-current-user-id');
// }

// const inboxMainMessagesId = "main-message-window";
// const messagesBox = document.querySelector('#main-message-scroll');

// // purpose:		escapes the html to a browser-safe string
// // arguments:	a html string to be escaped (string/html)
// // returns:		a browser-safe string
// // ------------------------------------------------------------------------
// function encodeHtml(string)
// {
// 	var element = document.createElement('div');
// 	element.innerText = element.textContent = string;
// 	string = element.innerHTML;
// 	return string;
// }

// function notification(sender, message) {
//   if (!("Notification" in window)) {
//     console.log("This browser does not support desktop notification");
//   } else if (Notification.permission === "granted") {
//     var notification = new Notification(`${sender}: ${message}`);
//   } else if (Notification.permission !== "denied") {
//     Notification.requestPermission().then(function (permission) {
//       if (permission === "granted") {
//         var notification = new Notification(`${sender}: ${message}`);
//       }    
//     });
//   }
// }

// function appendToRecipientMessages(data) {
//   const messagesWindow = document.getElementById(inboxMainMessagesId);
//   if (messagesWindow != null) {
// 	let timestamp = new Date(data["timestamp"]);
// 	timestamp = timestamp.getHours() + ':' + timestamp.getMinutes();

//     const message = `
// <div class="flex mb-2 break-words justify-start">
//   <div class="max-w-full rounded py-2 px-3 bg-gray-300">
//     <p class="text-sm mt-1"> ${ encodeHtml(data["message"]) } </p>
//     <p class="text-right text-xs text-gray-500 mt-1"> ${ timestamp } </p>
//   </div>
// </div>
// `;
//     messagesWindow.insertAdjacentHTML('beforeend', message);
// 	scrollBottom();
//   }
// }

// document.addEventListener("DOMContentLoaded", function(){
//   console.log("Setup notifications for user #", current_user_id);

//   if (current_user_id != null) {

//     consumer.subscriptions.create({ channel: "conversate", room_id: current_user_id }, {
//       received(data) {
//         console.log("[Notofications] Recived notification");
//         if (data.to_id === current_user_id || data.from_id == current_user_id) {
//           if (data.to_id == current_user_id) {
// 			document.getElementById('notificationsBell').style.display = "block";
//             notification(data.sender_name, data.message);
//           }
//           if (window.location.pathname.startsWith("/inbox") && data.to_id == current_user_id) {
//             const room = document.getElementById('new-chat-message');
//             const sentTo = room.getAttribute('data-to-id');
//             if (sentTo == data.from_id) {
//               appendToRecipientMessages(data);
//             }
//           }
//         }
//       }
//     });
//   }
// });

// // purpose:		scrolls the chat window to the bottom
// // ------------------------------------------------------------------------
// function scrollBottom(){
// 	messagesBox.scrollTo(0, messagesBox.scrollHeight);
// };