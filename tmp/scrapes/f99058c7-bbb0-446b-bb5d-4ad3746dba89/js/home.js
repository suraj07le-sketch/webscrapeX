jQuery(document).ready(function ($) {

  if (jQuery('body').hasClass('home')) {

    jQuery.ajax({

    type: 'post',

    url: ajaxurl,

    data: {

     action: 'stockinfohome',

    },

    success: function (msg) {

     console.log(msg);
      jQuery('.ajax_load').html(msg)
    

    },

   });

  }



  var swiper = new Swiper('.fold2-sldr', {
    slidesPerView: '3.2',
    spaceBetween: 30,
    grabCursor: true,
    mousewheel: false,
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: '.fold2-next',
      prevEl: '.fold2-prev',
    },
    pagination: {
      el: '.pagi-home2',
      clickable: true,
    },
    loop: true,
    breakpoints: {
      320: {
        slidesPerView: 1.1,
        spaceBetween: 20,
      },
      480: {
        slidesPerView: 1.1,
        spaceBetween: 15,
      },
      640: {
        slidesPerView: 1.1,
        spaceBetween: 15,
      },
      768: {
        slidesPerView: 2.5,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3.2,
        spaceBetween: 30,
      },
    },
  });

  // var swiper_home2 = new Swiper(".home-bnr-thumb-wrp", {
  //   //effect: "fade",
  //   slidesPerView: "1",
  //   loop:true,
  //   spaceBetween: 0,

  //  });
  // swiper_home2.slideTo(2, false,false);

  // var swiper_home = new Swiper(".home-bnr-sldr", {
  //  //effect: "fade",
  //  slidesPerView: "1",
  //  loop:true,
  //  spaceBetween: 0,
  //   pagination: {
  //     el: ".pagi-home",
  //     clickable: true,
  //   },
  //   thumbs: {
  //     swiper: swiper_home2,
  //   },
  // });

  var swiper = new Swiper('.banner-home', {
    loop: true,
    grabCursor: true,
    effect: 'coverflow',
    crossFade: true,
    speed: 1000,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 500,
      modifier: 1,
      slideShadows: true,
      scale: 0.5,
    },autoplay: {
      delay: 5000,
      disableOnInteraction: true,
    },
    pagination: {
      el: '.pagi-home',
      clickable: true,
    },
    navigation: {
      nextEl: '.home-next',
      prevEl: '.home-prev',
    },
  });

  //   swiper_home.on('slideChange', function (e) {
  //     console.log('*** mySwiper.activeIndex', swiper_home2.activeIndex);
  //     if(swiper_home2.activeIndex==6){
  //       swiper_home2.activeIndex=1;
  //     }
  //     swiper_home2.slideTo(swiper_home2.activeIndex+1, false,false);
  // });

  $('.pl-pau-cta').on('click', function (e) {
    $('.home-bnr-sldr').toggleClass('pause');
    $('.home-banner').toggleClass('pause2');
    $(this).toggleClass('pause-cta');
    setTimeout(function () {
      swiper_home.slideTo(2);
    }, 175);
  });

  $('.pl-pau-cta').click(function () {
    if ($('.home-bnr-sldr').hasClass('pause')) {
      // swiper_home.autoplay.start();
    } else {
      // swiper_home.autoplay.stop();
    }
  });

  var swiper_top = new Swiper('.buss-sldr', {
    effect: 'fade',
    loop: true,
    allowTouchMove: false,
    preventInteractionOnTransition: true,
    fadeEffect: {
      crossFade: true,
    },
    thumbs: {
      swiper: swiper_thumb,
    },
    speed: 100,
  });

  var swiper_thumb = new Swiper('.buss-thum-sldr', {
    //effect: "fade",
    loop: true,
    allowTouchMove: false,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
    // fadeEffect: {
    //   crossFade: true
    // },
    navigation: {
      nextEl: '.buss-next',
    },
    thumbs: {
      swiper: swiper_top,
    },
    speed: 2000,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    on: {
      slideNextTransitionStart: (swiper) => {
        // console.log('SWIPED RIGHT');
        $('.wheel-card').removeClass('wheel-card-bck');
        $('.wheel-card').removeClass('wheel-card-fwd');
        setTimeout(() => {
          $('.wheel-card').addClass('wheel-card-fwd');
        }, '50');
      },
      slidePrevTransitionStart: (swiper) => {
        // console.log('SWIPED LEFT');
        $('.wheel-card').removeClass('wheel-card-fwd');
        $('.wheel-card').removeClass('wheel-card-bck');
        setTimeout(() => {
          $('.wheel-card').addClass('wheel-card-bck');
        }, '50');
      },
    },
    //     on: {
    //       slideChangeTransitionStart: function(swiper) {

    //         if(swiper.previousIndex>swiper.activeIndex){

    //

    //         }else{
    //
    //           console.log('fwd')
    //         }

    //       },
    //       beforeTransitionStart: function(swiper) {

    //         $('.wheel-card').removeClass('wheel-card-fwd')
    //         $('.wheel-card').removeClass('wheel-card-bck')

    //       },

    // },
  });

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  if (
    /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
  ) {
  } else {
    // var smoother = ScrollSmoother.create({
    //   content: '.viewport',
    //   smooth: 2.5,
    //   smoothTouch: 0.1,
    //   effects: true,
    // });

    // legacy //
    // var swiper = new Swiper(".legacy-sldr", {
    //   grabCursor: true,
    //   effect: "creative",
    //   creativeEffect: {
    //     prev: {
    //       shadow: true,
    //       translate: [0, 0, -600],
    //     },
    //     next: {
    //       translate: ["100%", 0, 0],
    //     },
    //   },
    //   pagination: {
    //          el: ".pagi-home",
    //         clickable: true,
    //       },
    //       navigation: {
    //         nextEl: ".legacy-next",
    //         prevEl: ".legacy-prev",
    //       },
    // });
    // legacy //

    gsap.set('.anim-1', { y: -50, opacity: 0 });
    gsap.set(
      '.anim-2,.anim-3,.anim-4,.anim-8,.anim-9,.anim-10,.anim-11,.anim-12',
      { y: 50, opacity: 0 },
    );
    gsap.set('.anim-5', { x: -600, opacity: 1 });
    gsap.set('.anim-6', { x: 600, opacity: 1 });
    gsap.set('.anim-7', { scale: 0.01, opacity: 1 });

    window.onload = function () {
      setTimeout(function () {
        gsap.to('.anim-1', {
          y: 0,
          duration: 0.5,
          opacity: 1,
        });

        gsap.to('.anim-2', {
          y: 0,
          opacity: 1,
          delay: 0,
          stagger: {
            each: 0.3,
            ease: 'none',
          },
        });

        $('#bnr-vid')[0].play();
      }, 1000);
    };

    gsap.to('.anim-3', {
      scrollTrigger: {
        trigger: '.home-fold2',
        start: 'top 80%',
        end: 'top bottom',
      },
      y: 0,
      opacity: 1,
      duration: 1,
      delay: 0,
      ease: Expo.easeOut,
      stagger: {
        each: 0.05,
        ease: 'none',
      },
    });

    gsap.to('.anim-4', {
      scrollTrigger: {
        trigger: '.home-about-wrp',
        start: 'top 80%',
        end: 'top bottom',
      },
      y: 0,
      opacity: 1,
      duration: 1,
      delay: 0,
      ease: Expo.easeOut,
      stagger: {
        each: 0.05,
        ease: 'none',
      },
    });

    gsap.to('.anim-5', {
      scrollTrigger: {
        trigger: '.cars-abt-wrp',
        start: 'top 80%',
        end: 'top bottom',
      },
      x: 0,
      opacity: 1,
      duration: 1,
      delay: 0,
      ease: Expo.easeOut,
    });

    gsap.to('.anim-6', {
      scrollTrigger: {
        trigger: '.cars-abt-wrp',
        start: 'top 80%',
        end: 'top bottom',
      },
      x: 0,
      opacity: 1,
      duration: 1,
      delay: 0,
      ease: Expo.easeOut,
    });

    gsap.to('.anim-7', {
      scrollTrigger: {
        trigger: '.cars-abt-wrp',
        start: 'top 80%',
        end: 'top bottom',
      },
      scale: 1,
      opacity: 1,
      duration: 1,
      //delay: 0.5,
      //ease: Expo.easeOut,
    });

    gsap.to('.anim-8', {
      scrollTrigger: {
        trigger: '.legacy-wrp',
        start: 'top 80%',
        end: 'top bottom',
      },
      y: 0,
      opacity: 1,
      duration: 1,
      delay: 0,
      ease: Expo.easeOut,
      stagger: {
        each: 0.05,
        ease: 'none',
      },
    });

    gsap.to('.anim-9', {
      scrollTrigger: {
        trigger: '.our-business-wrp',
        start: 'top 80%',
        end: 'top bottom',
      },
      y: 0,
      opacity: 1,
      duration: 1,
      delay: 0,
      ease: Expo.easeOut,
      stagger: {
        each: 0.05,
        ease: 'none',
      },
    });

    gsap.to('.anim-10', {
      scrollTrigger: {
        trigger: '.home-investor-wrp',
        start: 'top 80%',
        end: 'top bottom',
      },
      y: 0,
      opacity: 1,
      duration: 1,
      delay: 0,
      ease: Expo.easeOut,
      stagger: {
        each: 0.05,
        ease: 'none',
      },
    });

    gsap.to('.anim-11', {
      scrollTrigger: {
        trigger: '.suatainability-wrp',
        start: 'top 80%',
        end: 'top bottom',
      },
      y: 0,
      opacity: 1,
      duration: 1,
      delay: 0,
      ease: Expo.easeOut,
      stagger: {
        each: 0.05,
        ease: 'none',
      },
    });

    gsap.to('.anim-12', {
      scrollTrigger: {
        trigger: '.home-careers-wrp',
        start: 'top 80%',
        end: 'top bottom',
      },
      y: 0,
      opacity: 1,
      duration: 1,
      delay: 0,
      ease: Expo.easeOut,
      stagger: {
        each: 0.05,
        ease: 'none',
      },
    });
  }

  ScrollTrigger.create({
    trigger: '.legacy-wrp',
    onEnter: myEnterFunc,
  });

  function myEnterFunc(param) {
    var legacyswiper = new Swiper('.legacy-sldr', {
      grabCursor: true,
      effect: 'fade',
      crossFade: true,
      loop: true,
      speed: 1000,
      autoplay: {
        delay: 5000,
        disableOnInteraction: true,
      },
      // creativeEffect: {
      //   prev: {
      //     shadow: true,
      //     translate: [0, 0, -600],
      //   },
      //   next: {
      //     translate: ['100%', 0, 0],
      //   },
      // },
      navigation: {
        nextEl: '.legacy-next',
        prevEl: '.legacy-prev',
      },
    });
  }
});
