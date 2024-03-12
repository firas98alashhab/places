(function($) {
    "use strict";

    function showSuccessMessage(message) {
        return '<div class="alert alert-success fade in show" role="alert">' +
                    '<div><span class="fa fa-check"></span></div>' +
                    message +
                '</div>';
    }

    function showErrorMessage(message) {
        return '<div class="alert alert-danger fade in show" role="alert">' +
                    '<div><span class="fa fa-exclamation"></span></div>' +
                    message +
                '</div>';
    }

    function urlParam(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
           return null;
        } else {
           return results[1] || 0;
        }
    }

    function getPathFromUrl(url) {
        return url.split("?")[0];
    }

    function userSignin() {
        $('.pxp-signin-modal-btn').addClass('disabled');
        $('.pxp-signin-modal-btn-text').hide();
        $('.pxp-signin-modal-btn-loading').show();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'     : 'resideo_user_signin',
                'signin_user': $('#pxp-signin-modal-email').val(),
                'signin_pass': $('#pxp-signin-modal-pass').val(),
                'security'   : $('#pxp-signin-modal-security').val()
            },
            success: function(data) {
                $('.pxp-signin-modal-btn').removeClass('disabled');
                $('.pxp-signin-modal-btn-loading').hide();
                $('.pxp-signin-modal-btn-text').show();

                if (data.signedin === true) {
                    var message = showSuccessMessage(data.message);

                    $('.pxp-signin-modal-message').empty().append(message).fadeIn('slow');
                    document.location.href = $('#pxp-signin-modal-redirect').val();
                } else {
                    var message = showErrorMessage(data.message);

                    $('.pxp-signin-modal-message').empty().append(message).fadeIn('slow');
                }
            },
            error: function(errorThrown) {}
        });
    }

    function userSignup() {
        $('.pxp-signup-modal-btn').addClass('disabled');
        $('.pxp-signup-modal-btn-text').hide();
        $('.pxp-signup-modal-btn-loading').show();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'          : 'resideo_user_signup',
                'signup_firstname': $('#pxp-signup-modal-firstname').val(),
                'signup_lastname' : $('#pxp-signup-modal-lastname').val(),
                'signup_email'    : $('#pxp-signup-modal-email').val(),
                'signup_pass'     : $('#pxp-signup-modal-pass').val(),
                'user_type'       : $('#pxp-signup-modal-user-type').val(),
                'terms'           : $('#pxp-signup-modal-terms').is(':checked'),
                'security'        : $('#pxp-signup-modal-security').val()
            },
            success: function(data) {
                $('.pxp-signup-modal-btn').removeClass('disabled');
                $('.pxp-signup-modal-btn-loading').hide();
                $('.pxp-signup-modal-btn-text').show();

                if (data.signedup === true) {
                    var message = showSuccessMessage(data.message);

                    $('#pxp-signup-modal').modal('hide');
                    $('#pxp-signin-modal').modal('show').on('shown.bs.modal', function(e) {
                        $('.pxp-signin-modal-message').empty().append(message).fadeIn('slow');
                    });
                } else {
                    var message = showErrorMessage(data.message);

                    $('.pxp-signup-modal-message').empty().append(message).fadeIn('slow');
                }
            },
            error: function(errorThrown) {

            }
        });
    }

    function forgotPassword() {
        $('.pxp-forgot-modal-btn').addClass('disabled');
        $('.pxp-forgot-modal-btn-text').hide();
        $('.pxp-forgot-modal-btn-loading').show();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'      : 'resideo_forgot_pass',
                'forgot_email': $('#pxp-forgot-modal-email').val(),
                'security'    : $('#pxp-forgot-modal-security').val()
            },

            success: function(data) {
                $('.pxp-forgot-modal-btn').removeClass('disabled');
                $('.pxp-forgot-modal-btn-loading').hide();
                $('.pxp-forgot-modal-btn-text').show();
                $('#pxp-forgot-modal-email').val('');

                if (data.sent === true) {
                    var message = showSuccessMessage(data.message);

                    $('.pxp-forgot-modal-message').empty().append(message).fadeIn('slow');
                } else {
                    var message = showErrorMessage(data.message);

                    $('.pxp-forgot-modal-message').empty().append(message).fadeIn('slow');
                }
            },
            error: function(errorThrown) {

            }
        });
    }

    function resetPassword() {
        $('.pxp-reset-modal-btn').addClass('disabled');
        $('.pxp-reset-modal-btn-text').hide();
        $('.pxp-reset-modal-btn-loading').show();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'  : 'resideo_reset_pass',
                'pass'    : $('#pxp-reset-modal-pass').val(),
                'key'     : urlParam('key'),
                'login'   : urlParam('login'),
                'security': $('#pxp-reset-modal-security').val()
            },

            success: function(data) {
                $('.pxp-reset-modal-btn').removeClass('disabled');
                $('.pxp-reset-modal-btn-loading').hide();
                $('.pxp-reset-modal-btn-text').show();
                $('#pxp-reset-modal-pass').val('');

                if (data.reset === true) {
                    var message = showSuccessMessage(data.message);

                    $('#pxp-reset-modal').modal('hide');
                    $('#pxp-signin-modal').modal('show').on('shown.bs.modal', function(e) {
                        $('.pxp-signin-modal-message').empty().append(message).fadeIn('slow');
                    });
                } else {
                    var message = showErrorMessage(data.message);

                    $('.pxp-reset-modal-message').empty().append(message).fadeIn('slow');
                }
            },
            error: function(errorThrown) {

            }
        });
    }

    /* Signin Modal */
    $('.pxp-signin-trigger').click(function() {
        $('#pxp-signup-modal').modal('hide');
        $('#pxp-signin-modal').modal('show');
    });
    $('#pxp-signin-modal').on('shown.bs.modal', function () {
        $('body').addClass('modal-open');
        $('#pxp-signin-modal-redirect').val(window.location.href.split(/\?|#/)[0]);
    });
    $('#pxp-signin-modal').on('hidden.bs.modal', function(e) {
        $('.pxp-signin-modal-message').empty();
        $('#pxp-signin-modal-email').val('');
        $('#pxp-signin-modal-pass').val('');
    });
    $('.pxp-signin-modal-btn').click(function() {
        userSignin();
    });
    $('#pxp-signin-modal-email, #pxp-signin-modal-pass').keydown(function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            userSignin();
        }
    });

    /* Signup Modal */
    $('.pxp-signup-trigger').click(function() {
        $('#pxp-signin-modal').modal('hide');
        $('#pxp-signup-modal').modal('show');
    });
    
    $('#pxp-signup-modal').on('shown.bs.modal', function () {
        $('body').addClass('modal-open');
    });
    $('#pxp-signup-modal').on('hidden.bs.modal', function(e) {
        $('.pxp-signup-modal-message').empty();
        $('#pxp-signup-modal-firstname').val('');
        $('#pxp-signup-modal-lastname').val('');
        $('#pxp-signup-modal-email').val('');
        $('#pxp-signup-modal-pass').val('');
    });
    $('.pxp-signup-modal-btn').click(function() {
        userSignup();
    });
    $('#pxp-signup-modal-firstname, #pxp-signup-modal-lastname, #pxp-signup-modal-email, #pxp-signup-modal-pass').keydown(function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            userSignup();
        }
    });

    /* Forgot Password Modal */
    $('.pxp-forgot-trigger').click(function() {
        $('#pxp-signin-modal').modal('hide');
        $('#pxp-forgot-modal').modal('show');
    });
    $('#pxp-forgot-modal').on('shown.bs.modal', function () {
        $('body').addClass('modal-open');
    });
    $('#pxp-forgot-modal').on('hidden.bs.modal', function(e) {
        $('.pxp-forgot-modal-message').empty();
        $('#pxp-forgot-modal-email').val('');
    });
    $('.pxp-forgot-modal-btn').click(function() {
        forgotPassword();
    });
    $('#pxp-forgot-modal-email').keydown(function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            forgotPassword();
        }
    });

    /* Reset Password Modal */
    if (urlParam('action') && urlParam('action') == 'rp') {
        $('#pxp-reset-modal').modal('show');
    }
    $('#pxp-reset-modal').on('hidden.bs.modal', function(e) {
        $('.pxp-reset-modal-message').empty();
        $('#pxp-reset-modal-pass').val('');
    });
    $('.pxp-reset-modal-btn').click(function() {
        resetPassword();
    });
    $('#pxp-reset-modal-pass').keydown(function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            resetPassword();
        }
    });

    // Contact form widget service
    $('.contact-widget-form-send').click(function() {
        var ajaxURL = services_vars.ajaxurl;
        var security = $('#contact_widget_security').val();
        var _self = $(this);

        _self.addClass('disabled');
        $('.contact-widget-form-response').empty().hide();
        $('.contact-widget-form-send-text').hide();
        $('.contact-widget-form-sending-text').show();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: ajaxURL,
            data: {
                'action'       : 'resideo_widget_contact_company',
                'company_email': $('#contact_widget_form_company_email').val(),
                'name'         : $('#contact_widget_form_name').val(),
                'phone'        : $('#contact_widget_form_phone').val(),
                'email'        : $('#contact_widget_form_email').val(),
                'message'      : $('#contact_widget_form_message').val(),
                'security'     : security
            },
            success: function(data) {
                var message = '';

                if (data.sent === true) {
                    message = showSuccessMessage(data.message);

                    $('#contact_widget_form_name').val('');
                    $('#contact_widget_form_phone').val('');
                    $('#contact_widget_form_email').val('');
                    $('#contact_widget_form_message').val('');
                } else {
                    message = showErrorMessage(data.message);
                }

                $('.contact-widget-form-response').append(message).fadeIn('slow');

                $('.contact-widget-form-sending-text').hide();
                $('.contact-widget-form-send-text').show();
                _self.removeClass('disabled');
            },
            error: function(errorThrown) {}
        });
    });

    // Single agent contact form
    $('.pxp-work-with-agent-modal-btn').click(function() {
        var _self = $(this);

        _self.addClass('disabled');
        $('.pxp-work-with-modal-response').empty().hide();
        $('.pxp-work-with-agent-modal-btn-text').hide();
        $('.pxp-work-with-agent-modal-btn-loading').show();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'      : 'resideo_work_with_agent',
                'agent_email': $('#pxp-single-agent-email').val(),
                'agent_id'   : $('#pxp-single-agent-id').val(),
                'user_id'    : $('#pxp-single-agent-user-id').val(),
                'firstname'  : $('#pxp-work-with-firstname').val(),
                'lastname'   : $('#pxp-work-with-lastname').val(),
                'email'      : $('#pxp-work-with-email').val(),
                'phone'      : $('#pxp-work-with-phone').val(),
                'interest'   : $('#pxp-work-with-interest').val(),
                'security'   : $('#pxp-single-agent-security').val(),
            },
            success: function(data) {
                _self.removeClass('disabled');
                $('.pxp-work-with-agent-modal-btn-text').show();
                $('.pxp-work-with-agent-modal-btn-loading').hide();

                if (data.sent === true) {
                    var message = showSuccessMessage(data.message);

                    $('.pxp-work-with-modal-response').empty().append(message).fadeIn('slow');

                    $('#pxp-work-with-firstname').val('');
                    $('#pxp-work-with-lastname').val('');
                    $('#pxp-work-with-email').val('');
                    $('#pxp-work-with-phone').val('');
                    $('#pxp-work-with-interest').val('');
                } else {
                    var message = showErrorMessage(data.message);

                    $('.pxp-work-with-modal-response').empty().append(message).fadeIn('slow');
                }
            },
            error: function(errorThrown) {}
        });
    });

    // Save properties search result
    $('.pxp-save-search-modal-btn').click(function() {
        var _self = $(this);

        _self.addClass('disabled');
        $('.pxp-save-search-modal-btn-text').hide();
        $('.pxp-save-search-modal-btn-loading').show();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'     : 'resideo_save_search',
                'search_name': $('#pxp-save-search-name').val(),
                'search_url' : window.location.href,
                'security'   : $('#pxp-save-search-security').val(),
            },
            success: function(data) {
                _self.removeClass('disabled');
                $('.pxp-save-search-modal-btn-text').show();
                $('.pxp-save-search-modal-btn-loading').hide();

                if (data.saved === true) {
                    var message = showSuccessMessage(data.message);

                    $('.pxp-save-search-modal-response').empty().append(message).fadeIn('slow');
                    $('#pxp-save-search-name').val('');
                } else {
                    var message = showErrorMessage(data.message);

                    $('.pxp-save-search-modal-response').empty().append(message).fadeIn('slow');
                }
            },
            error: function(errorThrown) {}
        });
    });

    $('#pxp-save-search-modal').on('hide.bs.modal', function() {
        $('.pxp-save-search-modal-response').empty();
        $('#pxp-save-search-name').val('');
    });

    $('.pxp-save-search-btn').click(function() {
        if (services_vars.user_logged_in == 0) {
            $('#pxp-signin-modal').modal('show');
        } else if(services_vars.user_logged_in == 1) {
            $('#pxp-save-search-modal').modal('show');
        }
    });

    // Contact agent form modal
    $('.pxp-contact-agent-modal-btn').click(function() {
        var _self = $(this);

        _self.addClass('disabled');
        $('.pxp-contact-agent-modal-btn-text').hide();
        $('.pxp-contact-agent-modal-btn-loading').show();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'     : 'resideo_contact_agent',
                'firstname'  : $('#pxp-contact-agent-firstname').val(),
                'lastname'   : $('#pxp-contact-agent-lastname').val(),
                'email'      : $('#pxp-contact-agent-email').val(),
                'phone'      : $('#pxp-contact-agent-phone').val(),
                'message'    : $('#pxp-contact-agent-message').val(),
                'agent_email': $('#pxp-modal-contact-agent-agent_email').val(),
                'agent_id'   : $('#pxp-modal-contact-agent-agent_id').val(),
                'user_id'    : $('#pxp-modal-contact-agent-user_id').val(),
                'link'       : $('#pxp-modal-contact-agent-link').val(),
                'title'      : $('#pxp-modal-contact-agent-title').val(),
                'security'   : $('#pxp-modal-contact-agent-security').val(),
            },
            success: function(data) {
                _self.removeClass('disabled');
                $('.pxp-contact-agent-modal-btn-loading').hide();
                $('.pxp-contact-agent-modal-btn-text').show();

                if (data.sent === true) {
                    var message = showSuccessMessage(data.message);

                    $('.pxp-contact-agent-modal-response').empty().append(message).fadeIn('slow');

                    $('#pxp-contact-agent-firstname').val('');
                    $('#pxp-contact-agent-lastname').val('');
                    $('#pxp-contact-agent-email').val('');
                    $('#pxp-contact-agent-phone').val('');
                    $('#pxp-contact-agent-message').val('');
                } else {
                    var message = showErrorMessage(data.message);

                    $('.pxp-contact-agent-modal-response').empty().append(message).fadeIn('slow');
                }
            },
            error: function(errorThrown) {}
        });
    });

    $('#pxp-contact-agent').on('hide.bs.modal', function() {
        $('.pxp-contact-agent-modal-response').empty();
        $('#pxp-contact-agent-firstname').val('');
        $('#pxp-contact-agent-lastname').val('');
        $('#pxp-contact-agent-email').val('');
        $('#pxp-contact-agent-phone').val('');
        $('#pxp-contact-agent-message').val($('#pxp-modal-contact-agent-hidden-message').html());
    });

    // Save property to wishlist
    $('#pxp-sp-top-btn-save').click(function() {
        var _self = $(this);

        if (_self.hasClass('pxp-is-saved')) {
            _self.removeClass('pxp-is-saved').html('<span class="fa fa-star-o"></span> ' + services_vars.wishlist_save);

            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: services_vars.ajaxurl,
                data: {
                    'action'  : 'resideo_remove_from_wishlist',
                    'user_id' : $('#pxp-sp-top-uid').val(),
                    'post_id' : $('#single_id').val(),
                    'security': $('#pxp-single-property-save-security').val()
                },
                success: function(data) {
                    if(data.removed === true) {}
                },
                error: function(errorThrown) {}
            });
        } else {
            _self.addClass('pxp-is-saved').html('<span class="fa fa-star"></span> ' + services_vars.wishlist_saved);

            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: services_vars.ajaxurl,
                data: {
                    'action'  : 'resideo_add_to_wishlist',
                    'user_id' : $('#pxp-sp-top-uid').val(),
                    'post_id' : $('#single_id').val(),
                    'security': $('#pxp-single-property-save-security').val()
                },
                success: function(data) {
                    if(data.saved === true) {}
                },
                error: function(errorThrown) {}
            });
        }
    });

    // Contact page form service
    $('.pxp-contact-form-btn').click(function() {
        var ajaxURL = services_vars.ajaxurl;
        var _self = $(this);

        _self.addClass('disabled');
        $('.pxp-contact-form-response').empty().hide();
        $('.pxp-contact-form-btn-text').hide();
        $('.pxp-contact-form-btn-sending').show();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: ajaxURL,
            data: {
                'action'       : 'resideo_contact_company',
                'company_email': $('#pxp-contact-form-company-email').val(),
                'name'         : $('.pxp-contact-form-name').val(),
                'email'        : $('.pxp-contact-form-email').val(),
                'reg'          : $('.pxp-contact-form-reg').val(),
                'phone'        : $('.pxp-contact-form-phone').val(),
                'message'      : $('.pxp-contact-form-message').val(),
                'security'     : $('#contact_page_security').val()
            },
            success: function(data) {
                var message = '';

                if (data.sent === true) {
                    message = showSuccessMessage(data.message);

                    $('.pxp-contact-form-name').val('');
                    $('.pxp-contact-form-phone').val('');
                    $('.pxp-contact-form-email').val('');
                    $('.pxp-contact-form-message').val('');
                } else {
                    message = showErrorMessage(data.message);
                }

                $('.pxp-contact-form-response').append(message).fadeIn('slow');

                $('.pxp-contact-form-btn-sending').hide();
                $('.pxp-contact-form-btn-text').show();
                _self.removeClass('disabled');
            },
            error: function(errorThrown) {}
        });
    });

    // Subscribe form service
    $('#pxp-subscribe-form-btn').click(function() { 
        var ajaxURL = services_vars.ajaxurl;
        var _self = $(this);

        _self.addClass('disabled');
        $('.pxp-subscribe-form-response').empty().hide();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: ajaxURL,
            data: {
                'action'  : 'resideo_save_subscription',
                'email'   : $('#pxp-subscribe-email').val(),
                'security': $('#security-subscribe').val()
            },
            success: function(data) {
                var message = '';

                if (data.save === true) {
                    message = showSuccessMessage(data.message);

                    $('#pxp-subscribe-email').val('');
                } else {
                    message = showErrorMessage(data.message);
                }

                $('.pxp-subscribe-form-response').append(message).fadeIn('slow');

                /* $('.pxp-contact-form-btn-sending').hide();
                $('.pxp-contact-form-btn-text').show(); */
                _self.removeClass('disabled');
            },
            error: function(errorThrown) {}
        });
    });

    function getTinymceContent(id) {
        if($('.pxp-is-tinymce').length > 0) {
            var content;
            var inputid = id;

            tinyMCE.triggerSave();

            var editor = tinyMCE.get(inputid);
            var textArea = jQuery('textarea#' + inputid);

            if (textArea.length > 0 && textArea.is(':visible')) {
                content = textArea.val();
            } else {
                content = editor.getContent();
            }

            return content;
        } else {
            return '';
        }
    }

    // Submit Property form service
    $('.pxp-submit-property-btn').click(function() {
        var amenities = [];
        var cfields   = [];
        var _self     = $(this);

        _self.addClass('disabled');
        $('.pxp-submit-property-btn-text').hide();
        $('.pxp-submit-property-btn-sending').show();

        $('#new_amenities input[type=checkbox]:checked').each(function(index) {
            amenities.push($(this).attr('id'));
        });

        $('.pxp-js-custom-field').each(function(index) {
            cfields.push({
                field_name     : $(this).attr('name'),
                field_value    : $(this).val(),
                field_mandatory: $(this).attr('data-mandatory')
            });
        });

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'      : 'resideo_save_property',
                'user'        : $('#current_user').val(),
                'new_id'      : $('#new_id').val(),
                'title'       : $('#new_title').val(),
                'type'        : $('#new_type').val(),
                'status'      : $('#new_status').val(),
                'overvew'     : getTinymceContent('new_overview'),
                'address'     : $('#new_address').val(),
                'lat'         : $('#new_lat_h').val(),
                'lng'         : $('#new_lng_h').val(),
                'street_no'   : $('#new_street_no').val(),
                'street'      : $('#new_street').val(),
                'neighborhood': $('#new_neighborhood').val(),
                'city'        : $('#new_city').val(),
                'state'       : $('#new_state').val(),
                'zip'         : $('#new_zip').val(),
                'price'       : $('#new_price').val(),
                'price_label' : $('#new_price_label').val(),
                'size'        : $('#new_size').val(),
                'beds'        : $('#new_beds').val(),
                'baths'       : $('#new_baths').val(),
                'cfields'     : cfields,
                'amenities'   : amenities,
                'video'       : $('#new_video').val(),
                'virtual_tour': $('#new_virtual_tour').val(),
                'gallery'     : $('#new_gallery').val(),
                'floor_plans' : $('#new_floor_plans').val(),
                'calculator'  : $('input[name=new_calculator]:checked').val(),
                'taxes'       : $('#new_taxes').val(),
                'hoa'         : $('#new_hoa').val(),
                'security'    : $('#security-submit-property').val(),
            },
            success: function(data) {
                if (data.save === true) {
                    $('#new_id').val(data.propID);

                    document.location.href = services_vars.list_redirect;
                } else {
                    $('.pxp-submit-property-response').html(data.message);
                    $('#pxp-submit-property-alert-modal').modal('show');

                    $('.pxp-submit-property-btn-sending').hide();
                    $('.pxp-submit-property-btn-text').show();
                    _self.removeClass('disabled');
                }

            },
            error: function(errorThrown) {}
        });
    });

    // Delete property on edit property page
    $('.pxp-submit-property-btn-delete-confirm').click(function() {
        var _self = $(this);

        _self.addClass('disabled');
        $('.pxp-submit-property-btn-delete-confirm-text').hide();
        $('.pxp-submit-property-btn-delete-confirm-sending').show();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'  : 'resideo_delete_property',
                'new_id'  : $('#new_id').val(),
                'security': $('#security-submit-property').val(),
            },
            success: function(data) {
                var message = '';

                if (data.delete === true) {
                    setTimeout(function() {
                        document.location.href = services_vars.list_redirect;
                    }, 1000);
                } else {
                    $('.pxp-submit-property-btn-delete-confirm-sending').hide();
                    $('.pxp-submit-property-btn-delete-confirm-text').show();
                    _self.removeClass('disabled');

                    $('#pxp-submit-property-delete-modal').on('hidden.bs.modal', function(e) {
                        $('.pxp-submit-property-response').html(data.message);
                        $('#pxp-submit-property-alert-modal').modal('show');
                    }).modal('hide');
                }
            },
            error: function(errorThrown) {}
        });
    });

    // Delete property from wishlist
    $('.pxp-wishlist-items-delete').click(function() {
        var delId = $(this).attr('data-id');

        $('#wishlist_del_id').val(delId);
    });
    $('.pxp-wishlist-btn-delete-confirm').click(function() {
        var _self = $(this);

        _self.addClass('disabled');
        $('.pxp-wishlist-btn-delete-confirm-text').hide();
        $('.pxp-wishlist-btn-delete-confirm-sending').show();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'  : 'resideo_remove_from_wishlist',
                'user_id' : $('#user_id').val(),
                'post_id' : $('#wishlist_del_id').val(),
                'security': $('#security-wishlist').val(),
            },
            success: function(data) {
                setTimeout(function() {
                    document.location.href = $('#wishlist_url').val();
                }, 1000);
            },
            error: function(errorThrown) {}
        });
    });
    $('#pxp-wishlist-delete-modal').on('hidden.bs.modal', function(e) {
        $('#wishlist_del_id').val('');
    });

    // Delete search item from saved searches list
    $('.pxp-saved-searches-items-delete').click(function() {
        var delName = $(this).attr('data-name');

        $('#searches_del_name').val(delName);
    });
    $('.pxp-saved-searches-btn-delete-confirm').click(function() {
        var _self = $(this);

        _self.addClass('disabled');
        $('.pxp-saved-searches-btn-delete-confirm-text').hide();
        $('.pxp-saved-searches-btn-delete-confirm-sending').show();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'     : 'resideo_delete_search',
                'user_id'    : $('#user_id').val(),
                'search_name': $('#searches_del_name').val(),
                'security'   : $('#security-deletesearch').val(),
            },
            success: function(data) {
                setTimeout(function() {
                    document.location.href = $('#searches_url').val();
                }, 1000);
            },
            error: function(errorThrown) {}
        });
    });
    $('#pxp-saved-searches-delete-modal').on('hidden.bs.modal', function(e) {
        $('#searches_del_name').val('');
    });

    // Manage pay per listing 
    var sPrice  = $('#standard_price').val();
    var fPrice  = $('#featured_price').val();
    var sfPrice = parseFloat(sPrice) + parseFloat(fPrice);

    $('.pxp-my-properties-item-payment-dropdown').click(function(event) {
        event.stopPropagation();
    });

    $('.pxp-my-featured').on('change', function() {
        var parentDropdown = $(this).parent().parent().parent();
        var payFeatured = parentDropdown.find('.pxp-pay-featured');
        var payBtn = parentDropdown.find('.pxp-pay-btn');
        var payTotal = parentDropdown.find('.pxp-pay-total');

        if ($(this).is(':checked')) {
            if (payFeatured.length > 0) {
                payBtn.attr('data-featured', '').show();
            } else {
                payTotal.text(sfPrice.toFixed(2));
                payBtn.attr('data-featured', '1');
            }
        } else {
            payBtn.attr('data-featured', '');

            if (payFeatured.length > 0) {
                payBtn.hide();
            } else {
                payTotal.text(parseFloat(sPrice));
            }
        }
    });

    $('.pxp-my-featured-free').on('change', function() {
        var parentDropdown = $(this).parent().parent().parent();
        var upgradeBtn = parentDropdown.find('.pxp-upgrade-btn');

        if ($(this).is(':checked')) {
            upgradeBtn.show();
        } else {
            upgradeBtn.hide();
        }
    });

    $('.pxp-upgrade-btn').on('click', function() {
        var _self = $(this);

        _self.addClass('disabled');
        _self.find('.pxp-my-properties-item-payment-upgrade-btn-text').hide();
        _self.find('.pxp-my-properties-item-payment-upgrade-btn-sending').show();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'  : 'resideo_upgrade_property_featured',
                'prop_id' : _self.attr('data-id'),
                'agent_id': _self.attr('data-agent-id'),
                'security': $('#securityUpgradeProperty').val()
            },
            success: function(data) {
                if (data.upgrade === true) {
                    document.location.href = services_vars.list_redirect;
                } else {
                    $('.pxp-my-properties-response').html(data.message);
                    $('#pxp-my-properties-alert-modal').modal('show');

                    _self.find('.pxp-my-properties-item-payment-upgrade-btn-sending').hide();
                    _self.find('.pxp-my-properties-item-payment-upgrade-btn-text').show();
                    _self.removeClass('disabled');
                }
            },
            error: function(errorThrown) {}
        });
    });

    $('.pxp-pay-btn').click(function() {
        var _self = $(this);

        _self.addClass('disabled');
        _self.find('.pxp-my-properties-item-payment-paypal-btn-text').hide();
        _self.find('.pxp-my-properties-item-payment-paypal-btn-sending').show();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'     : 'resideo_pay_listing',
                'prop_id'    : _self.attr('data-id'),
                'is_featured': _self.attr('data-featured'),
                'is_upgrade' : _self.attr('data-upgrade')
            },
            success: function(data) {
                if (data) {
                    window.location = data.url;
                } else {
                    _self.removeClass('disabled');
                    _self.find('.pxp-my-properties-item-payment-paypal-btn-sending').hide();
                    _self.find('.pxp-my-properties-item-payment-paypal-btn-text').show();
                }
            },
            error: function(errorThrown) {}
        });
    });

    $('.pxp-featured-btn').on('click', function() {
        var _self = $(this);

        _self.addClass('disabled');
        _self.find('.pxp-my-properties-item-payment-featured-btn-text').hide();
        _self.find('.pxp-my-properties-item-payment-featured-btn-sending').show();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'   : 'resideo_set_property_featured',
                'prop_id'  : _self.attr('data-id'),
                'agent_id' : _self.attr('data-agent-id'),
                'security' : $('#securityFeaturedProperty').val()
            },
            success: function(data) {
                if (data.upgrade === true) {
                    document.location.href = services_vars.list_redirect;
                } else {
                    $('.pxp-my-properties-response').html(data.message);
                    $('#pxp-my-properties-alert-modal').modal('show');

                    _self.find('.pxp-my-properties-item-payment-featured-btn-sending').hide();
                    _self.find('.pxp-my-properties-item-payment-featured-btn-text').show();
                    _self.removeClass('disabled');
                }
            },
            error: function(errorThrown) {}
        });
    });

    // Delete property item from my properties list
    $('.pxp-my-properties-items-delete').click(function() {
        var delId = $(this).attr('data-id');

        $('#del_id').val(delId);
    });
    $('.pxp-my-properties-btn-delete-confirm').click(function() {
        var _self = $(this);

        _self.addClass('disabled');
        $('.pxp-my-properties-btn-delete-confirm-text').hide();
        $('.pxp-my-properties-btn-delete-confirm-sending').show();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'  : 'resideo_delete_property',
                'new_id'  : $('#del_id').val(),
                'security': $('#security-submit-property').val(),
            },
            success: function(data) {
                if (data.delete === true) {
                    setTimeout(function() {
                        document.location.href = services_vars.list_redirect;
                    }, 1000);
                } else {
                    $('.pxp-my-properties-btn-delete-confirm-sending').hide();
                    $('.pxp-my-properties-btn-delete-confirm-text').show();
                    _self.removeClass('disabled');

                    $('#pxp-my-properties-delete-modal').on('hidden.bs.modal', function(e) {
                        $('.pxp-my-properties-response').html(data.message);
                        $('#pxp-my-properties-alert-modal').modal('show');
                    }).modal('hide');
                }
            },
            error: function(errorThrown) {}
        });
    });
    $('#pxp-my-properties-delete-modal').on('hidden.bs.modal', function(e) {
        $('#del_id').val('');
    });

    // Set leads charts
    if ($('.pxp-my-leads-charts').length > 0) {
        var leadsNoChartElem = document.getElementById('pxp-leads-chart').getContext('2d');

        var gradient = leadsNoChartElem.createLinearGradient(0, 250, 0, 0);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(.5, 'rgba(0, 112, 201, 0.09)');
        gradient.addColorStop(1, 'rgba(0, 112, 201, 0.12)');

        var leadsNoChart = new Chart(leadsNoChartElem, {
            type: 'line',
            data: {
                labels: ['', '', '', '', '', '', ''],
                datasets: [{
                    label: services_vars.leads,
                    data: [0, 0, 0, 0, 0, 0, 0],
                    borderWidth: 3,
                    borderColor: 'rgba(0, 112, 201, 1)',
                    pointBackgroundColor: 'rgba(255, 255, 255, 0)',
                    pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
                    pointBorderColor: 'rgba(66, 133, 244, 0)',
                    pointHoverBorderColor: 'rgba(0, 112, 201, 1)',
                    pointBorderWidth: 10,
                    pointHoverBorderWidth: 3,
                    pointHitRadius: 20,
                    cubicInterpolationMode: 'monotone',
                    fill: true,
                    backgroundColor: gradient
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        ticks: {
                            fontColor: 'rgba(153, 153, 153, 1)',
                            maxTicksLimit: 7,
                            maxRotation: 0
                        },
                        gridLines: {
                            zeroLineColor: 'rgba(232, 232, 232, 1)',
                            drawOnChartArea: false,
                        },
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: 'rgba(153, 153, 153, 1)',
                            callback: function(value, index, values) {
                                if (Math.floor(value) === value) {
                                    return value;
                                }
                            }
                        },
                        gridLines: {
                            zeroLineColor: 'rgba(232, 232, 232, 0)',
                        },
                    }],
                },
                responsive: true,
                tooltips: services_vars.theme_mode == 'dark' ? {
                    backgroundColor: 'rgba(0, 0, 0, 1)',
                    borderColor: 'rgba(255, 255, 255, 1)',
                    borderWidth: 2,
                    cornerRadius: 5,
                    mode: 'index',
                    intersect: false,
                    displayColors: false,
                    xPadding: 10,
                    yPadding: 10,
                    titleFontColor: 'rgba(255, 255, 255, .7)',
                    bodyFontColor: 'rgba(255, 255, 255, 1)',
                    titleFontStyle: 'normal',
                    bodyFontStyle: 'bold',
                } : {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    borderColor: 'rgba(51, 51, 51, 1)',
                    borderWidth: 2,
                    cornerRadius: 5,
                    mode: 'index',
                    intersect: false,
                    displayColors: false,
                    xPadding: 10,
                    yPadding: 10,
                    titleFontColor: 'rgba(153, 153, 153, 1)',
                    bodyFontColor: 'rgba(51, 51, 51, 1)',
                    titleFontStyle: 'normal',
                    bodyFontStyle: 'bold',
                },
                legend: {
                    display: false,
                }
            }
        });

        var leadsContactChartElem = document.getElementById('pxp-contacts-chart').getContext('2d');
        var leadsContactChart = new Chart(leadsContactChartElem, {
            type: 'doughnut',
            data: {
                labels: [services_vars.contacted, services_vars.not_contacted],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: ['rgba(0, 112, 201, 1)', 'rgba(153, 198, 233, 1)'],
                    borderWidth: [2, 2],
                    borderColor: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)'],
                    hoverBackgroundColor: ['rgba(0, 112, 201, 1)', 'rgba(153, 198, 233, 1)'],
                    hoverBorderWidth: [6, 6],
                    hoverBorderColor: ['rgba(0, 112, 201, .5)', 'rgba(153, 198, 233, .5)'],
                }],
            },
            options: {
                responsive: true,
                cutoutPercentage: 70,
                tooltips: services_vars.theme_mode == 'dark' ? {
                    backgroundColor: 'rgba(0, 0, 0, 1)',
                    borderColor: 'rgba(255, 255, 255, 1)',
                    borderWidth: 2,
                    cornerRadius: 5,
                    displayColors: false,
                    xPadding: 10,
                    yPadding: 10,
                    titleFontColor: 'rgba(255, 255, 255, .7)',
                    bodyFontColor: 'rgba(255, 255, 255, 1)',
                    titleFontStyle: 'normal',
                    bodyFontStyle: 'bold',
                } : {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    borderColor: 'rgba(51, 51, 51, 1)',
                    borderWidth: 2,
                    cornerRadius: 5,
                    displayColors: false,
                    xPadding: 10,
                    yPadding: 10,
                    titleFontColor: 'rgba(153, 153, 153, 1)',
                    bodyFontColor: 'rgba(51, 51, 51, 1)',
                    titleFontStyle: 'normal',
                    bodyFontStyle: 'bold',
                },
                legend: {
                    display: false,
                },
                aspectRatio: 1
            }
        });

        var leadsScoreChartElem = document.getElementById('pxp-score-chart').getContext('2d');
        var leadsScoreChart = new Chart(leadsScoreChartElem, {
            type: 'doughnut',
            data: {
                labels: [services_vars.engaged, services_vars.ready, services_vars.fit, services_vars.none],
                datasets: [{
                    data: [0, 0, 0, 0],
                    backgroundColor: ['rgba(0, 112, 201, 1)', 'rgba(75, 154, 217, 1)', 'rgba(153, 198, 233, 1)', 'rgba(200, 229, 248, 1)'],
                    borderWidth: [2, 2, 2, 2],
                    borderColor: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)'],
                    hoverBackgroundColor: ['rgba(0, 112, 201, 1)', 'rgba(75, 154, 217, 1)', 'rgba(153, 198, 233, 1)', 'rgba(200, 229, 248, 1)'],
                    hoverBorderWidth: [6, 6, 6, 6],
                    hoverBorderColor: ['rgba(0, 112, 201, .5)', 'rgba(75, 154, 217, .5)', 'rgba(153, 198, 233, .5)', 'rgba(200, 229, 248, .5)'],
                }],
            },
            options: {
                responsive: true,
                cutoutPercentage: 70,
                tooltips: services_vars.theme_mode == 'dark' ? {
                    backgroundColor: 'rgba(0, 0, 0, 1)',
                    borderColor: 'rgba(255, 255, 255, 1)',
                    borderWidth: 2,
                    cornerRadius: 5,
                    displayColors: false,
                    xPadding: 10,
                    yPadding: 10,
                    titleFontColor: 'rgba(255, 255, 255, .7)',
                    bodyFontColor: 'rgba(255, 255, 255, 1)',
                    titleFontStyle: 'normal',
                    bodyFontStyle: 'bold',
                } : {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    borderColor: 'rgba(51, 51, 51, 1)',
                    borderWidth: 2,
                    cornerRadius: 5,
                    displayColors: false,
                    xPadding: 10,
                    yPadding: 10,
                    titleFontColor: 'rgba(153, 153, 153, 1)',
                    bodyFontColor: 'rgba(51, 51, 51, 1)',
                    titleFontStyle: 'normal',
                    bodyFontStyle: 'bold',
                },
                legend: {
                    display: false,
                },
                aspectRatio: 1
            }
        });
    }

    function getLeadsNumber(period = '-7 days') {
        if ($('.pxp-my-leads-charts').length > 0) {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: services_vars.ajaxurl,
                data: {
                    'action'  : 'resideo_get_leads_number',
                    'agent_id': $('#agent_id').val(),
                    'period'  : period,
                    'security': $('#leadsSecurity').val()
                },
                success: function(data) {
                    if (data.getleads === true) {
                        var leads_no    = [];
                        var leads_dates = [];
                        var percent;
                        var versus      = {
                            '-7 days'   : services_vars.vs_7_days,
                            '-30 days'  : services_vars.vs_30_days,
                            '-60 days'  : services_vars.vs_60_days,
                            '-90 days'  : services_vars.vs_90_days,
                            '-12 months': services_vars.vs_12_months,
                        };

                        $.each(data.leads, function(date, lead) {
                            leads_no.push(lead);
                            leads_dates.push(date);
                        });

                        leadsNoChart.data.labels = leads_dates;
                        leadsNoChart.data.datasets[0].data = leads_no;

                        leadsNoChart.update();

                        $('.pxp-chart-legend-number-percent').removeClass('pxp-is-up').removeClass('pxp-is-down');
                        $('.pxp-chart-legend-number-total').text(data.total_leads);

                        if (data.total_leads_prev == '0') {
                            percent = parseInt(data.total_leads) * 100;
                        } else {
                            percent = ((parseInt(data.total_leads) - parseInt(data.total_leads_prev)) * 100) / parseInt(data.total_leads_prev);
                        }

                        if (percent >= 0) {
                            $('.pxp-chart-legend-number-percent').addClass('pxp-is-up').html('<span class="fa fa-long-arrow-up"></span> ' + Math.abs(percent.toFixed(1)) + '%');
                        } else {
                            $('.pxp-chart-legend-number-percent').addClass('pxp-is-down').html('<span class="fa fa-long-arrow-down"></span> ' + Math.abs(percent.toFixed(1)) + '%');
                        }

                        $('.pxp-chart-legend-number-vs').html(versus[period]);
                    }
                },
                error: function(errorThrown) {}
            });
        }
    }

    getLeadsNumber();

    $('#pxp-leads-chart-period').on('change', function() {
        getLeadsNumber($(this).val());
    });

    function getContactedLeads(period = '-7 days') {
        if ($('.pxp-my-leads-charts').length > 0) {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: services_vars.ajaxurl,
                data: {
                    'action'   : 'resideo_get_contacted_leads',
                    'agent_id' : $('#agent_id').val(),
                    'period'   : period,
                    'security' : $('#leadsSecurity').val()
                },
                success: function(data) {
                    if (data.getleads === true) {
                        var contacted = parseInt(data.leads.yes);
                        var notContacted = parseInt(data.leads.no);
                        var contacted_prev = parseInt(data.leads_prev.yes);
                        var notContacted_prev = parseInt(data.leads_prev.no);
                        var contacted_p_diff;
                        var notContacted_p_diff;

                        leadsContactChart.data.datasets[0].data = [contacted, notContacted];

                        leadsContactChart.update();

                        $('.pxp-contacts-legend-percent-yes-diff').removeClass('pxp-is-up').removeClass('pxp-is-down');
                        $('.pxp-contacts-legend-percent-no-diff').removeClass('pxp-is-up').removeClass('pxp-is-down');

                        if (contacted == 0 && notContacted == 0) {
                            var contacted_p = 0;
                            var notContacted_p = 0;
                        } else {
                            var contacted_p = (contacted * 100) / (contacted + notContacted);
                            var notContacted_p = (notContacted * 100) / (contacted + notContacted);
                        }

                        $('.pxp-contacts-legend-percent-yes-total').html(Math.abs(contacted_p.toFixed(1)) + '%');
                        $('.pxp-contacts-legend-percent-no-total').html(Math.abs(notContacted_p.toFixed(1)) + '%');

                        if (contacted_prev == 0) {
                            contacted_p_diff = contacted * 100;
                        } else {
                            contacted_p_diff = ((contacted - contacted_prev) * 100) / contacted_prev;
                        }

                        if (contacted_p_diff >= 0) {
                            $('.pxp-contacts-legend-percent-yes-diff').addClass('pxp-is-up').html('<span class="fa fa-long-arrow-up"></span> ' + Math.abs(contacted_p_diff.toFixed(1)) + '%');
                        } else {
                            $('.pxp-contacts-legend-percent-yes-diff').addClass('pxp-is-down').html('<span class="fa fa-long-arrow-down"></span> ' + Math.abs(contacted_p_diff.toFixed(1)) + '%');
                        }

                        if (notContacted_prev == 0) {
                            notContacted_p_diff = notContacted * 100;
                        } else {
                            notContacted_p_diff = ((notContacted - notContacted_prev) * 100) / notContacted_prev;
                        }

                        if (notContacted_p_diff >= 0) {
                            $('.pxp-contacts-legend-percent-no-diff').addClass('pxp-is-up').html('<span class="fa fa-long-arrow-up"></span> ' + Math.abs(notContacted_p_diff.toFixed(1)) + '%');
                        } else {
                            $('.pxp-contacts-legend-percent-no-diff').addClass('pxp-is-down').html('<span class="fa fa-long-arrow-down"></span> ' + Math.abs(notContacted_p_diff.toFixed(1)) + '%');
                        }
                    }
                },
                error: function(errorThrown) {}
            });
        }
    }

    getContactedLeads();

    $('#pxp-contacts-chart-period').on('change', function() {
        getContactedLeads($(this).val());
    });

    function getLeadsScore(period = '-7 days') {
        if ($('.pxp-my-leads-charts').length > 0) {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: services_vars.ajaxurl,
                data: {
                    'action'   : 'resideo_get_leads_score',
                    'agent_id' : $('#agent_id').val(),
                    'period'   : period,
                    'security' : $('#leadsSecurity').val()
                },
                success: function(data) {
                    if (data.getleads === true) {
                        var none = parseInt(data.leads.none);
                        var fit = parseInt(data.leads.fit);
                        var ready = parseInt(data.leads.ready);
                        var engaged = parseInt(data.leads.engaged);
                        var none_prev = parseInt(data.leads_prev.none);
                        var fit_prev = parseInt(data.leads_prev.fit);
                        var ready_prev = parseInt(data.leads_prev.ready);
                        var engaged_prev = parseInt(data.leads_prev.engaged);
                        var none_p_diff;
                        var fit_p_diff;
                        var ready_p_diff;
                        var engaged_p_diff;

                        leadsScoreChart.data.datasets[0].data = [engaged, ready, fit, none];

                        leadsScoreChart.update();

                        $('.pxp-score-legend-percent-none-diff').removeClass('pxp-is-up');
                        $('.pxp-score-legend-percent-none-diff').removeClass('pxp-is-down');
                        $('.pxp-score-legend-percent-fit-diff').removeClass('pxp-is-up');
                        $('.pxp-score-legend-percent-fit-diff').removeClass('pxp-is-down');
                        $('.pxp-score-legend-percent-ready-diff').removeClass('pxp-is-up');
                        $('.pxp-score-legend-percent-ready-diff').removeClass('pxp-is-down');
                        $('.pxp-score-legend-percent-engaged-diff').removeClass('pxp-is-up');
                        $('.pxp-score-legend-percent-engaged-diff').removeClass('pxp-is-down');

                        if (none == 0 && fit == 0 && ready == 0 && engaged == 0) {
                            var none_p    = 0;
                            var fit_p     = 0;
                            var ready_p   = 0;
                            var engaged_p = 0;
                        } else {
                            var none_p    = (none * 100) / (none + fit + ready + engaged);
                            var fit_p     = (fit * 100) / (none + fit + ready + engaged);
                            var ready_p   = (ready * 100) / (none + fit + ready + engaged);
                            var engaged_p = (engaged * 100) / (none + fit + ready + engaged);
                        }

                        $('.pxp-score-legend-percent-none-total').html(Math.abs(none_p.toFixed(1)) + '%');
                        $('.pxp-score-legend-percent-fit-total').html(Math.abs(fit_p.toFixed(1)) + '%');
                        $('.pxp-score-legend-percent-ready-total').html(Math.abs(ready_p.toFixed(1)) + '%');
                        $('.pxp-score-legend-percent-engaged-total').html(Math.abs(engaged_p.toFixed(1)) + '%');


                        if (none_prev == 0) {
                            none_p_diff = none * 100;
                        } else {
                            none_p_diff = ((none - none_prev) * 100) / none_prev;
                        }

                        if (none_p_diff >= 0) {
                            $('.pxp-score-legend-percent-none-diff').addClass('pxp-is-up').html('<span class="fa fa-long-arrow-up"></span> ' + Math.abs(none_p_diff.toFixed(1)) + '%');
                        } else {
                            $('.pxp-score-legend-percent-none-diff').addClass('pxp-is-down').html('<span class="fa fa-long-arrow-down"></span> ' + Math.abs(none_p_diff.toFixed(1)) + '%');
                        }

                        if (fit_prev == 0) {
                            fit_p_diff = fit * 100;
                        } else {
                            fit_p_diff = ((fit - fit_prev) * 100) / fit_prev;
                        }

                        if (fit_p_diff >= 0) {
                            $('.pxp-score-legend-percent-fit-diff').addClass('pxp-is-up').html('<span class="fa fa-long-arrow-up"></span> ' + Math.abs(fit_p_diff.toFixed(1)) + '%');
                        } else {
                            $('.pxp-score-legend-percent-fit-diff').addClass('pxp-is-down').html('<span class="fa fa-long-arrow-down"></span> ' + Math.abs(fit_p_diff.toFixed(1)) + '%');
                        }

                        if (ready_prev == 0) {
                            ready_p_diff = ready * 100;
                        } else {
                            ready_p_diff = ((ready - ready_prev) * 100) / ready_prev;
                        }

                        if (ready_p_diff >= 0) {
                            $('.pxp-score-legend-percent-ready-diff').addClass('pxp-is-up').html('<span class="fa fa-long-arrow-up"></span> ' + Math.abs(ready_p_diff.toFixed(1)) + '%');
                        } else {
                            $('.pxp-score-legend-percent-ready-diff').addClass('pxp-is-down').html('<span class="fa fa-long-arrow-down"></span> ' + Math.abs(ready_p_diff.toFixed(1)) + '%');
                        }

                        if (engaged_prev == 0) {
                            engaged_p_diff = engaged * 100;
                        } else {
                            engaged_p_diff = ((engaged - engaged_prev) * 100) / engaged_prev;
                        }

                        if (engaged_p_diff >= 0) {
                            $('.pxp-score-legend-percent-engaged-diff').addClass('pxp-is-up').html('<span class="fa fa-long-arrow-up"></span> ' + Math.abs(engaged_p_diff.toFixed(1)) + '%');
                        } else {
                            $('.pxp-score-legend-percent-engaged-diff').addClass('pxp-is-down').html('<span class="fa fa-long-arrow-down"></span> ' + Math.abs(engaged_p_diff.toFixed(1)) + '%');
                        }
                    }
                },
                error: function(errorThrown) {}
            });
        }
    }

    getLeadsScore();

    $('#pxp-score-chart-period').on('change', function() {
        getLeadsScore($(this).val());
    });

    function resetLeadTab(el, message) {
        $('#' + el).html('<img src="' + services_vars.theme_url + '/images/loader-dark.svg" class="pxp-loader" alt="..."><span class="pxp-loader-text">' + message + '</span>');
    }

    function emptyLeadTab(el, message) {
        $('#' + el).html(message);
    }

    function manageLeadDetails(isEdit) {
        $('.pxp-my-leads-charts').hide();
        $('.pxp-my-leads-header').hide();
        $('.pxp-my-leads-search').hide();
        $('.pxp-my-leads-list').hide();
        $('.pxp-my-leads-new-lead-form').show();

        $('html, body').animate({ scrollTop: 0 }, 300);

        if (isEdit == true) {
            $('a[href="#pxp-lead-messages-tab-panel"]').tab('show');
            $('.pxp-my-leads-submit-lead-btn').hide();
            $('.pxp-my-leads-update-lead-btn').show();
            $('.pxp-my-leads-delete-lead-btn').show();
        } else {
            $('a[href="#pxp-lead-notes-tab-panel"]').tab('show');
            $('.pxp-my-leads-update-lead-btn').hide();
            $('.pxp-my-leads-delete-lead-btn').hide();
            $('.pxp-my-leads-submit-lead-btn').show();

            emptyLeadTab('pxp-lead-messages-tab-panel', services_vars.messages_list_empty);
            emptyLeadTab('pxp-lead-wishlist-tab-panel', services_vars.wl_list_empty);
            emptyLeadTab('pxp-lead-searches-tab-panel', services_vars.searches_list_empty);
        }
    }

    $('.pxp-my-leads-new-lead-btn').click(function() {
        manageLeadDetails(false);
    });

    $('.pxp-my-leads-item-edit').click(function() {
        manageLeadDetails(true);

        var item = $(this).parent().parent().parent().parent();

        var lead_id   = item.attr('data-id');
        var lead_uid  = item.attr('data-uid');
        var name      = item.find('.pxp-my-leads-item-name').attr('data-name');
        var email     = item.find('.pxp-my-leads-item-email').attr('data-email');
        var phone     = item.find('.pxp-my-leads-item-phone').attr('data-phone');
        var contacted = item.find('.pxp-my-leads-item-contacted').attr('data-contacted');
        var score     = item.find('.pxp-my-leads-item-score').attr('data-score');
        var notes     = item.attr('data-notes');

        $('#pxp-lead-field-id').val(lead_id);
        $('#pxp-lead-field-uid').val(lead_uid);
        $('#pxp-lead-field-name').val(name);
        $('#pxp-lead-field-email').val(email);
        $('#pxp-lead-field-phone').val(phone);
        $('#pxp-lead-field-contacted').val(contacted);
        $('#pxp-lead-field-score').val(score);
        $('#pxp-lead-field-notes').val(notes);

        $('.pxp-my-leads-delete-lead-btn').attr('data-id', lead_id);

        getLeadMessages(lead_id);
        getLeadWishlist(lead_uid);
        getLeadSearches(lead_uid);
    });

    function getLeadMessages(lead_id) {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'  : 'resideo_get_lead_messages',
                'lead_id' : lead_id,
                'security': $('#leadsSecurity').val()
            },
            success: function(data) {
                var messagesHTML = '';

                if (data.getmessages === true) {
                    messagesHTML += '<ul class="pxp-lead-messages-list">'

                    $.each(data.messages, function(i, message) {
                        messagesHTML += '<li class="mt-3 mt-md-4">' +
                                            '<div class="pxp-lead-messages-list-date">' + message.date + '</div>' + 
                                            '<div class="pxp-lead-messages-list-message">' + message.message + '</div>';

                        if (message.prop_title != '') {
                            messagesHTML += '<div class="pxp-lead-messages-list-property">' + 
                                                '<span>' + services_vars.related_property + ':</span> ' + 
                                                '<a href="' + message.prop_link + '" target="_blank">' + message.prop_title + '</a>' + 
                                            '</div>';
                        }

                        messagesHTML += '</li>';
                    });

                    messagesHTML += '<ul>';
                } else {
                    messagesHTML += services_vars.messages_list_empty;
                }

                $('#pxp-lead-messages-tab-panel').html(messagesHTML);
            },
            error: function(errorThrown) {}
        });
    }

    function getLeadWishlist(user_id) {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'   : 'resideo_get_lead_wishlist',
                'user_id'  : user_id,
                'security' : $('#leadsSecurity').val()
            },
            success: function(data) {
                var wlHTML = '';

                if (data.getwl === true) {
                    $.each(data.props, function(i, prop) {
                        wlHTML +=   '<div class="pxp-wishlist-item rounded-lg">' + 
                                        '<div class="row align-items-center">' + 
                                            '<div class="col-3 col-sm-2 col-lg-1">' + 
                                                '<div class="pxp-wishlist-item-photo pxp-cover rounded-lg" style="background-image: url(' + prop.photo + ');"></div>' + 
                                            '</div>' + 
                                            '<div class="col-9 col-sm-10 col-lg-11">' + 
                                                '<div class="row align-items-center">' + 
                                                    '<div class="col-9 col-sm-8 col-lg-10">' + 
                                                        '<div class="row align-items-center">' + 
                                                            '<div class="col-lg-6">' + 
                                                                '<div class="pxp-wishlist-item-title">' + prop.title + '</div>' + 
                                                            '</div>' + 
                                                            '<div class="col-lg-4">' + 
                                                                '<div class="pxp-wishlist-item-features">';
                        if (prop.beds != '') {
                            wlHTML += prop.beds + ' ' + prop.beds_label + '<span>|</span>';
                        }
                        if (prop.baths != '') {
                            wlHTML += prop.baths + ' ' + prop.baths_label + '<span>|</span>';
                        }
                        if (prop.size != '') {
                            wlHTML += prop.size + ' ' + prop.unit;
                        }
                        wlHTML +=                               '</div>' + 
                                                            '</div>' + 
                                                            '<div class="col-lg-2">' + 
                                                                '<div class="pxp-wishlist-item-price">' + prop.price + '</div>' + 
                                                            '</div>' + 
                                                        '</div>' + 
                                                    '</div>' + 
                                                    '<div class="col-3 col-sm-4 col-lg-2">' + 
                                                        '<div class="pxp-wishlist-item-actions">' + 
                                                            '<a href="' + prop.link + '" target="_blank"><span class="fa fa-eye"></span></a>' + 
                                                        '</div>' + 
                                                    '</div>' + 
                                                '</div>' + 
                                            '</div>' + 
                                        '</div>' + 
                                    '</div>';
                    });
                } else {
                    wlHTML += services_vars.wl_list_empty;
                }

                $('#pxp-lead-wishlist-tab-panel').html(wlHTML);
            },
            error: function(errorThrown) {}
        });
    }

    function getLeadSearches(user_id) {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'   : 'resideo_get_lead_searches',
                'user_id'  : user_id,
                'security' : $('#leadsSecurity').val()
            },
            success: function(data) {
                var searchesHTML = '';

                if(data.getsearches === true) {
                    $.each(data.searches, function(i, search) {
                        searchesHTML += '<div class="pxp-saved-searches-item rounded-lg">' + 
                                            '<div class="row align-items-center">' + 
                                                '<div class="col-9 col-sm-8 col-lg-10">' + 
                                                    '<div class="row align-items-center">' + 
                                                        '<div class="col-lg-9">' + 
                                                            '<div class="pxp-saved-searches-item-name">' + search.name + '</div>' + 
                                                        '</div>' + 
                                                        '<div class="col-lg-3">' + 
                                                            '<div class="pxp-saved-searches-item-date">' + search.date + '</div>' + 
                                                        '</div>' + 
                                                    '</div>' + 
                                                '</div>' + 
                                                '<div class="col-3 col-sm-4 col-lg-2">' + 
                                                    '<div class="pxp-saved-searches-item-actions">' + 
                                                        '<a href="' + search.url + '" target="_blank"><span class="fa fa-eye"></span></a>' + 
                                                    '</div>' + 
                                                '</div>' + 
                                            '</div>' + 
                                        '</div>';
                    });
                } else {
                    searchesHTML += services_vars.searches_list_empty;
                }

                $('#pxp-lead-searches-tab-panel').html(searchesHTML);
            },
            error: function(errorThrown) {}
        });
    }

    $('.pxp-my-leads-cancel-lead-btn').click(function() {
        $('#pxp-lead-field-name').val('');
        $('#pxp-lead-field-email').val('');
        $('#pxp-lead-field-phone').val('');
        $('#pxp-lead-field-contacted').val('no');
        $('#pxp-lead-field-score').val('0');
        $('#pxp-lead-field-notes').val('');

        resetLeadTab('pxp-lead-messages-tab-panel', services_vars.loading_messages);
        resetLeadTab('pxp-lead-wishlist-tab-panel', services_vars.loading_wl);
        resetLeadTab('pxp-lead-searches-tab-panel', services_vars.loading_searches);
        
        $('.pxp-my-leads-new-lead-form').hide();
        $('.pxp-my-leads-charts').show();
        $('.pxp-my-leads-header').show();
        $('.pxp-my-leads-search').show();
        $('.pxp-my-leads-list').show();
    });

    $('#pxp-my-leads-search-form #sort').on('change', function() {
        $('#pxp-my-leads-search-form').submit();
    });

    $('.pxp-my-leads-submit-lead-btn').click(function() {
        var _self = $(this);

        _self.addClass('disabled');
        $('.pxp-my-leads-submit-lead-btn-text').hide();
        $('.pxp-my-leads-submit-lead-btn-sending').show();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'    : 'resideo_save_lead',
                'user_id'   : $('#user_id').val(),
                'agent_id'  : $('#agent_id').val(),
                'name'      : $('#pxp-lead-field-name').val(),
                'email'     : $('#pxp-lead-field-email').val(),
                'phone'     : $('#pxp-lead-field-phone').val(),
                'contacted' : $('#pxp-lead-field-contacted').val(),
                'score'     : $('#pxp-lead-field-score').val(),
                'notes'     : $('#pxp-lead-field-notes').val(),
                'security'  : $('#leadsSecurity').val()
            },
            success: function(data) {
                if (data.save === true) {
                    document.location.href = services_vars.leads_redirect;
                } else {
                    $('.pxp-my-leads-response').html(data.message);
                    $('#pxp-my-leads-alert-modal').modal('show');

                    $('.pxp-my-leads-submit-lead-btn-sending').hide();
                    $('.pxp-my-leads-submit-lead-btn-text').show();
                    _self.removeClass('disabled');
                }
            },
            error: function(errorThrown) {}
        });
    });

    $('.pxp-my-leads-update-lead-btn').click(function() {
        var _self = $(this);

        _self.addClass('disabled');
        $('.pxp-my-leads-update-lead-btn-text').hide();
        $('.pxp-my-leads-update-lead-btn-sending').show();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'    : 'resideo_save_lead',
                'lead_id'   : $('#pxp-lead-field-id').val(),
                'user_id'   : $('#user_id').val(),
                'agent_id'  : $('#agent_id').val(),
                'name'      : $('#pxp-lead-field-name').val(),
                'email'     : $('#pxp-lead-field-email').val(),
                'phone'     : $('#pxp-lead-field-phone').val(),
                'contacted' : $('#pxp-lead-field-contacted').val(),
                'score'     : $('#pxp-lead-field-score').val(),
                'notes'     : $('#pxp-lead-field-notes').val(),
                'security'  : $('#leadsSecurity').val()
            },
            success: function(data) {
                if (data.save === true) {
                    document.location.href = services_vars.leads_redirect;
                } else {
                    $('.pxp-my-leads-response').html(data.message);
                    $('#pxp-my-leads-alert-modal').modal('show');

                    $('.pxp-my-leads-update-lead-btn-sending').hide();
                    $('.pxp-my-leads-update-lead-btn-text').show();
                    _self.removeClass('disabled');
                }
            },
            error: function(errorThrown) {}
        });
    });

    $('.pxp-my-leads-item-delete').click(function() {
        var item = $(this).parent().parent().parent().parent();
        var itemId = item.attr('data-id');
        
        $('#pxp-my-leads-delete-lead-modal').modal('show').on('shown.bs.modal', function() {
            $('.pxp-my-leads-delete-lead-btn-confirm').attr('data-id', itemId);
        });
    });

    $('.pxp-my-leads-delete-lead-btn').click(function() {
        var itemId = $(this).attr('data-id');
        
        $('#pxp-my-leads-delete-lead-modal').modal('show').on('shown.bs.modal', function() {
            $('.pxp-my-leads-delete-lead-btn-confirm').attr('data-id', itemId);
        });
    });

    $('.pxp-my-leads-delete-lead-btn-confirm').click(function() {
        var _self = $(this);

        _self.addClass('disabled');
        $('.pxp-my-leads-delete-lead-btn-confirm-text').hide();
        $('.pxp-my-leads-delete-lead-btn-confirm-sending').show();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'   : 'resideo_delete_lead',
                'lead_id'  : _self.attr('data-id'),
                'security' : $('#leadsSecurity').val()
            },
            success: function(data) {
                if (data.delete === true) {
                    document.location.href = services_vars.leads_redirect;
                } else {
                    $('.pxp-my-leads-delete-lead-btn-confirm-sending').hide();
                    $('.pxp-my-leads-delete-lead-btn-confirm-text').show();
                    _self.removeClass('disabled');

                    $('#pxp-my-leads-delete-lead-modal').on('hidden.bs.modal', function(e) {
                        $('.pxp-my-leads-response').html(data.message);
                        $('#pxp-my-leads-alert-modal').modal('show');
                    }).modal('hide');
                }
            },
            error: function(errorThrown) {}
        });
    });

    $('.pxp-activate-plan-btn').click(function() {
        var _self = $(this);

        _self.addClass('disabled');
        $('.pxp-activate-plan-btn-text').hide();
        $('.pxp-activate-plan-btn-sending').show();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'   : 'resideo_activate_membership_plan',
                'plan_id'  : _self.attr('data-id'),
                'agent_id' : _self.attr('data-agent-id')
            },
            success: function(data) {
                if (data) {
                    window.location = data.url;
                } else {
                    $('.pxp-activate-plan-btn-sending').hide();
                    $('.pxp-activate-plan-btn-text').show();
                    _self.removeClass('disabled');
                }
            },
            error: function(errorThrown) {}
        });
    });

    $('.pxp-pay-plan-btn').click(function() {
        var _self = $(this);

        _self.addClass('disabled');
        $('.pxp-pay-plan-btn-text').hide();
        $('.pxp-pay-plan-btn-sending').show();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'  : 'resideo_pay_membership_plan',
                'plan_id' : _self.attr('data-id')
            },
            success: function(data) {
                if (data) {
                    window.location = data.url;
                } else {
                    $('.pxp-pay-plan-btn-sending').hide();
                    $('.pxp-pay-plan-btn-text').show();
                    _self.removeClass('disabled');
                }
            },
            error: function(errorThrown) {}
        });
    });

    $('.pxp-account-settings-update-btn').click(function() {
        var _self = $(this);

        _self.addClass('disabled');
        $('.pxp-account-settings-update-btn-text').hide();
        $('.pxp-account-settings-update-btn-sending').show();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'          : 'resideo_update_account_settings',
                'security'        : $('#securityAccountSettings').val(),
                'user_id'         : $('#as_id').val(),
                'first_name'      : $('#as_first_name').val(),
                'last_name'       : $('#as_last_name').val(),
                'nickname'        : $('#as_nickname').val(),
                'email'           : $('#as_email').val(),
                'password'        : $('#as_password').val(),
                'avatar'          : $('#as_avatar').val(),
                'agent_id'        : $('#as_agent_id').val(),
                'agent_about'     : getTinymceContent('as_agent_about'),
                'agent_title'     : $('#as_agent_title').val(),
                'agent_specs'     : $('#as_agent_specs').val(),
                'agent_phone'     : $('#as_agent_phone').val(),
                'agent_skype'     : $('#as_agent_skype').val(),
                'agent_facebook'  : $('#as_agent_facebook').val(),
                'agent_twitter'   : $('#as_agent_twitter').val(),
                'agent_pinterest' : $('#as_agent_pinterest').val(),
                'agent_linkedin'  : $('#as_agent_linkedin').val(),
                'agent_instagram' : $('#as_agent_instagram').val()
            },
            success: function(data) {
                if (data.save === true) {
                    document.location.href = services_vars.account_redirect;
                } else {
                    $('.pxp-account-settings-response').html(data.message);
                    $('#pxp-account-settings-alert-modal').modal('show');

                    $('.pxp-account-settings-update-btn-sending').hide();
                    $('.pxp-account-settings-update-btn-text').show();
                    _self.removeClass('disabled');
                }
            },
            error: function(errorThrown) {}
        });
    });

    $('.pxp-become-agent-btn-group .dropdown-menu a').click(function() {
        $('.pxp-become-agent-btn').attr('data-type', $(this).attr('data-value'));

        if ($(this).attr('data-value') == 'agent') {
            $('.pxp-is-owner').hide();
            $('.pxp-is-agent').show();
        } else {
            $('.pxp-is-agent').hide();
            $('.pxp-is-owner').show();
        }
    });

    $('.pxp-become-agent-btn').click(function() {
        var _self = $(this);

        _self.addClass('disabled');
        $('.pxp-become-agent-btn-text').hide();
        $('.pxp-become-agent-btn-sending').show();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: services_vars.ajaxurl,
            data: {
                'action'   : 'resideo_become_agent',
                'security' : $('#securityAccountSettings').val(),
                'user_id'  : $('#as_id').val(),
                'type'     : _self.attr('data-type')
            },
            success: function(data) {
                if (data.save === true) {
                    document.location.href = services_vars.account_redirect;
                } else {
                    $('.pxp-account-settings-response').html(data.message);
                    $('#pxp-account-settings-alert-modal').modal('show');

                    $('.pxp-become-agent-btn-sending').hide();
                    $('.pxp-become-agent-btn-text').show();
                    _self.removeClass('disabled');
                }
            },
            error: function(errorThrown) {}
        });
    });
})(jQuery);