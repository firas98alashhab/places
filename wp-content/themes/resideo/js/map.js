(function($) {
    "use strict";

    var map;
    var markers = [];
    var markerCluster;
    var styles;
    var resizeCenter;

    var options = {
        zoom : 14,
        mapTypeId : 'Styled',
        panControl: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false,
        scrollwheel: false,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
        },
        fullscreenControl: false,
    };

    if (map_vars.theme_mode == 'dark') {
        styles = [{"featureType": "all","elementType": "labels.text.fill","stylers": [{"saturation": 36},{"color": "#000000"},{"lightness": 40}]},{"featureType": "all","elementType": "labels.text.stroke","stylers": [{"visibility": "on"},{"color": "#000000"},{"lightness": 16}]},{"featureType": "all","elementType": "labels.icon","stylers": [{"visibility": "off"}]},{"featureType": "administrative","elementType": "geometry.fill","stylers": [{"color": "#000000"},{"lightness": 20}]},{"featureType": "administrative","elementType": "geometry.stroke","stylers": [{"color": "#000000"},{"lightness": 17},{"weight": 1.2}]},{"featureType": "landscape","elementType": "geometry","stylers": [{"color": "#000000"},{"lightness": 20}]},{"featureType": "poi","elementType": "geometry","stylers": [{"color": "#000000"},{"lightness": 21}]},{"featureType": "road.highway","elementType": "geometry.fill","stylers": [{"color": "#000000"},{"lightness": 17}]},{"featureType": "road.highway","elementType": "geometry.stroke","stylers": [{"color": "#000000"},{"lightness": 29},{"weight": 0.2}]},{"featureType": "road.arterial","elementType": "geometry","stylers": [{"color": "#000000"},{"lightness": 18}]},{"featureType": "road.local","elementType": "geometry","stylers": [{"color": "#000000"},{"lightness": 16}]},{"featureType": "transit","elementType": "geometry","stylers": [{"color": "#000000"},{"lightness": 19}]},{"featureType": "water","elementType": "geometry","stylers": [{"color": "#000000"},{"lightness": 17}]}];
    } else {
        styles = [{"featureType": "water","elementType": "geometry","stylers": [{"color": "#e9e9e9"},{"lightness": 17}]},{"featureType": "landscape","elementType": "geometry","stylers": [{"color": "#f5f5f5"},{"lightness": 20}]},{"featureType": "road.highway","elementType": "geometry.fill","stylers": [{"color": "#ffffff"},{"lightness": 17}]},{"featureType": "road.highway","elementType": "geometry.stroke","stylers": [{"color": "#ffffff"},{"lightness": 29},{"weight": 0.2}]},{"featureType": "road.arterial","elementType": "geometry","stylers": [{"color": "#ffffff"},{"lightness": 18}]},{"featureType": "road.local","elementType": "geometry","stylers": [{"color": "#ffffff"},{"lightness": 16}]},{"featureType": "poi","elementType": "geometry","stylers": [{"color": "#f5f5f5"},{"lightness": 21}]},{"featureType": "poi.park","elementType": "geometry","stylers": [{"color": "#dedede"},{"lightness": 21}]},{"elementType": "labels.text.stroke","stylers": [{"visibility": "on"},{"color": "#ffffff"},{"lightness": 16}]},{"elementType": "labels.text.fill","stylers": [{"saturation": 36},{"color": "#333333"},{"lightness": 40}]},{"elementType": "labels.icon","stylers": [{"visibility": "off"}]},{"featureType": "transit","elementType": "geometry","stylers": [{"color": "#f2f2f2"},{"lightness": 19}]},{"featureType": "administrative","elementType": "geometry.fill","stylers": [{"color": "#fefefe"},{"lightness": 20}]},{"featureType": "administrative","elementType": "geometry.stroke","stylers": [{"color": "#fefefe"},{"lightness": 17},{"weight": 1.2}]}];
    }
    function CustomMarker(id, latlng, map, classname, html) {
        this.id        = id;
        this.latlng_   = latlng;
        this.classname = classname;
        this.html      = html;

        this.setMap(map);
    }

    CustomMarker.prototype = new google.maps.OverlayView();

    CustomMarker.prototype.draw = function() {
        var me = this;
        var div = this.div_;

        if (!div) {
            div = this.div_ = document.createElement('div');
            div.classList.add(this.classname);
            div.innerHTML = this.html;

            google.maps.event.addDomListener(div, 'click', function(event) {
                google.maps.event.trigger(me, 'click');
            });

            var panes = this.getPanes();
            panes.overlayImage.appendChild(div);
        }

        var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);

        if (point) {
            div.style.left = point.x + 'px';
            div.style.top = point.y + 'px';
        }
    };

    CustomMarker.prototype.remove = function() {
        if (this.div_) {
            this.div_.parentNode.removeChild(this.div_);
            this.div_ = null;
        }
    };

    CustomMarker.prototype.getPosition = function() {
        return this.latlng_;
    };

    CustomMarker.prototype.addActive = function() {
        if (this.div_) {
            $('.pxp-price-marker').removeClass('active');
            this.div_.classList.add('active');
        }
    };

    CustomMarker.prototype.removeActive = function() {
        if (this.div_) {
            this.div_.classList.remove('active');
        }
    };

    function formatPrice(nStr) {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ' ' + '$2');
        }
        return x1 + x2;
    }

    function addMarkers(props, map) {
        $.each(props, function(i, prop) {
            var latlng = new google.maps.LatLng(prop.lat, prop.lng);

            var price = '';
            var numeralPrice = '';
            var priceFormat = '';
            var priceFormat_ = '';
            var priceCurrency = '';
            var priceLabel = '';

            if (prop.price_raw != '') {
                if ($.isNumeric(prop.price_raw)) {
                    if (prop.price_raw > 999999) {
                        priceFormat = numeral(prop.price_raw).format('0.0a');
                    } else {
                        if (prop.price_raw.slice(-3) == '000') {
                            priceFormat = numeral(prop.price_raw).format('0a');
                        } else {
                            priceFormat = numeral(prop.price_raw).format('0.0a');
                        }
                    }

                    priceFormat_ = formatPrice(prop.price_raw);
                    priceCurrency = prop.currency;
                    priceLabel = prop.price_label;
                } else {
                    priceFormat = prop.price_raw;
                    priceFormat_ = prop.price_raw;
                    priceCurrency = '';
                    priceLabel = '';
                }

                if (prop.currency_pos == 'before') {
                    numeralPrice = priceCurrency + priceFormat;
                    price = priceCurrency + priceFormat_ + ' ' + priceLabel;
                } else {
                    numeralPrice = priceFormat + ' ' + priceCurrency;
                    price = priceFormat_ + priceCurrency + ' ' + priceLabel;
                }

                var feat = '';

                if (prop.beds != '') {
                    feat += prop.beds + ' ' + prop.beds_label + '<span>|</span>';
                }
                if (prop.baths != '') {
                    feat += prop.baths + ' ' + prop.baths_label + '<span>|</span>';
                }
                if (prop.size != '') {
                    feat += prop.size + ' ' + prop.unit;
                }
            }

            var html = '<div class="pxp-marker-short-price">' + numeralPrice + '</div>' + 
                        '<a href="' + prop.link + '" class="pxp-marker-details">' + 
                            '<div class="pxp-marker-details-fig pxp-cover" style="background-image: url(' + prop.photo + ');"></div>' + 
                            '<div class="pxp-marker-details-info">' + 
                                '<div class="pxp-marker-details-info-title">' + prop.title + '</div>' + 
                                '<div class="pxp-marker-details-info-price">' + prop.price + '</div>' + 
                                '<div class="pxp-marker-details-info-feat">' + feat + '</div>' + 
                            '</div>' + 
                        '</a>';

            var marker = new CustomMarker(prop.id, latlng, map, 'pxp-price-marker', html);

            marker.id = prop.id;
            markers.push(marker);
        });
    }

    if ($('#results-map').length > 0) {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: map_vars.ajaxurl,
            data: {
                'action'               : 'resideo_get_searched_properties',
                'security'             : $('#resultsMapSecurity').val(),
                'default_lat'          : map_vars.gmaps_lat,
                'default_lng'          : map_vars.gmaps_lng,
                'default_zoom'         : map_vars.gmaps_zoom,
                'search_status'        : map_vars.search_status,
                'search_address'       : map_vars.search_address,
                'search_street_no'     : map_vars.search_street_no,
                'search_street'        : map_vars.search_street,
                'search_neighborhood'  : map_vars.search_neighborhood,
                'search_city'          : map_vars.search_city,
                'search_state'         : map_vars.search_state,
                'search_zip'           : map_vars.search_zip,
                'search_type'          : map_vars.search_type,
                'search_price_min'     : map_vars.search_price_min,
                'search_price_max'     : map_vars.search_price_max,
                'search_beds'          : map_vars.search_beds,
                'search_baths'         : map_vars.search_baths,
                'search_size_min'      : map_vars.search_size_min,
                'search_size_max'      : map_vars.search_size_max,
                'search_keywords'      : map_vars.search_keywords,
                'search_id'            : map_vars.search_id,
                'search_amenities'     : map_vars.search_amenities,
                'search_custom_fields' : map_vars.search_custom_fields,
                'featured'             : map_vars.featured,
                'sort'                 : map_vars.sort,
                'page'                 : map_vars.page,
            },
            success: function(data) {
                var center = new google.maps.LatLng(map_vars.default_lat, map_vars.default_lng);
                map = new google.maps.Map(document.getElementById('results-map'), options);
                var styledMapType = new google.maps.StyledMapType(styles, {
                    name : 'Styled',
                });
                map.mapTypes.set('Styled', styledMapType);
                map.setCenter(center);
                map.setZoom(parseInt(map_vars.default_zoom));

                if (data.getprops === true) {
                    addMarkers(data.props, map);

                    map.fitBounds(markers.reduce(function(bounds, marker) {
                        return bounds.extend(marker.getPosition());
                    }, new google.maps.LatLngBounds()));

                    markerCluster = new MarkerClusterer(map, markers, {
                        maxZoom: 18,
                        gridSize: 60,
                        styles: [
                            {
                                width: 40,
                                height: 40,
                            },
                            {
                                width: 60,
                                height: 60,
                            },
                            {
                                width: 80,
                                height: 80,
                            },
                        ]
                    });

                    google.maps.event.trigger(map, 'resize');
                    resizeCenter = map.getCenter();

                    $('.pxp-results-card-1').each(function(i) {
                        var propID = $(this).attr('data-prop');

                        $(this).on('mouseenter', function() {
                            if (map) {
                                var targetMarker = $.grep(markers, function(e) {
                                    return e.id == propID;
                                });
        
                                if(targetMarker.length > 0) {
                                    targetMarker[0].addActive();
                                    map.setCenter(targetMarker[0].latlng_);
                                }
                            }
                        });
                        $(this).on('mouseleave', function() {
                            var targetMarker = $.grep(markers, function(e) {
                                return e.id == propID;
                            });
        
                            if(targetMarker.length > 0) {
                                targetMarker[0].removeActive();
                            }
                        });
                    });
                }
            },
            error: function(errorThrown) {}
        });
    }
})(jQuery);