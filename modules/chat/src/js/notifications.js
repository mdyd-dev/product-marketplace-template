import consumer from "./consumer";

document.addEventListener("DOMContentLoaded", function(){
  const inbox = document.getElementById('inbox-notifications');
  const current_user_id = inbox.getAttribute('data-current-user-id');

  console.log("Setup notifications for user #", current_user_id);

  consumer.subscriptions.create({ channel: "conversate", room_id: current_user_id }, {
    received(data) {
      if (data.to_id === current_user_id || data.from_id == current_user_id) {
        document.getElementById('notificationsBell').style.display = "block";
        if (window.location.pathname.startsWith("/inbox") && data.to_id == current_user_id) {
          appendToRecipientMessages(data);
        }
      }
    }
  });
});


const inboxMainMessagesId = "main-message-window";
function appendToRecipientMessages(data) {
  const messagesWindow = document.getElementById(inboxMainMessagesId);
  if (messagesWindow != null) {
    const message = `
<div class="flex mb-2 justify-start">
  <div class="rounded py-2 px-3 bg-gray-300">
    <p class="text-sm mt-1"> ${ data["message"] } </p>
    <p class="text-right text-xs text-gray-500 mt-1"> ${ data["timestamp"] } </p>
  </div>
</div>
`;
    messagesWindow.innerHTML += message;
  }

}
