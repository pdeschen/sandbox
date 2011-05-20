var aam = function() {
	return ( {
		username: '',
		password: '',
		model : {logout: true},
		view : {},

		render : function(view, model, callback) {
			aam.model = model;
			aam.view = view;
			try {
				var html = Mustache.to_html(view, model);
				callback.call(this, html);
			} catch (error) {
				onError('Error while rendering template.');
			}
		},
		replace : function(html) {
			
			$('#dynamic').fadeOut('slow', function() {
				$('#dynamic').html(html);
				$('#dynamic').fadeIn('slow');
			});
		}
	});
}();

$.fn.shake = function(){ 
    this.each(function(init){ 
         var jqNode = $(this); 
         jqNode.css({position: 'relative'}); 
         for (var x = 1; x <= 3; x++){ 
              jqNode.animate({ left: -25 },10) 
              .animate({ left: 0 },50) 
              .animate({ left: 25 },10) 
              .animate({ left: 0 },50); 
         } 
    }); 
	return this; 
};

$(document).ready(function() {

	$(document).ajaxError(function (event, request, options) {

	    if (request.status === 401) {
	    	onError("oups");
	    }
	});
	
	function onError(message) {
		$('#errorMessage').text(message);
		$('#feedback .ui-state-error').fadeIn('slow', function() {
			$('#feedback .ui-state-error').delay(3000);
			$('#feedback .ui-state-error').fadeOut('slow', function() {
				$('#errorMessage').text('');
			});
		});
	}
	
	function validate() {
		aam.username = $('#loginform #user_login').val();
		aam.password = $('#loginform #user_pass').val();
		
		if (aam.username === '') {
			onError('Missing username.');
			$('#loginform #user_login').focus();
			return false;
		}
		else if (aam.password === '') {
			onError('Missing password.');
			$('#loginform #user_pass').focus();
			return false;
		}
		return true;
	}

	function login() {
		if (!validate()) {
			$('#loginform').shake();
			return;
		}

		try {
			$.ajax( {
				url : '/views/user.mustache',
				dataType : 'text',
				success : function(view) {
					aam.view = view;
					$.ajax( {
						url : '/model/user.json',
						dataType : 'json',
						'beforeSend': function(xhr) {
							xhr.setRequestHeader("Authorization", "Basic " + encodeBase64(aam.username, aam.password));
						},
						error : function(xhr, ajaxOptions, thrownError) {
							reset();
							onError('Invalid username or password. Please try again.');
							$('#loginform #user_login').focus();
						},
						success : function(model) {
							cookies();
							aam.model = model;
							aam.render(aam.view, aam.model, aam.replace);							
						}
					});
				},
				error : function(xhr, ajaxOptions, thrownError) {
					onError('Problem while fetching remote template.');
				}
			});

			
		} catch (error) {
			onError('Invalid JSON format.');
		}
	}
	
	function encodeBase64(username, password) {
		
		var bytes = Crypto.charenc.Binary.stringToBytes(username + ":" + password);
		var base64 = Crypto.util.bytesToBase64(bytes);
		return base64; 			
	}
	
	function cookies() {
		
		if ($('#rememberme').attr('checked')) {			
			// set cookies to expire in 14 days
			// we should encrypt (hmac?) the password
			$.cookie('username', aam.username, { expires: 14, path: '/*' });
			$.cookie('password', aam.password, { expires: 14, path: '/*' });
			$.cookie('remember', true, { expires: 14, path: '/*' });
		} else {
			reset();
		}		
	}
	
	function reset()
	{
		// reset cookies
		$.cookie('username', null);
		$.cookie('password', null);
		$.cookie('remember', null);
	}
		
	function logout() {
		try {
			var json = JSON.parse(model);
			aam.render(view, json, aam.replace);
		} catch (error) {
			onError('Invalid JSON format.');
		}
	}
	
	$('#loginform #user_login').val(aam.username);
	$('#loginform #user_pass').val(aam.password);
	
	$('#cta').bind('click', login);
});
