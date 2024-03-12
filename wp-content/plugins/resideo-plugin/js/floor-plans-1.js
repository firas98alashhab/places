(function($) {
    "use strict";

    var max = floor_plan_upload_vars.plupload.max_files;

    function fixedEncodeURIComponent(str) {
        return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
            return '%' + c.charCodeAt(0).toString(16);
        });
    }

    function jsonParser(str) {
        try {
          return JSON.parse(str);
        } catch(ex) {
          return null;
        }
    }

    if ($('.pxp-submit-property-floor-plan').length > 0) {
        $('body').addClass('no-overflow');
    }

    if (typeof(plupload) !== 'undefined') {
        var uploader = new plupload.Uploader(floor_plan_upload_vars.plupload);

        uploader.init();

        uploader.bind('FilesAdded', function(up, files) {
            var filesNo = 0;

            $.each(files, function(i, file) {
                if (filesNo < max) {
                    $('.pxp-submit-property-upload-floor-plan-status').append('<div id="' + file.id + '" class="pxp-submit-property-upload-progress"></div>');
                }

                filesNo = filesNo + 1;
            });

            up.refresh();
            uploader.start();
        });

        uploader.bind('UploadProgress', function(up, file) {
            $('.pxp-submit-property-floor-plan').empty();
            $('#' + file.id).addClass('pxp-is-active').html('<div class="progress">' + 
                '<div class="progress-bar" role="progressbar" aria-valuenow="' + file.percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + file.percent + '%">' + file.percent + '%</div>' + 
            '</div>');
        });

        // On error occur
        uploader.bind('Error', function(up, err) {
            $('.pxp-submit-property-upload-floor-plan-status').append('<div>Error: ' + err.code +
                ', Message: ' + err.message +
                (err.file ? ', File: ' + err.file.name : '') +
                '</div>');

            up.refresh();
        });

        uploader.bind('FileUploaded', function(up, file, response) {
            var result = $.parseJSON(response.response);

            $('#' + file.id).remove();

            if (result.success) {
                $('.pxp-submit-property-floor-plan').html(
                    '<div class="pxp-submit-property-floor-plan-image has-animation" data-id="' + result.attach + '" data-src="' + result.html + '" style="background-image: url(' + result.html + ')">' +
                        '<button class="pxp-submit-property-floor-plan-delete-image"><span class="fa fa-trash-o"></span></button>' + 
                    '</div>'
                );
                $('#pxp-new-floor-plan-image').val(result.attach);
            }
        });

        $('#aaiu-uploader-floor-plan').click(function(e) {
            uploader.start();
            e.preventDefault();
        });
    }

    $('.pxp-submit-property-floor-plan').on('click', '.pxp-submit-property-floor-plan-delete-image', function(e) {
        e.preventDefault();

        var _parent = $(this).parent();

        _parent.removeClass('has-animation')
                .fadeOut('slow', function() {
                    $(this).remove();
                    $('#pxp-new-floor-plan-image').val('');
                    $('.pxp-submit-property-floor-plan').html(
                        '<div class="pxp-submit-property-floor-plan-image" data-id="" data-src="" style="background-image: url(' + floor_plan_upload_vars.plugin_url + 'images/image-placeholder.png)"></div>'
                    );
                });
    });

    if ($('#new_floor_plans').length > 0) {
        var data = {
            'plans' : []
        }
        var floorPlans = '';
        var floorPlansRaw = $('#new_floor_plans').val();

        if (floorPlansRaw != '') {
            floorPlans = jsonParser(decodeURIComponent(floorPlansRaw.replace(/\+/g, ' ')));

            if (floorPlans !== null) {
                data = floorPlans;
            }
        }

        $('.pxp-add-floor-plan-btn').on('click', function(event) {
            event.preventDefault();

            $(this).hide();
            $('.pxp-new-floor-plan').show();
        });

        $('.pxp-new-floor-plan-ok-btn').on('click', function(event) {
            event.preventDefault();

            var title       = $('#pxp-new-floor-plan-title').val();
            var beds        = $('#pxp-new-floor-plan-beds').val();
            var baths       = $('#pxp-new-floor-plan-baths').val();
            var size        = $('#pxp-new-floor-plan-size').val();
            var description = $('#pxp-new-floor-plan-description').val();
            var image       = $('.pxp-submit-property-floor-plan-image').attr('data-id');
            var image_src   = $('.pxp-submit-property-floor-plan-image').attr('data-src');

            data.plans.push({
                'title'      : title,
                'beds'       : beds,
                'baths'      : baths,
                'size'       : size,
                'description': description,
                'image'      : image
            });

            $('#new_floor_plans').val(fixedEncodeURIComponent(JSON.stringify(data)));

            var info = '';
            if (beds != '') {
                info += beds + ' ' + floor_plan_upload_vars.beds_label + ' <span>|</span> ';
            }
            if (baths != '') {
                info += baths + ' ' + floor_plan_upload_vars.baths_label + ' <span>|</span> ';
            }
            if (size != '') {
                info += size + ' ' + floor_plan_upload_vars.unit;
            }

            $('#pxp-submit-property-floor-plans-list').append(
                '<li class="pxp-sortable-list-item rounded-lg" data-id="' + image + '" ' + 
                        'data-title="' + title + '" ' + 
                        'data-beds="' + beds + '" ' + 
                        'data-baths="' + baths + '" ' + 
                        'data-size="' + size + '" ' + 
                        'data-description="' + description + '">' + 
                    '<div class="row align-items-center">' + 
                        '<div class="col-3 col-sm-2">' + 
                            '<div class="pxp-sortable-list-item-photo pxp-cover rounded-lg" style="background-image: url(' + image_src + ');"></div>' + 
                        '</div>' + 
                        '<div class="col-9 col-sm-10">' + 
                            '<div class="row align-items-center">' + 
                                '<div class="col-9 col-sm-8 col-lg-10">' + 
                                    '<div class="row align-items-center">' + 
                                        '<div class="col-lg-7">' + title + '</div>' + 
                                        '<div class="col-lg-5">' + 
                                            '<div class="pxp-sortable-list-item-features">' + info + '</div>' + 
                                        '</div>' + 
                                    '</div>' + 
                                '</div>' + 
                                '<div class="col-3 col-sm-4 col-lg-2 text-right">' + 
                                    '<a href="javascript:void(0);" class="pxp-sortable-list-item-delete pxp-submit-property-floor-plans-item-delete"><span class="fa fa-trash-o"></span></a>' + 
                                '</div>' + 
                            '</div>' + 
                        '</div>' + 
                    '</div>' + 
                '</li>'
            );

            $('#pxp-new-floor-plan-title').val('');
            $('#pxp-new-floor-plan-beds').val('');
            $('#pxp-new-floor-plan-baths').val('');
            $('#pxp-new-floor-plan-size').val('');
            $('#pxp-new-floor-plan-description').val('');
            $('#pxp-new-floor-plan-image').val('');

            $('.pxp-submit-property-floor-plan-image')
                .css('background-image', 'url(' + floor_plan_upload_vars.plugin_url + 'images/image-placeholder.png)')
                .attr({
                    'data-id': '',
                    'data-src': ''
                })
                .removeClass('has-animation')
                .empty();

            $('.pxp-new-floor-plan').hide();
            $('.pxp-add-floor-plan-btn').show();

            $('.pxp-submit-property-floor-plans-item-delete').on('click', function() {
                event.preventDefault();
                $(this).parent().parent().parent().parent().parent().remove();
    
                data.plans = [];
    
                $('#pxp-submit-property-floor-plans-list li').each(function(index, el) {
                    data.plans.push({
                        'title'      : $(this).attr('data-title'),
                        'beds'       : $(this).attr('data-beds'),
                        'baths'      : $(this).attr('data-baths'),
                        'size'       : $(this).attr('data-size'),
                        'description': $(this).attr('data-description'),
                        'image'      : $(this).attr('data-id')
                    });
                });
    
                $('#new_floor_plans').val(fixedEncodeURIComponent(JSON.stringify(data)));
            });
        });

        $('.pxp-new-floor-plan-cancel-btn').on('click', function(event) {
            event.preventDefault();

            $('#pxp-new-floor-plan-title').val('');
            $('#pxp-new-floor-plan-beds').val('');
            $('#pxp-new-floor-plan-baths').val('');
            $('#pxp-new-floor-plan-size').val('');
            $('#pxp-new-floor-plan-description').val('');
            $('#pxp-new-floor-plan-image').val('');

            $('.pxp-submit-property-floor-plan-image')
                .css('background-image', 'url(' + floor_plan_upload_vars.plugin_url + 'images/image-placeholder.png)')
                .attr({
                    'data-id': '',
                    'data-src': ''
                })
                .removeClass('has-animation')
                .empty();

            $('.pxp-new-floor-plan').hide();
            $('.pxp-add-floor-plan-btn').show();
        });

        $('#pxp-submit-property-floor-plans-list').sortable({
            placeholder: 'sortable-placeholder',
            opacity: 0.7,
            stop: function(event, ui) {
                data.plans = [];

                $('#pxp-submit-property-floor-plans-list li').each(function(index, el) {
                    data.plans.push({
                        'title'      : $(this).attr('data-title'),
                        'beds'       : $(this).attr('data-beds'),
                        'baths'      : $(this).attr('data-baths'),
                        'size'       : $(this).attr('data-size'),
                        'description': $(this).attr('data-description'),
                        'image'      : $(this).attr('data-id')
                    });

                });

                $('#new_floor_plans').val(fixedEncodeURIComponent(JSON.stringify(data)));
            }
        }).disableSelection();

        $('.pxp-submit-property-floor-plans-item-delete').on('click', function() {
            event.preventDefault();
            $(this).parent().parent().parent().parent().parent().remove();

            data.plans = [];

            $('#pxp-submit-property-floor-plans-list li').each(function(index, el) {
                data.plans.push({
                    'title'      : $(this).attr('data-title'),
                    'beds'       : $(this).attr('data-beds'),
                    'baths'      : $(this).attr('data-baths'),
                    'size'       : $(this).attr('data-size'),
                    'description': $(this).attr('data-description'),
                    'image'      : $(this).attr('data-id')
                });
            });

            $('#new_floor_plans').val(fixedEncodeURIComponent(JSON.stringify(data)));
        });
    }
})(jQuery);
