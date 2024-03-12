(function($) {
    "use strict";

    function elementLoaded(el, cb) {
        if ($(el).length) {
            cb($(el));
        } else {
            setTimeout(function() {
                elementLoaded(el, cb)
            }, 200);
        }
    }

    function checkMapTrigger() {
        $('#dsidx.dsidx-results #dsidx-map-control a').on('click', function() {
            elementLoaded('#dsidx.dsidx-results #dsidx-map-control a', function(el) {
                $('#dsidx.dsidx-results #dsidx-map-control a:contains("Hide")').addClass('pxp-is-active');
                $('#dsidx.dsidx-results #dsidx-map-control a:contains("Show")').removeClass('pxp-is-active');
            });
        });
    }

    elementLoaded('#dsidx.dsidx-results #dsidx-map-control a', function(el) {
        $('#dsidx.dsidx-results #dsidx-map-control a:contains("Hide")').addClass('pxp-is-active');
        $('#dsidx.dsidx-results #dsidx-map-control a:contains("Show")').removeClass('pxp-is-active');

        if ($('.pxp-idx-map-half').length > 0) {
            if (!$('#dsidx.dsidx-results #dsidx-map-control a').hasClass('pxp-is-active')) {
                $('#dsidx.dsidx-results #dsidx-map-control a').click();
            }

            $('.dsidx-sorting-control').after('<a role="button" class="pxp-idx-map-toggle"><span class="fa fa-map-o"></span></a>');
            $('#dsidx-map').addClass('pxp-min');
            $('.pxp-idx-map-toggle').on('click', function () {
                $('.pxp-map-side').addClass('pxp-max');
                $('#dsidx-map').addClass('pxp-max').removeClass('pxp-min');
                $('.pxp-content-side').addClass('pxp-min');
                $('.pxp-idx-list-toggle').show();
            });
        }

        checkMapTrigger();
    });

    $('#dsidx.dsidx-results #dsidx-listings li.dsidx-listings-grid-clear').remove();

    $('#dsidx.dsidx-results #dsidx-listings li').each(function(index, element) {
        var photoElem = $(this).find('.dsidx-photo');
        var photoSrc = photoElem.find('img').attr('src');

        photoElem.css('background-image', 'url(' + photoSrc + ')');
    });

    /* Modern version - Listings Page */
    if ($('.dsidx-show-hide-map').length > 0) {
        $('.dsidx-show-hide-map').prev('div').remove();
        $('.dsidx-show-hide-map').on('click', function() {
            $(this).toggleClass('pxp-is-active');
        });

        $('.dsidx-show-hide-map').parent().addClass('pxp-is-modern');

        $('#dsidx.dsidx-results #dsidx-listings li').each(function(index, element) {
            var photoElem = $(this).find('.dsidx-photo-content');
            var photoSrc = photoElem.find('img').attr('src');
    
            photoElem.css('background-image', 'url(' + photoSrc + ')');
        });

        if ($('.pxp-idx-map-half').length > 0) {
            $('#dsidx-map').show();
            $('.dsidx-show-hide-map').click();

            $('.dsidx-sorting-control').after('<a role="button" class="pxp-idx-map-toggle"><span class="fa fa-map-o"></span></a>');
            $('#dsidx-map').css('visibility', 'hidden');
            setTimeout(function() {
                $('#dsidx-map').addClass('pxp-min').css('visibility', 'visible');
            }, 1000);
            $('.pxp-idx-map-toggle').on('click', function () {
                $('.pxp-map-side').addClass('pxp-max');
                $('#dsidx-map').addClass('pxp-max').removeClass('pxp-min');
                $('.pxp-content-side').addClass('pxp-min');
                $('.pxp-idx-list-toggle').show();
            });
        } else {
            if ($('#dsidx-map').is(':visible')) {
                $('.dsidx-show-hide-map').addClass('pxp-is-active');
            }
        }

        $('#dsidx.dsidx-results.pxp-is-modern #dsidx-listings .dsidx-listing .dsidx-toolbar-button.dsidx-virtualtour .dsidx-toolbar-content').empty();
    }

    $('.pxp-idx-list-toggle').on('click', function() {
        $('.pxp-map-side').removeClass('pxp-max');
        $('#dsidx-map').removeClass('pxp-max').addClass('pxp-min');
        $('.pxp-content-side').removeClass('pxp-min');
        $('.pxp-idx-list-toggle').hide();
    });

    if ($('#dsidx-actions').length > 0) {
        $('#dsidx-button-share').click(function() {
            var offset = $(this).offset();

            $(window).scrollTop(0);

            $('.dsidx-ui-widget.ui-widget').css({
                'top' : offset.top + 46,
                'left': offset.left
            });
        });
    }

    if ($('#dsidx.dsidx-details #dsidx-photos').length > 0) {
        $('#dsidx.dsidx-details #dsidx-photos').parent().parent().addClass('pxp-no-slider');
    }

    if ($('.pxp-idx-listings-page .dsidx-widget-guided-search').length > 0) {
        $('.dsidx-resp-search-box').before('<a role="button" class="pxp-idx-adv-toggle"><span class="fa fa-sliders"></span></a><div class="clearfix"></div>');
        $('.pxp-idx-adv-toggle').on('click', function () {
            $(this).toggleClass('pxp-active');
            $('.dsidx-resp-search-box').slideToggle();
        });
        $('.dsidx-resp-area-submit').before('<div class="clearfix"></div>');

        var fieldsParent = $('.dsidx-resp-area').find('.dsidx-resp-area').parent();
        var fieldsParentHTML = fieldsParent.html();
        if (fieldsParentHTML !== undefined) {
            fieldsParent.remove();
            $('.pxp-idx-listings-page .dsidx-widget-guided-search form fieldset').append(fieldsParentHTML);
        }
    }

    if ($('.pxp-idx-listings-page .dsidx-widget-quick-search').length > 0) {
        $('.dsidx-resp-area-submit').before('<div class="clearfix"></div>');
    }

    $('.dsidx-shortcode-item p').first().addClass('pxp-dsidx-property-types');

    if ($('.dsidx-xlistings > ul > li.dsidx-listing-item .dsidx-photo-content').length > 0) {

    }
    $('.dsidx-xlistings > ul > li.dsidx-listing-item .dsidx-photo-content').each(function(index, element) {
        var photoSrc = $(this).find('img').attr('src');

        $(this).css('background-image', 'url(' + photoSrc + ')');
        $(this).parent().find('.dsidx-multi-line br').replaceWith(', ');
    });
})(jQuery);