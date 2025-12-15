jQuery(document).ready(function($) {
	$( ".wpcf7-tel" ).each(function( index ) { 
		var onlyCountries_data = $(this).data("onlyct");
		var exclude = $(this).data("excludecountries");
		var preferredCountries_data = $(this).data("pre");
		var geoIpLookup_data = $(this).data("auto");
		var initialCountry_data = $(this).data("defcountry");
		var name = $(this).attr("name");
		var input = $(this).data("name");
		var data = [];
		if (onlyCountries_data == "") { 
			onlyCountries_data = [];
		}else{
			onlyCountries_data = onlyCountries_data.split('|');
		}
		if (exclude == "") { 
			exclude = [];
		}else{
			exclude = exclude.split('|');
		}

		if (preferredCountries_data == "") { 
			preferredCountries_data = [ "us", "gb" ];
		}else{
			preferredCountries_data = preferredCountries_data.split('|');
		}

		if (initialCountry_data == "") { 
			initialCountry_data = "auto";
		}
		//data.push({preferredCountries:preferredCountries_data});
		//data.push({initialCountry:initialCountry_data});
		//data.push({utilsScript:cf7_tel.utilsScript});
		//data.push({separateDialCode:true});
		//console.log(onlyCountries_data);
		
		if( $(this).data("auto") == 1 ){
			var iti = $( this ).intlTelInput({
				nationalMode: true,
				onlyCountries: onlyCountries_data,
				excludeCountries: exclude,
				initialCountry: initialCountry_data,
				preferredCountries: preferredCountries_data,
				utilsScript: cf7_tel.utilsScript,
				separateDialCode: true,
				hiddenInput: input,
				geoIpLookup: function(success, failure) {
				    $.get("https://ipinfo.io", function() {}, "jsonp").always(function(resp) {
				      var countryCode = (resp && resp.country) ? resp.country : "";
				      success(countryCode);
				    });
				 },
			});

			
		}else{
			var iti = $( this ).intlTelInput({
				onlyCountries: onlyCountries_data,
				excludeCountries: exclude,
				initialCountry: initialCountry_data,
				preferredCountries: preferredCountries_data,
				utilsScript: cf7_tel.utilsScript,
				separateDialCode: true,
				hiddenInput: input
			});
		}
		var form_datas =  JSON.parse(localStorage.getItem('cf7'));
		if(form_datas !== null) {
			Object.keys(form_datas).forEach(function(key1) { 
				var datas = form_datas[key1];
				var form = $("input[name='_wpcf7'][value='"+key1+"']").closest("form");
				Object.keys(datas).forEach(function(key) { 
					if( name == key ) {
						var default_code = datas[key +"-code"];
						var phone = datas[key];
						var full_phone = default_code+phone;
						iti.intlTelInput("setNumber",full_phone);
					}
				})
			})
		}
	})

	$("body").on("change",".wpcf7-tel",function(){
		var content = $.trim($(this).val());
		var number = $(this).intlTelInput("getNumber");
		$(this).next("input").val(number);
		
		if( $(this).data("validation") == 1 && content.length > 0 ) {
			var number = $(this).intlTelInput("getNumber");
			console.log(number);
			if ($(this).intlTelInput("isValidNumber")) { 
				console.log( $(this).intlTelInput("isValidNumber") );
				$(this).addClass('wpcf7-not-valid-blue').removeClass('wpcf7-not-valid-red').removeClass('wpcf7-not-valid');
				$(this).closest('.wpcf7-form-control-wrap').find('.wpcf7-not-valid-tip').hide();
				$(this).closest('form').find("input:submit").prop( 'disabled',false);
			}else{
				$(this).closest('form').find("input:submit").prop( 'disabled',true);
				$(this).addClass('wpcf7-not-valid-red').removeClass('wpcf7-not-valid-blue');
			}
		}
	})
	$( ".wpcf7-tel" ).keyup(function( event ) {
	 	var content = $.trim($(this).val());
		if( $(this).data("validation")  ) {

			if ($(this).intlTelInput("isValidNumber")) { 
				console.log( $(this).intlTelInput("isValidNumber") );
				$(this).addClass('wpcf7-not-valid-blue').removeClass('wpcf7-not-valid-red').removeClass('wpcf7-not-valid');
				$(this).closest('.wpcf7-form-control-wrap').find('.wpcf7-not-valid-tip').hide();
				$(this).closest('form').find("input:submit").prop( 'disabled',false);
			}else{
				$(this).closest('form').find("input:submit").prop( 'disabled',true);
				$(this).addClass('wpcf7-not-valid-red').removeClass('wpcf7-not-valid-blue');
			}
		}
	}).keydown(function( event ) {
	  
	});
///

	$( ".wpcf7-tel" ).focusout(function( event ) {
	    
	 	var content = $.trim($(this).val());
		if( $(this).data("validation")  ) {

			if ($(this).intlTelInput("isValidNumber")) { 
				console.log( $(this).intlTelInput("isValidNumber") );
				$(this).addClass('wpcf7-not-valid-blue').removeClass('wpcf7-not-valid-red').removeClass('wpcf7-not-valid');
				$(this).closest('.wpcf7-form-control-wrap').find('.wpcf7-not-valid-tip').hide();
				$(this).closest('form').find("input:submit").prop( 'disabled',false);
			}else{
				$(this).closest('form').find("input:submit").prop( 'disabled',true);
				$(this).addClass('wpcf7-not-valid-red').removeClass('wpcf7-not-valid-blue');
			}
		}
	});


///

	$("body").on("focus",".wpcf7-validates-as-tel",function(){
		$(this).removeClass('wpcf7-not-valid-blue').removeClass('wpcf7-not-valid-red');
	})
	document.addEventListener("countrychange", function() {
	  $(".wpcf7-tel").change();
	});
});