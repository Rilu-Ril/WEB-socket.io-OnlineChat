var socket = io();

function escapeHTML(theString) {
	return theString
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		//.replace(/\//g, "&#47;")  // \/  represents the / here.
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function startup() {
	$("#main").hide();
	
	socket.on("tellThemAll", function(msg) {
		console.log("The server just said: " + msg);
		$("#conversation").append(escapeHTML(msg)+"\n");
	});
	
	socket.on("updateUserList", function(userList) {
		$("#userList").text("");
		var str = "";
		for(var j = 0; j < userList.length; j++) {
			str += escapeHTML(userList[j]) + "<br>";
		}
		$("#userList").html(str);
	});
	
	$("#loginButton").click(function() {
		var username = $("#username").val();
		socket.emit("login", username);
		$("#loginScreen").hide();
		$("#main").show();
	});

	$("#chatButton").click(function() {
		var s = $("#message").val();
		socket.emit("talk", s);
		$("#message").val("");
	});
}


$(startup);
