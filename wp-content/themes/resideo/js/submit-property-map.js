(function($) {
    "use strict";

    var map;
    var styles;
    var marker;
    var mapLat = 0, mapLng = 0;

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

    if (spm_vars.theme_mode == 'dark') {
        styles = [{"featureType": "all","elementType": "labels.text.fill","stylers": [{"saturation": 36},{"color": "#000000"},{"lightness": 40}]},{"featureType": "all","elementType": "labels.text.stroke","stylers": [{"visibility": "on"},{"color": "#000000"},{"lightness": 16}]},{"featureType": "all","elementType": "labels.icon","stylers": [{"visibility": "off"}]},{"featureType": "administrative","elementType": "geometry.fill","stylers": [{"color": "#000000"},{"lightness": 20}]},{"featureType": "administrative","elementType": "geometry.stroke","stylers": [{"color": "#000000"},{"lightness": 17},{"weight": 1.2}]},{"featureType": "landscape","elementType": "geometry","stylers": [{"color": "#000000"},{"lightness": 20}]},{"featureType": "poi","elementType": "geometry","stylers": [{"color": "#000000"},{"lightness": 21}]},{"featureType": "road.highway","elementType": "geometry.fill","stylers": [{"color": "#000000"},{"lightness": 17}]},{"featureType": "road.highway","elementType": "geometry.stroke","stylers": [{"color": "#000000"},{"lightness": 29},{"weight": 0.2}]},{"featureType": "road.arterial","elementType": "geometry","stylers": [{"color": "#000000"},{"lightness": 18}]},{"featureType": "road.local","elementType": "geometry","stylers": [{"color": "#000000"},{"lightness": 16}]},{"featureType": "transit","elementType": "geometry","stylers": [{"color": "#000000"},{"lightness": 19}]},{"featureType": "water","elementType": "geometry","stylers": [{"color": "#000000"},{"lightness": 17}]}];
    } else {
        styles = [{"featureType": "water","elementType": "geometry","stylers": [{"color": "#e9e9e9"},{"lightness": 17}]},{"featureType": "landscape","elementType": "geometry","stylers": [{"color": "#f5f5f5"},{"lightness": 20}]},{"featureType": "road.highway","elementType": "geometry.fill","stylers": [{"color": "#ffffff"},{"lightness": 17}]},{"featureType": "road.highway","elementType": "geometry.stroke","stylers": [{"color": "#ffffff"},{"lightness": 29},{"weight": 0.2}]},{"featureType": "road.arterial","elementType": "geometry","stylers": [{"color": "#ffffff"},{"lightness": 18}]},{"featureType": "road.local","elementType": "geometry","stylers": [{"color": "#ffffff"},{"lightness": 16}]},{"featureType": "poi","elementType": "geometry","stylers": [{"color": "#f5f5f5"},{"lightness": 21}]},{"featureType": "poi.park","elementType": "geometry","stylers": [{"color": "#dedede"},{"lightness": 21}]},{"elementType": "labels.text.stroke","stylers": [{"visibility": "on"},{"color": "#ffffff"},{"lightness": 16}]},{"elementType": "labels.text.fill","stylers": [{"saturation": 36},{"color": "#333333"},{"lightness": 40}]},{"elementType": "labels.icon","stylers": [{"visibility": "off"}]},{"featureType": "transit","elementType": "geometry","stylers": [{"color": "#f2f2f2"},{"lightness": 19}]},{"featureType": "administrative","elementType": "geometry.fill","stylers": [{"color": "#fefefe"},{"lightness": 20}]},{"featureType": "administrative","elementType": "geometry.stroke","stylers": [{"color": "#fefefe"},{"lightness": 17},{"weight": 1.2}]}];
    }

    CustomMarker.prototype = new google.maps.OverlayView();

    CustomMarker.prototype.onAdd = function() {
        var container = document.createElement('div'),
            that = this;

        if (typeof this.get('content').nodeName !== 'undefined') {
            container.appendChild(this.get('content'));
        } else {
            if (typeof this.get('content') === 'string') {
                container.innerHTML = this.get('content');
            } else {
                return;
            }
        }

        container.style.position = 'absolute';
        container.draggable = true;

        google.maps.event.addDomListener(this.get('map').getDiv(), 'mouseleave', function() {
            google.maps.event.trigger(container,'mouseup');
        });

        google.maps.event.addDomListener(container, 'mousedown', function(e) {
            this.style.cursor = 'grabbing';
            that.map.set('draggable', false);
            that.set('origin', e);

            that.moveHandler = google.maps.event.addDomListener(that.get('map').getDiv(), 'mousemove', function(e) {
                var origin = that.get('origin'),
                    left = origin.clientX - e.clientX,
                    top = origin.clientY - e.clientY,
                    pos = that.getProjection().fromLatLngToDivPixel(that.get('position')),
                    latLng = that.getProjection().fromDivPixelToLatLng(new google.maps.Point(pos.x - left, pos.y - top));
                    that.set('origin', e);
                    that.set('position', latLng);
                    that.draw();
                });
        });

        google.maps.event.addDomListener(container, 'mouseup', function() {
            that.map.set('draggable', true);
            this.style.cursor = 'pointer';
            google.maps.event.removeListener(that.moveHandler);

            $('#new_lat').val(that.position.lat());
            $('#new_lng').val(that.position.lng());
        });

        google.maps.event.addDomListener(container, 'mouseover', function() {
            this.style.cursor = 'pointer';
        });

        this.set('container',container);
        this.getPanes().floatPane.appendChild(container);
    };

    function CustomMarker(map, position, content) {
        if (typeof draw === 'function') {
            this.draw = draw;
        }

        this.setValues({
            position: position,
            container: null,
            content: content,
            map: map
        });
    }

    CustomMarker.prototype.draw = function() {
        var pos = this.getProjection().fromLatLngToDivPixel(this.get('position'));

        this.get('container').style.left = pos.x + 'px';
        this.get('container').style.top = pos.y + 'px';
    };

    CustomMarker.prototype.onRemove = function() {
        this.get('container').parentNode.removeChild(this.get('container'));
        this.set('container', null);
    };

    setTimeout(function() {
        if ($('#pxp-submit-property-map').length > 0) {
            map = new google.maps.Map(document.getElementById('pxp-submit-property-map'), options);
            var styledMapType = new google.maps.StyledMapType(styles, {
                name : 'Styled',
            });
            var address = document.getElementById('new_address');

            if ($('#new_lat_h').val() != '' && $('#new_lng_h').val() != '') {
                mapLat = $('#new_lat_h').val();
                mapLng = $('#new_lng_h').val();
            } else if (spm_vars.default_lat != '' && spm_vars.default_lng != '') {
                mapLat = spm_vars.default_lat;
                mapLng = spm_vars.default_lng;
            }

            var center = new google.maps.LatLng(mapLat, mapLng);

            map.mapTypes.set('Styled', styledMapType);
            map.setCenter(center);
            map.setZoom(15);

            var latLng = new google.maps.LatLng(mapLat, mapLng);
            marker = new CustomMarker(map, latLng, '<div class="pxp-single-marker"></div>');

            google.maps.event.trigger(map, 'resize');

            if ($('#new_address').length > 0 && $('#new_address').hasClass('new-address-auto')) {
                var componentForm = {
                    neighborhood: { type: 'long_name' , field: 'new_neighborhood' },
                    street_number: { type: 'short_name', field: 'new_street_no' },
                    route: { type: 'long_name',  field: 'new_street' },
                    locality: { type: 'long_name',  field: 'new_city' },
                    administrative_area_level_1: { type: 'short_name', field: 'new_state' },
                    postal_code: { type: 'short_name', field: 'new_zip' },
                };
                var addressOptions;
    
                if (main_vars.auto_country != '') {
                    addressOptions = {
                        types: ['geocode'],
                        componentRestrictions: { country: spm_vars.auto_country }
                    }
                } else {
                    addressOptions = {
                        types: ['geocode']
                    }
                }
    
                var addressAuto = new google.maps.places.Autocomplete(address, addressOptions);
    
                google.maps.event.addListener(addressAuto, 'place_changed', function() {
                    $.each(componentForm, function(index, value) {
                        $('#' + value.field).val('');
                    });
    
                    var place = addressAuto.getPlace();
    
                    if ("undefined" != typeof place.address_components) {
                        for (var i = 0; i < place.address_components.length; i++) {
                            var addressType = place.address_components[i].types[0];
    
                            if (componentForm[addressType]) {
                                var val = place.address_components[i][componentForm[addressType].type];
    
                                if (componentForm[addressType].field == 'new_city' && spm_vars.city_type == 'list') {
                                    $('#new_city option').each(function() {
                                        if ($(this).text() == val) {
                                            $(this).prop('selected', true);
                                        }
                                    });
                                } else if (componentForm[addressType].field == 'new_neighborhood' && spm_vars.neighborhood_type == 'list') {
                                    $('#new_neighborhood option').each(function() {
                                        if ($(this).text() == val) {
                                            $(this).prop('selected', true);
                                        }
                                    });
                                } else {
                                    $('#' + componentForm[addressType].field).val(val);
                                }
                            }
                        }
                    }
    
                    if ("undefined" != typeof place.geometry) {
                        var newLatLng = place.geometry.location;

                        map.setCenter(newLatLng);
                        marker.set('position', newLatLng);
                        marker.draw();

                        $('#new_lat, #new_lat_h').val(newLatLng.lat());
                        $('#new_lng, #new_lng_h').val(newLatLng.lng());
                    }

                    return false;
                });
            } else if ($('#new_address').length > 0 && !$('#new_address').hasClass('new-address-auto')) {
                $('#new_address').on('change', function() {
                    var geocoder = new google.maps.Geocoder();
                    var addressVal = document.getElementById('new_address').value;

                    geocoder.geocode({ 'address': addressVal }, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            var newLatLng = results[0].geometry.location;

                            map.setCenter(newLatLng);
                            marker.set('position', newLatLng);
                            marker.draw();

                            $('#new_lat, #new_lat_h').val(newLatLng.lat());
                            $('#new_lng, #new_lng_h').val(newLatLng.lng());
                        }
                    });
                });
            }

            $('#new_lat, #new_lng').on('change', function() {
                var newLat = $('#new_lat').val();
                var newLng = $('#new_lng').val();
                var newLatLng = new google.maps.LatLng(newLat, newLng);

                $('#new_lat_h').val(newLat);
                $('#new_lng_h').val(newLng);

                marker.set('position', newLatLng);
                marker.draw();
                map.setCenter(newLatLng);
                google.maps.event.trigger(map, 'resize');
            });
        }
    }, 300);
})(jQuery);