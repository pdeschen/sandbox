var cst = function() {
	return ( {
		model : {},
		view : {},

		render : function(view, model, callback) {
			cst.model = model;
			cst.view = view;
			try {
				var html = Mustache.to_html(view, model);
				callback.call(this, html);
			} catch (error) {
				onError('Error while rendering template.');
			}
		},
		replace : function(html) {

			$('#view').val(cst.view);
			var json = JSON.stringify(cst.model, null, 4);
			$('#model').val(json);
			$('#raw').val(html);
			$('#dynamic').fadeOut('slow', function() {
				$('#dynamic').html(html);
				$('#dynamic').fadeIn('slow');
			});
		}
	});
}();

$(document).ready(function() {

	$.ajax( {
		url : 'model/test.json',
		dataType : 'json',
		error : function() {
			onError('Problem while fetching remote model.');
		},
		success : function(model) {
			$.ajax( {
				url : 'views/test.mustache',
				dataType : 'text',
				success : function(view) {
					cst.render(view, model, cst.replace);
				},
				error : function() {
					onError('Problem while fetching remote template.');
				}
			});
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

	function update() {
		var view = $('#view').val();
		var model = $('#model').val();
		try {
			var json = JSON.parse(model);
			cst.render(view, json, cst.replace);
		} catch (error) {
			onError('Invalid JSON format.');
		}
	}
	$('#cta').bind('click', update);
});
