var map,
	lt,
	ln,
	pos,
	marker,
	isPos = false,
	sessionID,
	nick;
	
sessionID = prompt("What is your session ID?");
nick = prompt("What is your nickname?");

var socket = new WebSocket("ws://localhost:8081");

socket.onopen = function() {
  $("#chat").append("<div class='container'><p>System: session " + sessionID + " started</p></div>");
};

socket.onmessage = function(event) {
  var res = JSON.parse(event.data);
  
  console.log(res);
  
  if (res.type == "msg" && res.session == sessionID) {
  	$("#chat").append("<div class='container'><p>" + res.nick + ": " + res.text + "</p></div>");
  }
};

function send() {
	console.log("wadwadwda");

	var msg = $("#msg").val();
	
	if (msg != "" && sessionID !== "" && nick !== "") {
		socket.send(JSON.stringify({
			session: sessionID,
			type: "msg",
			nick: nick,
			text: msg
		}));
	} else {
		alert("You didn't wrote your Session ID or Nickname");
	}
  	return false;
}

socket.onerror = function(error) {
  console.log("Error " + error.message);
};

function getCoords() {
	$.post( "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAawABvA4Qu__y4BSFbGDXgy2kPshIGDkc", function( data ) {
		console.log(data);
  		setCoords(data);
	});
}

function setCoords (data) {
	lt = data.location.lat;
	ln = data.location.lng;
	pos = {
    	lat: lt,
    	lng: ln
    };

	isPos = true;
	changeLoc();
} 

function changeLoc() {
	pos = {
    	lat: lt,
    	lng: ln
    };
	map.panTo(pos);
	marker.setPosition(pos);
	
	
}

function init() {
    var coords = getCoords();
    var coordinates = {lat: -34.000, lng: 20.0000};

    map = new google.maps.Map(document.getElementById('map'), {
        center: coordinates,
        zoom: 15
    });

    var icon = {
    	url: "/images/User_Avatar.png", // url
    	scaledSize: new google.maps.Size(20, 20), // scaled size
    	origin: new google.maps.Point(0,0), // origin
    	anchor: new google.maps.Point(0, 0) // anchor
	};
    
    marker = new google.maps.Marker({
    	position: coordinates,
    	map: map,
    	icon:icon
  	});
	
	marker.setMap(map);
}

document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        lt += 0.0003
    }
    else if (e.keyCode == '40') {
        lt -= 0.0003
    }
    else if (e.keyCode == '37') {
       ln -= 0.0003
    }
    else if (e.keyCode == '39') {
       ln += 0.0003
    }
	
	changeLoc();
}
