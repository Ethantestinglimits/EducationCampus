document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
window.addEventListener('resize', function () {
    document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
});

var scroller = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    smoothMobile: true,
    getDirection: true,
    getSpeed: true,
    lerp: 0.05
});

function preloadScroll(elem) {
    var objectToScrollOffset = elem.position().top;

    // console.log(objectToScrollOffset);

    scroller.scrollTo(objectToScrollOffset, {
        duration: 2000
    });
}

var typeHash = window.location.hash.substr(1);

if (typeHash) {
    preloadScroll($('.' + typeHash));
}

$(document).ready(function () {

    gsap.registerPlugin(ScrollTrigger)

    scroller.on('scroll', ScrollTrigger.update)

    ScrollTrigger.scrollerProxy(
        '.container', {
            scrollTop(value) {
                return arguments.length ?
                    scroller.scrollTo(value, 0, 0) :
                    scroller.scroll.instance.scroll.y
            },
            getBoundingClientRect() {
                return {
                    left: 0, top: 0,
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            }
        }
    )

    document.querySelectorAll(".image-mask").forEach(image => {
        const tl = gsap.timeline();

        tl
            .set(image, {
                autoAlpha: .8,
                scale: 1.8
            })
            .fromTo(image, {
                autoAlpha: .8,
                scale: 1.4
            }, {
                autoAlpha: 1,
                scale: 1,
            })

        ScrollTrigger.create({
            trigger: image,
            scroller: ".container",
            scrub: true,
            start: "top bottom",
            end: "top 25%",
            animation: tl,

        });

    });

    ScrollTrigger.addEventListener('refresh', () => scroller.update())

    ScrollTrigger.refresh()

    var swiperBgArr = ['#CA9C73', '#FBC7B3', '#EDD6C0', '#1F110A'];

    var preferencesSwiper = new Swiper('.swiper-container.preferencesSwiper', {
        direction: 'vertical',
        speed: 1500,
        effect: 'fade',
        watchOverflow: true,
        touchReleaseOnEdges: true,
        resistance: false,
        resistanceRatio: 0,
        mousewheel: {
            releaseOnEdges: true
        },
        navigation: {
            nextEl: '.nextSlide',
            prevEl: '.prevSlide',
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'custom',
            renderCustom: function (swiper, current, total) {
                return ('0' + current).slice(-2) + '<span class="separator"> — </span>' + ('0' + total).slice(-2);
            }
        },
        on: {
            init: function (swiper) {
                if (swiper.activeIndex === 0) {
                    $('.preferencesSwiper').addClass('first');
                } else if (swiper.activeIndex === swiper.slides.length) {
                    $('.preferencesSwiper').addClass('last');
                } else {
                    $('.preferencesSwiper').removeClass('last');
                    $('.preferencesSwiper').removeClass('first');
                }
            },
            slideChange: function (swiper) {
                if (swiper.activeIndex === 0) {
                    $('.preferencesSwiper').addClass('first');
                    $('.header').removeClass('moveHeader');
                    $('.leftSideBg').css({'background': swiperBgArr[0]});
                    setTimeout(function () {
                        scroller.start();
                    }, 1750);
                } else if (swiper.activeIndex === 1) {
                    $('.preferencesSwiper').removeClass('last');
                    $('.preferencesSwiper').removeClass('first');
                    $('.header').addClass('moveHeader');
                    scroller.scrollTo(document.querySelector('.ourPreferences'));
                    scroller.stop();
                    $('.leftSideBg').css({'background': swiperBgArr[1]});
                } else if (swiper.activeIndex === 2) {
                    $('.preferencesSwiper').removeClass('last');
                    $('.preferencesSwiper').removeClass('first');
                    $('.header').addClass('moveHeader');
                    scroller.scrollTo(document.querySelector('.ourPreferences'));
                    scroller.stop();
                    $('.leftSideBg').css({'background': swiperBgArr[2]});
                } else if (swiper.activeIndex === 3) {
                    $('.preferencesSwiper').addClass('last');
                    $('.header').removeClass('moveHeader');
                    $('.leftSideBg').css({'background': swiperBgArr[3]});
                    setTimeout(function () {
                        scroller.start();
                    }, 1750);
                }
            }
        }
    });

    var productCardSwiper = new Swiper('.swiper-container.productCardSwiper', {
        speed: 1500,
        effect: 'fade',
        initialSlide: $('.productCardSwiper .currentService').index(),
        observer: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'custom',
            renderCustom: function (swiper, current, total) {
                return ('0' + current).slice(-2) + '<span class="separator"> / </span>' + ('0' + total).slice(-2);
            }
        },
        breakpoints: {
            320: {
                autoHeight: true,
            },
            1024: {
                autoHeight: false,
            }
        },
        on: {
            init(swiper) {
                if ($(window).width() < 1024) {
                    setTimeout(function () {
                        swiper.updateAutoHeight();
                    }, 1000);
                }
            }
        }
    });

    $('select').niceSelect();

    $('.servicesListWrap .servicesList .listItem a').each(function () {
        $(this).css({
            'left': Math.floor(Math.random() * 125 - 65) + 'px'
        });
    });

    $(document).on('click', '.scrollToTopButton', function (e) {
        e.preventDefault();

        scroller.scrollTo(0);
    });

    $(document).on('click', '.headerNav a:not([target="_blank"])', function (e) {
        e.preventDefault();

        var self = $(this);

        $('.header').removeClass('showMenu');

        if (!$(this).hasClass('popup-link')) {
            if (!$('.wrapper').hasClass('productCardPage')) {
                e.preventDefault();

                $('body').removeClass('fixed');
                var objectToScrollOffset = self.attr('href');
                objectToScrollOffset = objectToScrollOffset.replace('/', '');
                objectToScrollOffset = objectToScrollOffset.substring(1);

                scroller.scrollTo(document.getElementById(objectToScrollOffset), {
                    duration: 2000
                });

                return false;
            } else {
                e.preventDefault();

                let elem = $(this);

                // let prop = elem.attr('href').replace('/', '');
                // $(location).attr('href', 'index.php' + prop);
                $(location).attr('href', elem.attr('href'));

                return false;
            }
        }
    });

    $(document).on('click', '.header .hamburgerMenu', function (e) {
        e.preventDefault();

        $(this).parents('.header').addClass('onceOpened');

        $(this).parents('.header').toggleClass('showMenu');
        $('body').toggleClass('fixed');

        return false;
    });

    $(document).on('click', '.moreTriggerButton', function (e) {
        e.preventDefault();
        var allShowedListItems = $(this).siblings('.servicesList').find('.listItem.show');

        if ($(this).hasClass('listEnded')) {
            scroller.scrollTo(document.getElementById('ourServices'));
            setTimeout(function () {
                for (var i = 5; i < allShowedListItems.length; i++) {
                    $('.servicesList .listItem').eq(i).removeClass('show');
                    $('.servicesList .listItem').eq(i).css("display", "none");
                }
            }, 2000);

            $(this).removeClass('listEnded');
        } else {
            for (var i = allShowedListItems.length; i < allShowedListItems.length + 6; i++) {
                $('.servicesList .listItem').eq(i).addClass('show');
                $('.servicesList .listItem').eq(i).slideDown(750);
            }

            ScrollTrigger.update;
            ScrollTrigger.refresh();


            if ($('.servicesList .listItem:last-child').hasClass('show')) {
                $(this).addClass('listEnded');
            }
        }

        setTimeout(function () {
            scroller.update();
            ScrollTrigger.update;
            ScrollTrigger.refresh();
        }, 2500);
        return false;
    });


    function openThankYouPopup() {
        $.magnificPopup.open({
            items: {
                src: '#thankYouPopup',
            },
            type: 'inline',
            fixedContentPos: true,
            fixedBgPos: true,
            removalDelay: 100,
            mainClass: 'my-mfp-zoom-in',
            callbacks: {
                open: function () {
                    $('body').addClass('fixed');

                },
                close: function () {
                    $('body').removeClass('fixed');
                }
            }
        });
    }

    $('.popup-link').magnificPopup({
        type: 'inline',
        fixedContentPos: true,
        fixedBgPos: true,
        removalDelay: 150,
        mainClass: 'my-mfp-zoom-in',
        callbacks: {
            open: function () {
                $('body').addClass('fixed');

            },
            close: function () {
                $('body').removeClass('fixed');
            }
        }
    })

    $(document).on('click', '.mfp-close', function (e) {
        e.preventDefault();
    });

    $(document).on('change', '.languageSelector', function (e) {
        $(location).attr('href', $(e.currentTarget).val());
    });

});