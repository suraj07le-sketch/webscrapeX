jQuery(document).ready(function($){
    console.log("custom js loaded");
    var legacyBannerSlider = new Swiper('.legacy-banner-slider', {
        slidesPerView: 1,
        effect: "fade",
        fadeEffect: {
            crossFade: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
    });
    /* var legacyBannerDetSlider = new Swiper('.legacy-det-slider', {
        slidesPerView: 1,
        effect: "fade",
        simulateTouch: false,
        fadeEffect: {
            crossFade: true,
        }
        
    });
    legacyBannerSlider.controller.control = legacyBannerDetSlider;   */

    /****************************************************************************/
    /****************************************************************************/

    wow = new WOW({
        //mobile: false,
        offset: 150,
    });
    wow.init(); 


    function detectRotation(){
        
        const rotatorImgs = document.querySelectorAll('.rotator img');
        const bannerTexts = document.querySelectorAll('.banner-text span'); 
        if (rotatorImgs && rotatorImgs.length > 0) {
            let lastAngle = null;
            // Divide 360 into 3 equal parts: 120, 240 and wrap-around (treated as milestone 3)
            const milestones = [0, 120, 240];
            const reached = {};

            function getRotationAngle(el) {
                const style = window.getComputedStyle(el);
                const matrix = style.transform; 
                if (matrix && matrix !== 'none') {
                    const values = matrix.split('(')[1].split(')')[0].split(',');
                    const a = parseFloat(values[0]);
                    const b = parseFloat(values[1]);
                    let angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
                    if (angle < 0) angle += 360; 
                    return angle;
                }
                return 0;
            }

            function updateImageOpacity(index) {
                if (rotatorImgs && rotatorImgs.length > 0) {
                    rotatorImgs.forEach((img, i) => {
                        if (window.gsap && window.gsap.to) {
                            img.style.display = 'block';
                            gsap.to(img, { 
                                opacity: (i === (index - 1)) ? 1 : 0.7, 
                                duration: 0.4, 
                                ease: 'power2.out' 
                            });
                        } else {
                            img.style.opacity = (i === (index - 1)) ? '1' : '0.7';
                        }
                    });
                }
            }

            function triggerMilestone(index){
                // 1 for first part (0), 2 for second (120), 3 for third (240)
                /*  console.log(index); */
                
                // Update banner text opacity
                if (bannerTexts && bannerTexts.length) {
                    bannerTexts.forEach((el, i) => {
                        if (window.gsap && window.gsap.to) {
                            el.style.display = 'block';
                            gsap.to(el, { opacity: (i === (index - 1)) ? 1 : 0, duration: 0.6, ease: 'power2.out' });
                        } else {
                            el.style.opacity = (i === (index - 1)) ? '1' : '0';
                            el.style.display = 'none';
                        }
                    });
                }
                
                // Update image opacity
                updateImageOpacity(index);
            }

            function resetMilestones(){
                milestones.forEach(d => reached[d] = false);
            }

            function checkRotation() {
                const angle = getRotationAngle(rotatorImgs[0]);

                // Detect wrap-around from high angle to low angle (e.g., 350 -> 10)
                if (lastAngle !== null && angle < lastAngle) {
                    // On wrap-around, show first banner text
                    triggerMilestone(1);
                    resetMilestones();
                }

                milestones.forEach((deg, idx) => {
                    if (!reached[deg] && angle >= deg) {
                        reached[deg] = true;
                        triggerMilestone(idx + 1);
                    }
                });

                lastAngle = angle;
                requestAnimationFrame(checkRotation);
            }

            function startChecking(){
                resetMilestones();
                lastAngle = getRotationAngle(rotatorImgs[0]);
                // Initialize visibility based on current angle - start with index 1
                triggerMilestone(1);
                requestAnimationFrame(checkRotation);
            }

            // Start checking immediately and also when animation starts (in case of delayed CSS animations)
            startChecking();
            rotatorImgs[0].addEventListener('animationstart', startChecking);
        }
    }
    detectRotation();

    /* ********************************************************************************** */
    function splitTextAnim(){
        console.log('init');
        let splitTitle = jQuery('.sp-txt'); 
        let splitIntroPara = jQuery('.sp-para'); 

        gsap.registerPlugin(ScrollTrigger);

        if (document.fonts && document.fonts.ready) {
            //if (!splitTitle.length || !splitIntroPara.length) return; 
            // Split text
            const splitTl = new SplitText(splitTitle, {
                type: "words",
                wordsClass: "split-word"
            });  
            const splitParaChild = new SplitText(splitIntroPara, {
                type: "lines", 
                linesClass: "lineChild"
            });
            const splitPara = new SplitText(splitIntroPara, {
                type: "lines", 
                linesClass: "lineParent"
            });

        }

        function animateSectionOnScroll(selector, timelineCallback) {
        let tl = gsap.timeline({
            scrollTrigger: {
            trigger: selector,
            start: "top 60%",
            end: "bottom top",
            toggleActions: "play none none none",
            scrub: false,
            //markers: true,
            }
        });
        timelineCallback(tl, selector);
        }

        animateSectionOnScroll('.demerged-info', function(tl, selector) { 
            tl.from(selector + " .lineChild", { duration: 0.7, opacity: 0, yPercent: 100, stagger: 0.12, } ) 
        });
    }

    splitTextAnim(); 
    /* setTimeout(() => {
        splitTextAnim(); 
    }, 4000);   */


});