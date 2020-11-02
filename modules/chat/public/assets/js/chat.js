!function(t){var e={};function n(o){if(e[o])return e[o].exports;var i=e[o]={i:o,l:!1,exports:{}};return t[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(o,i,function(e){return t[e]}.bind(null,i));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",Object.defineProperty(n,"p",{get:function(){try{if("string"!=typeof window.cdnUrl)throw new Error("WebpackRequireFrom: 'window.cdnUrl' is not a string or not available at runtime. See https://github.com/agoldis/webpack-require-from#troubleshooting");return window.cdnUrl}catch(t){return console.error(t),""}}}),n(n.s=2)}([function(t,e,n){"use strict";var o=n(1);e.a=Object(o.createConsumer)("/websocket")},function(t,e,n){!function(t){"use strict";var e={logger:self.console,WebSocket:self.WebSocket},n={log:function(){if(this.enabled){for(var t,n=arguments.length,o=Array(n),i=0;i<n;i++)o[i]=arguments[i];o.push(Date.now()),(t=e.logger).log.apply(t,["[ActionCable]"].concat(o))}}},o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},r=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),s=function(){return(new Date).getTime()},c=function(t){return(s()-t)/1e3},a=function(t,e,n){return Math.max(e,Math.min(n,t))},l=function(){function t(e){i(this,t),this.visibilityDidChange=this.visibilityDidChange.bind(this),this.connection=e,this.reconnectAttempts=0}return t.prototype.start=function(){this.isRunning()||(this.startedAt=s(),delete this.stoppedAt,this.startPolling(),addEventListener("visibilitychange",this.visibilityDidChange),n.log("ConnectionMonitor started. pollInterval = "+this.getPollInterval()+" ms"))},t.prototype.stop=function(){this.isRunning()&&(this.stoppedAt=s(),this.stopPolling(),removeEventListener("visibilitychange",this.visibilityDidChange),n.log("ConnectionMonitor stopped"))},t.prototype.isRunning=function(){return this.startedAt&&!this.stoppedAt},t.prototype.recordPing=function(){this.pingedAt=s()},t.prototype.recordConnect=function(){this.reconnectAttempts=0,this.recordPing(),delete this.disconnectedAt,n.log("ConnectionMonitor recorded connect")},t.prototype.recordDisconnect=function(){this.disconnectedAt=s(),n.log("ConnectionMonitor recorded disconnect")},t.prototype.startPolling=function(){this.stopPolling(),this.poll()},t.prototype.stopPolling=function(){clearTimeout(this.pollTimeout)},t.prototype.poll=function(){var t=this;this.pollTimeout=setTimeout((function(){t.reconnectIfStale(),t.poll()}),this.getPollInterval())},t.prototype.getPollInterval=function(){var t=this.constructor.pollInterval,e=t.min,n=t.max,o=t.multiplier*Math.log(this.reconnectAttempts+1);return Math.round(1e3*a(o,e,n))},t.prototype.reconnectIfStale=function(){this.connectionIsStale()&&(n.log("ConnectionMonitor detected stale connection. reconnectAttempts = "+this.reconnectAttempts+", pollInterval = "+this.getPollInterval()+" ms, time disconnected = "+c(this.disconnectedAt)+" s, stale threshold = "+this.constructor.staleThreshold+" s"),this.reconnectAttempts++,this.disconnectedRecently()?n.log("ConnectionMonitor skipping reopening recent disconnect"):(n.log("ConnectionMonitor reopening"),this.connection.reopen()))},t.prototype.connectionIsStale=function(){return c(this.pingedAt?this.pingedAt:this.startedAt)>this.constructor.staleThreshold},t.prototype.disconnectedRecently=function(){return this.disconnectedAt&&c(this.disconnectedAt)<this.constructor.staleThreshold},t.prototype.visibilityDidChange=function(){var t=this;"visible"===document.visibilityState&&setTimeout((function(){!t.connectionIsStale()&&t.connection.isOpen()||(n.log("ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = "+document.visibilityState),t.connection.reopen())}),200)},t}();l.pollInterval={min:3,max:30,multiplier:5},l.staleThreshold=6;var u={message_types:{welcome:"welcome",disconnect:"disconnect",ping:"ping",confirmation:"confirm_subscription",rejection:"reject_subscription"},disconnect_reasons:{unauthorized:"unauthorized",invalid_request:"invalid_request",server_restart:"server_restart"},default_mount_path:"/cable",protocols:["actioncable-v1-json","actioncable-unsupported"]},d=u.message_types,p=u.protocols,f=p.slice(0,p.length-1),h=[].indexOf,m=function(){function t(e){i(this,t),this.open=this.open.bind(this),this.consumer=e,this.subscriptions=this.consumer.subscriptions,this.monitor=new l(this),this.disconnected=!0}return t.prototype.send=function(t){return!!this.isOpen()&&(this.webSocket.send(JSON.stringify(t)),!0)},t.prototype.open=function(){return this.isActive()?(n.log("Attempted to open WebSocket, but existing socket is "+this.getState()),!1):(n.log("Opening WebSocket, current state is "+this.getState()+", subprotocols: "+p),this.webSocket&&this.uninstallEventHandlers(),this.webSocket=new e.WebSocket(this.consumer.url,p),this.installEventHandlers(),this.monitor.start(),!0)},t.prototype.close=function(){if((arguments.length>0&&void 0!==arguments[0]?arguments[0]:{allowReconnect:!0}).allowReconnect||this.monitor.stop(),this.isActive())return this.webSocket.close()},t.prototype.reopen=function(){if(n.log("Reopening WebSocket, current state is "+this.getState()),!this.isActive())return this.open();try{return this.close()}catch(t){n.log("Failed to reopen WebSocket",t)}finally{n.log("Reopening WebSocket in "+this.constructor.reopenDelay+"ms"),setTimeout(this.open,this.constructor.reopenDelay)}},t.prototype.getProtocol=function(){if(this.webSocket)return this.webSocket.protocol},t.prototype.isOpen=function(){return this.isState("open")},t.prototype.isActive=function(){return this.isState("open","connecting")},t.prototype.isProtocolSupported=function(){return h.call(f,this.getProtocol())>=0},t.prototype.isState=function(){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];return h.call(e,this.getState())>=0},t.prototype.getState=function(){if(this.webSocket)for(var t in e.WebSocket)if(e.WebSocket[t]===this.webSocket.readyState)return t.toLowerCase();return null},t.prototype.installEventHandlers=function(){for(var t in this.events){var e=this.events[t].bind(this);this.webSocket["on"+t]=e}},t.prototype.uninstallEventHandlers=function(){for(var t in this.events)this.webSocket["on"+t]=function(){}},t}();m.reopenDelay=500,m.prototype.events={message:function(t){if(this.isProtocolSupported()){var e=JSON.parse(t.data),o=e.identifier,i=e.message,r=e.reason,s=e.reconnect;switch(e.type){case d.welcome:return this.monitor.recordConnect(),this.subscriptions.reload();case d.disconnect:return n.log("Disconnecting. Reason: "+r),this.close({allowReconnect:s});case d.ping:return this.monitor.recordPing();case d.confirmation:return this.subscriptions.notify(o,"connected");case d.rejection:return this.subscriptions.reject(o);default:return this.subscriptions.notify(o,"received",i)}}},open:function(){if(n.log("WebSocket onopen event, using '"+this.getProtocol()+"' subprotocol"),this.disconnected=!1,!this.isProtocolSupported())return n.log("Protocol is unsupported. Stopping monitor and disconnecting."),this.close({allowReconnect:!1})},close:function(t){if(n.log("WebSocket onclose event"),!this.disconnected)return this.disconnected=!0,this.monitor.recordDisconnect(),this.subscriptions.notifyAll("disconnected",{willAttemptReconnect:this.monitor.isRunning()})},error:function(){n.log("WebSocket onerror event")}};var g=function(t,e){if(null!=e)for(var n in e){var o=e[n];t[n]=o}return t},b=function(){function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},o=arguments[2];i(this,t),this.consumer=e,this.identifier=JSON.stringify(n),g(this,o)}return t.prototype.perform=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return e.action=t,this.send(e)},t.prototype.send=function(t){return this.consumer.send({command:"message",identifier:this.identifier,data:JSON.stringify(t)})},t.prototype.unsubscribe=function(){return this.consumer.subscriptions.remove(this)},t}(),y=function(){function t(e){i(this,t),this.consumer=e,this.subscriptions=[]}return t.prototype.create=function(t,e){var n=t,i="object"===(void 0===n?"undefined":o(n))?n:{channel:n},r=new b(this.consumer,i,e);return this.add(r)},t.prototype.add=function(t){return this.subscriptions.push(t),this.consumer.ensureActiveConnection(),this.notify(t,"initialized"),this.sendCommand(t,"subscribe"),t},t.prototype.remove=function(t){return this.forget(t),this.findAll(t.identifier).length||this.sendCommand(t,"unsubscribe"),t},t.prototype.reject=function(t){var e=this;return this.findAll(t).map((function(t){return e.forget(t),e.notify(t,"rejected"),t}))},t.prototype.forget=function(t){return this.subscriptions=this.subscriptions.filter((function(e){return e!==t})),t},t.prototype.findAll=function(t){return this.subscriptions.filter((function(e){return e.identifier===t}))},t.prototype.reload=function(){var t=this;return this.subscriptions.map((function(e){return t.sendCommand(e,"subscribe")}))},t.prototype.notifyAll=function(t){for(var e=this,n=arguments.length,o=Array(n>1?n-1:0),i=1;i<n;i++)o[i-1]=arguments[i];return this.subscriptions.map((function(n){return e.notify.apply(e,[n,t].concat(o))}))},t.prototype.notify=function(t,e){for(var n=arguments.length,o=Array(n>2?n-2:0),i=2;i<n;i++)o[i-2]=arguments[i];return("string"==typeof t?this.findAll(t):[t]).map((function(t){return"function"==typeof t[e]?t[e].apply(t,o):void 0}))},t.prototype.sendCommand=function(t,e){var n=t.identifier;return this.consumer.send({command:e,identifier:n})},t}(),v=function(){function t(e){i(this,t),this._url=e,this.subscriptions=new y(this),this.connection=new m(this)}return t.prototype.send=function(t){return this.connection.send(t)},t.prototype.connect=function(){return this.connection.open()},t.prototype.disconnect=function(){return this.connection.close({allowReconnect:!1})},t.prototype.ensureActiveConnection=function(){if(!this.connection.isActive())return this.connection.open()},r(t,[{key:"url",get:function(){return S(this._url)}}]),t}();function S(t){if("function"==typeof t&&(t=t()),t&&!/^wss?:/i.test(t)){var e=document.createElement("a");return e.href=t,e.href=e.href,e.protocol=e.protocol.replace("http","ws"),e.href}return t}function w(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:A("url")||u.default_mount_path;return new v(t)}function A(t){var e=document.head.querySelector("meta[name='action-cable-"+t+"']");if(e)return e.getAttribute("content")}t.Connection=m,t.ConnectionMonitor=l,t.Consumer=v,t.INTERNAL=u,t.Subscription=b,t.Subscriptions=y,t.adapters=e,t.createWebSocketURL=S,t.logger=n,t.createConsumer=w,t.getConfig=A,Object.defineProperty(t,"__esModule",{value:!0})}(e)},function(t,e,n){"use strict";n.r(e);var o=n(0);const i=document.getElementById("room");var r,s,c,a;const l=document.querySelector("#inbox"),u=document.getElementById("newMessage"),d=document.getElementById("new-chat-message");var p=null,f=null,h=null,m=null;document.addEventListener("DOMContentLoaded",(function(){if(null!=i&&(r=i.getAttribute("data-room-name"),s=i.getAttribute("data-sender-id"),c=i.getAttribute("data-recipient-id"),a=i.getAttribute("data-sender-name")),null!=u&&(null===p&&(p=o.a.subscriptions.create({channel:"conversate",room_id:r,sender_name:a,from_id:s,to_id:c,timestamp:new Date},{received(t){console.log("[Profile] Recived (sender):",t);const e=document.getElementById("messages");null!=e&&1==t.create&&e.insertAdjacentHTML("afterbegin",`<div class="mb-4 text-sm bg-white" >\n        \x3c!-- A message --\x3e\n        <div class="flex-1 overflow-hidden">\n          <div>\n            <span class="font-bold"> ${t.sender_name}</span>\n            <span class="text-grey text-xs">${t.timestamp}</span>\n          </div>\n          <p class="text-black leading-normal"> ${t.message} </p>\n        </div>\n      </div>\n             `)}})),null===f&&(f=o.a.subscriptions.create({channel:"conversate",room_id:s},{received(t){console.log("[Profile] Recived (recipient):",t);const e=document.getElementById("messages");null!=e&&1==t.create&&e.insertAdjacentHTML("afterbegin",`\n      <div class="mb-4 text-sm bg-gray-100" >\n        \x3c!-- A message --\x3e\n        <div class="flex-1 overflow-hidden border-1 border-gray-600">\n          <div>\n            <span class="font-bold"> ${t.sender_name}</span>\n            <span class="text-grey text-xs">${t.timestamp}</span>\n          </div>\n          <p class="text-black leading-normal"> ${t.message} </p>\n        </div>\n      </div>\n             `)}})),u.addEventListener("keydown",(function(t){if(13===t.keyCode&&""!==a){const t={message:u.value,from_id:s,sender_name:a,to_id:c,timestamp:new Date,create:!0};p.send(Object.assign(t,{create:!0})),f.send(Object.assign(t,{create:!1})),u.value=""}}))),null!=d){console.log("[Inbox] Waiting for new messages");const t=d.getAttribute("data-from-id"),e=d.getAttribute("data-from-name"),n=d.getAttribute("data-from-id"),i=d.getAttribute("data-to-id");null===h&&(h=o.a.subscriptions.create({channel:"conversate",room_id:t,sender_name:e,from_id:n,to_id:i,timestamp:new Date},{received:function(t){t.from_id==n&&function(t){const e=document.getElementById("main-message-window");if(null!=e){const n=`\n<div class="flex mb-2 justify-end">\n  <div class="rounded py-2 px-3 bg-indigo-200">\n    <p class="text-sm mt-1"> ${t.message} </p>\n    <p class="text-right text-xs text-gray-500 mt-1"> ${t.timestamp} </p>\n  </div>\n</div>\n`;e.insertAdjacentHTML("afterbegin",n)}}(t)},connected:function(t){console.log("[Inbox] Connected to sender channel")}})),null===m&&(m=o.a.subscriptions.create({channel:"conversate",room_id:i,sender_name:e,from_id:n,to_id:i,timestamp:new Date},{received:function(t){console.log("[Inbox] Recived:",t);const e=document.getElementById("messages");null!=e&&e.insertAdjacentHTML("afterbegin",`\n      <div class="flex items-start mb-4 text-sm bg-gray-400" >\n        \x3c!-- A message --\x3e\n        <div class="flex-1 overflow-hidden border-1 border-gray-600">\n          <div>\n            <span class="font-bold"> ${t.sender_name}</span>\n            <span class="text-grey text-xs">${t.timestamp}</span>\n          </div>\n          <p class="text-black leading-normal"> ${t.message} </p>\n        </div>\n      </div>\n             `)},connected:function(t){console.log("[Inbox] Connected to recipient channel")}})),d.addEventListener("keydown",(function(t){if(13===t.keyCode&&""!==e){const t={message:d.value,from_id:n,sender_name:e,to_id:i,timestamp:new Date};h.send(Object.assign(t,{create:!0})),m.send(Object.assign(t,{create:!1})),d.value=""}})),l.style.height=`calc(100vh - ${l.offsetTop}px - 20px)`}}))}]);