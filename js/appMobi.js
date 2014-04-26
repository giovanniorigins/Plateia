/*
 * Update App using AppMobi LiveUpdate
 */

/* If you decide to allow your application to handle Live Updates itself,
 this snippet will give you a starting point. Drop this javascript code
 into your application's <body> HTML tag to detect if an update has been
 successfully downloaded. */

function onUpdateAvailable ( evt ) {
	/* appMobi.updateAvailable indicates whether or not an over the air update is available or not. */
	if ( evt.type == "appMobi.device.update.available" || AppMobi.updateAvailable == true ) {
		//there is an application update available at startup
		if ( confirm( AppMobi.updateMessage ) == true ) {
			updateApplication();
		} else {
			updateApplicationLater();
		}
	}
}

function updateApplication () {
	/* installs an update if one is available */
	AppMobi.device.installUpdate();
}

function updateApplicationLater () {
	/* add any code to indicate that the update has been postponed */
	alert( "The update has been postponed" );
}

/* This event handler captures the event thrown when an update becomes available while an application is running */
document.addEventListener( "appMobi.device.update.available", onUpdateAvailable, false );
document.addEventListener( "appMobi.device.ready", onUpdateAvailable, false );

/*
 *  Push Messages using AppMobi Notifications
 */

/* This code is used to run as soon as appMobi activates */
var checkNotifs = function () {
	//See if the push user exists already
	//We are just using the unique device id, but you can send any unique user id and password.
	AppMobi.notification.checkPushUser( AppMobi.device.uuid, AppMobi.device.uuid );
};
document.addEventListener( "appMobi.device.ready", checkNotifs, false );

/* This code runs when notifications are registered */
var didAdd = false;
var notificationsRegistered = function ( event ) {
	//This is first called from the checkPushUser event above.
	//If a user is not found, success = false, and this tries to add that user.
	if ( event.success === false ) {
		if ( didAdd === false ) {
			didAdd = true;
			//AppMobi.notification.alert( "Doing addPushUser now...", "My Message", "OK" );
			//Try adding the user now - sending unique user id, password, and email address.
			AppMobi.notification.addPushUser( AppMobi.device.uuid, AppMobi.device.uuid, 'no@email.com' );
			//This will fire the push.enable event again, so that is why we use didAdd to make sure
			//we dont add the user twice if this fails for any reason.
			return;
		}
		//AppMobi.notification.alert("Notifications Failed: " + event.message,"My Message","OK");
		return;
	}
	var msg = event.message || 'success';
	//AppMobi.notification.alert("Notifications Enabled: " + msg,"My Message","OK");
};
document.addEventListener( "appMobi.notification.push.enable", notificationsRegistered, false );

/* This code runs when a push message is received
var receivedPush = function () {
	//Get the notifications object
	var myNotifications = AppMobi.notification.getNotificationList();
	//It may contain more than one message, so iterate over them
	var len = myNotifications.length;
	if ( len > 0 ) {
		for ( i = 0; i < len; i++ ) {
			//Get message object
			msgObj = AppMobi.notification.getNotificationData( myNotifications[i] );
			try {
				if ( typeof msgObj == "object" && msgObj.id == myNotifications[i] ) {
					//Display the message now.
					//You can do this however you like - it doesn't have to be an alert.
					//AppMobi.notification.alert( msgObj.msg + "\n" + msgObj.data + "\n" + msgObj.userkey, "pushMobi Message", "OK" );
					//Always mark the messages as read and delete them.
					//If you dont, your users will get them over and over again.

					//AppMobi.notification.deletePushNotifications( msgObj.id );
					return;
				}
				AppMobi.notification.alert( "Invalid Message Object: " + i, "My Message", "OK" );
			} catch ( e ) {
				AppMobi.notification.alert( "Caught Exception For: " + msgObj.id, "My Message", "OK" );
				//Always mark the messages as read and delete them.
				//If you dont, your users will get them over and over again.
				AppMobi.notification.deletePushNotifications( msgObj.id );
			}
		}
	}
};
document.addEventListener( "appMobi.notification.push.receive", receivedPush, false ); */