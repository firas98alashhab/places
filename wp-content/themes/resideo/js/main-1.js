(function($) {
    "use strict";

    function toggleSticky() {
        if ($('.pxp-sp-agent-section').length > 0) {
            var windowWidth = $(window).width();
            var similarHeight = 0;
            var commentsHeight = 0;
            var marginsHeight = 100;

            if ($('.pxp-similar-properties').length > 0) {
                similarHeight = $('.pxp-similar-properties').outerHeight(true);
            }

            if ($('.pxp-blog-comments-block').length > 0) {
                commentsHeight = $('.pxp-blog-comments-block').outerHeight(true);
                marginsHeight += 20;
            }

            var bottomSpacing = $('.pxp-footer').outerHeight(true) + commentsHeight + similarHeight + marginsHeight;
            var topSpacing = 182;

            if (windowWidth > 991) {
                $('.pxp-sp-agent-section').sticky({
                    topSpacing: topSpacing, 
                    bottomSpacing: bottomSpacing
                });
            } else {
                $('.pxp-sp-agent-section').unstick();
            }
        }
    }

    function checkNav() {
        var windowWidth = $(window).width();

        if (windowWidth > 991) {
            if ($('.pxp-header-nav-trigger').hasClass('pxp-active')) {
                $('.pxp-header-nav-trigger').removeClass('pxp-active');
                $('.pxp-logo').removeClass('pxp-logo-nav');
                $('.pxp-header').removeClass('pxp-mobile');
                $('body').removeClass('pxp-fixed');
            }

            $('.pxp-nav').show();
            $('.pxp-nav .sub-menu').hide();
        } else {
            if (!$('.pxp-header-nav-trigger').hasClass('pxp-active')) {
                $('.pxp-nav').hide();
                $('body').removeClass('pxp-fixed');
            } else {
                $('body').addClass('pxp-fixed');
            }

            $('.pxp-nav .sub-menu').show();
        }
    }

    function checkHeader() {
        var windowWidth = $(window).width();

        if (window.pageYOffset > 46 && windowWidth <= 600) {
            $('.pxp-header').addClass('pxp-is-admin');
        } else {
            $('.pxp-header').removeClass('pxp-is-admin');
        }

        if (window.pageYOffset > 93) {
            $('.pxp-header').addClass('pxp-is-sticky');
        } else {
            $('.pxp-header').removeClass('pxp-is-sticky');
        }
    }

    function handleMasonry() {
        if ($('.pxp-masonry').length > 0) {
            setTimeout(function() {
                $('.pxp-masonry').masonry({
                    itemSelector: '.pxp-grid-item',
                    columnWidth: '.pxp-grid-item',
                    horizontalOrder: true,
                    isAnimated: false,
                    hiddenStyle: {
                        opacity: 0,
                        transform: ''
                    }
                });
            }, 50);
        }
    }

    // Animate nav sub menu
    function handleTopMenuAnimation() {
        var windowWidth = $(window).width();

        if (windowWidth > 991) {
            $('.pxp-nav > div > ul > li > ul li.menu-item-has-children').append('<span class="fa fa-angle-right"></span>');
            $('.pxp-nav > div > ul > li').hover(function() {
                var subMenu = $(this).children('ul:first');
    
                if (subMenu.length > 0 && !$('.pxp-header').hasClass('pxp-mobile')) {
                    var subMenuWidth  = subMenu.width();
                    var menuItemLeft  = $(this).offset().left;
                    var windowWidth   = $(window).width();
                    var menuItemRight = windowWidth - menuItemLeft;
    
                    if (menuItemRight < subMenuWidth) {
                        subMenu.css({
                            'right': '0',
                            'left': 'auto'
                        });
                    }
    
                    subMenu.fadeIn({ queue: false, duration: 200 });
                    subMenu.animate({ top: "24px" }, 200);
                }
            }, function() {
                var subMenu = $(this).children('ul:first');
    
                if (subMenu.length > 0  && !$('.pxp-header').hasClass('pxp-mobile')) {
                    subMenu.fadeOut({ queue: false, duration: 200 });
                    subMenu.animate({ top: "17px" }, 200);
                }
            });
            $('.pxp-nav > div > ul > li ul > li').hover(function() {
                var subMenu = $(this).children('ul:first');
    
                if (subMenu.length > 0 && !$('.pxp-header').hasClass('pxp-mobile')) {
                    var subMenuWidth  = subMenu.width();
                    var menuItemLeft  = $(this).offset().left;
                    var windowWidth   = $(window).width();
                    var menuItemRight = windowWidth - menuItemLeft - subMenuWidth;
    
                    subMenu.fadeIn({ queue: false, duration: 200 });
    
                    if (menuItemRight < subMenuWidth) {
                        subMenu.css({
                            'right': 'auto',
                            'left': 'calc(-100% + 7px)'
                        });
                        subMenu.animate({ left: "-100%" }, 200);
                    } else {
                        subMenu.css({
                            'right': 'auto',
                            'left': 'calc(100% - 7px)'
                        });
                        subMenu.animate({ left: "100%" }, 200);
                    }
                }
            }, function() {
                var subMenu = $(this).children('ul:first');
    
                if (subMenu.length > 0  && !$('.pxp-header').hasClass('pxp-mobile')) {
                    subMenu.fadeOut({ queue: false, duration: 200 });
                }
            });
        } else {
            $('.pxp-nav > div > ul > li > ul li.menu-item-has-children span').remove();
        }
    }

    function windowResizeHandler() {
        toggleSticky();
        checkNav();
        checkHeader();
        handleMasonry();
        handleTopMenuAnimation();
    }

    windowResizeHandler();
    checkHeader();
    handleMasonry();
    handleTopMenuAnimation();

    $(window).resize(function() {
        windowResizeHandler();
    });

    function onContentScroll() {
        checkHeader();
    }

    window.onscroll = function() {
        onContentScroll();
    };

    var animateHTML = function() {
        var elems;
        var windowHeight;

        function init() {
            elems = document.querySelectorAll('.pxp-animate-in');
            windowHeight = window.innerHeight;
            addEventHandlers();
            checkPosition();
        }

        function addEventHandlers() {
            window.addEventListener('scroll', checkPosition);
            window.addEventListener('resize', init);
        }

        function checkPosition() {
            for (var i = 0; i < elems.length; i++) {
                var positionFromTop = elems[i].getBoundingClientRect().top;

                if (positionFromTop - windowHeight <= 0) {
                    elems[i].classList.add('pxp-in');
                }
            }
        }

        return {
            init: init
        };
    };

    if ($('.pxp-hero-has-animation').length > 0) {
        setTimeout(function() {
            $('.pxp-hero-has-animation').addClass('pxp-hero-animate');
        }, 100);
    }

    animateHTML().init();

    if ($('.pxp-props-carousel-right-stage').length > 0) {
        $('.pxp-props-carousel-right-stage').owlCarousel({
            'nav': true,
            'dots': false,
            'margin': 30,
            'responsive': {
                0: {
                    'items': 1
                },
                600: {
                    'items': 2,
                    'stagePadding': 30
                },
                900: {
                    'items': 3,
                    'stagePadding': 60
                },
                1200: {
                    'items': 3,
                    'stagePadding': 120
                },
                1600: {
                    'items': 4,
                    'stagePadding': 120
                }
            },
            'navText': [`<div class="pxp-props-carousel-left-arrow pxp-animate">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32.414" height="20.828" viewBox="0 0 32.414 20.828" class="pxp-arrow-1">
                                <g id="Group_30" data-name="Group 30" transform="translate(-1845.086 -1586.086)">
                                    <line id="Line_2" data-name="Line 2" x1="30" transform="translate(1846.5 1596.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                    <line id="Line_3" data-name="Line 3" x1="9" y2="9" transform="translate(1846.5 1587.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                    <line id="Line_4" data-name="Line 4" x1="9" y1="9" transform="translate(1846.5 1596.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                </g>
                            </svg>
                        </div>`,
                        `<div class="pxp-props-carousel-right-arrow pxp-animate">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32.414" height="20.828" viewBox="0 0 32.414 20.828">
                                <g id="Symbol_1_1" data-name="Symbol 1 – 1" transform="translate(-1847.5 -1589.086)">
                                    <line id="Line_2" data-name="Line 2" x2="30" transform="translate(1848.5 1599.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                    <line id="Line_3" data-name="Line 3" x2="9" y2="9" transform="translate(1869.5 1590.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                    <line id="Line_4" data-name="Line 4" y1="9" x2="9" transform="translate(1869.5 1599.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                </g>
                            </svg>
                        </div>`],
            'checkVisible': false,
            'smartSpeed': 600
        });
    }

    if ($('.pxp-props-carousel-right-stage-1').length > 0) {
        $('.pxp-props-carousel-right-stage-1').owlCarousel({
            'nav': true,
            'dots': false,
            'margin': 30,
            'responsive': {
                0: {
                    'items': 1
                },
                600: {
                    'items': 2,
                },
                900: {
                    'items': 2,
                    'stagePadding': 30
                },
                1200: {
                    'items': 3,
                    'stagePadding': 30
                },
                1600: {
                    'items': 3,
                    'stagePadding': 120
                }
            },
            'navText': [`<div class="pxp-props-carousel-left-arrow pxp-animate">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32.414" height="20.828" viewBox="0 0 32.414 20.828">
                                <g id="Group_30" data-name="Group 30" transform="translate(-1845.086 -1586.086)">
                                    <line id="Line_2" data-name="Line 2" x1="30" transform="translate(1846.5 1596.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                    <line id="Line_3" data-name="Line 3" x1="9" y2="9" transform="translate(1846.5 1587.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                    <line id="Line_4" data-name="Line 4" x1="9" y1="9" transform="translate(1846.5 1596.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                </g>
                            </svg>
                        </div>`,
                        `<div class="pxp-props-carousel-right-arrow pxp-animate">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32.414" height="20.828" viewBox="0 0 32.414 20.828">
                                <g id="Symbol_1_1" data-name="Symbol 1 – 1" transform="translate(-1847.5 -1589.086)">
                                    <line id="Line_2" data-name="Line 2" x2="30" transform="translate(1848.5 1599.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                    <line id="Line_3" data-name="Line 3" x2="9" y2="9" transform="translate(1869.5 1590.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                    <line id="Line_4" data-name="Line 4" y1="9" x2="9" transform="translate(1869.5 1599.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                </g>
                            </svg>
                        </div>`],
            'checkVisible': false,
            'smartSpeed': 600
        });
    }

    if ($('.pxp-services-c-stage').length > 0) {
        $('.pxp-services-c-stage').owlCarousel({
            'nav': true,
            'dots': false,
            'margin': 30,
            'responsive': {
                0: {
                    'items': 1
                },
                600: {
                    'items': 2,
                },
                900: {
                    'items': 2,
                },
                1200: {
                    'items': 3,
                },
            },
            'navText': [`<svg xmlns="http://www.w3.org/2000/svg" width="32.414" height="20.828" viewBox="0 0 32.414 20.828">
                            <g id="Group_30" data-name="Group 30" transform="translate(-1845.086 -1586.086)">
                                <line id="Line_2" data-name="Line 2" x1="30" transform="translate(1846.5 1596.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                <line id="Line_3" data-name="Line 3" x1="9" y2="9" transform="translate(1846.5 1587.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                <line id="Line_4" data-name="Line 4" x1="9" y1="9" transform="translate(1846.5 1596.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                            </g>
                        </svg>`,
                        `<svg xmlns="http://www.w3.org/2000/svg" width="32.414" height="20.828" viewBox="0 0 32.414 20.828">
                            <g id="Symbol_1_1" data-name="Symbol 1 – 1" transform="translate(-1847.5 -1589.086)">
                                <line id="Line_2" data-name="Line 2" x2="30" transform="translate(1848.5 1599.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                <line id="Line_3" data-name="Line 3" x2="9" y2="9" transform="translate(1869.5 1590.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                <line id="Line_4" data-name="Line 4" y1="9" x2="9" transform="translate(1869.5 1599.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                            </g>
                        </svg>`],
            'checkVisible': false,
            'smartSpeed': 600
        });
    }

    if ($('.pxp-testim-1-stage').length > 0) {
        $('.pxp-testim-1-stage').owlCarousel({
            'nav': true,
            'dots': false,
            'margin': 30,
            'responsive': {
                0: {
                    'items': 1
                },
                600: {
                    'items': 2,
                },
                900: {
                    'items': 2,
                },
                1200: {
                    'items': 3,
                },
            },
            'navText': [`<svg xmlns="http://www.w3.org/2000/svg" width="32.414" height="20.828" viewBox="0 0 32.414 20.828">
                            <g id="Group_30" data-name="Group 30" transform="translate(-1845.086 -1586.086)">
                                <line id="Line_2" data-name="Line 2" x1="30" transform="translate(1846.5 1596.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                <line id="Line_3" data-name="Line 3" x1="9" y2="9" transform="translate(1846.5 1587.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                <line id="Line_4" data-name="Line 4" x1="9" y1="9" transform="translate(1846.5 1596.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                            </g>
                        </svg>`,
                        `<svg xmlns="http://www.w3.org/2000/svg" width="32.414" height="20.828" viewBox="0 0 32.414 20.828">
                            <g id="Symbol_1_1" data-name="Symbol 1 – 1" transform="translate(-1847.5 -1589.086)">
                                <line id="Line_2" data-name="Line 2" x2="30" transform="translate(1848.5 1599.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                <line id="Line_3" data-name="Line 3" x2="9" y2="9" transform="translate(1869.5 1590.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                <line id="Line_4" data-name="Line 4" y1="9" x2="9" transform="translate(1869.5 1599.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                            </g>
                        </svg>`],
            'checkVisible': false,
            'smartSpeed': 600
        });
    }

    if ($('.pxp-hero-props-carousel-1').length > 0) {
        if ($('.pxp-hero-props-carousel-1-timer').length > 0) {
            var timerVal = $('.pxp-hero-props-carousel-1-timer').val();
            $('.pxp-hero-props-carousel-1-prices .carousel-item > span').css('transition', 'all ' + timerVal + 's linear');
        }

        var carouselOpacity = $('.pxp-hero-props-carousel-1-opacity').val();
        if (carouselOpacity != '') {
            $('.pxp-hero-props-carousel-1 .pxp-hero-bg > span').css('background-color', 'rgba(0,0,0,' + carouselOpacity + ')');
        }
    }

    var heroPropCarouselItems = 1;

    $('.pxp-hero-props-carousel-1 .carousel-item').each(function(index, element) {
        var slide = $(element).attr('data-slide');
        var priceElem = $('.pxp-hero-props-carousel-1-prices [data-slide=' + slide + ']');
        var img = document.createElement('img');

        img.setAttribute('src', $(element).find('.pxp-hero-bg').attr('data-src'));
        img.addEventListener('load', function() {
            var vibrant = new Vibrant(img);
            var swatches = vibrant.swatches();

            for (var swatch in swatches) {
                if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
                    if (swatch == 'Muted') {
                        priceElem.css('background-color', swatches[swatch].getHex());
                    }
                }
            }
            if (index == 0) {
                $('.pxp-hero-props-carousel-1-prices').addClass('pxp-price-active pxp-first-time');
            }
        });

        $('.pxp-carousel-ticker-counter').append('<span>0' + heroPropCarouselItems + '</span>');

        heroPropCarouselItems += 1;
    });

    $('.pxp-hero-props-carousel-1-prices .pxp-carousel-ticker-total').append('<span>0' + $('.pxp-hero-props-carousel-1 .carousel-item').length + '</span>');

    $('.pxp-hero-props-carousel-1').on('slide.bs.carousel', function(carousel) {
        $('.pxp-hero-props-carousel-1-prices').removeClass('pxp-first-time');
        $('.pxp-hero-props-carousel-1-prices').carousel(carousel.to);
    });

    $('.pxp-hero-props-carousel-1').on('slid.bs.carousel', function(carousel) {
        var tickerPos = (carousel.to) * 13;

        $('.pxp-hero-props-carousel-1-prices .pxp-carousel-ticker-counter > span').css('transform', 'translateY(-' + tickerPos + 'px)');
    });

    $('.pxp-hero-props-carousel-1 .pxp-carousel-control-next').click(function(e) { 
        $('.pxp-hero-props-carousel-1').carousel('next');
    });
    $('.pxp-hero-props-carousel-1 .pxp-carousel-control-prev').click(function(e) { 
        $('.pxp-hero-props-carousel-1').carousel('prev');
    });

    $('.pxp-hero-props-carousel-2-right .carousel-item').each(function(index, element) {
        var slide = $(element).attr('data-slide');
        var leftElem = $('.pxp-hero-props-carousel-2-left [data-slide=' + slide + ']');
        var img = document.createElement('img');

        img.setAttribute('src', $(element).find('.pxp-hero-bg').attr('data-src'));
        img.addEventListener('load', function() {
            var vibrant = new Vibrant(img);
            var swatches = vibrant.swatches();

            for (var swatch in swatches) {
                if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
                    if (swatch == 'Muted') {
                        leftElem.css('background-color', swatches[swatch].getHex());
                    }
                }
            }
        });
    });

    $('.pxp-hero-props-carousel-2-right').on('slide.bs.carousel', function(carousel) {
        if(carousel.direction == 'left') {
            $('.pxp-hero-props-carousel-2-left').carousel('next');
        } else {
            $('.pxp-hero-props-carousel-2-left').carousel('prev');
        }
    });

    $('.pxp-hero-props-carousel-2 .pxp-carousel-control-next').click(function(e) { 
        $('.pxp-hero-props-carousel-2-right').carousel('next');
    });
    $('.pxp-hero-props-carousel-2 .pxp-carousel-control-prev').click(function(e) { 
        $('.pxp-hero-props-carousel-2-right').carousel('prev');
    });

    var heroPropCarousel2Items = 1;

    $('.pxp-hero-props-carousel-2-right .carousel-item').each(function(index, element) {
        $('.pxp-hero-props-carousel-2 .pxp-carousel-ticker-counter').append('<span>0' + heroPropCarousel2Items + '</span>');

        heroPropCarousel2Items += 1;
    });

    $('.pxp-hero-props-carousel-2 .pxp-carousel-ticker-total').append('<span>0' + $('.pxp-hero-props-carousel-2-right .carousel-item').length + '</span>');

    $('.pxp-hero-props-carousel-2-right').on('slid.bs.carousel', function(carousel) {
        var tickerPos = (carousel.to) * 13;

        $('.pxp-hero-props-carousel-2 .pxp-carousel-ticker-counter > span').css('transform', 'translateY(-' + tickerPos + 'px)');
    });

    $('.pxp-sp-more').click(function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        $(this).prev('p').find('.pxp-dots').toggle();
        $(this).prev('p').find('.pxp-dots-more').slideToggle();
        $(this).toggleClass('pxp-sp-less');
    });

    $('.pxp-blog-posts-carousel-1 .pxp-carousel-control-next').click(function(e) { 
        $('.pxp-blog-posts-carousel-1-img').carousel('next');
    });
    $('.pxp-blog-posts-carousel-1 .pxp-carousel-control-prev').click(function(e) { 
        $('.pxp-blog-posts-carousel-1-img').carousel('prev');
    });

    $('.pxp-blog-posts-carousel-1-img').on('slide.bs.carousel', function(carousel) {
        if (carousel.direction == 'left') {
            $('.pxp-blog-posts-carousel-1-caption').carousel('next');
        } else {
            $('.pxp-blog-posts-carousel-1-caption').carousel('prev');
        }

        if ($('.pxp-blog-posts-carousel-1-img .carousel-item:eq(' + carousel.to + ')').hasClass('pxp-no-image')) {
            $('.pxp-blog-posts-carousel-1-caption-container').hide();
            $('.pxp-blog-posts-carousel-1-img').addClass('pxp-no-image');
            $('.pxp-posts-lists').removeClass('mt-200').addClass('mt-100');
        } else {
            $('.pxp-blog-posts-carousel-1-caption-container').show();
            $('.pxp-blog-posts-carousel-1-img').removeClass('pxp-no-image');
            $('.pxp-posts-lists').removeClass('mt-100').addClass('mt-200');
        }
    });

    if ($('.pxp-blog-posts-carousel-1-img').length > 0) {
        if (!$('.pxp-blog-posts-carousel-1-img .carousel-item.active').hasClass('pxp-no-image')) {
            $('.pxp-blog-posts-carousel-1-caption-container').show();
            $('.pxp-posts-lists').removeClass('mt-100').addClass('mt-200');
        } else {
            $('.pxp-blog-posts-carousel-1-img').addClass('pxp-no-image');
            $('.pxp-posts-lists').removeClass('mt-200').addClass('mt-100');
        }
    }

    $('.pxp-header-nav-trigger').click(function() {
        $(this).toggleClass('pxp-active');
        $('.pxp-logo').toggleClass('pxp-logo-nav');
        $('.pxp-header').toggleClass('pxp-mobile');
        $('.pxp-nav').toggle();
        $('body').toggleClass('pxp-fixed');
    });

    $('.pxp-blog-post-video').click(function() {
        $(this).hide().next('iframe').show();
    });

    $('.pxp-header-user-loggedin').click(function() {
        var userMenu = $('.pxp-user-menu');

        if (userMenu.hasClass('pxp-user-menu-active')) {
            userMenu.fadeOut({ queue: false, duration: 200 });
            userMenu.animate({ top: "37px" }, 200);
            userMenu.removeClass('pxp-user-menu-active');
        } else {
            userMenu.fadeIn({ queue: false, duration: 200 });
            userMenu.animate({ top: "46px" }, 200);
            userMenu.addClass('pxp-user-menu-active');
        }
    });

    $(document).click(function(e) {
        var userMenu            = $('.pxp-user-menu');
        var userMenuTrigger     = $('.pxp-header-user-loggedin');
        var userMenuTriggerIcon = $('.pxp-header-user-loggedin > span');

        if (!userMenu.is(e.target) && !userMenuTriggerIcon.is(e.target) && !userMenuTrigger.is(e.target) && userMenu.has(e.target).length === 0) {
            userMenu.fadeOut({ queue: false, duration: 200 });
            userMenu.animate({ top: "37px" }, 200);
            userMenu.removeClass('pxp-user-menu-active');
        }
    });

    // Handle agent rating system
    function clearAgentRating() {
        $('.pxp-single-agent-rating span').removeClass('pxp-selected');
    }
    $('.pxp-single-agent-rating span').click(function() {
        clearAgentRating();
        $(this).addClass('pxp-selected');
    });

    $('.pxp-map-toggle').click(function () {
        $('.pxp-map-side').addClass('pxp-max');
        $('.pxp-content-side').addClass('pxp-min');
        $('.pxp-list-toggle').show();
    });

    $('.pxp-list-toggle').click(function() {
        $('.pxp-map-side').removeClass('pxp-max');
        $('.pxp-content-side').removeClass('pxp-min');
        $('.pxp-list-toggle').hide();
    });

    $('.pxp-adv-toggle').click(function () {
        $(this).toggleClass('pxp-active');
        $('.pxp-content-side-search-form-adv').slideToggle();
    });

    $('.pxp-results-card-1 .carousel-control-next').click(function(event) {
        event.preventDefault();
        var target = $(this).attr('data-href');

        $(target).carousel('next');
    });
    $('.pxp-results-card-1 .carousel-control-prev').click(function(event) {
        event.preventDefault()
        var target = $(this).attr('data-href');

        $(target).carousel('prev');
    });

    var mapAPILoaded = (typeof google === 'object' && typeof google.maps === 'object') ? true : false;

    // Search properties widget - manage address field
    if ($('#widget-search-address-auto').length > 0 && mapAPILoaded === true) {
        var address = document.getElementById('widget-search-address-auto');
        var componentForm = {
            neighborhood                : { type : 'long_name' , field : 'search_neighborhood' },
            street_number               : { type : 'short_name', field : 'search_street_no' },
            route                       : { type : 'long_name',  field : 'search_street' },
            locality                    : { type : 'long_name',  field : 'search_city' },
            administrative_area_level_1 : { type : 'short_name', field : 'search_state' },
            postal_code                 : { type : 'short_name', field : 'search_zip' },
        };
        var addressOptions;

        if (main_vars.auto_country != '') {
            addressOptions = {
                types: ['geocode'],
                componentRestrictions: { country: main_vars.auto_country }
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
                        $('#' + componentForm[addressType].field).val(val);
                    }
                }
            }
            return false;
        });

        $('#widget-search-address-auto').keydown(function(e) {
            if (e.which == 13 && $('.pac-container:visible').length) return false;
        });
    }

    // Handle agent rating system
    function clearAgentRating() {
        $('.pxp-single-agent-rating span').removeClass('pxp-selected');
        $('#rate').val('');
    }

    $('.pxp-single-agent-rating span').click(function() {
        var rating = $(this).attr('data-rating');

        clearAgentRating();
        $(this).addClass('pxp-selected');
        $('#rate').val(rating);
    });

    // Init date pickers
    $('.date-picker').datepickerc({
        'format' : 'yyyy-mm-dd'
    });

    // Submit filter properties form triggers
    $('#pxp-sort-results').change(function() {
        var selected = $(this).val();
        $('#sort').val(selected);
        $('.pxp-results-filter-form').submit();
    });
    $('#search_status').change(function() {
        $('.pxp-results-filter-form').submit();
    });

    // Search properties hero form - manage address field
    if ($('#hero-search-address-auto').length > 0 && mapAPILoaded === true) {
        var address = document.getElementById('hero-search-address-auto');
        var componentForm = {
            neighborhood                : { type : 'long_name' , field : 'search_neighborhood_field' },
            street_number               : { type : 'short_name', field : 'search_street_no_field' },
            route                       : { type : 'long_name',  field : 'search_street_field' },
            locality                    : { type : 'long_name',  field : 'search_city_field' },
            administrative_area_level_1 : { type : 'short_name', field : 'search_state_field' },
            postal_code                 : { type : 'short_name', field : 'search_zip_field' },
        };
        var addressOptions;

        if (main_vars.auto_country != '') {
            addressOptions = {
                types: ['geocode'],
                componentRestrictions: { country: main_vars.auto_country }
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
                        $('#' + componentForm[addressType].field).val(val);
                    }
                }
            }

            return false;
        });
        $('#hero-search-address-auto').keydown(function(e) {
            if (e.which == 13 && $('.pac-container:visible').length) return false;
        });
    }

    // Filter properties form - manage address field
    if ($('#filter-address-auto').length > 0 && mapAPILoaded === true) {
        var address = document.getElementById('filter-address-auto');
        var componentForm = {
            neighborhood                : { type : 'long_name' , field : 'filter_neighborhood_field' },
            street_number               : { type : 'short_name', field : 'filter_street_no_field' },
            route                       : { type : 'long_name',  field : 'filter_street_field' },
            locality                    : { type : 'long_name',  field : 'filter_city_field' },
            administrative_area_level_1 : { type : 'short_name', field : 'filter_state_field' },
            postal_code                 : { type : 'short_name', field : 'filter_zip_field' },
        };
        var addressOptions;

        if (main_vars.auto_country != '') {
            addressOptions = {
                types: ['geocode'],
                componentRestrictions: { country: main_vars.auto_country }
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
                        $('#' + componentForm[addressType].field).val(val);
                    }
                }
            }

            $('.pxp-results-filter-form').submit();
        });
        $('#filter-address-auto').keydown(function(e) {
            if (e.which == 13 && $('.pac-container:visible').length) return false;
        });
    }

    if ($('.pxp-similar-properties-stage').length > 0) {
        $('.pxp-similar-properties-stage').owlCarousel({
            'nav': true,
            'dots': false,
            'margin': 30,
            'responsive': {
                0: {
                    'items': 1
                },
                600: {
                    'items': 2
                },
                900: {
                    'items': 3
                },
                1200: {
                    'items': 3
                }
            },
            'navText': [`<div class="pxp-props-carousel-left-arrow pxp-animate">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32.414" height="20.828" viewBox="0 0 32.414 20.828" class="pxp-arrow-1">
                                <g id="Group_30" data-name="Group 30" transform="translate(-1845.086 -1586.086)">
                                    <line id="Line_2" data-name="Line 2" x1="30" transform="translate(1846.5 1596.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                    <line id="Line_3" data-name="Line 3" x1="9" y2="9" transform="translate(1846.5 1587.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                    <line id="Line_4" data-name="Line 4" x1="9" y1="9" transform="translate(1846.5 1596.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                </g>
                            </svg>
                        </div>`,
                        `<div class="pxp-props-carousel-right-arrow pxp-animate">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32.414" height="20.828" viewBox="0 0 32.414 20.828">
                                <g id="Symbol_1_1" data-name="Symbol 1 – 1" transform="translate(-1847.5 -1589.086)">
                                    <line id="Line_2" data-name="Line 2" x2="30" transform="translate(1848.5 1599.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                    <line id="Line_3" data-name="Line 3" x2="9" y2="9" transform="translate(1869.5 1590.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                    <line id="Line_4" data-name="Line 4" y1="9" x2="9" transform="translate(1869.5 1599.5)" fill="none" stroke="#333" stroke-linecap="round" stroke-width="2"/>
                                </g>
                            </svg>
                        </div>`],
            'checkVisible': false,
            'smartSpeed': 600,
            'onInitialized': toggleSticky
        });
    }
})(jQuery);