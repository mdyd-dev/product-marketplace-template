import consumer from "./consumer";

document.addEventListener("DOMContentLoaded", function(){
  const inbox = document.getElementById('inbox-notifications');
  const current_user_id = inbox.getAttribute('data-current-user-id');

  console.log("Setup notifications for user #", current_user_id);

  consumer.subscriptions.create({ channel: "conversate", room_id: current_user_id }, {
    received(data) {
      if (data.to_id === current_user_id || data.from_id == current_user_id) {
        document.getElementById('notificationsBell').style.display = "block";
        if (window.location.pathname.startsWith("/inbox")) {
          setTimeout(function () {
            window.location = window.location;
          }, 100);
        }
      }
    }
  });
});
