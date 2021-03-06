// Form validation logic

recheckActivated = false;

// Recheck plugin
(function ($) {
	$.fn.getVal = function(fieldname) {
		var b;
		$(this.serializeArray()).each(function() {
			if (!b && this.name == fieldname)
				b = this.value;
		});
		
		return b;
	}
	$.fn.isPracticallyEmpty = function() {
		// v = $('#appform').getVal(this.attr('name'));
		if (this.val().match(/^[\s-.]+$|^$/))
			return true;
		else
			return false;
	}
	// Invoked from an input control
	$.fn.recheck = function() {
		// the corresponding label
		l = $('label[for=' + this.attr('id') + ']');
		s = this.parents('fieldset');
		n = $(".form-nav a[href='#" + s.attr('id') + "']");

		if (this.isPracticallyEmpty()) {
			// mark labels and nav
			l.addClass('recheck');
			n.addClass('recheck');

			this.addClass('invalid');
			if (this.css('border-width') == 0)
				this.parents('span').addClass('invalid');
		}
		this.change(function() {
			t = $(this);
			l = $('label[for=' + t.attr('id') + ']');
			s = t.parents('fieldset');
			n = $(".form-nav a[href='#" + s.attr('id') + "']");

			if (!t.isPracticallyEmpty()) {
				t.removeClass('invalid');
				if (t.css('border-width') == 0)
					t.parents('span').removeClass('invalid');
				l.removeClass('recheck');

				if ($('.invalid', s).length == 0) {
					n.removeClass('recheck');
				}
			}
			else {
				l.addClass('recheck');
				n.addClass('recheck');
				t.addClass('invalid');
				if (t.css('border-width') == 0)
					t.parents('span').addClass('invalid');
			}
		});

		return this;	
	}
	
	activateRecheck = function() {
		console.log('hello');
		if (!recheckActivated) {
			// $('label.required').each(function() {
			// 	e = $('#' + $(this).attr('for'));
			// 	console.log(this, e);
			// 	if (!e.length) {
			// 		$(this).addClass('recheck');
			// 		$('input[name=' + $(this).attr('for') + ']').change(function() {
			// 			$('label[for=' + $(this).attr('name') + ']').removeClass('recheck');
			// 		});
			// 	}
			// 	else
			// 		e.recheck();
			// });

			required_fields = ["first_name","place_of_birth","applicant_email","applicant_address_street","sex","body_height","body_weight","blood_type","citizenship","religion","father_full_name","mother_full_name","number_of_children_in_family","nth_child","high_school_name","high_school_admission_year","high_school_graduation_year","junior_high_school_name","junior_high_school_graduation_year","elementary_school_name","elementary_school_graduation_year","years_speaking_english","favorite_subject","dream","arts_hobby","sports_hobby","motivation","hopes","recommendations_school_name","recommendations_school_address","recommendations_school_occupation","recommendations_school_work_address","recommendations_school_relationship","recommendations_nonschool_name","recommendations_nonschool_address","recommendations_nonschool_occupation","recommendations_nonschool_relationship","recommendations_close_friend_name","recommendations_close_friend_address","recommendations_close_friend_relationship","personality","strengths_and_weaknesses","stressful_conditions","biggest_life_problem","plans","grades_y1t1_average","grades_y1t1_subjects","grades_y1t2_average","grades_y1t2_subjects","grades_y2t1_average","grades_y2t1_subjects","grades_y2t2_average","grades_y2t2_subjects","grades_y3t1_average","grades_y3t1_subjects","grades_y3t2_average","grades_y3t2_subjects","grades_y4t1_average","grades_y4t1_subjects","grades_y4t2_average","grades_y4t2_subjects","grades_y5t1_average","grades_y5t1_subjects","grades_y5t2_average","grades_y5t2_subjects","grades_y7t1_average","grades_y7t1_subjects","grades_y7t2_average","grades_y7t2_subjects","grades_y8t1_average","grades_y8t1_subjects","grades_y8t2_average","grades_y8t2_subjects","grades_y10t1_average","grades_y10t1_subjects"];
			$(required_fields).each(function() {
				id = '#' + this;
				$(id).recheck();
			});

			$('[data-continent] select').recheck();

			// Program check
			afs = $('#program_afs');
			yes = $('#program_yes');
			$('#program_afs, #program_yes').each(function() {
				if (!afs.prop('checked') && !yes.prop('checked')) {
					afs.parents('tr').children('th.label').addClass('recheck');
					$(".form-nav a[href='#program']").addClass('recheck');
				}
			}).change(function() {
				if (!afs.prop('checked') && !yes.prop('checked')) {
					$(this).parents('tr').children('th.label').addClass('recheck');
					$(".form-nav a[href='#program']").addClass('recheck');
				}
				else {
					afs.parents('tr').children('th.label').removeClass('recheck');
					$(".form-nav a[href='#program']").removeClass('recheck');
				}
			});
			
			// // Grades check
			// for (i=1; i<=8; i++) {
			// 	if (i != 6) {
			// 		$('#grades_y' + i + 't1_average').recheck();
			// 		$('#grades_y' + i + 't1_subjects').recheck();
			// 		$('#grades_y' + i + 't2_average').recheck();
			// 		$('#grades_y' + i + 't2_subjects').recheck();
			// 	}
			// }
			// $('#grades_y10t1_rank').recheck();
			// $('#grades_y10t1_total').recheck();
		}

		recheckActivated = true;
	}
})(jQuery);

$(function(){
	$('span.phone-number input, span.number input')
		.focus(function(){$(this.parentNode).addClass('focus')})
		.blur(function(){$(this.parentNode).removeClass('focus')});

	function switchToTab(activeTab, direct) {
		if ($('#lastpane').val() == activeTab)
			return;

		if (!activeTab)
			activeTab = '#pribadi';

		if ($(activeTab).hasClass('pane')) {
			$('fieldset.pane').hide();
			
			$(".form-nav li a.active").each(function() {
				t = $(this);
				t.removeClass('active');
				$(t.attr('href')).removeClass('active').hide().trigger('deactivate');
			})

			$(".form-nav li a[href='" + activeTab + "']").addClass("active"); //Add "active" class to selected tab
	
			$("#lastpane").val(activeTab);

			$(activeTab).trigger('activate');
			
			if (direct) {
				$(window).scrollTop($('.page-header').offset().top);
				$(activeTab).addClass('active').show();
			}
			else {
				// Fade in
				$(activeTab).addClass('active').fadeIn('medium');
			}
		}
	}

	// Click Events
	$(".form-nav li a").click(function(e) {
		e.preventDefault();

		activeTab = $(this).attr("href"); //Find the href attribute value to identify the active tab + content
		
		switchToTab(activeTab);
		if (history.pushState)
			history.pushState(activeTab, $(this).text(), activeTab);
	});
	

	// Pagination
	function getNextTab() {
		return $(".form-nav a.active").parent().closest('li').next().children().first().attr('href');
	}
	function getPrevTab() {
		return	$(".form-nav a.active").parent().closest('li').prev().children().first().attr('href') ? 
				$(".form-nav a.active").parent().closest('li').prev().children().first().attr('href') :
				$(".form-nav a.active").parent().siblings().last().children().first().attr('href');
	}
	$("a[href='#_next']").click(function(e) {
		e.preventDefault();
		$(window).scrollTop(0);
		switchToTab(getNextTab());
	})
	$("a[href='#_prev']").click(function(e) {
		e.preventDefault();
		$(window).scrollTop(0);
		switchToTab(getPrevTab());
	})

	// History manipulation
	if (history.pushState) {
		window.onpopstate = function(e) {
			e.preventDefault();
			if (e.state)
				switchToTab(e.state);
			else if (window.location.hash)
				switchToTab(window.location.hash, true);
		}
	}
	if (last_pane) {
		console.log('here');
		window.onhashchange = function(e) { e.preventDefault(); $(document).scrollTop(0); return false; }
		window.location.hash = last_pane;
		$(document).scrollTop(0);
		$(document).load(function() {
			$(this).scrollTop(0);
		});
		$(document).scrollTop(0);
		if (!history.pushState)
			switchToTab(last_pane, true);
	}
	else if (window.location.hash) {
		switchToTab(window.location.hash, true);
		$(window).scrollTop(0);
	}
	else {
		window.onhashchange = function(e) { e.preventDefault(); $(document).scrollTop(0); return false; }
		window.location.replace('#pribadi');
		switchToTab('#pribadi', true);
	}

	toggleFinalizeButton = function(e) {

		if ($('#finalize').is(':checked')) {
			activateRecheck();
			if ($('.form-nav li a.recheck').length) {
				// Invalid elements still exist
				$('.recheck', '#finalisasi').show();
				$('.finalize-checkbox').hide();
				e.preventDefault();
				$('#finalize').prop('checked', false);
			}
			else {
				$('.recheck', '#finalisasi').hide();
				$('.finalize-checkbox').show();
				$('#finalize-button:parent').fadeIn('fast').focus();
			}
		}
		else
			$('#finalize-button:parent').hide();
	}
	$('#finalize').change(toggleFinalizeButton);


	$('fieldset#finalisasi')
		.on('activate', function() {
			if (!$('.form-nav li a.recheck').length) {
				$('.recheck', '#finalisasi').hide();
				$('.finalize-checkbox').show();
				$('#finalize-button:parent').fadeIn('fast').focus();
			}
			toggleFinalizeButton();
		})
		.on('deactivate', function() {
			$('p.save button').css('visibility', 'visible');
			$('.form-page-nav.below').show();
			$('#finalize').prop('checked', false);
			toggleFinalizeButton();
		});

	if (incomplete) {
		activateRecheck();
	}
	
	// Family
	$.fn.replaceKey = function(rand) {
		this.attr('name', this.attr('name').replace('[#]', '[' + rand + ']'));
	}
	fac = function() {
		$('td.sibling-name input').each(function() {
			t = $(this);
			if (!t.parent().parent().hasClass('prototype')) {
				if (t.val())
					t.parent().parent().removeClass('engineered').addClass('notempty');
				else
					t.parent().parent().addClass('engineered').removeClass('notempty');
			}
		})

		v = parseInt($(this).val());
		o = $('.siblings-table tbody tr').length - 1;
		if (v > o) {
			d = v - o - 1;
			for (i=0; i<d; i++) {
				cl = $('.prototype').clone().removeClass('prototype');
				rand = Math.ceil(Math.random() * 1000).toString();
				$('input, select', cl).each(function() { $(this).replaceKey(rand); } );
				$('.siblings-table tbody').append(cl);
			}
		}
		if (v <= o) {
			d = o - v + 1;
			for (i=0; i<d; i++) {
				$('tr.engineered').first().detach();
			}
		}
	}
	$('#number_of_children_in_family').click(fac);
	$('#number_of_children_in_family').change(fac);
	$('#number_of_children_in_family').keyup(fac);
	$('#keluarga input[type=number]').attr('min', 1);

	// YES filter: acceleration class cannot choose YES
	previously_selected_yes = $('#program_yes').prop('checked')
	checkAcc = function() {
		if ($('#in_acceleration_class').is(':checked')) {								
			previously_selected_yes = $('#program_yes').prop('checked');
			$('#program_yes').prop('checked', false)
			$('.programs-table .yes').hide();
			$('#country-prefs-td').attr('colspan', 1);
		}
		else {
			if (previously_selected_yes)
				$('#program_yes').prop('checked', true);
			else
				$('#program_yes').prop('checked', false);

			$('.programs-table .yes').show();
			$('#country-prefs-td').attr('colspan', 2);
		}
	}
	checkAcc();
	$('#in_acceleration_class').click(checkAcc);

	$('input[type=file]').change(function() { $(this).parents('form').submit() });
	
	// Country Preference Ordering
	$.fn.reserveCountry = function()  {
		this.each(function() {
			t = $(this);
			v = t.val();
			p = t.data('prev-value');
			t.data('prev-value', v);
			siblings = $('select', t.parents('li').siblings());
			// enable all options
			siblings.each(function() {
				$('option[value=' + p + ']', this).removeAttr('disabled');
			});

			// disable options with the same value as this one, except if it's empty
			if (v) siblings.each(function() {
				$('option[value=' + v + ']', this).attr('disabled', 'disabled');
			});
		});
		
		return this;
	};
	$('[data-continent] select')
		.reserveCountry()
		.change(function() {
			$(this).reserveCountry();
		});

	$('*[data-toggle]').each(function() {
		t = $(this);
		trigger = t.attr('data-toggle');

		if ($('#' + trigger).prop('checked'))
			t.show();
		else
			t.hide();

		$('#' + trigger).change(function() {
			if ($(this).prop('checked'))
				$('*[data-toggle=' + this.id + ']').fadeIn();
			else
				$('*[data-toggle=' + this.id + ']').hide();
		});
	});
	
	$(window).scroll(function(e) {
		el = $('.form-tools-container');
		t = $('.form-tools').offset().top;
		y = $(this).scrollTop();
		
		if (y >= t) {
			el.addClass('fixed');
		} else {
			console.log('no more');
			el.removeClass('fixed');
		}
	})
	
	$('#appform input, #appform select, #appform textarea').focus(function() {
		$(this).parents('tr').first().addClass('selected');
	});
	$('#appform input, #appform select, #appform textarea').blur(function() {
		$(this).parents('tr').first().removeClass('selected');
	});
	
	// AFS Program force checkbox
	$('#program_afs').change(function() {
		$(this).prop('checked', true);
	});

	// Typeahead for school names
	typeaheadSchool = function(query, process) {
		var schs = [];
		$('datalist[data-for=high_school_name] option[value*="' + query + '"]').each(function() {
			schs.push($(this).attr('value'));
		})

		return schs;
	}
	$('#high_school_name').typeahead({
		source: typeaheadSchool,
		items: 20
	});
});