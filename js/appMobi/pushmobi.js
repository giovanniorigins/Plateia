var pushMobi = function () {
	return{
		un                   : '',
		pwd                  : '',
		email                : '',
		listening            : false,
		boxBg                : '#fff',
		fontColor            : '#000',
		font                 : 'arial',
		vibrateRepeat        : 0,
		failSilent           : false,
		authForm             : false, //silent, form
		sendUserPwd          : false,
		alertOnSuccessfulEdit: true,
		receivedDataCallback : '',
		findUserCallbackSet  : false,
		didCheckUser         : false,
		userAttrs            : false,

		/*****************************************************************************
		 INIT
		 - userId
		 - password
		 - email
		 - boxbg
		 - boxfont
		 - fail
		 - authForm
		 - receivedDataCallback
		 *****************************************************************************/
		init: function ( params ) {

			/************************************
			 Make sure we have access to the appMobi library
			 ************************************/
			try {
				AppMobi.device.appmobiversion;
			} catch ( er ) {
				alert( 'You are missing the appMobi library. Please include the appMobi library to support Push Messages.' );
				return false;
			}

			if ( params == undefined ) {
				tmpId = this.uid();
				params = {
					userId  : tmpId,
					password: 'password',
					email   : tmpId + '@appmobi.com'
				};
			}

			/************************************
			 Grab config settings
			 ************************************/
			if ( params.userId != undefined && params.userId != '' && params.userId != null ) {
				this.un = params.userId;
			}

			if ( params.password != undefined && params.password != '' && params.password != null ) {
				this.pwd = params.password;
			}

			if ( params.email != undefined && params.email != '' && params.email != null ) {
				this.email = params.email;
			}

			if ( params.boxBg != undefined ) {
				this.boxBg = params.boxBg;
			}

			if ( params.boxFont != undefined ) {
				this.font = params.boxFont;
			}

			if ( params.boxFontColor != undefined ) {
				this.fontColor = params.boxFontColor;
			}

			if ( params.fail == 'silent' ) {
				this.failSilent = true;
			}

			if ( params.receivedDataCallback != '' && params.receivedDataCallback != undefined && params.receivedDataCallback != 'undefined' ) {
				this.receivedDataCallback = params.receivedDataCallback;
			}

			if ( params.authForm != undefined && params.authForm != '' && params.authForm != null ) {
				this.authForm = true;
			}


			/************************************
			 Setup Event Listeners
			 ************************************/
			document.addEventListener( 'appMobi.notification.push.enable', pushMobi.pushEnabled, false );
			document.addEventListener( 'appMobi.notification.push.receive', pushMobi.pushReceive, false );
			document.addEventListener( "appMobi.notification.push.rich.close", pushMobi.richViewerClosed, false );
			document.addEventListener( "appMobi.notification.push.user.edit", pushMobi.pushUserEdit, false );
			document.addEventListener( "appMobi.notification.push.disable", pushMobi.pushDisabled, false );
			document.addEventListener( "appMobi.notification.push.send", pushMobi.pushSendEvent, false );
			document.addEventListener( "appMobi.notification.push.user.editattributes", pushMobi.pushUserEditAttributesEvent, false );

			/************************************
			 Figure out how we are authenticating
			 the user:
			 - cookie
			 - silent
			 - form
			 - sent from dev
			 ************************************/
			unCookie = AppMobi.cache.getCookie( "pushmobi_username" );
			console.log( unCookie );
			if ( unCookie != undefined && unCookie != '' ) {
				console.log( 'A' );
				this.un = unCookie;
				this.pwd = AppMobi.cache.getCookie( "pushmobi_password" );
				this.email = AppMobi.cache.getCookie( "pushmobi_email" );

				this.addPushUser();
				return true;

			} else if ( this.authForm ) {
				console.log( 'B' );
				this.displayAuthForm();
				return true;

			} else {

				if ( this.un == '' || this.un == null ) {
					this.un = this.uid();
				}
				if ( this.pwd == '' || this.pwd == null ) {
					this.pwd = 'password';
				}
				if ( this.email == '' || this.email == null ) {
					this.email = this.un + '@appmobi.com';
				}

				if ( this.un != '' && this.pwd != '' && this.email != '' ) {
					console.log( 'Ca' );
					this.addPushUser();
					return true;
				} else {
					console.log( 'Cb' );
					return this.error( 'Can not authenticate user for Push Messages' );
				}
			}


		},

		/*****************************************************************************
		 ADD PUSH USER
		 - Internaly called method to add a user
		 *****************************************************************************/
		addPushUser: function () {
			AppMobi.cache.setCookie( "pushmobi_username", this.un, -1 );
			AppMobi.cache.setCookie( "pushmobi_password", this.pwd, -1 );
			AppMobi.cache.setCookie( "pushmobi_email", this.email, -1 );
			console.log( this.un, this.pwd, this.email );
			AppMobi.notification.addPushUser( this.un, this.pwd, this.email );
			pushMobi.removeDiv( 'ampushform' );
		},


		/*****************************************************************************
		 DRAW BOX
		 - Internal call
		 - Helper to draw the base box to use for messages I want to show
		 *****************************************************************************/
		drawBox: function ( html ) {
			var d = document.createElement( "div" );
			d.id = "ampushform";
			d.style['position'] = 'fixed';
			d.style['top'] = '0';
			d.style['left'] = '0';
			d.style['background'] = this.boxBg;
			d.style['color'] = this.fontColor;
			d.style['font-family'] = this.font;
			d.style['text-align'] = 'left';
			d.style['width'] = '100%';
			d.style['height'] = '100%';
			d.style['padding'] = '10px 5px 20px 5px';
			d.style['margin'] = '0 auto';
			d.innerHTML = html;
			document.body.appendChild( d );
		},


		/*****************************************************************************
		 DISPLAY AUTH FORM
		 - internal call
		 - Creates HTML login box
		 - Calls DRAW BOX
		 *****************************************************************************/
		displayAuthForm: function () {
			var html = '';
			html += '<div style="width:90%; margin:0 auto;">';
			html += '<div style="font-weight:bold; font-size:18px;">Push Messaging Authentication</div>';
			html += '<div style="margin:10px 0 10px 0;">If you already have an account, sign in below. If not, just enter your email and an account will be created for you.</div>';
			html += '<div><b>Email</b></div>';
			html += '<div><input type="text" name="email" id="pushEmail" /></div>';
			html += '<div id="pushEmailError" style="display:none;">ERROR. Email is invalid.</div>';
			html += '<div style="font-weight:bold; margin:10px 0 0 0;">Password</div>';
			html += '<div><input type="password" name="password" id="pushPassword" /></div>';
			html += '<div style="margin:20px 0 0 0; text-align:center;"><div onclick="pushMobi.processAuthForm();" style="padding:20px 0 20px 0; -moz-border-radius:10px; border-radius:10px; background:#e54d26; color:#fff; font-weight:bold; font-size:20px;">Continue</div></div>';
			html += '</div>';
			this.drawBox( html );
		},

		/*****************************************************************************
		 DISPLAY UPDATE FORM
		 - Internal call
		 - Displays a form to the user to update thier creds
		 *****************************************************************************/
		displayUpdateForm: function () {
			var html = '';
			html += '<div>Update Your Push Messaging Information</div>';
			html += '<div>\Enter a new username and password for your account</div>';
			html += '<div>Email</div>';
			html += '<div><input type="text" name="email" id="pushEmail" /></div>';
			html += '<div id="pushEmailError" style="display:none;">ERROR. Email is invalid.</div>';
			html += '<div>Password</div>';
			html += '<div><input type="text" name="password" id="pushPassword" /></div>';
			html += '<div><button onclick="pushMobi.processUpdateForm();">Continue</button></div>';
			this.drawBox( html );
		},


		/*****************************************************************************
		 ### UPDATE PUSH USER
		 -function to update user
		 - email
		 - password
		 *****************************************************************************/
		updatePushUser: function ( params ) {
			if ( params.silent ) {
				this.alertOnSuccessfulEdit = false;
			}

			if ( params.email == '' || params.email == null || params.password == '' || params.password == null ) {
				this.displayAuthForm();
				return false;
			} else {
				AppMobi.notification.editPushUser( params.email, params.password );
				return true;
			}
		},

		/*****************************************************************************
		 ### DELETE PUSH USER
		 - deletes the user from this app
		 *****************************************************************************/
		deletePushUser: function () {
			AppMobi.cache.removeCookie( 'pushmobi_username' );
			AppMobi.cache.removeCookie( 'pushmobi_password' );
			AppMobi.cache.removeCookie( 'pushmobi_email' );
			AppMobi.notification.deletePushUser();
		},

		/*****************************************************************************
		 FIND PUSH USER
		 - userId
		 - email
		 - callback
		 *****************************************************************************/
		findPushUser: function ( params ) {
			var userId = '';
			var email = '';

			if ( params.userId != 'undefined' && params.userId != 'null' ) {
				userId = params.userId;
			}

			if ( params.email != 'undefined' && params.email != 'null' ) {
				email = params.email;
			}

			if ( email == '' && userId == '' ) {
				return this.error( 'You need to supply either a User Id or Email' );
			}

			if ( params.callback != 'undefined' && params.callback != 'null' && params.callback != '' ) {
				if ( !this.findUserCallbackSet ) {
					this.findUserCallbackSet = true;
					eval( "document.addEventListener('appMobi.notification.push.user.find'," + params.callback + ",false);" );
				}
				AppMobi.notification.findPushUser( userId, email );
			} else {
				this.error( 'You must supply a callback function to recieve data.' )
			}

		},

		/*****************************************************************************
		 SEND MESSAGE
		 - userId
		 - message
		 - data
		 *****************************************************************************/
		sendMessage: function ( params ) {

			if ( params.userId == undefined || params.userId == 'undefined' || params.userId == '' ) {
				return this.error( 'You must provide a User Id to send a Push Notification' );
			}

			if ( params.message == undefined || params.message == 'undefined' || params.message == '' ) {
				return this.error( 'You must provide a message to send a Push Notification' );
			}

			if ( params.data == undefined || params.data == 'undefined' || params.data == '' ) {
				params.data = {};
			}

			AppMobi.notification.sendPushNotification( params.userId, params.message, params.data );


		},

		/*****************************************************************************
		 User Data - Attributes
		 *****************************************************************************/
		saveUserAttributes: function ( objArr ) {
			if ( objArr != undefined ) {
				if ( objArr.length > 0 ) {
					pushMobi.userAttrs = new AppMobi.Notification.PushUserAttributes();
					for ( x = 0; x < objArr.length; x++ ) {
						pushMobi.setUserData( objArr[x].key, objArr[x].value );
					}
					AppMobi.notification.setPushUserAttributes( pushMobi.userAttrs );
				}
			}
		},

		setUserData: function ( key, value ) {
			if ( key != '' && value != '' ) {
				key = key.toLowerCase();

				switch ( key.charAt( 0 ) ) {
					case 's':
						i = new Number( key.charAt( 1 ) );
						if ( i < 1 || i > 6 ) {
							return this.error( 'Your attribute key it out of range. It must be between s1 and s6.' );
						}
						eval( 'pushMobi.userAttrs.' + key + '=value;' );
						break;

					case 'n':
						num = new Number( value );
						i = new Number( key.charAt( 1 ) );
						if ( i < 1 || i > 4 ) {
							return this.error( 'Your attribute key it out of range. It must be between n1 and n4.' );
						}
						if ( num == 'NaN' ) {
							return this.error( 'You are supplying a string when a number is expected.' );
						}
						eval( 'pushMobi.userAttrs.' + key + '=value;' );
						break;
				}

				return true;
			} else {
				return false;
			}
		},


		/*****************************************************************************
		 PUSH DISABLED EVENT
		 *****************************************************************************/
		pushUserEditAttributesEvent: function ( event ) {
			console.log( event );
			if ( event.success == false ) {
				this.error( "Error setting user attributes: " + event.message );
			}
		},


		/*****************************************************************************
		 PUSH DISABLED EVENT
		 *****************************************************************************/
		pushDisabled: function ( event ) {
			if ( event.success === false ) {
				pushMobi.error( "There was an error editing the Push user: " + event.message );
			}
		},

		/*****************************************************************************
		 PROCESS AUTH FORM
		 - called from the box
		 *****************************************************************************/
		processAuthForm: function () {
			var emailEl = document.getElementById( 'pushEmail' );
			var emailErrorEl = document.getElementById( 'pushEmailError' );
			var pwdEl = document.getElementById( 'pushPassword' );

			var email = this.trim( emailEl.value );
			var pwd = this.trim( pwdEl.value );

			emailErrorEl.style["display"] = "none";

			var atpos = email.indexOf( "@" );
			var dotpos = email.lastIndexOf( "." );
			if ( atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length ) {
				emailErrorEl.style["display"] = "block";
				return false;
			}

			if ( pwd == '' || pwd == null ) {
				//create new user
				this.email = email;
				this.pwd = this.uid( 'xxxx' );
				this.un = this.uid( '' );
				this.sendUserPwd = true;
			} else {
				//login user
				this.email = email;
				this.pwd = pwd;
				this.un = this.uid( '' );
			}

			this.addPushUser();

		},

		/*****************************************************************************
		 PROCESS UPDATE FORM
		 - Called from box button
		 *****************************************************************************/
		processUpdateForm: function () {
			var emailEl = document.getElementById( 'pushEmail' );
			var emailErrorEl = document.getElementById( 'pushEmailError' );
			var pwdEl = document.getElementById( 'pushPassword' );

			var email = this.trim( emailEl.value );
			var pwd = this.trim( pwdEl.value );

			emailErrorEl.style["display"] = "none";

			var atpos = email.indexOf( "@" );
			var dotpos = email.lastIndexOf( "." );
			if ( atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length ) {
				emailErrorEl.style["display"] = "block";
				return false;
			}

			if ( pwd == '' || pwd == null ) {
				pwdErrorEl.style["display"] = "block";
				return false;
			} else {
				//login user
				this.email = email;
				this.pwd = pwd;
				AppMobi.notification.editPushUser( email, pwd );
				return true;
			}

		},

		/*****************************************************************************
		 PUSH ENABLED EVENT
		 *****************************************************************************/
		pushEnabled: function ( event ) {
			this.un = AppMobi.cache.getCookie( "pushmobi_username" );
			this.pwd = AppMobi.cache.getCookie( "pushmobi_password" );
			this.email = AppMobi.cache.getCookie( "pushmobi_email" );

			if ( event.success === false ) {
				if ( !this.didCheckUser ) {
					AppMobi.notification.checkPushUser( this.un, this.pwd );
					this.didCheckUser = true;
				} else {
					pushMobi.alert( "There was an error enabling Push notifications: " + event.message );
				}
				return false;
			} else {
				if ( this.sendUserPwd ) {
					AppMobi.notification.sendPushUserPass();
					this.sendUserPwd = false;
				}
			}

			return true;
		},

		/*****************************************************************************
		 PUSH RECEIVED EVENT
		 *****************************************************************************/
		pushReceive: function ( event ) {
			try {
				var myNotifications = AppMobi.notification.getNotificationList();
				var len = myNotifications.length;
				for ( i = 0; i < len; i++ ) {
					//get the pushMobi message data
					msgObj = AppMobi.notification.getNotificationData( myNotifications[i] );
					//display the pushMobi message as a notification if there is no data
					if ( msgObj.isRich == false ) { //Is this a simple text push message?
						//YOUR CODE HERE - possibly do something more interesting than alert the text
						//pushMobi.displayPushMsg(msgObj.msg);
						pushMobi.alert( msgObj.msg, 'New Message', 'Close' );
						//////
						//remove the message from the server otherwise the app will
						//think it has more messages waiting for it
						AppMobi.notification.deletePushNotifications( msgObj.id );
					} else { //Show rich push messages in the rich viewer
						var px = screen.width - 30;
						AppMobi.notification.showRichPushViewer( msgObj.id, 5, 5, 5, 5, 20, 20 );
						break; // only one rich message at a time, will resume after richViewerClosed
					}

					if ( msgObj.data != 'null' ) {
						var msgData = msgObj.data;
						msgData = msgData.replace( /"/g, '\\"' );
						eval( pushMobi.receivedDataCallback + '("' + msgData + '")' );
					}
				}
			}
			catch ( e ) {
				return pushMobi.error( "error in processNotifications: " + e.message );
			}
		},


		/*****************************************************************************
		 PUSH USER EDITED EVENT
		 *****************************************************************************/
		pushUserEdit: function ( event ) {
			if ( event.success === false ) {
				this.error( "There was an error editing the Push user: " + event.message );
			} else {
				if ( this.alertOnSuccessfulEdit ) {
					this.alert( 'Your Push Messaging information has been updated', 'Success', 'Ok' );
				}
			}
			this.alertOnSuccessfulEdit = false;
		},


		/*****************************************************************************
		 PUSH SEND EVENT
		 *****************************************************************************/
		pushSendEvent: function ( event ) {
			if ( event.success === false ) {
				this.error( "There was an error sending your push message: " + event.message );
			}
		},

		/*****************************************************************************
		 RICH MSG CLOSED EVENT
		 *****************************************************************************/
		richViewerClosed: function ( event ) {
			AppMobi.notification.deletePushNotifications( event.id );
			this.pushReceive();
		},

		/*****************************************************************************
		 DISPLAY PUSH MSG
		 *****************************************************************************/
		displayPushMsg: function ( msg ) {
			var d = document.createElement( "div" );
			d.id = "ampushmsg";
			d.setAttribute( "align", "center" );
			d.setAttribute( "onclick", "pushMobi.removeDiv('ampushmsg')" );
			d.style['background'] = this.boxBg;
			d.style['font-family'] = this.font;
			d.style['text-align'] = 'center';
			d.style['width'] = '80%';
			d.style['padding'] = '20px 5px 20px 5px';
			d.style['border-radius'] = '10px';
			d.style['-moz-border-radius'] = '10px';
			d.style['margin'] = '20px auto';
			d.style.margin = "20px auto";
			d.innerHTML = msg;
			document.body.appendChild( d );
		},

		/*****************************************************************************
		 REMOVE DIV
		 *****************************************************************************/
		removeDiv: function ( id ) {
			d = document.getElementById( id );
			if ( d != null ) {
				document.body.removeChild( d );
			}
		},

		/*****************************************************************************
		 ALERT
		 *****************************************************************************/
		alert: function ( msg, title, button ) {
			if ( button == '' ) {
				button = 'Ok';
			}
			if ( title == '' ) {
				title = 'ATTENTION';
			}
			AppMobi.notification.alert( msg, title, button );
		},

		/*****************************************************************************
		 VIBRATE
		 *****************************************************************************/
		vibrate: function ( repeat ) {
			if ( repeat != null && repeat != '' ) {
				repeat = parseInt( repeat );
				if ( repeat == 'NaN' ) {
					repeat = 0;
				}
				this.vibrateRepeat = repeat;
			}

			if ( this.vibrateRepeat > 1 ) {
				AppMobi.notification.vibrate();
				this.vibrateRepeat--;
				setTimeout( "pushMobi.vibrate(" + this.vibrateRepeat + ")", 1100 );
			} else {
				AppMobi.notification.vibrate();
			}
		},

		/*****************************************************************************
		 BEEP
		 *****************************************************************************/
		beep: function ( cnt ) {
			if ( cnt != '' && cnt != null ) {
				cnt = parseInt( cnt );
				if ( cnt == 'NaN' ) {
					cnt = '';
				}
			}
			AppMobi.notification.beep( cnt );
		},


		/*****************************************************************************
		 ERROR
		 *****************************************************************************/
		error: function ( msg ) {
			if ( !this.failSilent ) {
				this.alert( msg, 'Error', 'Ok' );
			}
			return false;
		},


		/*****************************************************************************
		 TRIM
		 *****************************************************************************/
		trim: function ( str ) {
			return str.replace( /^\s\s*/, '' ).replace( /\s\s*$/, '' );
		},


		/*****************************************************************************
		 UID
		 *****************************************************************************/
		uid: function ( strPattern ) {
			if ( strPattern == '' || strPattern == null ) {
				strPattern = 'xxxxxxxxxxxx';
			}

			return strPattern.replace( /[xy]/g, function ( c ) {
				var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString( 16 );
			} );
		}
	}
}();