// /*! lightgallery - v1.3.2 - 2016-09-23
// * http://sachinchoolur.github.io/lightGallery/
// * Copyright (c) 2016 Sachin N; Licensed Apache 2.0 */

// (function (root, factory) {
//     if (typeof define === 'function' && define.amd) {
//       // AMD. Register as an anonymous module unless amdModuleId is set
//       define(["jquery"], function (a0) {
//         return (factory(a0));
//       });
//     } else if (typeof exports === 'object') {
//       // Node. Does not work with strict CommonJS, but
//       // only CommonJS-like environments that support module.exports,
//       // like Node.
//       module.exports = factory(require("jquery"));
//     } else {
//       factory(jQuery);
//     }
//   }(this, function (jquery) {
  
  
//   (function(){
//       'use strict';
  
//       var defaults = {
  
//           mode: 'lg-slide',
  
//           // Ex : 'ease'
//           cssEasing: 'ease',
  
//           //'for jquery animation'
//           easing: 'linear',
//           speed: 600,
//           height: '100%',
//           width: '100%',
//           addClass: '',
//           startClass: 'lg-start-zoom',
//           backdropDuration: 150,
//           hideBarsDelay: 6000,
  
//           useLeft: false,
  
//           closable: true,
//           loop: true,
//           escKey: true,
//           keyPress: true,
//           controls: true,
//           slideEndAnimatoin: true,
//           hideControlOnEnd: false,
//           mousewheel: true,
  
//           getCaptionFromTitleOrAlt: true,
  
//           // .lg-item || '.lg-sub-html'
//           appendSubHtmlTo: '.lg-sub-html',
  
//           subHtmlSelectorRelative: false,
  
//           /**
//            * @desc number of preload slides
//            * will exicute only after the current slide is fully loaded.
//            *
//            * @ex you clicked on 4th image and if preload = 1 then 3rd slide and 5th
//            * slide will be loaded in the background after the 4th slide is fully loaded..
//            * if preload is 2 then 2nd 3rd 5th 6th slides will be preloaded.. ... ...
//            *
//            */
//           preload: 1,
//           showAfterLoad: true,
//           selector: '',
//           selectWithin: '',
//           nextHtml: '',
//           prevHtml: '',
  
//           // 0, 1
//           index: false,
  
//           iframeMaxWidth: '100%',
  
//           download: true,
//           counter: true,
//           appendCounterTo: '.lg-toolbar',
  
//           swipeThreshold: 50,
//           enableSwipe: true,
//           enableDrag: true,
  
//           dynamic: false,
//           dynamicEl: [],
//           galleryId: 1
//       };
  
//       function Plugin(element, options) {
  
//           // Current lightGallery element
//           this.el = element;
  
//           // Current jquery element
//           this.$el = $(element);
  
//           // lightGallery settings
//           this.s = $.extend({}, defaults, options);
  
//           // When using dynamic mode, ensure dynamicEl is an array
//           if (this.s.dynamic && this.s.dynamicEl !== 'undefined' && this.s.dynamicEl.constructor === Array && !this.s.dynamicEl.length) {
//               throw ('When using dynamic mode, you must also define dynamicEl as an Array.');
//           }
  
//           // lightGallery modules
//           this.modules = {};
  
//           // false when lightgallery complete first slide;
//           this.lGalleryOn = false;
  
//           this.lgBusy = false;
  
//           // Timeout function for hiding controls;
//           this.hideBartimeout = false;
  
//           // To determine browser supports for touch events;
//           this.isTouch = ('ontouchstart' in document.documentElement);
  
//           // Disable hideControlOnEnd if sildeEndAnimation is true
//           if (this.s.slideEndAnimatoin) {
//               this.s.hideControlOnEnd = false;
//           }
  
//           // Gallery items
//           if (this.s.dynamic) {
//               this.$items = this.s.dynamicEl;
//           } else {
//               if (this.s.selector === 'this') {
//                   this.$items = this.$el;
//               } else if (this.s.selector !== '') {
//                   if (this.s.selectWithin) {
//                       this.$items = $(this.s.selectWithin).find(this.s.selector);
//                   } else {
//                       this.$items = this.$el.find($(this.s.selector));
//                   }
//               } else {
//                   this.$items = this.$el.children();
//               }
//           }
  
//           // .lg-item
//           this.$slide = '';
  
//           // .lg-outer
//           this.$outer = '';
  
//           this.init();
  
//           return this;
//       }
  
//       Plugin.prototype.init = function() {
  
//           var _this = this;
  
//           // s.preload should not be more than $item.length
//           if (_this.s.preload > _this.$items.length) {
//               _this.s.preload = _this.$items.length;
//           }
  
//           // if dynamic option is enabled execute immediately
//           var _hash = window.location.hash;
//           if (_hash.indexOf('lg=' + this.s.galleryId) > 0) {
  
//               _this.index = parseInt(_hash.split('&slide=')[1], 10);
  
//               $('body').addClass('lg-from-hash');
//               if (!$('body').hasClass('lg-on')) {
//                   setTimeout(function() {
//                       _this.build(_this.index);
//                   });
//                   $('body').addClass('lg-on');
//               }
//           }
  
//           if (_this.s.dynamic) {
  
//               _this.$el.trigger('onBeforeOpen.lg');
  
//               _this.index = _this.s.index || 0;
  
//               // prevent accidental double execution
//               if (!$('body').hasClass('lg-on')) {
//                   setTimeout(function() {
//                       _this.build(_this.index);
//                       $('body').addClass('lg-on');
//                   });
//               }
//           } else {
  
//               // Using different namespace for click because click event should not unbind if selector is same object('this')
//               _this.$items.on('click.lgcustom', function(event) {
  
//                   // For IE8
//                   try {
//                       event.preventDefault();
//                       event.preventDefault();
//                   } catch (er) {
//                       event.returnValue = false;
//                   }
  
//                   _this.$el.trigger('onBeforeOpen.lg');
  
//                   _this.index = _this.s.index || _this.$items.index(this);
  
//                   // prevent accidental double execution
//                   if (!$('body').hasClass('lg-on')) {
//                       _this.build(_this.index);
//                       $('body').addClass('lg-on');
//                   }
//               });
//           }
  
//       };
  
//       Plugin.prototype.build = function(index) {
  
//           var _this = this;
  
//           _this.structure();
  
//           // module constructor
//           $.each($.fn.lightGallery.modules, function(key) {
//               _this.modules[key] = new $.fn.lightGallery.modules[key](_this.el);
//           });
  
//           // initiate slide function
//           _this.slide(index, false, false);
  
//           if (_this.s.keyPress) {
//               _this.keyPress();
//           }
  
//           if (_this.$items.length > 1) {
  
//               _this.arrow();
  
//               setTimeout(function() {
//                   _this.enableDrag();
//                   _this.enableSwipe();
//               }, 50);
  
//               if (_this.s.mousewheel) {
//                   _this.mousewheel();
//               }
//           }
  
//           _this.counter();
  
//           _this.closeGallery();
  
//           _this.$el.trigger('onAfterOpen.lg');
  
//           // Hide controllers if mouse doesn't move for some period
//           _this.$outer.on('mousemove.lg click.lg touchstart.lg', function() {
  
//               _this.$outer.removeClass('lg-hide-items');
  
//               clearTimeout(_this.hideBartimeout);
  
//               // Timeout will be cleared on each slide movement also
//               _this.hideBartimeout = setTimeout(function() {
//                   _this.$outer.addClass('lg-hide-items');
//               }, _this.s.hideBarsDelay);
  
//           });
  
//       };
  
//       Plugin.prototype.structure = function() {
//           var list = '';
//           var controls = '';
//           var i = 0;
//           var subHtmlCont = '';
//           var template;
//           var _this = this;
  
//           $('body').append('<div class="lg-backdrop"></div>');
//           $('.lg-backdrop').css('transition-duration', this.s.backdropDuration + 'ms');
  
//           // Create gallery items
//           for (i = 0; i < this.$items.length; i++) {
//               list += '<div class="lg-item"></div>';
//           }
  
//           // Create controlls
//           if (this.s.controls && this.$items.length > 1) {
//               controls = '<div class="lg-actions">' +
//                   '<div class="lg-prev lg-icon">' + this.s.prevHtml + '</div>' +
//                   '<div class="lg-next lg-icon">' + this.s.nextHtml + '</div>' +
//                   '</div>';
//           }
  
//           if (this.s.appendSubHtmlTo === '.lg-sub-html') {
//               subHtmlCont = '<div class="lg-sub-html"></div>';
//           }
  
//           template = '<div class="lg-outer ' + this.s.addClass + ' ' + this.s.startClass + '">' +
//               '<div class="lg" style="width:' + this.s.width + '; height:' + this.s.height + '">' +
//               '<div class="lg-inner">' + list + '</div>' +
//               '<div class="lg-toolbar group">' +
//               '<span class="lg-close lg-icon"></span>' +
//               '</div>' +
//               controls +
//               subHtmlCont +
//               '</div>' +
//               '</div>';
  
//           $('body').append(template);
//           this.$outer = $('.lg-outer');
//           this.$slide = this.$outer.find('.lg-item');
  
//           if (this.s.useLeft) {
//               this.$outer.addClass('lg-use-left');
  
//               // Set mode lg-slide if use left is true;
//               this.s.mode = 'lg-slide';
//           } else {
//               this.$outer.addClass('lg-use-css3');
//           }
  
//           // For fixed height gallery
//           _this.setTop();
//           $(window).on('resize.lg orientationchange.lg', function() {
//               setTimeout(function() {
//                   _this.setTop();
//               }, 100);
//           });
  
//           // add class lg-current to remove initial transition
//           this.$slide.eq(this.index).addClass('lg-current');
  
//           // add Class for css support and transition mode
//           if (this.doCss()) {
//               this.$outer.addClass('lg-css3');
//           } else {
//               this.$outer.addClass('lg-css');
  
//               // Set speed 0 because no animation will happen if browser doesn't support css3
//               this.s.speed = 0;
//           }
  
//           this.$outer.addClass(this.s.mode);
  
//           if (this.s.enableDrag && this.$items.length > 1) {
//               this.$outer.addClass('lg-grab');
//           }
  
//           if (this.s.showAfterLoad) {
//               this.$outer.addClass('lg-show-after-load');
//           }
  
//           if (this.doCss()) {
//               var $inner = this.$outer.find('.lg-inner');
//               $inner.css('transition-timing-function', this.s.cssEasing);
//               $inner.css('transition-duration', this.s.speed + 'ms');
//           }
  
//           $('.lg-backdrop').addClass('in');
  
//           setTimeout(function() {
//               _this.$outer.addClass('lg-visible');
//           }, this.s.backdropDuration);
  
//           if (this.s.download) {
//               this.$outer.find('.lg-toolbar').append('<a id="lg-download" target="_blank" download class="lg-download lg-icon"></a>');
//           }
  
//           // Store the current scroll top value to scroll back after closing the gallery..
//           this.prevScrollTop = $(window).scrollTop();
  
//       };
  
//       // For fixed height gallery
//       Plugin.prototype.setTop = function() {
//           if (this.s.height !== '100%') {
//               var wH = $(window).height();
//               var top = (wH - parseInt(this.s.height, 10)) / 2;
//               var $lGallery = this.$outer.find('.lg');
//               if (wH >= parseInt(this.s.height, 10)) {
//                   $lGallery.css('top', top + 'px');
//               } else {
//                   $lGallery.css('top', '0px');
//               }
//           }
//       };
  
//       // Find css3 support
//       Plugin.prototype.doCss = function() {
//           // check for css animation support
//           var support = function() {
//               var transition = ['transition', 'MozTransition', 'WebkitTransition', 'OTransition', 'msTransition', 'KhtmlTransition'];
//               var root = document.documentElement;
//               var i = 0;
//               for (i = 0; i < transition.length; i++) {
//                   if (transition[i] in root.style) {
//                       return true;
//                   }
//               }
//           };
  
//           if (support()) {
//               return true;
//           }
  
//           return false;
//       };
  
//       /**
//        *  @desc Check the given src is video
//        *  @param {String} src
//        *  @return {Object} video type
//        *  Ex:{ youtube  :  ["//www.youtube.com/watch?v=c0asJgSyxcY", "c0asJgSyxcY"] }
//        */
//       Plugin.prototype.isVideo = function(src, index) {
  
//           var html;
//           if (this.s.dynamic) {
//               html = this.s.dynamicEl[index].html;
//           } else {
//               html = this.$items.eq(index).attr('data-html');
//           }
  
//           if (!src && html) {
//               return {
//                   html5: true
//               };
//           }
  
//           var youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i);
//           var vimeo = src.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i);
//           var dailymotion = src.match(/\/\/(?:www\.)?dai.ly\/([0-9a-z\-_]+)/i);
//           var vk = src.match(/\/\/(?:www\.)?(?:vk\.com|vkontakte\.ru)\/(?:video_ext\.php\?)(.*)/i);
  
//           if (youtube) {
//               return {
//                   youtube: youtube
//               };
//           } else if (vimeo) {
//               return {
//                   vimeo: vimeo
//               };
//           } else if (dailymotion) {
//               return {
//                   dailymotion: dailymotion
//               };
//           } else if (vk) {
//               return {
//                   vk: vk
//               };
//           }
//       };
  
//       /**
//        *  @desc Create image counter
//        *  Ex: 1/10
//        */
//       Plugin.prototype.counter = function() {
//           if (this.s.counter) {
//               $(this.s.appendCounterTo).append('<div id="lg-counter"><span id="lg-counter-current">' + (parseInt(this.index, 10) + 1) + '</span> / <span id="lg-counter-all">' + this.$items.length + '</span></div>');
//           }
//       };
  
//       /**
//        *  @desc add sub-html into the slide
//        *  @param {Number} index - index of the slide
//        */
//       Plugin.prototype.addHtml = function(index) {
//           var subHtml = null;
//           var subHtmlUrl;
//           var $currentEle;
//           if (this.s.dynamic) {
//               if (this.s.dynamicEl[index].subHtmlUrl) {
//                   subHtmlUrl = this.s.dynamicEl[index].subHtmlUrl;
//               } else {
//                   subHtml = this.s.dynamicEl[index].subHtml;
//               }
//           } else {
//               $currentEle = this.$items.eq(index);
//               if ($currentEle.attr('data-sub-html-url')) {
//                   subHtmlUrl = $currentEle.attr('data-sub-html-url');
//               } else {
//                   subHtml = $currentEle.attr('data-sub-html');
//                   if (this.s.getCaptionFromTitleOrAlt && !subHtml) {
//                       subHtml = $currentEle.attr('title') || $currentEle.find('img').first().attr('alt');
//                   }
//               }
//           }
  
//           if (!subHtmlUrl) {
//               if (typeof subHtml !== 'undefined' && subHtml !== null) {
  
//                   // get first letter of subhtml
//                   // if first letter starts with . or # get the html form the jQuery object
//                   var fL = subHtml.substring(0, 1);
//                   if (fL === '.' || fL === '#') {
//                       if (this.s.subHtmlSelectorRelative && !this.s.dynamic) {
//                           subHtml = $currentEle.find(subHtml).html();
//                       } else {
//                           subHtml = $(subHtml).html();
//                       }
//                   }
//               } else {
//                   subHtml = '';
//               }
//           }
  
//           if (this.s.appendSubHtmlTo === '.lg-sub-html') {
  
//               if (subHtmlUrl) {
//                   this.$outer.find(this.s.appendSubHtmlTo).load(subHtmlUrl);
//               } else {
//                   this.$outer.find(this.s.appendSubHtmlTo).html(subHtml);
//               }
  
//           } else {
  
//               if (subHtmlUrl) {
//                   this.$slide.eq(index).load(subHtmlUrl);
//               } else {
//                   this.$slide.eq(index).append(subHtml);
//               }
//           }
  
//           // Add lg-empty-html class if title doesn't exist
//           if (typeof subHtml !== 'undefined' && subHtml !== null) {
//               if (subHtml === '') {
//                   this.$outer.find(this.s.appendSubHtmlTo).addClass('lg-empty-html');
//               } else {
//                   this.$outer.find(this.s.appendSubHtmlTo).removeClass('lg-empty-html');
//               }
//           }
  
//           this.$el.trigger('onAfterAppendSubHtml.lg', [index]);
//       };
  
//       /**
//        *  @desc Preload slides
//        *  @param {Number} index - index of the slide
//        */
//       Plugin.prototype.preload = function(index) {
//           var i = 1;
//           var j = 1;
//           for (i = 1; i <= this.s.preload; i++) {
//               if (i >= this.$items.length - index) {
//                   break;
//               }
  
//               this.loadContent(index + i, false, 0);
//           }
  
//           for (j = 1; j <= this.s.preload; j++) {
//               if (index - j < 0) {
//                   break;
//               }
  
//               this.loadContent(index - j, false, 0);
//           }
//       };
  
//       /**
//        *  @desc Load slide content into slide.
//        *  @param {Number} index - index of the slide.
//        *  @param {Boolean} rec - if true call loadcontent() function again.
//        *  @param {Boolean} delay - delay for adding complete class. it is 0 except first time.
//        */
//       Plugin.prototype.loadContent = function(index, rec, delay) {
  
//           var _this = this;
//           var _hasPoster = false;
//           var _$img;
//           var _src;
//           var _poster;
//           var _srcset;
//           var _sizes;
//           var _html;
//           var getResponsiveSrc = function(srcItms) {
//               var rsWidth = [];
//               var rsSrc = [];
//               for (var i = 0; i < srcItms.length; i++) {
//                   var __src = srcItms[i].split(' ');
  
//                   // Manage empty space
//                   if (__src[0] === '') {
//                       __src.splice(0, 1);
//                   }
  
//                   rsSrc.push(__src[0]);
//                   rsWidth.push(__src[1]);
//               }
  
//               var wWidth = $(window).width();
//               for (var j = 0; j < rsWidth.length; j++) {
//                   if (parseInt(rsWidth[j], 10) > wWidth) {
//                       _src = rsSrc[j];
//                       break;
//                   }
//               }
//           };
  
//           if (_this.s.dynamic) {
  
//               if (_this.s.dynamicEl[index].poster) {
//                   _hasPoster = true;
//                   _poster = _this.s.dynamicEl[index].poster;
//               }
  
//               _html = _this.s.dynamicEl[index].html;
//               _src = _this.s.dynamicEl[index].src;
  
//               if (_this.s.dynamicEl[index].responsive) {
//                   var srcDyItms = _this.s.dynamicEl[index].responsive.split(',');
//                   getResponsiveSrc(srcDyItms);
//               }
  
//               _srcset = _this.s.dynamicEl[index].srcset;
//               _sizes = _this.s.dynamicEl[index].sizes;
  
//           } else {
  
//               if (_this.$items.eq(index).attr('data-poster')) {
//                   _hasPoster = true;
//                   _poster = _this.$items.eq(index).attr('data-poster');
//               }
  
//               _html = _this.$items.eq(index).attr('data-html');
//               _src = _this.$items.eq(index).attr('href') || _this.$items.eq(index).attr('data-src');
  
//               if (_this.$items.eq(index).attr('data-responsive')) {
//                   var srcItms = _this.$items.eq(index).attr('data-responsive').split(',');
//                   getResponsiveSrc(srcItms);
//               }
  
//               _srcset = _this.$items.eq(index).attr('data-srcset');
//               _sizes = _this.$items.eq(index).attr('data-sizes');
  
//           }
  
//           //if (_src || _srcset || _sizes || _poster) {
  
//           var iframe = false;
//           if (_this.s.dynamic) {
//               if (_this.s.dynamicEl[index].iframe) {
//                   iframe = true;
//               }
//           } else {
//               if (_this.$items.eq(index).attr('data-iframe') === 'true') {
//                   iframe = true;
//               }
//           }
  
//           var _isVideo = _this.isVideo(_src, index);
//           if (!_this.$slide.eq(index).hasClass('lg-loaded')) {
//               if (iframe) {
//                   _this.$slide.eq(index).prepend('<div class="lg-video-cont" style="max-width:' + _this.s.iframeMaxWidth + '"><div class="lg-video"><iframe class="lg-object" frameborder="0" src="' + _src + '"  allowfullscreen="true"></iframe></div></div>');
//               } else if (_hasPoster) {
//                   var videoClass = '';
//                   if (_isVideo && _isVideo.youtube) {
//                       videoClass = 'lg-has-youtube';
//                   } else if (_isVideo && _isVideo.vimeo) {
//                       videoClass = 'lg-has-vimeo';
//                   } else {
//                       videoClass = 'lg-has-html5';
//                   }
  
//                   _this.$slide.eq(index).prepend('<div class="lg-video-cont ' + videoClass + ' "><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="' + _poster + '" /></div></div>');
  
//               } else if (_isVideo) {
//                   _this.$slide.eq(index).prepend('<div class="lg-video-cont "><div class="lg-video"></div></div>');
//                   _this.$el.trigger('hasVideo.lg', [index, _src, _html]);
//               } else {
//                   _this.$slide.eq(index).prepend('<div class="lg-img-wrap"><img class="lg-object lg-image" src="' + _src + '" /></div>');
//               }
  
//               _this.$el.trigger('onAferAppendSlide.lg', [index]);
  
//               _$img = _this.$slide.eq(index).find('.lg-object');
//               if (_sizes) {
//                   _$img.attr('sizes', _sizes);
//               }
  
//               if (_srcset) {
//                   _$img.attr('srcset', _srcset);
//                   try {
//                       picturefill({
//                           elements: [_$img[0]]
//                       });
//                   } catch (e) {
//                       console.error('Make sure you have included Picturefill version 2');
//                   }
//               }
  
//               if (this.s.appendSubHtmlTo !== '.lg-sub-html') {
//                   _this.addHtml(index);
//               }
  
//               _this.$slide.eq(index).addClass('lg-loaded');
//           }
  
//           _this.$slide.eq(index).find('.lg-object').on('load.lg error.lg', function() {
  
//               // For first time add some delay for displaying the start animation.
//               var _speed = 0;
  
//               // Do not change the delay value because it is required for zoom plugin.
//               // If gallery opened from direct url (hash) speed value should be 0
//               if (delay && !$('body').hasClass('lg-from-hash')) {
//                   _speed = delay;
//               }
  
//               setTimeout(function() {
//                   _this.$slide.eq(index).addClass('lg-complete');
//                   _this.$el.trigger('onSlideItemLoad.lg', [index, delay || 0]);
//               }, _speed);
  
//           });
  
//           // @todo check load state for html5 videos
//           if (_isVideo && _isVideo.html5 && !_hasPoster) {
//               _this.$slide.eq(index).addClass('lg-complete');
//           }
  
//           if (rec === true) {
//               if (!_this.$slide.eq(index).hasClass('lg-complete')) {
//                   _this.$slide.eq(index).find('.lg-object').on('load.lg error.lg', function() {
//                       _this.preload(index);
//                   });
//               } else {
//                   _this.preload(index);
//               }
//           }
  
//           //}
//       };
  
//       /**
//       *   @desc slide function for lightgallery
//           ** Slide() gets call on start
//           ** ** Set lg.on true once slide() function gets called.
//           ** Call loadContent() on slide() function inside setTimeout
//           ** ** On first slide we do not want any animation like slide of fade
//           ** ** So on first slide( if lg.on if false that is first slide) loadContent() should start loading immediately
//           ** ** Else loadContent() should wait for the transition to complete.
//           ** ** So set timeout s.speed + 50
//       <=> ** loadContent() will load slide content in to the particular slide
//           ** ** It has recursion (rec) parameter. if rec === true loadContent() will call preload() function.
//           ** ** preload will execute only when the previous slide is fully loaded (images iframe)
//           ** ** avoid simultaneous image load
//       <=> ** Preload() will check for s.preload value and call loadContent() again accoring to preload value
//           ** loadContent()  <====> Preload();
  
//       *   @param {Number} index - index of the slide
//       *   @param {Boolean} fromTouch - true if slide function called via touch event or mouse drag
//       *   @param {Boolean} fromThumb - true if slide function called via thumbnail click
//       */
//       Plugin.prototype.slide = function(index, fromTouch, fromThumb) {
  
//           var _prevIndex = this.$outer.find('.lg-current').index();
//           var _this = this;
  
//           // Prevent if multiple call
//           // Required for hsh plugin
//           if (_this.lGalleryOn && (_prevIndex === index)) {
//               return;
//           }
  
//           var _length = this.$slide.length;
//           var _time = _this.lGalleryOn ? this.s.speed : 0;
//           var _next = false;
//           var _prev = false;
  
//           if (!_this.lgBusy) {
  
//               if (this.s.download) {
//                   var _src;
//                   if (_this.s.dynamic) {
//                       _src = _this.s.dynamicEl[index].downloadUrl !== false && (_this.s.dynamicEl[index].downloadUrl || _this.s.dynamicEl[index].src);
//                   } else {
//                       _src = _this.$items.eq(index).attr('data-download-url') !== 'false' && (_this.$items.eq(index).attr('data-download-url') || _this.$items.eq(index).attr('href') || _this.$items.eq(index).attr('data-src'));
  
//                   }
  
//                   if (_src) {
//                       $('#lg-download').attr('href', _src);
//                       _this.$outer.removeClass('lg-hide-download');
//                   } else {
//                       _this.$outer.addClass('lg-hide-download');
//                   }
//               }
  
//               this.$el.trigger('onBeforeSlide.lg', [_prevIndex, index, fromTouch, fromThumb]);
  
//               _this.lgBusy = true;
  
//               clearTimeout(_this.hideBartimeout);
  
//               // Add title if this.s.appendSubHtmlTo === lg-sub-html
//               if (this.s.appendSubHtmlTo === '.lg-sub-html') {
  
//                   // wait for slide animation to complete
//                   setTimeout(function() {
//                       _this.addHtml(index);
//                   }, _time);
//               }
  
//               this.arrowDisable(index);
  
//               if (!fromTouch) {
  
//                   // remove all transitions
//                   _this.$outer.addClass('lg-no-trans');
  
//                   this.$slide.removeClass('lg-prev-slide lg-next-slide');
  
//                   if (index < _prevIndex) {
//                       _prev = true;
//                       if ((index === 0) && (_prevIndex === _length - 1) && !fromThumb) {
//                           _prev = false;
//                           _next = true;
//                       }
//                   } else if (index > _prevIndex) {
//                       _next = true;
//                       if ((index === _length - 1) && (_prevIndex === 0) && !fromThumb) {
//                           _prev = true;
//                           _next = false;
//                       }
//                   }
  
//                   if (_prev) {
  
//                       //prevslide
//                       this.$slide.eq(index).addClass('lg-prev-slide');
//                       this.$slide.eq(_prevIndex).addClass('lg-next-slide');
//                   } else if (_next) {
  
//                       // next slide
//                       this.$slide.eq(index).addClass('lg-next-slide');
//                       this.$slide.eq(_prevIndex).addClass('lg-prev-slide');
//                   }
  
//                   // give 50 ms for browser to add/remove class
//                   setTimeout(function() {
//                       _this.$slide.removeClass('lg-current');
  
//                       //_this.$slide.eq(_prevIndex).removeClass('lg-current');
//                       _this.$slide.eq(index).addClass('lg-current');
  
//                       // reset all transitions
//                       _this.$outer.removeClass('lg-no-trans');
//                   }, 50);
//               } else {
  
//                   var touchPrev = index - 1;
//                   var touchNext = index + 1;
  
//                   if ((index === 0) && (_prevIndex === _length - 1)) {
  
//                       // next slide
//                       touchNext = 0;
//                       touchPrev = _length - 1;
//                   } else if ((index === _length - 1) && (_prevIndex === 0)) {
  
//                       // prev slide
//                       touchNext = 0;
//                       touchPrev = _length - 1;
//                   }
  
//                   this.$slide.removeClass('lg-prev-slide lg-current lg-next-slide');
//                   _this.$slide.eq(touchPrev).addClass('lg-prev-slide');
//                   _this.$slide.eq(touchNext).addClass('lg-next-slide');
//                   _this.$slide.eq(index).addClass('lg-current');
//               }
  
//               if (_this.lGalleryOn) {
//                   setTimeout(function() {
//                       _this.loadContent(index, true, 0);
//                   }, this.s.speed + 50);
  
//                   setTimeout(function() {
//                       _this.lgBusy = false;
//                       _this.$el.trigger('onAfterSlide.lg', [_prevIndex, index, fromTouch, fromThumb]);
//                   }, this.s.speed);
  
//               } else {
//                   _this.loadContent(index, true, _this.s.backdropDuration);
  
//                   _this.lgBusy = false;
//                   _this.$el.trigger('onAfterSlide.lg', [_prevIndex, index, fromTouch, fromThumb]);
//               }
  
//               _this.lGalleryOn = true;
  
//               if (this.s.counter) {
//                   $('#lg-counter-current').text(index + 1);
//               }
  
//           }
  
//       };
  
//       /**
//        *  @desc Go to next slide
//        *  @param {Boolean} fromTouch - true if slide function called via touch event
//        */
//       Plugin.prototype.goToNextSlide = function(fromTouch) {
//           var _this = this;
//           if (!_this.lgBusy) {
//               if ((_this.index + 1) < _this.$slide.length) {
//                   _this.index++;
//                   _this.$el.trigger('onBeforeNextSlide.lg', [_this.index]);
//                   _this.slide(_this.index, fromTouch, false);
//               } else {
//                   if (_this.s.loop) {
//                       _this.index = 0;
//                       _this.$el.trigger('onBeforeNextSlide.lg', [_this.index]);
//                       _this.slide(_this.index, fromTouch, false);
//                   } else if (_this.s.slideEndAnimatoin) {
//                       _this.$outer.addClass('lg-right-end');
//                       setTimeout(function() {
//                           _this.$outer.removeClass('lg-right-end');
//                       }, 400);
//                   }
//               }
//           }
//       };
  
//       /**
//        *  @desc Go to previous slide
//        *  @param {Boolean} fromTouch - true if slide function called via touch event
//        */
//       Plugin.prototype.goToPrevSlide = function(fromTouch) {
//           var _this = this;
//           if (!_this.lgBusy) {
//               if (_this.index > 0) {
//                   _this.index--;
//                   _this.$el.trigger('onBeforePrevSlide.lg', [_this.index, fromTouch]);
//                   _this.slide(_this.index, fromTouch, false);
//               } else {
//                   if (_this.s.loop) {
//                       _this.index = _this.$items.length - 1;
//                       _this.$el.trigger('onBeforePrevSlide.lg', [_this.index, fromTouch]);
//                       _this.slide(_this.index, fromTouch, false);
//                   } else if (_this.s.slideEndAnimatoin) {
//                       _this.$outer.addClass('lg-left-end');
//                       setTimeout(function() {
//                           _this.$outer.removeClass('lg-left-end');
//                       }, 400);
//                   }
//               }
//           }
//       };
  
//       Plugin.prototype.keyPress = function() {
//           var _this = this;
//           if (this.$items.length > 1) {
//               $(window).on('keyup.lg', function(e) {
//                   if (_this.$items.length > 1) {
//                       if (e.keyCode === 37) {
//                           e.preventDefault();
//                           _this.goToPrevSlide();
//                       }
  
//                       if (e.keyCode === 39) {
//                           e.preventDefault();
//                           _this.goToNextSlide();
//                       }
//                   }
//               });
//           }
  
//           $(window).on('keydown.lg', function(e) {
//               if (_this.s.escKey === true && e.keyCode === 27) {
//                   e.preventDefault();
//                   if (!_this.$outer.hasClass('lg-thumb-open')) {
//                       _this.destroy();
//                   } else {
//                       _this.$outer.removeClass('lg-thumb-open');
//                   }
//               }
//           });
//       };
  
//       Plugin.prototype.arrow = function() {
//           var _this = this;
//           this.$outer.find('.lg-prev').on('click.lg', function() {
//               _this.goToPrevSlide();
//           });
  
//           this.$outer.find('.lg-next').on('click.lg', function() {
//               _this.goToNextSlide();
//           });
//       };
  
//       Plugin.prototype.arrowDisable = function(index) {
  
//           // Disable arrows if s.hideControlOnEnd is true
//           if (!this.s.loop && this.s.hideControlOnEnd) {
//               if ((index + 1) < this.$slide.length) {
//                   this.$outer.find('.lg-next').removeAttr('disabled').removeClass('disabled');
//               } else {
//                   this.$outer.find('.lg-next').attr('disabled', 'disabled').addClass('disabled');
//               }
  
//               if (index > 0) {
//                   this.$outer.find('.lg-prev').removeAttr('disabled').removeClass('disabled');
//               } else {
//                   this.$outer.find('.lg-prev').attr('disabled', 'disabled').addClass('disabled');
//               }
//           }
//       };
  
//       Plugin.prototype.setTranslate = function($el, xValue, yValue) {
//           // jQuery supports Automatic CSS prefixing since jQuery 1.8.0
//           if (this.s.useLeft) {
//               $el.css('left', xValue);
//           } else {
//               $el.css({
//                   transform: 'translate3d(' + (xValue) + 'px, ' + yValue + 'px, 0px)'
//               });
//           }
//       };
  
//       Plugin.prototype.touchMove = function(startCoords, endCoords) {
  
//           var distance = endCoords - startCoords;
  
//           if (Math.abs(distance) > 15) {
//               // reset opacity and transition duration
//               this.$outer.addClass('lg-dragging');
  
//               // move current slide
//               this.setTranslate(this.$slide.eq(this.index), distance, 0);
  
//               // move next and prev slide with current slide
//               this.setTranslate($('.lg-prev-slide'), -this.$slide.eq(this.index).width() + distance, 0);
//               this.setTranslate($('.lg-next-slide'), this.$slide.eq(this.index).width() + distance, 0);
//           }
//       };
  
//       Plugin.prototype.touchEnd = function(distance) {
//           var _this = this;
  
//           // keep slide animation for any mode while dragg/swipe
//           if (_this.s.mode !== 'lg-slide') {
//               _this.$outer.addClass('lg-slide');
//           }
  
//           this.$slide.not('.lg-current, .lg-prev-slide, .lg-next-slide').css('opacity', '0');
  
//           // set transition duration
//           setTimeout(function() {
//               _this.$outer.removeClass('lg-dragging');
//               if ((distance < 0) && (Math.abs(distance) > _this.s.swipeThreshold)) {
//                   _this.goToNextSlide(true);
//               } else if ((distance > 0) && (Math.abs(distance) > _this.s.swipeThreshold)) {
//                   _this.goToPrevSlide(true);
//               } else if (Math.abs(distance) < 5) {
  
//                   // Trigger click if distance is less than 5 pix
//                   _this.$el.trigger('onSlideClick.lg');
//               }
  
//               _this.$slide.removeAttr('style');
//           });
  
//           // remove slide class once drag/swipe is completed if mode is not slide
//           setTimeout(function() {
//               if (!_this.$outer.hasClass('lg-dragging') && _this.s.mode !== 'lg-slide') {
//                   _this.$outer.removeClass('lg-slide');
//               }
//           }, _this.s.speed + 100);
  
//       };
  
//       Plugin.prototype.enableSwipe = function() {
//           var _this = this;
//           var startCoords = 0;
//           var endCoords = 0;
//           var isMoved = false;
  
//           if (_this.s.enableSwipe && _this.isTouch && _this.doCss()) {
  
//               _this.$slide.on('touchstart.lg', function(e) {
//                   if (!_this.$outer.hasClass('lg-zoomed') && !_this.lgBusy) {
//                       e.preventDefault();
//                       _this.manageSwipeClass();
//                       startCoords = e.originalEvent.targetTouches[0].pageX;
//                   }
//               });
  
//               _this.$slide.on('touchmove.lg', function(e) {
//                   if (!_this.$outer.hasClass('lg-zoomed')) {
//                       e.preventDefault();
//                       endCoords = e.originalEvent.targetTouches[0].pageX;
//                       _this.touchMove(startCoords, endCoords);
//                       isMoved = true;
//                   }
//               });
  
//               _this.$slide.on('touchend.lg', function() {
//                   if (!_this.$outer.hasClass('lg-zoomed')) {
//                       if (isMoved) {
//                           isMoved = false;
//                           _this.touchEnd(endCoords - startCoords);
//                       } else {
//                           _this.$el.trigger('onSlideClick.lg');
//                       }
//                   }
//               });
//           }
  
//       };
  
//       Plugin.prototype.enableDrag = function() {
//           var _this = this;
//           var startCoords = 0;
//           var endCoords = 0;
//           var isDraging = false;
//           var isMoved = false;
//           if (_this.s.enableDrag && !_this.isTouch && _this.doCss()) {
//               _this.$slide.on('mousedown.lg', function(e) {
//                   // execute only on .lg-object
//                   if (!_this.$outer.hasClass('lg-zoomed')) {
//                       if ($(e.target).hasClass('lg-object') || $(e.target).hasClass('lg-video-play')) {
//                           e.preventDefault();
  
//                           if (!_this.lgBusy) {
//                               _this.manageSwipeClass();
//                               startCoords = e.pageX;
//                               isDraging = true;
  
//                               // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
//                               _this.$outer.scrollLeft += 1;
//                               _this.$outer.scrollLeft -= 1;
  
//                               // *
  
//                               _this.$outer.removeClass('lg-grab').addClass('lg-grabbing');
  
//                               _this.$el.trigger('onDragstart.lg');
//                           }
  
//                       }
//                   }
//               });
  
//               $(window).on('mousemove.lg', function(e) {
//                   if (isDraging) {
//                       isMoved = true;
//                       endCoords = e.pageX;
//                       _this.touchMove(startCoords, endCoords);
//                       _this.$el.trigger('onDragmove.lg');
//                   }
//               });
  
//               $(window).on('mouseup.lg', function(e) {
//                   if (isMoved) {
//                       isMoved = false;
//                       _this.touchEnd(endCoords - startCoords);
//                       _this.$el.trigger('onDragend.lg');
//                   } else if ($(e.target).hasClass('lg-object') || $(e.target).hasClass('lg-video-play')) {
//                       _this.$el.trigger('onSlideClick.lg');
//                   }
  
//                   // Prevent execution on click
//                   if (isDraging) {
//                       isDraging = false;
//                       _this.$outer.removeClass('lg-grabbing').addClass('lg-grab');
//                   }
//               });
  
//           }
//       };
  
//       Plugin.prototype.manageSwipeClass = function() {
//           var touchNext = this.index + 1;
//           var touchPrev = this.index - 1;
//           var length = this.$slide.length;
//           if (this.s.loop) {
//               if (this.index === 0) {
//                   touchPrev = length - 1;
//               } else if (this.index === length - 1) {
//                   touchNext = 0;
//               }
//           }
  
//           this.$slide.removeClass('lg-next-slide lg-prev-slide');
//           if (touchPrev > -1) {
//               this.$slide.eq(touchPrev).addClass('lg-prev-slide');
//           }
  
//           this.$slide.eq(touchNext).addClass('lg-next-slide');
//       };
  
//       Plugin.prototype.mousewheel = function() {
//           var _this = this;
//           _this.$outer.on('mousewheel.lg', function(e) {
  
//               if (!e.deltaY) {
//                   return;
//               }
  
//               if (e.deltaY > 0) {
//                   _this.goToPrevSlide();
//               } else {
//                   _this.goToNextSlide();
//               }
  
//               e.preventDefault();
//           });
  
//       };
  
//       Plugin.prototype.closeGallery = function() {
  
//           var _this = this;
//           var mousedown = false;
//           this.$outer.find('.lg-close').on('click.lg', function() {
//               _this.destroy();
//           });
  
//           if (_this.s.closable) {
  
//               // If you drag the slide and release outside gallery gets close on chrome
//               // for preventing this check mousedown and mouseup happened on .lg-item or lg-outer
//               _this.$outer.on('mousedown.lg', function(e) {
  
//                   if ($(e.target).is('.lg-outer') || $(e.target).is('.lg-item ') || $(e.target).is('.lg-img-wrap')) {
//                       mousedown = true;
//                   } else {
//                       mousedown = false;
//                   }
  
//               });
  
//               _this.$outer.on('mouseup.lg', function(e) {
  
//                   if ($(e.target).is('.lg-outer') || $(e.target).is('.lg-item ') || $(e.target).is('.lg-img-wrap') && mousedown) {
//                       if (!_this.$outer.hasClass('lg-dragging')) {
//                           _this.destroy();
//                       }
//                   }
  
//               });
  
//           }
  
//       };
  
//       Plugin.prototype.destroy = function(d) {
  
//           var _this = this;
  
//           if (!d) {
//               _this.$el.trigger('onBeforeClose.lg');
//           }
  
//           $(window).scrollTop(_this.prevScrollTop);
  
//           /**
//            * if d is false or undefined destroy will only close the gallery
//            * plugins instance remains with the element
//            *
//            * if d is true destroy will completely remove the plugin
//            */
  
//           if (d) {
//               if (!_this.s.dynamic) {
//                   // only when not using dynamic mode is $items a jquery collection
//                   this.$items.off('click.lg click.lgcustom');
//               }
  
//               $.removeData(_this.el, 'lightGallery');
//           }
  
//           // Unbind all events added by lightGallery
//           this.$el.off('.lg.tm');
  
//           // Distroy all lightGallery modules
//           $.each($.fn.lightGallery.modules, function(key) {
//               if (_this.modules[key]) {
//                   _this.modules[key].destroy();
//               }
//           });
  
//           this.lGalleryOn = false;
  
//           clearTimeout(_this.hideBartimeout);
//           this.hideBartimeout = false;
//           $(window).off('.lg');
//           $('body').removeClass('lg-on lg-from-hash');
  
//           if (_this.$outer) {
//               _this.$outer.removeClass('lg-visible');
//           }
  
//           $('.lg-backdrop').removeClass('in');
  
//           setTimeout(function() {
//               if (_this.$outer) {
//                   _this.$outer.remove();
//               }
  
//               $('.lg-backdrop').remove();
  
//               if (!d) {
//                   _this.$el.trigger('onCloseAfter.lg');
//               }
  
//           }, _this.s.backdropDuration + 50);
//       };
  
//       $.fn.lightGallery = function(options) {
//           return this.each(function() {
//               if (!$.data(this, 'lightGallery')) {
//                   $.data(this, 'lightGallery', new Plugin(this, options));
//               } else {
//                   try {
//                       $(this).data('lightGallery').init();
//                   } catch (err) {
//                       console.error('lightGallery has not initiated properly');
//                   }
//               }
//           });
//       };
  
//       $.fn.lightGallery.modules = {};
  
//   })();
  
  
//   }));


/*! lightgallery - v1.3.2 - 2016-09-23
* http://sachinchoolur.github.io/lightGallery/
* Copyright (c) 2016 Sachin N; Licensed Apache 2.0 */ 

!function(e,t){"function"==typeof define&&define.amd?define(["jquery"],function(e){return t(e)}):"object"==typeof exports?module.exports=t(require("jquery")):t(jQuery)}(this,function(e){!function(){"use strict";var e={mode:"lg-slide",cssEasing:"ease",easing:"linear",speed:600,height:"100%",width:"100%",addClass:"",startClass:"lg-start-zoom",backdropDuration:150,hideBarsDelay:6e3,useLeft:!1,closable:!0,loop:!0,escKey:!0,keyPress:!0,controls:!0,slideEndAnimatoin:!0,hideControlOnEnd:!1,mousewheel:!0,getCaptionFromTitleOrAlt:!0,appendSubHtmlTo:".lg-sub-html",subHtmlSelectorRelative:!1,preload:1,showAfterLoad:!0,selector:"",selectWithin:"",nextHtml:"",prevHtml:"",index:!1,iframeMaxWidth:"100%",download:!0,counter:!0,appendCounterTo:".lg-toolbar",swipeThreshold:50,enableSwipe:!0,enableDrag:!0,dynamic:!1,dynamicEl:[],galleryId:1};function t(t,s){if(this.el=t,this.$el=$(t),this.s=$.extend({},e,s),this.s.dynamic&&"undefined"!==this.s.dynamicEl&&this.s.dynamicEl.constructor===Array&&!this.s.dynamicEl.length)throw"When using dynamic mode, you must also define dynamicEl as an Array.";return this.modules={},this.lGalleryOn=!1,this.lgBusy=!1,this.hideBartimeout=!1,this.isTouch="ontouchstart"in document.documentElement,this.s.slideEndAnimatoin&&(this.s.hideControlOnEnd=!1),this.s.dynamic?this.$items=this.s.dynamicEl:"this"===this.s.selector?this.$items=this.$el:""!==this.s.selector?this.s.selectWithin?this.$items=$(this.s.selectWithin).find(this.s.selector):this.$items=this.$el.find($(this.s.selector)):this.$items=this.$el.children(),this.$slide="",this.$outer="",this.init(),this}t.prototype.init=function(){var e=this;e.s.preload>e.$items.length&&(e.s.preload=e.$items.length);var t=window.location.hash;t.indexOf("lg="+this.s.galleryId)>0&&(e.index=parseInt(t.split("&slide=")[1],10),$("body").addClass("lg-from-hash"),$("body").hasClass("lg-on")||(setTimeout(function(){e.build(e.index)}),$("body").addClass("lg-on"))),e.s.dynamic?(e.$el.trigger("onBeforeOpen.lg"),e.index=e.s.index||0,$("body").hasClass("lg-on")||setTimeout(function(){e.build(e.index),$("body").addClass("lg-on")})):e.$items.on("click.lgcustom",function(t){try{t.preventDefault(),t.preventDefault()}catch(s){t.returnValue=!1}e.$el.trigger("onBeforeOpen.lg"),e.index=e.s.index||e.$items.index(this),$("body").hasClass("lg-on")||(e.build(e.index),$("body").addClass("lg-on"))})},t.prototype.build=function(e){var t=this;t.structure(),$.each($.fn.lightGallery.modules,function(e){t.modules[e]=new $.fn.lightGallery.modules[e](t.el)}),t.slide(e,!1,!1),t.s.keyPress&&t.keyPress(),t.$items.length>1&&(t.arrow(),setTimeout(function(){t.enableDrag(),t.enableSwipe()},50),t.s.mousewheel&&t.mousewheel()),t.counter(),t.closeGallery(),t.$el.trigger("onAfterOpen.lg"),t.$outer.on("mousemove.lg click.lg touchstart.lg",function(){t.$outer.removeClass("lg-hide-items"),clearTimeout(t.hideBartimeout),t.hideBartimeout=setTimeout(function(){t.$outer.addClass("lg-hide-items")},t.s.hideBarsDelay)})},t.prototype.structure=function(){var e,t="",s="",i=0,l="",o=this;for($("body").append('<div class="lg-backdrop"></div>'),$(".lg-backdrop").css("transition-duration",this.s.backdropDuration+"ms"),i=0;i<this.$items.length;i++)t+='<div class="lg-item"></div>';if(this.s.controls&&this.$items.length>1&&(s='<div class="lg-actions"><div class="lg-prev lg-icon">'+this.s.prevHtml+'</div><div class="lg-next lg-icon">'+this.s.nextHtml+"</div></div>"),".lg-sub-html"===this.s.appendSubHtmlTo&&(l='<div class="lg-sub-html"></div>'),e='<div class="lg-outer '+this.s.addClass+" "+this.s.startClass+'"><div class="lg" style="width:'+this.s.width+"; height:"+this.s.height+'"><div class="lg-inner">'+t+'</div><div class="lg-toolbar group"><span class="lg-close lg-icon"></span></div>'+s+l+"</div></div>",$("body").append(e),this.$outer=$(".lg-outer"),this.$slide=this.$outer.find(".lg-item"),this.s.useLeft?(this.$outer.addClass("lg-use-left"),this.s.mode="lg-slide"):this.$outer.addClass("lg-use-css3"),o.setTop(),$(window).on("resize.lg orientationchange.lg",function(){setTimeout(function(){o.setTop()},100)}),this.$slide.eq(this.index).addClass("lg-current"),this.doCss()?this.$outer.addClass("lg-css3"):(this.$outer.addClass("lg-css"),this.s.speed=0),this.$outer.addClass(this.s.mode),this.s.enableDrag&&this.$items.length>1&&this.$outer.addClass("lg-grab"),this.s.showAfterLoad&&this.$outer.addClass("lg-show-after-load"),this.doCss()){var a=this.$outer.find(".lg-inner");a.css("transition-timing-function",this.s.cssEasing),a.css("transition-duration",this.s.speed+"ms")}$(".lg-backdrop").addClass("in"),setTimeout(function(){o.$outer.addClass("lg-visible")},this.s.backdropDuration),this.s.download&&this.$outer.find(".lg-toolbar").append('<a id="lg-download" target="_blank" download class="lg-download lg-icon"></a>'),this.prevScrollTop=$(window).scrollTop()},t.prototype.setTop=function(){if("100%"!==this.s.height){var e=$(window).height(),t=(e-parseInt(this.s.height,10))/2,s=this.$outer.find(".lg");e>=parseInt(this.s.height,10)?s.css("top",t+"px"):s.css("top","0px")}},t.prototype.doCss=function(){return!!function(){var e=["transition","MozTransition","WebkitTransition","OTransition","msTransition","KhtmlTransition"],t=document.documentElement,s=0;for(s=0;s<e.length;s++)if(e[s]in t.style)return!0}()},t.prototype.isVideo=function(e,t){if(s=this.s.dynamic?this.s.dynamicEl[t].html:this.$items.eq(t).attr("data-html"),!e&&s)return{html5:!0};var s,i=e.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i),l=e.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i),o=e.match(/\/\/(?:www\.)?dai.ly\/([0-9a-z\-_]+)/i),a=e.match(/\/\/(?:www\.)?(?:vk\.com|vkontakte\.ru)\/(?:video_ext\.php\?)(.*)/i);return i?{youtube:i}:l?{vimeo:l}:o?{dailymotion:o}:a?{vk:a}:void 0},t.prototype.counter=function(){this.s.counter&&$(this.s.appendCounterTo).append('<div id="lg-counter"><span id="lg-counter-current">'+(parseInt(this.index,10)+1)+'</span> / <span id="lg-counter-all">'+this.$items.length+"</span></div>")},t.prototype.addHtml=function(e){var t,s,i=null;if(this.s.dynamic?this.s.dynamicEl[e].subHtmlUrl?t=this.s.dynamicEl[e].subHtmlUrl:i=this.s.dynamicEl[e].subHtml:(s=this.$items.eq(e)).attr("data-sub-html-url")?t=s.attr("data-sub-html-url"):(i=s.attr("data-sub-html"),this.s.getCaptionFromTitleOrAlt&&!i&&(i=s.attr("title")||s.find("img").first().attr("alt"))),!t){if(null!=i){var l=i.substring(0,1);("."===l||"#"===l)&&(i=this.s.subHtmlSelectorRelative&&!this.s.dynamic?s.find(i).html():$(i).html())}else i=""}".lg-sub-html"===this.s.appendSubHtmlTo?t?this.$outer.find(this.s.appendSubHtmlTo).load(t):this.$outer.find(this.s.appendSubHtmlTo).html(i):t?this.$slide.eq(e).load(t):this.$slide.eq(e).append(i),null!=i&&(""===i?this.$outer.find(this.s.appendSubHtmlTo).addClass("lg-empty-html"):this.$outer.find(this.s.appendSubHtmlTo).removeClass("lg-empty-html")),this.$el.trigger("onAfterAppendSubHtml.lg",[e])},t.prototype.preload=function(e){var t=1,s=1;for(t=1;t<=this.s.preload&&!(t>=this.$items.length-e);t++)this.loadContent(e+t,!1,0);for(s=1;s<=this.s.preload&&!(e-s<0);s++)this.loadContent(e-s,!1,0)},t.prototype.loadContent=function(e,t,s){var i,l,o,a,n,d,r=this,g=!1,h=function(e){for(var t=[],s=[],i=0;i<e.length;i++){var o=e[i].split(" ");""===o[0]&&o.splice(0,1),s.push(o[0]),t.push(o[1])}for(var a=$(window).width(),n=0;n<t.length;n++)if(parseInt(t[n],10)>a){l=s[n];break}};if(r.s.dynamic)r.s.dynamicEl[e].poster&&(g=!0,o=r.s.dynamicEl[e].poster),d=r.s.dynamicEl[e].html,l=r.s.dynamicEl[e].src,r.s.dynamicEl[e].responsive&&h(r.s.dynamicEl[e].responsive.split(",")),a=r.s.dynamicEl[e].srcset,n=r.s.dynamicEl[e].sizes;else{if(r.$items.eq(e).attr("data-poster")&&(g=!0,o=r.$items.eq(e).attr("data-poster")),d=r.$items.eq(e).attr("data-html"),l=r.$items.eq(e).attr("href")||r.$items.eq(e).attr("data-src"),r.$items.eq(e).attr("data-responsive")){var u=r.$items.eq(e).attr("data-responsive").split(",");h(u)}a=r.$items.eq(e).attr("data-srcset"),n=r.$items.eq(e).attr("data-sizes")}var c=!1;r.s.dynamic?r.s.dynamicEl[e].iframe&&(c=!0):"true"===r.$items.eq(e).attr("data-iframe")&&(c=!0);var m=r.isVideo(l,e);if(!r.$slide.eq(e).hasClass("lg-loaded")){if(c)r.$slide.eq(e).prepend('<div class="lg-video-cont" style="max-width:'+r.s.iframeMaxWidth+'"><div class="lg-video"><iframe class="lg-object" frameborder="0" src="'+l+'"  allowfullscreen="true"></iframe></div></div>');else if(g){var p="";p=m&&m.youtube?"lg-has-youtube":m&&m.vimeo?"lg-has-vimeo":"lg-has-html5",r.$slide.eq(e).prepend('<div class="lg-video-cont '+p+' "><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="'+o+'" /></div></div>')}else m?(r.$slide.eq(e).prepend('<div class="lg-video-cont "><div class="lg-video"></div></div>'),r.$el.trigger("hasVideo.lg",[e,l,d])):r.$slide.eq(e).prepend('<div class="lg-img-wrap"><img class="lg-object lg-image" src="'+l+'" /></div>');if(r.$el.trigger("onAferAppendSlide.lg",[e]),i=r.$slide.eq(e).find(".lg-object"),n&&i.attr("sizes",n),a){i.attr("srcset",a);try{picturefill({elements:[i[0]]})}catch(f){console.error("Make sure you have included Picturefill version 2")}}".lg-sub-html"!==this.s.appendSubHtmlTo&&r.addHtml(e),r.$slide.eq(e).addClass("lg-loaded")}r.$slide.eq(e).find(".lg-object").on("load.lg error.lg",function(){var t=0;s&&!$("body").hasClass("lg-from-hash")&&(t=s),setTimeout(function(){r.$slide.eq(e).addClass("lg-complete"),r.$el.trigger("onSlideItemLoad.lg",[e,s||0])},t)}),m&&m.html5&&!g&&r.$slide.eq(e).addClass("lg-complete"),!0===t&&(r.$slide.eq(e).hasClass("lg-complete")?r.preload(e):r.$slide.eq(e).find(".lg-object").on("load.lg error.lg",function(){r.preload(e)}))},t.prototype.slide=function(e,t,s){var i,l=this.$outer.find(".lg-current").index(),o=this;if(!o.lGalleryOn||l!==e){var a=this.$slide.length,n=o.lGalleryOn?this.s.speed:0,d=!1,r=!1;if(!o.lgBusy){if(this.s.download&&((i=o.s.dynamic?!1!==o.s.dynamicEl[e].downloadUrl&&(o.s.dynamicEl[e].downloadUrl||o.s.dynamicEl[e].src):"false"!==o.$items.eq(e).attr("data-download-url")&&(o.$items.eq(e).attr("data-download-url")||o.$items.eq(e).attr("href")||o.$items.eq(e).attr("data-src")))?($("#lg-download").attr("href",i),o.$outer.removeClass("lg-hide-download")):o.$outer.addClass("lg-hide-download")),this.$el.trigger("onBeforeSlide.lg",[l,e,t,s]),o.lgBusy=!0,clearTimeout(o.hideBartimeout),".lg-sub-html"===this.s.appendSubHtmlTo&&setTimeout(function(){o.addHtml(e)},n),this.arrowDisable(e),t){var g=e-1,h=e+1;0===e&&l===a-1?(h=0,g=a-1):e===a-1&&0===l&&(h=0,g=a-1),this.$slide.removeClass("lg-prev-slide lg-current lg-next-slide"),o.$slide.eq(g).addClass("lg-prev-slide"),o.$slide.eq(h).addClass("lg-next-slide"),o.$slide.eq(e).addClass("lg-current")}else o.$outer.addClass("lg-no-trans"),this.$slide.removeClass("lg-prev-slide lg-next-slide"),e<l?(r=!0,0!==e||l!==a-1||s||(r=!1,d=!0)):e>l&&(d=!0,e!==a-1||0!==l||s||(r=!0,d=!1)),r?(this.$slide.eq(e).addClass("lg-prev-slide"),this.$slide.eq(l).addClass("lg-next-slide")):d&&(this.$slide.eq(e).addClass("lg-next-slide"),this.$slide.eq(l).addClass("lg-prev-slide")),setTimeout(function(){o.$slide.removeClass("lg-current"),o.$slide.eq(e).addClass("lg-current"),o.$outer.removeClass("lg-no-trans")},50);o.lGalleryOn?(setTimeout(function(){o.loadContent(e,!0,0)},this.s.speed+50),setTimeout(function(){o.lgBusy=!1,o.$el.trigger("onAfterSlide.lg",[l,e,t,s])},this.s.speed)):(o.loadContent(e,!0,o.s.backdropDuration),o.lgBusy=!1,o.$el.trigger("onAfterSlide.lg",[l,e,t,s])),o.lGalleryOn=!0,this.s.counter&&$("#lg-counter-current").text(e+1)}}},t.prototype.goToNextSlide=function(e){var t=this;!t.lgBusy&&(t.index+1<t.$slide.length?(t.index++,t.$el.trigger("onBeforeNextSlide.lg",[t.index]),t.slide(t.index,e,!1)):t.s.loop?(t.index=0,t.$el.trigger("onBeforeNextSlide.lg",[t.index]),t.slide(t.index,e,!1)):t.s.slideEndAnimatoin&&(t.$outer.addClass("lg-right-end"),setTimeout(function(){t.$outer.removeClass("lg-right-end")},400)))},t.prototype.goToPrevSlide=function(e){var t=this;!t.lgBusy&&(t.index>0?(t.index--,t.$el.trigger("onBeforePrevSlide.lg",[t.index,e]),t.slide(t.index,e,!1)):t.s.loop?(t.index=t.$items.length-1,t.$el.trigger("onBeforePrevSlide.lg",[t.index,e]),t.slide(t.index,e,!1)):t.s.slideEndAnimatoin&&(t.$outer.addClass("lg-left-end"),setTimeout(function(){t.$outer.removeClass("lg-left-end")},400)))},t.prototype.keyPress=function(){var e=this;this.$items.length>1&&$(window).on("keyup.lg",function(t){e.$items.length>1&&(37===t.keyCode&&(t.preventDefault(),e.goToPrevSlide()),39===t.keyCode&&(t.preventDefault(),e.goToNextSlide()))}),$(window).on("keydown.lg",function(t){!0===e.s.escKey&&27===t.keyCode&&(t.preventDefault(),e.$outer.hasClass("lg-thumb-open")?e.$outer.removeClass("lg-thumb-open"):e.destroy())})},t.prototype.arrow=function(){var e=this;this.$outer.find(".lg-prev").on("click.lg",function(){e.goToPrevSlide()}),this.$outer.find(".lg-next").on("click.lg",function(){e.goToNextSlide()})},t.prototype.arrowDisable=function(e){!this.s.loop&&this.s.hideControlOnEnd&&(e+1<this.$slide.length?this.$outer.find(".lg-next").removeAttr("disabled").removeClass("disabled"):this.$outer.find(".lg-next").attr("disabled","disabled").addClass("disabled"),e>0?this.$outer.find(".lg-prev").removeAttr("disabled").removeClass("disabled"):this.$outer.find(".lg-prev").attr("disabled","disabled").addClass("disabled"))},t.prototype.setTranslate=function(e,t,s){this.s.useLeft?e.css("left",t):e.css({transform:"translate3d("+t+"px, "+s+"px, 0px)"})},t.prototype.touchMove=function(e,t){var s=t-e;Math.abs(s)>15&&(this.$outer.addClass("lg-dragging"),this.setTranslate(this.$slide.eq(this.index),s,0),this.setTranslate($(".lg-prev-slide"),-this.$slide.eq(this.index).width()+s,0),this.setTranslate($(".lg-next-slide"),this.$slide.eq(this.index).width()+s,0))},t.prototype.touchEnd=function(e){var t=this;"lg-slide"!==t.s.mode&&t.$outer.addClass("lg-slide"),this.$slide.not(".lg-current, .lg-prev-slide, .lg-next-slide").css("opacity","0"),setTimeout(function(){t.$outer.removeClass("lg-dragging"),e<0&&Math.abs(e)>t.s.swipeThreshold?t.goToNextSlide(!0):e>0&&Math.abs(e)>t.s.swipeThreshold?t.goToPrevSlide(!0):5>Math.abs(e)&&t.$el.trigger("onSlideClick.lg"),t.$slide.removeAttr("style")}),setTimeout(function(){t.$outer.hasClass("lg-dragging")||"lg-slide"===t.s.mode||t.$outer.removeClass("lg-slide")},t.s.speed+100)},t.prototype.enableSwipe=function(){var e=this,t=0,s=0,i=!1;e.s.enableSwipe&&e.isTouch&&e.doCss()&&(e.$slide.on("touchstart.lg",function(s){e.$outer.hasClass("lg-zoomed")||e.lgBusy||(s.preventDefault(),e.manageSwipeClass(),t=s.originalEvent.targetTouches[0].pageX)}),e.$slide.on("touchmove.lg",function(l){e.$outer.hasClass("lg-zoomed")||(l.preventDefault(),s=l.originalEvent.targetTouches[0].pageX,e.touchMove(t,s),i=!0)}),e.$slide.on("touchend.lg",function(){e.$outer.hasClass("lg-zoomed")||(i?(i=!1,e.touchEnd(s-t)):e.$el.trigger("onSlideClick.lg"))}))},t.prototype.enableDrag=function(){var e=this,t=0,s=0,i=!1,l=!1;e.s.enableDrag&&!e.isTouch&&e.doCss()&&(e.$slide.on("mousedown.lg",function(s){!e.$outer.hasClass("lg-zoomed")&&($(s.target).hasClass("lg-object")||$(s.target).hasClass("lg-video-play"))&&(s.preventDefault(),e.lgBusy||(e.manageSwipeClass(),t=s.pageX,i=!0,e.$outer.scrollLeft+=1,e.$outer.scrollLeft-=1,e.$outer.removeClass("lg-grab").addClass("lg-grabbing"),e.$el.trigger("onDragstart.lg")))}),$(window).on("mousemove.lg",function(o){i&&(l=!0,s=o.pageX,e.touchMove(t,s),e.$el.trigger("onDragmove.lg"))}),$(window).on("mouseup.lg",function(o){l?(l=!1,e.touchEnd(s-t),e.$el.trigger("onDragend.lg")):($(o.target).hasClass("lg-object")||$(o.target).hasClass("lg-video-play"))&&e.$el.trigger("onSlideClick.lg"),i&&(i=!1,e.$outer.removeClass("lg-grabbing").addClass("lg-grab"))}))},t.prototype.manageSwipeClass=function(){var e=this.index+1,t=this.index-1,s=this.$slide.length;this.s.loop&&(0===this.index?t=s-1:this.index===s-1&&(e=0)),this.$slide.removeClass("lg-next-slide lg-prev-slide"),t>-1&&this.$slide.eq(t).addClass("lg-prev-slide"),this.$slide.eq(e).addClass("lg-next-slide")},t.prototype.mousewheel=function(){var e=this;e.$outer.on("mousewheel.lg",function(t){t.deltaY&&(t.deltaY>0?e.goToPrevSlide():e.goToNextSlide(),t.preventDefault())})},t.prototype.closeGallery=function(){var e=this,t=!1;this.$outer.find(".lg-close").on("click.lg",function(){e.destroy()}),e.s.closable&&(e.$outer.on("mousedown.lg",function(e){t=!!($(e.target).is(".lg-outer")||$(e.target).is(".lg-item ")||$(e.target).is(".lg-img-wrap"))}),e.$outer.on("mouseup.lg",function(s){($(s.target).is(".lg-outer")||$(s.target).is(".lg-item ")||$(s.target).is(".lg-img-wrap")&&t)&&!e.$outer.hasClass("lg-dragging")&&e.destroy()}))},t.prototype.destroy=function(e){var t=this;e||t.$el.trigger("onBeforeClose.lg"),$(window).scrollTop(t.prevScrollTop),e&&(t.s.dynamic||this.$items.off("click.lg click.lgcustom"),$.removeData(t.el,"lightGallery")),this.$el.off(".lg.tm"),$.each($.fn.lightGallery.modules,function(e){t.modules[e]&&t.modules[e].destroy()}),this.lGalleryOn=!1,clearTimeout(t.hideBartimeout),this.hideBartimeout=!1,$(window).off(".lg"),$("body").removeClass("lg-on lg-from-hash"),t.$outer&&t.$outer.removeClass("lg-visible"),$(".lg-backdrop").removeClass("in"),setTimeout(function(){t.$outer&&t.$outer.remove(),$(".lg-backdrop").remove(),e||t.$el.trigger("onCloseAfter.lg")},t.s.backdropDuration+50)},$.fn.lightGallery=function(e){return this.each(function(){if($.data(this,"lightGallery"))try{$(this).data("lightGallery").init()}catch(s){console.error("lightGallery has not initiated properly")}else $.data(this,"lightGallery",new t(this,e))})},$.fn.lightGallery.modules={}}()});

!function(i){"use strict";"function"==typeof define&&define.amd?define(["jquery"],i):"undefined"!=typeof exports?module.exports=i(require("jquery")):i(jQuery)}(function(i){"use strict";var e=window.Slick||{};(e=function(){var e=0;return function(t,o){var s,n=this;n.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:i(t),appendDots:i(t),arrows:!0,asNavFor:null,prevArrow:'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',nextArrow:'<button class="slick-next" aria-label="Next" type="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(e,t){return i('<button type="button" />').text(t+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,focusOnChange:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},n.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,scrolling:!1,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,swiping:!1,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},i.extend(n,n.initials),n.activeBreakpoint=null,n.animType=null,n.animProp=null,n.breakpoints=[],n.breakpointSettings=[],n.cssTransitions=!1,n.focussed=!1,n.interrupted=!1,n.hidden="hidden",n.paused=!0,n.positionProp=null,n.respondTo=null,n.rowCount=1,n.shouldClick=!0,n.$slider=i(t),n.$slidesCache=null,n.transformType=null,n.transitionType=null,n.visibilityChange="visibilitychange",n.windowWidth=0,n.windowTimer=null,s=i(t).data("slick")||{},n.options=i.extend({},n.defaults,o,s),n.currentSlide=n.options.initialSlide,n.originalSettings=n.options,void 0!==document.mozHidden?(n.hidden="mozHidden",n.visibilityChange="mozvisibilitychange"):void 0!==document.webkitHidden&&(n.hidden="webkitHidden",n.visibilityChange="webkitvisibilitychange"),n.autoPlay=i.proxy(n.autoPlay,n),n.autoPlayClear=i.proxy(n.autoPlayClear,n),n.autoPlayIterator=i.proxy(n.autoPlayIterator,n),n.changeSlide=i.proxy(n.changeSlide,n),n.clickHandler=i.proxy(n.clickHandler,n),n.selectHandler=i.proxy(n.selectHandler,n),n.setPosition=i.proxy(n.setPosition,n),n.swipeHandler=i.proxy(n.swipeHandler,n),n.dragHandler=i.proxy(n.dragHandler,n),n.keyHandler=i.proxy(n.keyHandler,n),n.instanceUid=e++,n.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,n.registerBreakpoints(),n.init(!0)}}()).prototype.activateADA=function(){this.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},e.prototype.addSlide=e.prototype.slickAdd=function(e,t,o){var s=this;if("boolean"==typeof t)o=t,t=null;else if(t<0||t>=s.slideCount)return!1;s.unload(),"number"==typeof t?0===t&&0===s.$slides.length?i(e).appendTo(s.$slideTrack):o?i(e).insertBefore(s.$slides.eq(t)):i(e).insertAfter(s.$slides.eq(t)):!0===o?i(e).prependTo(s.$slideTrack):i(e).appendTo(s.$slideTrack),s.$slides=s.$slideTrack.children(this.options.slide),s.$slideTrack.children(this.options.slide).detach(),s.$slideTrack.append(s.$slides),s.$slides.each(function(e,t){i(t).attr("data-slick-index",e)}),s.$slidesCache=s.$slides,s.reinit()},e.prototype.animateHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.animate({height:e},i.options.speed)}},e.prototype.animateSlide=function(e,t){var o={},s=this;s.animateHeight(),!0===s.options.rtl&&!1===s.options.vertical&&(e=-e),!1===s.transformsEnabled?!1===s.options.vertical?s.$slideTrack.animate({left:e},s.options.speed,s.options.easing,t):s.$slideTrack.animate({top:e},s.options.speed,s.options.easing,t):!1===s.cssTransitions?(!0===s.options.rtl&&(s.currentLeft=-s.currentLeft),i({animStart:s.currentLeft}).animate({animStart:e},{duration:s.options.speed,easing:s.options.easing,step:function(i){i=Math.ceil(i),!1===s.options.vertical?(o[s.animType]="translate("+i+"px, 0px)",s.$slideTrack.css(o)):(o[s.animType]="translate(0px,"+i+"px)",s.$slideTrack.css(o))},complete:function(){t&&t.call()}})):(s.applyTransition(),e=Math.ceil(e),!1===s.options.vertical?o[s.animType]="translate3d("+e+"px, 0px, 0px)":o[s.animType]="translate3d(0px,"+e+"px, 0px)",s.$slideTrack.css(o),t&&setTimeout(function(){s.disableTransition(),t.call()},s.options.speed))},e.prototype.getNavTarget=function(){var e=this,t=e.options.asNavFor;return t&&null!==t&&(t=i(t).not(e.$slider)),t},e.prototype.asNavFor=function(e){var t=this.getNavTarget();null!==t&&"object"==typeof t&&t.each(function(){var t=i(this).slick("getSlick");t.unslicked||t.slideHandler(e,!0)})},e.prototype.applyTransition=function(i){var e=this,t={};!1===e.options.fade?t[e.transitionType]=e.transformType+" "+e.options.speed+"ms "+e.options.cssEase:t[e.transitionType]="opacity "+e.options.speed+"ms "+e.options.cssEase,!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.autoPlay=function(){var i=this;i.autoPlayClear(),i.slideCount>i.options.slidesToShow&&(i.autoPlayTimer=setInterval(i.autoPlayIterator,i.options.autoplaySpeed))},e.prototype.autoPlayClear=function(){var i=this;i.autoPlayTimer&&clearInterval(i.autoPlayTimer)},e.prototype.autoPlayIterator=function(){var i=this,e=i.currentSlide+i.options.slidesToScroll;i.paused||i.interrupted||i.focussed||(!1===i.options.infinite&&(1===i.direction&&i.currentSlide+1===i.slideCount-1?i.direction=0:0===i.direction&&(e=i.currentSlide-i.options.slidesToScroll,i.currentSlide-1==0&&(i.direction=1))),i.slideHandler(e))},e.prototype.buildArrows=function(){var e=this;!0===e.options.arrows&&(e.$prevArrow=i(e.options.prevArrow).addClass("slick-arrow"),e.$nextArrow=i(e.options.nextArrow).addClass("slick-arrow"),e.slideCount>e.options.slidesToShow?(e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.prependTo(e.options.appendArrows),e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.appendTo(e.options.appendArrows),!0!==e.options.infinite&&e.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},e.prototype.buildDots=function(){var e,t,o=this;if(!0===o.options.dots){for(o.$slider.addClass("slick-dotted"),t=i("<ul />").addClass(o.options.dotsClass),e=0;e<=o.getDotCount();e+=1)t.append(i("<li />").append(o.options.customPaging.call(this,o,e)));o.$dots=t.appendTo(o.options.appendDots),o.$dots.find("li").first().addClass("slick-active")}},e.prototype.buildOut=function(){var e=this;e.$slides=e.$slider.children(e.options.slide+":not(.slick-cloned)").addClass("slick-slide"),e.slideCount=e.$slides.length,e.$slides.each(function(e,t){i(t).attr("data-slick-index",e).data("originalStyling",i(t).attr("style")||"")}),e.$slider.addClass("slick-slider"),e.$slideTrack=0===e.slideCount?i('<div class="slick-track"/>').appendTo(e.$slider):e.$slides.wrapAll('<div class="slick-track"/>').parent(),e.$list=e.$slideTrack.wrap('<div class="slick-list"/>').parent(),e.$slideTrack.css("opacity",0),!0!==e.options.centerMode&&!0!==e.options.swipeToSlide||(e.options.slidesToScroll=1),i("img[data-lazy]",e.$slider).not("[src]").addClass("slick-loading"),e.setupInfinite(),e.buildArrows(),e.buildDots(),e.updateDots(),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),!0===e.options.draggable&&e.$list.addClass("draggable")},e.prototype.buildRows=function(){var i,e,t,o,s,n,r,l=this;if(o=document.createDocumentFragment(),n=l.$slider.children(),l.options.rows>1){for(r=l.options.slidesPerRow*l.options.rows,s=Math.ceil(n.length/r),i=0;i<s;i++){var d=document.createElement("div");for(e=0;e<l.options.rows;e++){var a=document.createElement("div");for(t=0;t<l.options.slidesPerRow;t++){var c=i*r+(e*l.options.slidesPerRow+t);n.get(c)&&a.appendChild(n.get(c))}d.appendChild(a)}o.appendChild(d)}l.$slider.empty().append(o),l.$slider.children().children().children().css({width:100/l.options.slidesPerRow+"%",display:"inline-block"})}},e.prototype.checkResponsive=function(e,t){var o,s,n,r=this,l=!1,d=r.$slider.width(),a=window.innerWidth||i(window).width();if("window"===r.respondTo?n=a:"slider"===r.respondTo?n=d:"min"===r.respondTo&&(n=Math.min(a,d)),r.options.responsive&&r.options.responsive.length&&null!==r.options.responsive){s=null;for(o in r.breakpoints)r.breakpoints.hasOwnProperty(o)&&(!1===r.originalSettings.mobileFirst?n<r.breakpoints[o]&&(s=r.breakpoints[o]):n>r.breakpoints[o]&&(s=r.breakpoints[o]));null!==s?null!==r.activeBreakpoint?(s!==r.activeBreakpoint||t)&&(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):null!==r.activeBreakpoint&&(r.activeBreakpoint=null,r.options=r.originalSettings,!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e),l=s),e||!1===l||r.$slider.trigger("breakpoint",[r,l])}},e.prototype.changeSlide=function(e,t){var o,s,n,r=this,l=i(e.currentTarget);switch(l.is("a")&&e.preventDefault(),l.is("li")||(l=l.closest("li")),n=r.slideCount%r.options.slidesToScroll!=0,o=n?0:(r.slideCount-r.currentSlide)%r.options.slidesToScroll,e.data.message){case"previous":s=0===o?r.options.slidesToScroll:r.options.slidesToShow-o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide-s,!1,t);break;case"next":s=0===o?r.options.slidesToScroll:o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide+s,!1,t);break;case"index":var d=0===e.data.index?0:e.data.index||l.index()*r.options.slidesToScroll;r.slideHandler(r.checkNavigable(d),!1,t),l.children().trigger("focus");break;default:return}},e.prototype.checkNavigable=function(i){var e,t;if(e=this.getNavigableIndexes(),t=0,i>e[e.length-1])i=e[e.length-1];else for(var o in e){if(i<e[o]){i=t;break}t=e[o]}return i},e.prototype.cleanUpEvents=function(){var e=this;e.options.dots&&null!==e.$dots&&(i("li",e.$dots).off("click.slick",e.changeSlide).off("mouseenter.slick",i.proxy(e.interrupt,e,!0)).off("mouseleave.slick",i.proxy(e.interrupt,e,!1)),!0===e.options.accessibility&&e.$dots.off("keydown.slick",e.keyHandler)),e.$slider.off("focus.slick blur.slick"),!0===e.options.arrows&&e.slideCount>e.options.slidesToShow&&(e.$prevArrow&&e.$prevArrow.off("click.slick",e.changeSlide),e.$nextArrow&&e.$nextArrow.off("click.slick",e.changeSlide),!0===e.options.accessibility&&(e.$prevArrow&&e.$prevArrow.off("keydown.slick",e.keyHandler),e.$nextArrow&&e.$nextArrow.off("keydown.slick",e.keyHandler))),e.$list.off("touchstart.slick mousedown.slick",e.swipeHandler),e.$list.off("touchmove.slick mousemove.slick",e.swipeHandler),e.$list.off("touchend.slick mouseup.slick",e.swipeHandler),e.$list.off("touchcancel.slick mouseleave.slick",e.swipeHandler),e.$list.off("click.slick",e.clickHandler),i(document).off(e.visibilityChange,e.visibility),e.cleanUpSlideEvents(),!0===e.options.accessibility&&e.$list.off("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().off("click.slick",e.selectHandler),i(window).off("orientationchange.slick.slick-"+e.instanceUid,e.orientationChange),i(window).off("resize.slick.slick-"+e.instanceUid,e.resize),i("[draggable!=true]",e.$slideTrack).off("dragstart",e.preventDefault),i(window).off("load.slick.slick-"+e.instanceUid,e.setPosition)},e.prototype.cleanUpSlideEvents=function(){var e=this;e.$list.off("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.off("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.cleanUpRows=function(){var i,e=this;e.options.rows>1&&((i=e.$slides.children().children()).removeAttr("style"),e.$slider.empty().append(i))},e.prototype.clickHandler=function(i){!1===this.shouldClick&&(i.stopImmediatePropagation(),i.stopPropagation(),i.preventDefault())},e.prototype.destroy=function(e){var t=this;t.autoPlayClear(),t.touchObject={},t.cleanUpEvents(),i(".slick-cloned",t.$slider).detach(),t.$dots&&t.$dots.remove(),t.$prevArrow&&t.$prevArrow.length&&(t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.prevArrow)&&t.$prevArrow.remove()),t.$nextArrow&&t.$nextArrow.length&&(t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.nextArrow)&&t.$nextArrow.remove()),t.$slides&&(t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){i(this).attr("style",i(this).data("originalStyling"))}),t.$slideTrack.children(this.options.slide).detach(),t.$slideTrack.detach(),t.$list.detach(),t.$slider.append(t.$slides)),t.cleanUpRows(),t.$slider.removeClass("slick-slider"),t.$slider.removeClass("slick-initialized"),t.$slider.removeClass("slick-dotted"),t.unslicked=!0,e||t.$slider.trigger("destroy",[t])},e.prototype.disableTransition=function(i){var e=this,t={};t[e.transitionType]="",!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.fadeSlide=function(i,e){var t=this;!1===t.cssTransitions?(t.$slides.eq(i).css({zIndex:t.options.zIndex}),t.$slides.eq(i).animate({opacity:1},t.options.speed,t.options.easing,e)):(t.applyTransition(i),t.$slides.eq(i).css({opacity:1,zIndex:t.options.zIndex}),e&&setTimeout(function(){t.disableTransition(i),e.call()},t.options.speed))},e.prototype.fadeSlideOut=function(i){var e=this;!1===e.cssTransitions?e.$slides.eq(i).animate({opacity:0,zIndex:e.options.zIndex-2},e.options.speed,e.options.easing):(e.applyTransition(i),e.$slides.eq(i).css({opacity:0,zIndex:e.options.zIndex-2}))},e.prototype.filterSlides=e.prototype.slickFilter=function(i){var e=this;null!==i&&(e.$slidesCache=e.$slides,e.unload(),e.$slideTrack.children(this.options.slide).detach(),e.$slidesCache.filter(i).appendTo(e.$slideTrack),e.reinit())},e.prototype.focusHandler=function(){var e=this;e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick","*",function(t){t.stopImmediatePropagation();var o=i(this);setTimeout(function(){e.options.pauseOnFocus&&(e.focussed=o.is(":focus"),e.autoPlay())},0)})},e.prototype.getCurrent=e.prototype.slickCurrentSlide=function(){return this.currentSlide},e.prototype.getDotCount=function(){var i=this,e=0,t=0,o=0;if(!0===i.options.infinite)if(i.slideCount<=i.options.slidesToShow)++o;else for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else if(!0===i.options.centerMode)o=i.slideCount;else if(i.options.asNavFor)for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else o=1+Math.ceil((i.slideCount-i.options.slidesToShow)/i.options.slidesToScroll);return o-1},e.prototype.getLeft=function(i){var e,t,o,s,n=this,r=0;return n.slideOffset=0,t=n.$slides.first().outerHeight(!0),!0===n.options.infinite?(n.slideCount>n.options.slidesToShow&&(n.slideOffset=n.slideWidth*n.options.slidesToShow*-1,s=-1,!0===n.options.vertical&&!0===n.options.centerMode&&(2===n.options.slidesToShow?s=-1.5:1===n.options.slidesToShow&&(s=-2)),r=t*n.options.slidesToShow*s),n.slideCount%n.options.slidesToScroll!=0&&i+n.options.slidesToScroll>n.slideCount&&n.slideCount>n.options.slidesToShow&&(i>n.slideCount?(n.slideOffset=(n.options.slidesToShow-(i-n.slideCount))*n.slideWidth*-1,r=(n.options.slidesToShow-(i-n.slideCount))*t*-1):(n.slideOffset=n.slideCount%n.options.slidesToScroll*n.slideWidth*-1,r=n.slideCount%n.options.slidesToScroll*t*-1))):i+n.options.slidesToShow>n.slideCount&&(n.slideOffset=(i+n.options.slidesToShow-n.slideCount)*n.slideWidth,r=(i+n.options.slidesToShow-n.slideCount)*t),n.slideCount<=n.options.slidesToShow&&(n.slideOffset=0,r=0),!0===n.options.centerMode&&n.slideCount<=n.options.slidesToShow?n.slideOffset=n.slideWidth*Math.floor(n.options.slidesToShow)/2-n.slideWidth*n.slideCount/2:!0===n.options.centerMode&&!0===n.options.infinite?n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)-n.slideWidth:!0===n.options.centerMode&&(n.slideOffset=0,n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)),e=!1===n.options.vertical?i*n.slideWidth*-1+n.slideOffset:i*t*-1+r,!0===n.options.variableWidth&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,!0===n.options.centerMode&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow+1),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,e+=(n.$list.width()-o.outerWidth())/2)),e},e.prototype.getOption=e.prototype.slickGetOption=function(i){return this.options[i]},e.prototype.getNavigableIndexes=function(){var i,e=this,t=0,o=0,s=[];for(!1===e.options.infinite?i=e.slideCount:(t=-1*e.options.slidesToScroll,o=-1*e.options.slidesToScroll,i=2*e.slideCount);t<i;)s.push(t),t=o+e.options.slidesToScroll,o+=e.options.slidesToScroll<=e.options.slidesToShow?e.options.slidesToScroll:e.options.slidesToShow;return s},e.prototype.getSlick=function(){return this},e.prototype.getSlideCount=function(){var e,t,o=this;return t=!0===o.options.centerMode?o.slideWidth*Math.floor(o.options.slidesToShow/2):0,!0===o.options.swipeToSlide?(o.$slideTrack.find(".slick-slide").each(function(s,n){if(n.offsetLeft-t+i(n).outerWidth()/2>-1*o.swipeLeft)return e=n,!1}),Math.abs(i(e).attr("data-slick-index")-o.currentSlide)||1):o.options.slidesToScroll},e.prototype.goTo=e.prototype.slickGoTo=function(i,e){this.changeSlide({data:{message:"index",index:parseInt(i)}},e)},e.prototype.init=function(e){var t=this;i(t.$slider).hasClass("slick-initialized")||(i(t.$slider).addClass("slick-initialized"),t.buildRows(),t.buildOut(),t.setProps(),t.startLoad(),t.loadSlider(),t.initializeEvents(),t.updateArrows(),t.updateDots(),t.checkResponsive(!0),t.focusHandler()),e&&t.$slider.trigger("init",[t]),!0===t.options.accessibility&&t.initADA(),t.options.autoplay&&(t.paused=!1,t.autoPlay())},e.prototype.initADA=function(){var e=this,t=Math.ceil(e.slideCount/e.options.slidesToShow),o=e.getNavigableIndexes().filter(function(i){return i>=0&&i<e.slideCount});e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),null!==e.$dots&&(e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(t){var s=o.indexOf(t);i(this).attr({role:"tabpanel",id:"slick-slide"+e.instanceUid+t,tabindex:-1}),-1!==s&&i(this).attr({"aria-describedby":"slick-slide-control"+e.instanceUid+s})}),e.$dots.attr("role","tablist").find("li").each(function(s){var n=o[s];i(this).attr({role:"presentation"}),i(this).find("button").first().attr({role:"tab",id:"slick-slide-control"+e.instanceUid+s,"aria-controls":"slick-slide"+e.instanceUid+n,"aria-label":s+1+" of "+t,"aria-selected":null,tabindex:"-1"})}).eq(e.currentSlide).find("button").attr({"aria-selected":"true",tabindex:"0"}).end());for(var s=e.currentSlide,n=s+e.options.slidesToShow;s<n;s++)e.$slides.eq(s).attr("tabindex",0);e.activateADA()},e.prototype.initArrowEvents=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},i.changeSlide),i.$nextArrow.off("click.slick").on("click.slick",{message:"next"},i.changeSlide),!0===i.options.accessibility&&(i.$prevArrow.on("keydown.slick",i.keyHandler),i.$nextArrow.on("keydown.slick",i.keyHandler)))},e.prototype.initDotEvents=function(){var e=this;!0===e.options.dots&&(i("li",e.$dots).on("click.slick",{message:"index"},e.changeSlide),!0===e.options.accessibility&&e.$dots.on("keydown.slick",e.keyHandler)),!0===e.options.dots&&!0===e.options.pauseOnDotsHover&&i("li",e.$dots).on("mouseenter.slick",i.proxy(e.interrupt,e,!0)).on("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.initSlideEvents=function(){var e=this;e.options.pauseOnHover&&(e.$list.on("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.on("mouseleave.slick",i.proxy(e.interrupt,e,!1)))},e.prototype.initializeEvents=function(){var e=this;e.initArrowEvents(),e.initDotEvents(),e.initSlideEvents(),e.$list.on("touchstart.slick mousedown.slick",{action:"start"},e.swipeHandler),e.$list.on("touchmove.slick mousemove.slick",{action:"move"},e.swipeHandler),e.$list.on("touchend.slick mouseup.slick",{action:"end"},e.swipeHandler),e.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},e.swipeHandler),e.$list.on("click.slick",e.clickHandler),i(document).on(e.visibilityChange,i.proxy(e.visibility,e)),!0===e.options.accessibility&&e.$list.on("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),i(window).on("orientationchange.slick.slick-"+e.instanceUid,i.proxy(e.orientationChange,e)),i(window).on("resize.slick.slick-"+e.instanceUid,i.proxy(e.resize,e)),i("[draggable!=true]",e.$slideTrack).on("dragstart",e.preventDefault),i(window).on("load.slick.slick-"+e.instanceUid,e.setPosition),i(e.setPosition)},e.prototype.initUI=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.show(),i.$nextArrow.show()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.show()},e.prototype.keyHandler=function(i){var e=this;i.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===i.keyCode&&!0===e.options.accessibility?e.changeSlide({data:{message:!0===e.options.rtl?"next":"previous"}}):39===i.keyCode&&!0===e.options.accessibility&&e.changeSlide({data:{message:!0===e.options.rtl?"previous":"next"}}))},e.prototype.lazyLoad=function(){function e(e){i("img[data-lazy]",e).each(function(){var e=i(this),t=i(this).attr("data-lazy"),o=i(this).attr("data-srcset"),s=i(this).attr("data-sizes")||n.$slider.attr("data-sizes"),r=document.createElement("img");r.onload=function(){e.animate({opacity:0},100,function(){o&&(e.attr("srcset",o),s&&e.attr("sizes",s)),e.attr("src",t).animate({opacity:1},200,function(){e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")}),n.$slider.trigger("lazyLoaded",[n,e,t])})},r.onerror=function(){e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),n.$slider.trigger("lazyLoadError",[n,e,t])},r.src=t})}var t,o,s,n=this;if(!0===n.options.centerMode?!0===n.options.infinite?s=(o=n.currentSlide+(n.options.slidesToShow/2+1))+n.options.slidesToShow+2:(o=Math.max(0,n.currentSlide-(n.options.slidesToShow/2+1)),s=n.options.slidesToShow/2+1+2+n.currentSlide):(o=n.options.infinite?n.options.slidesToShow+n.currentSlide:n.currentSlide,s=Math.ceil(o+n.options.slidesToShow),!0===n.options.fade&&(o>0&&o--,s<=n.slideCount&&s++)),t=n.$slider.find(".slick-slide").slice(o,s),"anticipated"===n.options.lazyLoad)for(var r=o-1,l=s,d=n.$slider.find(".slick-slide"),a=0;a<n.options.slidesToScroll;a++)r<0&&(r=n.slideCount-1),t=(t=t.add(d.eq(r))).add(d.eq(l)),r--,l++;e(t),n.slideCount<=n.options.slidesToShow?e(n.$slider.find(".slick-slide")):n.currentSlide>=n.slideCount-n.options.slidesToShow?e(n.$slider.find(".slick-cloned").slice(0,n.options.slidesToShow)):0===n.currentSlide&&e(n.$slider.find(".slick-cloned").slice(-1*n.options.slidesToShow))},e.prototype.loadSlider=function(){var i=this;i.setPosition(),i.$slideTrack.css({opacity:1}),i.$slider.removeClass("slick-loading"),i.initUI(),"progressive"===i.options.lazyLoad&&i.progressiveLazyLoad()},e.prototype.next=e.prototype.slickNext=function(){this.changeSlide({data:{message:"next"}})},e.prototype.orientationChange=function(){var i=this;i.checkResponsive(),i.setPosition()},e.prototype.pause=e.prototype.slickPause=function(){var i=this;i.autoPlayClear(),i.paused=!0},e.prototype.play=e.prototype.slickPlay=function(){var i=this;i.autoPlay(),i.options.autoplay=!0,i.paused=!1,i.focussed=!1,i.interrupted=!1},e.prototype.postSlide=function(e){var t=this;t.unslicked||(t.$slider.trigger("afterChange",[t,e]),t.animating=!1,t.slideCount>t.options.slidesToShow&&t.setPosition(),t.swipeLeft=null,t.options.autoplay&&t.autoPlay(),!0===t.options.accessibility&&(t.initADA(),t.options.focusOnChange&&i(t.$slides.get(t.currentSlide)).attr("tabindex",0).focus()))},e.prototype.prev=e.prototype.slickPrev=function(){this.changeSlide({data:{message:"previous"}})},e.prototype.preventDefault=function(i){i.preventDefault()},e.prototype.progressiveLazyLoad=function(e){e=e||1;var t,o,s,n,r,l=this,d=i("img[data-lazy]",l.$slider);d.length?(t=d.first(),o=t.attr("data-lazy"),s=t.attr("data-srcset"),n=t.attr("data-sizes")||l.$slider.attr("data-sizes"),(r=document.createElement("img")).onload=function(){s&&(t.attr("srcset",s),n&&t.attr("sizes",n)),t.attr("src",o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),!0===l.options.adaptiveHeight&&l.setPosition(),l.$slider.trigger("lazyLoaded",[l,t,o]),l.progressiveLazyLoad()},r.onerror=function(){e<3?setTimeout(function(){l.progressiveLazyLoad(e+1)},500):(t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),l.$slider.trigger("lazyLoadError",[l,t,o]),l.progressiveLazyLoad())},r.src=o):l.$slider.trigger("allImagesLoaded",[l])},e.prototype.refresh=function(e){var t,o,s=this;o=s.slideCount-s.options.slidesToShow,!s.options.infinite&&s.currentSlide>o&&(s.currentSlide=o),s.slideCount<=s.options.slidesToShow&&(s.currentSlide=0),t=s.currentSlide,s.destroy(!0),i.extend(s,s.initials,{currentSlide:t}),s.init(),e||s.changeSlide({data:{message:"index",index:t}},!1)},e.prototype.registerBreakpoints=function(){var e,t,o,s=this,n=s.options.responsive||null;if("array"===i.type(n)&&n.length){s.respondTo=s.options.respondTo||"window";for(e in n)if(o=s.breakpoints.length-1,n.hasOwnProperty(e)){for(t=n[e].breakpoint;o>=0;)s.breakpoints[o]&&s.breakpoints[o]===t&&s.breakpoints.splice(o,1),o--;s.breakpoints.push(t),s.breakpointSettings[t]=n[e].settings}s.breakpoints.sort(function(i,e){return s.options.mobileFirst?i-e:e-i})}},e.prototype.reinit=function(){var e=this;e.$slides=e.$slideTrack.children(e.options.slide).addClass("slick-slide"),e.slideCount=e.$slides.length,e.currentSlide>=e.slideCount&&0!==e.currentSlide&&(e.currentSlide=e.currentSlide-e.options.slidesToScroll),e.slideCount<=e.options.slidesToShow&&(e.currentSlide=0),e.registerBreakpoints(),e.setProps(),e.setupInfinite(),e.buildArrows(),e.updateArrows(),e.initArrowEvents(),e.buildDots(),e.updateDots(),e.initDotEvents(),e.cleanUpSlideEvents(),e.initSlideEvents(),e.checkResponsive(!1,!0),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),e.setPosition(),e.focusHandler(),e.paused=!e.options.autoplay,e.autoPlay(),e.$slider.trigger("reInit",[e])},e.prototype.resize=function(){var e=this;i(window).width()!==e.windowWidth&&(clearTimeout(e.windowDelay),e.windowDelay=window.setTimeout(function(){e.windowWidth=i(window).width(),e.checkResponsive(),e.unslicked||e.setPosition()},50))},e.prototype.removeSlide=e.prototype.slickRemove=function(i,e,t){var o=this;if(i="boolean"==typeof i?!0===(e=i)?0:o.slideCount-1:!0===e?--i:i,o.slideCount<1||i<0||i>o.slideCount-1)return!1;o.unload(),!0===t?o.$slideTrack.children().remove():o.$slideTrack.children(this.options.slide).eq(i).remove(),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slidesCache=o.$slides,o.reinit()},e.prototype.setCSS=function(i){var e,t,o=this,s={};!0===o.options.rtl&&(i=-i),e="left"==o.positionProp?Math.ceil(i)+"px":"0px",t="top"==o.positionProp?Math.ceil(i)+"px":"0px",s[o.positionProp]=i,!1===o.transformsEnabled?o.$slideTrack.css(s):(s={},!1===o.cssTransitions?(s[o.animType]="translate("+e+", "+t+")",o.$slideTrack.css(s)):(s[o.animType]="translate3d("+e+", "+t+", 0px)",o.$slideTrack.css(s)))},e.prototype.setDimensions=function(){var i=this;!1===i.options.vertical?!0===i.options.centerMode&&i.$list.css({padding:"0px "+i.options.centerPadding}):(i.$list.height(i.$slides.first().outerHeight(!0)*i.options.slidesToShow),!0===i.options.centerMode&&i.$list.css({padding:i.options.centerPadding+" 0px"})),i.listWidth=i.$list.width(),i.listHeight=i.$list.height(),!1===i.options.vertical&&!1===i.options.variableWidth?(i.slideWidth=Math.ceil(i.listWidth/i.options.slidesToShow),i.$slideTrack.width(Math.ceil(i.slideWidth*i.$slideTrack.children(".slick-slide").length))):!0===i.options.variableWidth?i.$slideTrack.width(5e3*i.slideCount):(i.slideWidth=Math.ceil(i.listWidth),i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0)*i.$slideTrack.children(".slick-slide").length)));var e=i.$slides.first().outerWidth(!0)-i.$slides.first().width();!1===i.options.variableWidth&&i.$slideTrack.children(".slick-slide").width(i.slideWidth-e)},e.prototype.setFade=function(){var e,t=this;t.$slides.each(function(o,s){e=t.slideWidth*o*-1,!0===t.options.rtl?i(s).css({position:"relative",right:e,top:0,zIndex:t.options.zIndex-2,opacity:0}):i(s).css({position:"relative",left:e,top:0,zIndex:t.options.zIndex-2,opacity:0})}),t.$slides.eq(t.currentSlide).css({zIndex:t.options.zIndex-1,opacity:1})},e.prototype.setHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.css("height",e)}},e.prototype.setOption=e.prototype.slickSetOption=function(){var e,t,o,s,n,r=this,l=!1;if("object"===i.type(arguments[0])?(o=arguments[0],l=arguments[1],n="multiple"):"string"===i.type(arguments[0])&&(o=arguments[0],s=arguments[1],l=arguments[2],"responsive"===arguments[0]&&"array"===i.type(arguments[1])?n="responsive":void 0!==arguments[1]&&(n="single")),"single"===n)r.options[o]=s;else if("multiple"===n)i.each(o,function(i,e){r.options[i]=e});else if("responsive"===n)for(t in s)if("array"!==i.type(r.options.responsive))r.options.responsive=[s[t]];else{for(e=r.options.responsive.length-1;e>=0;)r.options.responsive[e].breakpoint===s[t].breakpoint&&r.options.responsive.splice(e,1),e--;r.options.responsive.push(s[t])}l&&(r.unload(),r.reinit())},e.prototype.setPosition=function(){var i=this;i.setDimensions(),i.setHeight(),!1===i.options.fade?i.setCSS(i.getLeft(i.currentSlide)):i.setFade(),i.$slider.trigger("setPosition",[i])},e.prototype.setProps=function(){var i=this,e=document.body.style;i.positionProp=!0===i.options.vertical?"top":"left","top"===i.positionProp?i.$slider.addClass("slick-vertical"):i.$slider.removeClass("slick-vertical"),void 0===e.WebkitTransition&&void 0===e.MozTransition&&void 0===e.msTransition||!0===i.options.useCSS&&(i.cssTransitions=!0),i.options.fade&&("number"==typeof i.options.zIndex?i.options.zIndex<3&&(i.options.zIndex=3):i.options.zIndex=i.defaults.zIndex),void 0!==e.OTransform&&(i.animType="OTransform",i.transformType="-o-transform",i.transitionType="OTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.MozTransform&&(i.animType="MozTransform",i.transformType="-moz-transform",i.transitionType="MozTransition",void 0===e.perspectiveProperty&&void 0===e.MozPerspective&&(i.animType=!1)),void 0!==e.webkitTransform&&(i.animType="webkitTransform",i.transformType="-webkit-transform",i.transitionType="webkitTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.msTransform&&(i.animType="msTransform",i.transformType="-ms-transform",i.transitionType="msTransition",void 0===e.msTransform&&(i.animType=!1)),void 0!==e.transform&&!1!==i.animType&&(i.animType="transform",i.transformType="transform",i.transitionType="transition"),i.transformsEnabled=i.options.useTransform&&null!==i.animType&&!1!==i.animType},e.prototype.setSlideClasses=function(i){var e,t,o,s,n=this;if(t=n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),n.$slides.eq(i).addClass("slick-current"),!0===n.options.centerMode){var r=n.options.slidesToShow%2==0?1:0;e=Math.floor(n.options.slidesToShow/2),!0===n.options.infinite&&(i>=e&&i<=n.slideCount-1-e?n.$slides.slice(i-e+r,i+e+1).addClass("slick-active").attr("aria-hidden","false"):(o=n.options.slidesToShow+i,t.slice(o-e+1+r,o+e+2).addClass("slick-active").attr("aria-hidden","false")),0===i?t.eq(t.length-1-n.options.slidesToShow).addClass("slick-center"):i===n.slideCount-1&&t.eq(n.options.slidesToShow).addClass("slick-center")),n.$slides.eq(i).addClass("slick-center")}else i>=0&&i<=n.slideCount-n.options.slidesToShow?n.$slides.slice(i,i+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):t.length<=n.options.slidesToShow?t.addClass("slick-active").attr("aria-hidden","false"):(s=n.slideCount%n.options.slidesToShow,o=!0===n.options.infinite?n.options.slidesToShow+i:i,n.options.slidesToShow==n.options.slidesToScroll&&n.slideCount-i<n.options.slidesToShow?t.slice(o-(n.options.slidesToShow-s),o+s).addClass("slick-active").attr("aria-hidden","false"):t.slice(o,o+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"));"ondemand"!==n.options.lazyLoad&&"anticipated"!==n.options.lazyLoad||n.lazyLoad()},e.prototype.setupInfinite=function(){var e,t,o,s=this;if(!0===s.options.fade&&(s.options.centerMode=!1),!0===s.options.infinite&&!1===s.options.fade&&(t=null,s.slideCount>s.options.slidesToShow)){for(o=!0===s.options.centerMode?s.options.slidesToShow+1:s.options.slidesToShow,e=s.slideCount;e>s.slideCount-o;e-=1)t=e-1,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t-s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");for(e=0;e<o+s.slideCount;e+=1)t=e,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t+s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");s.$slideTrack.find(".slick-cloned").find("[id]").each(function(){i(this).attr("id","")})}},e.prototype.interrupt=function(i){var e=this;i||e.autoPlay(),e.interrupted=i},e.prototype.selectHandler=function(e){var t=this,o=i(e.target).is(".slick-slide")?i(e.target):i(e.target).parents(".slick-slide"),s=parseInt(o.attr("data-slick-index"));s||(s=0),t.slideCount<=t.options.slidesToShow?t.slideHandler(s,!1,!0):t.slideHandler(s)},e.prototype.slideHandler=function(i,e,t){var o,s,n,r,l,d=null,a=this;if(e=e||!1,!(!0===a.animating&&!0===a.options.waitForAnimate||!0===a.options.fade&&a.currentSlide===i))if(!1===e&&a.asNavFor(i),o=i,d=a.getLeft(o),r=a.getLeft(a.currentSlide),a.currentLeft=null===a.swipeLeft?r:a.swipeLeft,!1===a.options.infinite&&!1===a.options.centerMode&&(i<0||i>a.getDotCount()*a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else if(!1===a.options.infinite&&!0===a.options.centerMode&&(i<0||i>a.slideCount-a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else{if(a.options.autoplay&&clearInterval(a.autoPlayTimer),s=o<0?a.slideCount%a.options.slidesToScroll!=0?a.slideCount-a.slideCount%a.options.slidesToScroll:a.slideCount+o:o>=a.slideCount?a.slideCount%a.options.slidesToScroll!=0?0:o-a.slideCount:o,a.animating=!0,a.$slider.trigger("beforeChange",[a,a.currentSlide,s]),n=a.currentSlide,a.currentSlide=s,a.setSlideClasses(a.currentSlide),a.options.asNavFor&&(l=(l=a.getNavTarget()).slick("getSlick")).slideCount<=l.options.slidesToShow&&l.setSlideClasses(a.currentSlide),a.updateDots(),a.updateArrows(),!0===a.options.fade)return!0!==t?(a.fadeSlideOut(n),a.fadeSlide(s,function(){a.postSlide(s)})):a.postSlide(s),void a.animateHeight();!0!==t?a.animateSlide(d,function(){a.postSlide(s)}):a.postSlide(s)}},e.prototype.startLoad=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.hide(),i.$nextArrow.hide()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.hide(),i.$slider.addClass("slick-loading")},e.prototype.swipeDirection=function(){var i,e,t,o,s=this;return i=s.touchObject.startX-s.touchObject.curX,e=s.touchObject.startY-s.touchObject.curY,t=Math.atan2(e,i),(o=Math.round(180*t/Math.PI))<0&&(o=360-Math.abs(o)),o<=45&&o>=0?!1===s.options.rtl?"left":"right":o<=360&&o>=315?!1===s.options.rtl?"left":"right":o>=135&&o<=225?!1===s.options.rtl?"right":"left":!0===s.options.verticalSwiping?o>=35&&o<=135?"down":"up":"vertical"},e.prototype.swipeEnd=function(i){var e,t,o=this;if(o.dragging=!1,o.swiping=!1,o.scrolling)return o.scrolling=!1,!1;if(o.interrupted=!1,o.shouldClick=!(o.touchObject.swipeLength>10),void 0===o.touchObject.curX)return!1;if(!0===o.touchObject.edgeHit&&o.$slider.trigger("edge",[o,o.swipeDirection()]),o.touchObject.swipeLength>=o.touchObject.minSwipe){switch(t=o.swipeDirection()){case"left":case"down":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide+o.getSlideCount()):o.currentSlide+o.getSlideCount(),o.currentDirection=0;break;case"right":case"up":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide-o.getSlideCount()):o.currentSlide-o.getSlideCount(),o.currentDirection=1}"vertical"!=t&&(o.slideHandler(e),o.touchObject={},o.$slider.trigger("swipe",[o,t]))}else o.touchObject.startX!==o.touchObject.curX&&(o.slideHandler(o.currentSlide),o.touchObject={})},e.prototype.swipeHandler=function(i){var e=this;if(!(!1===e.options.swipe||"ontouchend"in document&&!1===e.options.swipe||!1===e.options.draggable&&-1!==i.type.indexOf("mouse")))switch(e.touchObject.fingerCount=i.originalEvent&&void 0!==i.originalEvent.touches?i.originalEvent.touches.length:1,e.touchObject.minSwipe=e.listWidth/e.options.touchThreshold,!0===e.options.verticalSwiping&&(e.touchObject.minSwipe=e.listHeight/e.options.touchThreshold),i.data.action){case"start":e.swipeStart(i);break;case"move":e.swipeMove(i);break;case"end":e.swipeEnd(i)}},e.prototype.swipeMove=function(i){var e,t,o,s,n,r,l=this;return n=void 0!==i.originalEvent?i.originalEvent.touches:null,!(!l.dragging||l.scrolling||n&&1!==n.length)&&(e=l.getLeft(l.currentSlide),l.touchObject.curX=void 0!==n?n[0].pageX:i.clientX,l.touchObject.curY=void 0!==n?n[0].pageY:i.clientY,l.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(l.touchObject.curX-l.touchObject.startX,2))),r=Math.round(Math.sqrt(Math.pow(l.touchObject.curY-l.touchObject.startY,2))),!l.options.verticalSwiping&&!l.swiping&&r>4?(l.scrolling=!0,!1):(!0===l.options.verticalSwiping&&(l.touchObject.swipeLength=r),t=l.swipeDirection(),void 0!==i.originalEvent&&l.touchObject.swipeLength>4&&(l.swiping=!0,i.preventDefault()),s=(!1===l.options.rtl?1:-1)*(l.touchObject.curX>l.touchObject.startX?1:-1),!0===l.options.verticalSwiping&&(s=l.touchObject.curY>l.touchObject.startY?1:-1),o=l.touchObject.swipeLength,l.touchObject.edgeHit=!1,!1===l.options.infinite&&(0===l.currentSlide&&"right"===t||l.currentSlide>=l.getDotCount()&&"left"===t)&&(o=l.touchObject.swipeLength*l.options.edgeFriction,l.touchObject.edgeHit=!0),!1===l.options.vertical?l.swipeLeft=e+o*s:l.swipeLeft=e+o*(l.$list.height()/l.listWidth)*s,!0===l.options.verticalSwiping&&(l.swipeLeft=e+o*s),!0!==l.options.fade&&!1!==l.options.touchMove&&(!0===l.animating?(l.swipeLeft=null,!1):void l.setCSS(l.swipeLeft))))},e.prototype.swipeStart=function(i){var e,t=this;if(t.interrupted=!0,1!==t.touchObject.fingerCount||t.slideCount<=t.options.slidesToShow)return t.touchObject={},!1;void 0!==i.originalEvent&&void 0!==i.originalEvent.touches&&(e=i.originalEvent.touches[0]),t.touchObject.startX=t.touchObject.curX=void 0!==e?e.pageX:i.clientX,t.touchObject.startY=t.touchObject.curY=void 0!==e?e.pageY:i.clientY,t.dragging=!0},e.prototype.unfilterSlides=e.prototype.slickUnfilter=function(){var i=this;null!==i.$slidesCache&&(i.unload(),i.$slideTrack.children(this.options.slide).detach(),i.$slidesCache.appendTo(i.$slideTrack),i.reinit())},e.prototype.unload=function(){var e=this;i(".slick-cloned",e.$slider).remove(),e.$dots&&e.$dots.remove(),e.$prevArrow&&e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.remove(),e.$nextArrow&&e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.remove(),e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},e.prototype.unslick=function(i){var e=this;e.$slider.trigger("unslick",[e,i]),e.destroy()},e.prototype.updateArrows=function(){var i=this;Math.floor(i.options.slidesToShow/2),!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&!i.options.infinite&&(i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===i.currentSlide?(i.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-i.options.slidesToShow&&!1===i.options.centerMode?(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-1&&!0===i.options.centerMode&&(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},e.prototype.updateDots=function(){var i=this;null!==i.$dots&&(i.$dots.find("li").removeClass("slick-active").end(),i.$dots.find("li").eq(Math.floor(i.currentSlide/i.options.slidesToScroll)).addClass("slick-active"))},e.prototype.visibility=function(){var i=this;i.options.autoplay&&(document[i.hidden]?i.interrupted=!0:i.interrupted=!1)},i.fn.slick=function(){var i,t,o=this,s=arguments[0],n=Array.prototype.slice.call(arguments,1),r=o.length;for(i=0;i<r;i++)if("object"==typeof s||void 0===s?o[i].slick=new e(o[i],s):t=o[i].slick[s].apply(o[i].slick,n),void 0!==t)return t;return o}});/*! lightgallery - v1.3.2 - 2016-09-23
* http://sachinchoolur.github.io/lightGallery/
* Copyright (c) 2016 Sachin N; Licensed Apache 2.0 */ 
!function(e,t){"function"==typeof define&&define.amd?define(["jquery"],function(e){return t(e)}):"object"==typeof exports?module.exports=t(require("jquery")):t(jQuery)}(this,function(e){!function(){"use strict";var e={mode:"lg-slide",cssEasing:"ease",easing:"linear",speed:600,height:"100%",width:"100%",addClass:"",startClass:"lg-start-zoom",backdropDuration:150,hideBarsDelay:6e3,useLeft:!1,closable:!0,loop:!0,escKey:!0,keyPress:!0,controls:!0,slideEndAnimatoin:!0,hideControlOnEnd:!1,mousewheel:!0,getCaptionFromTitleOrAlt:!0,appendSubHtmlTo:".lg-sub-html",subHtmlSelectorRelative:!1,preload:1,showAfterLoad:!0,selector:"",selectWithin:"",nextHtml:"",prevHtml:"",index:!1,iframeMaxWidth:"100%",download:!0,counter:!0,appendCounterTo:".lg-toolbar",swipeThreshold:50,enableSwipe:!0,enableDrag:!0,dynamic:!1,dynamicEl:[],galleryId:1};function t(t,s){if(this.el=t,this.$el=$(t),this.s=$.extend({},e,s),this.s.dynamic&&"undefined"!==this.s.dynamicEl&&this.s.dynamicEl.constructor===Array&&!this.s.dynamicEl.length)throw"When using dynamic mode, you must also define dynamicEl as an Array.";return this.modules={},this.lGalleryOn=!1,this.lgBusy=!1,this.hideBartimeout=!1,this.isTouch="ontouchstart"in document.documentElement,this.s.slideEndAnimatoin&&(this.s.hideControlOnEnd=!1),this.s.dynamic?this.$items=this.s.dynamicEl:"this"===this.s.selector?this.$items=this.$el:""!==this.s.selector?this.s.selectWithin?this.$items=$(this.s.selectWithin).find(this.s.selector):this.$items=this.$el.find($(this.s.selector)):this.$items=this.$el.children(),this.$slide="",this.$outer="",this.init(),this}t.prototype.init=function(){var e=this;e.s.preload>e.$items.length&&(e.s.preload=e.$items.length);var t=window.location.hash;t.indexOf("lg="+this.s.galleryId)>0&&(e.index=parseInt(t.split("&slide=")[1],10),$("body").addClass("lg-from-hash"),$("body").hasClass("lg-on")||(setTimeout(function(){e.build(e.index)}),$("body").addClass("lg-on"))),e.s.dynamic?(e.$el.trigger("onBeforeOpen.lg"),e.index=e.s.index||0,$("body").hasClass("lg-on")||setTimeout(function(){e.build(e.index),$("body").addClass("lg-on")})):e.$items.on("click.lgcustom",function(t){try{t.preventDefault(),t.preventDefault()}catch(s){t.returnValue=!1}e.$el.trigger("onBeforeOpen.lg"),e.index=e.s.index||e.$items.index(this),$("body").hasClass("lg-on")||(e.build(e.index),$("body").addClass("lg-on"))})},t.prototype.build=function(e){var t=this;t.structure(),$.each($.fn.lightGallery.modules,function(e){t.modules[e]=new $.fn.lightGallery.modules[e](t.el)}),t.slide(e,!1,!1),t.s.keyPress&&t.keyPress(),t.$items.length>1&&(t.arrow(),setTimeout(function(){t.enableDrag(),t.enableSwipe()},50),t.s.mousewheel&&t.mousewheel()),t.counter(),t.closeGallery(),t.$el.trigger("onAfterOpen.lg"),t.$outer.on("mousemove.lg click.lg touchstart.lg",function(){t.$outer.removeClass("lg-hide-items"),clearTimeout(t.hideBartimeout),t.hideBartimeout=setTimeout(function(){t.$outer.addClass("lg-hide-items")},t.s.hideBarsDelay)})},t.prototype.structure=function(){var e,t="",s="",i=0,l="",o=this;for($("body").append('<div class="lg-backdrop"></div>'),$(".lg-backdrop").css("transition-duration",this.s.backdropDuration+"ms"),i=0;i<this.$items.length;i++)t+='<div class="lg-item"></div>';if(this.s.controls&&this.$items.length>1&&(s='<div class="lg-actions"><div class="lg-prev lg-icon">'+this.s.prevHtml+'</div><div class="lg-next lg-icon">'+this.s.nextHtml+"</div></div>"),".lg-sub-html"===this.s.appendSubHtmlTo&&(l='<div class="lg-sub-html"></div>'),e='<div class="lg-outer '+this.s.addClass+" "+this.s.startClass+'"><div class="lg" style="width:'+this.s.width+"; height:"+this.s.height+'"><div class="lg-inner">'+t+'</div><div class="lg-toolbar group"><span class="lg-close lg-icon"></span></div>'+s+l+"</div></div>",$("body").append(e),this.$outer=$(".lg-outer"),this.$slide=this.$outer.find(".lg-item"),this.s.useLeft?(this.$outer.addClass("lg-use-left"),this.s.mode="lg-slide"):this.$outer.addClass("lg-use-css3"),o.setTop(),$(window).on("resize.lg orientationchange.lg",function(){setTimeout(function(){o.setTop()},100)}),this.$slide.eq(this.index).addClass("lg-current"),this.doCss()?this.$outer.addClass("lg-css3"):(this.$outer.addClass("lg-css"),this.s.speed=0),this.$outer.addClass(this.s.mode),this.s.enableDrag&&this.$items.length>1&&this.$outer.addClass("lg-grab"),this.s.showAfterLoad&&this.$outer.addClass("lg-show-after-load"),this.doCss()){var a=this.$outer.find(".lg-inner");a.css("transition-timing-function",this.s.cssEasing),a.css("transition-duration",this.s.speed+"ms")}$(".lg-backdrop").addClass("in"),setTimeout(function(){o.$outer.addClass("lg-visible")},this.s.backdropDuration),this.s.download&&this.$outer.find(".lg-toolbar").append('<a id="lg-download" target="_blank" download class="lg-download lg-icon"></a>'),this.prevScrollTop=$(window).scrollTop()},t.prototype.setTop=function(){if("100%"!==this.s.height){var e=$(window).height(),t=(e-parseInt(this.s.height,10))/2,s=this.$outer.find(".lg");e>=parseInt(this.s.height,10)?s.css("top",t+"px"):s.css("top","0px")}},t.prototype.doCss=function(){return!!function(){var e=["transition","MozTransition","WebkitTransition","OTransition","msTransition","KhtmlTransition"],t=document.documentElement,s=0;for(s=0;s<e.length;s++)if(e[s]in t.style)return!0}()},t.prototype.isVideo=function(e,t){if(s=this.s.dynamic?this.s.dynamicEl[t].html:this.$items.eq(t).attr("data-html"),!e&&s)return{html5:!0};var s,i=e.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i),l=e.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i),o=e.match(/\/\/(?:www\.)?dai.ly\/([0-9a-z\-_]+)/i),a=e.match(/\/\/(?:www\.)?(?:vk\.com|vkontakte\.ru)\/(?:video_ext\.php\?)(.*)/i);return i?{youtube:i}:l?{vimeo:l}:o?{dailymotion:o}:a?{vk:a}:void 0},t.prototype.counter=function(){this.s.counter&&$(this.s.appendCounterTo).append('<div id="lg-counter"><span id="lg-counter-current">'+(parseInt(this.index,10)+1)+'</span> / <span id="lg-counter-all">'+this.$items.length+"</span></div>")},t.prototype.addHtml=function(e){var t,s,i=null;if(this.s.dynamic?this.s.dynamicEl[e].subHtmlUrl?t=this.s.dynamicEl[e].subHtmlUrl:i=this.s.dynamicEl[e].subHtml:(s=this.$items.eq(e)).attr("data-sub-html-url")?t=s.attr("data-sub-html-url"):(i=s.attr("data-sub-html"),this.s.getCaptionFromTitleOrAlt&&!i&&(i=s.attr("title")||s.find("img").first().attr("alt"))),!t){if(null!=i){var l=i.substring(0,1);("."===l||"#"===l)&&(i=this.s.subHtmlSelectorRelative&&!this.s.dynamic?s.find(i).html():$(i).html())}else i=""}".lg-sub-html"===this.s.appendSubHtmlTo?t?this.$outer.find(this.s.appendSubHtmlTo).load(t):this.$outer.find(this.s.appendSubHtmlTo).html(i):t?this.$slide.eq(e).load(t):this.$slide.eq(e).append(i),null!=i&&(""===i?this.$outer.find(this.s.appendSubHtmlTo).addClass("lg-empty-html"):this.$outer.find(this.s.appendSubHtmlTo).removeClass("lg-empty-html")),this.$el.trigger("onAfterAppendSubHtml.lg",[e])},t.prototype.preload=function(e){var t=1,s=1;for(t=1;t<=this.s.preload&&!(t>=this.$items.length-e);t++)this.loadContent(e+t,!1,0);for(s=1;s<=this.s.preload&&!(e-s<0);s++)this.loadContent(e-s,!1,0)},t.prototype.loadContent=function(e,t,s){var i,l,o,a,n,d,r=this,g=!1,h=function(e){for(var t=[],s=[],i=0;i<e.length;i++){var o=e[i].split(" ");""===o[0]&&o.splice(0,1),s.push(o[0]),t.push(o[1])}for(var a=$(window).width(),n=0;n<t.length;n++)if(parseInt(t[n],10)>a){l=s[n];break}};if(r.s.dynamic)r.s.dynamicEl[e].poster&&(g=!0,o=r.s.dynamicEl[e].poster),d=r.s.dynamicEl[e].html,l=r.s.dynamicEl[e].src,r.s.dynamicEl[e].responsive&&h(r.s.dynamicEl[e].responsive.split(",")),a=r.s.dynamicEl[e].srcset,n=r.s.dynamicEl[e].sizes;else{if(r.$items.eq(e).attr("data-poster")&&(g=!0,o=r.$items.eq(e).attr("data-poster")),d=r.$items.eq(e).attr("data-html"),l=r.$items.eq(e).attr("href")||r.$items.eq(e).attr("data-src"),r.$items.eq(e).attr("data-responsive")){var u=r.$items.eq(e).attr("data-responsive").split(",");h(u)}a=r.$items.eq(e).attr("data-srcset"),n=r.$items.eq(e).attr("data-sizes")}var c=!1;r.s.dynamic?r.s.dynamicEl[e].iframe&&(c=!0):"true"===r.$items.eq(e).attr("data-iframe")&&(c=!0);var m=r.isVideo(l,e);if(!r.$slide.eq(e).hasClass("lg-loaded")){if(c)r.$slide.eq(e).prepend('<div class="lg-video-cont" style="max-width:'+r.s.iframeMaxWidth+'"><div class="lg-video"><iframe class="lg-object" frameborder="0" src="'+l+'"  allowfullscreen="true"></iframe></div></div>');else if(g){var p="";p=m&&m.youtube?"lg-has-youtube":m&&m.vimeo?"lg-has-vimeo":"lg-has-html5",r.$slide.eq(e).prepend('<div class="lg-video-cont '+p+' "><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="'+o+'" /></div></div>')}else m?(r.$slide.eq(e).prepend('<div class="lg-video-cont "><div class="lg-video"></div></div>'),r.$el.trigger("hasVideo.lg",[e,l,d])):r.$slide.eq(e).prepend('<div class="lg-img-wrap"><img class="lg-object lg-image" src="'+l+'" /></div>');if(r.$el.trigger("onAferAppendSlide.lg",[e]),i=r.$slide.eq(e).find(".lg-object"),n&&i.attr("sizes",n),a){i.attr("srcset",a);try{picturefill({elements:[i[0]]})}catch(f){console.error("Make sure you have included Picturefill version 2")}}".lg-sub-html"!==this.s.appendSubHtmlTo&&r.addHtml(e),r.$slide.eq(e).addClass("lg-loaded")}r.$slide.eq(e).find(".lg-object").on("load.lg error.lg",function(){var t=0;s&&!$("body").hasClass("lg-from-hash")&&(t=s),setTimeout(function(){r.$slide.eq(e).addClass("lg-complete"),r.$el.trigger("onSlideItemLoad.lg",[e,s||0])},t)}),m&&m.html5&&!g&&r.$slide.eq(e).addClass("lg-complete"),!0===t&&(r.$slide.eq(e).hasClass("lg-complete")?r.preload(e):r.$slide.eq(e).find(".lg-object").on("load.lg error.lg",function(){r.preload(e)}))},t.prototype.slide=function(e,t,s){var i,l=this.$outer.find(".lg-current").index(),o=this;if(!o.lGalleryOn||l!==e){var a=this.$slide.length,n=o.lGalleryOn?this.s.speed:0,d=!1,r=!1;if(!o.lgBusy){if(this.s.download&&((i=o.s.dynamic?!1!==o.s.dynamicEl[e].downloadUrl&&(o.s.dynamicEl[e].downloadUrl||o.s.dynamicEl[e].src):"false"!==o.$items.eq(e).attr("data-download-url")&&(o.$items.eq(e).attr("data-download-url")||o.$items.eq(e).attr("href")||o.$items.eq(e).attr("data-src")))?($("#lg-download").attr("href",i),o.$outer.removeClass("lg-hide-download")):o.$outer.addClass("lg-hide-download")),this.$el.trigger("onBeforeSlide.lg",[l,e,t,s]),o.lgBusy=!0,clearTimeout(o.hideBartimeout),".lg-sub-html"===this.s.appendSubHtmlTo&&setTimeout(function(){o.addHtml(e)},n),this.arrowDisable(e),t){var g=e-1,h=e+1;0===e&&l===a-1?(h=0,g=a-1):e===a-1&&0===l&&(h=0,g=a-1),this.$slide.removeClass("lg-prev-slide lg-current lg-next-slide"),o.$slide.eq(g).addClass("lg-prev-slide"),o.$slide.eq(h).addClass("lg-next-slide"),o.$slide.eq(e).addClass("lg-current")}else o.$outer.addClass("lg-no-trans"),this.$slide.removeClass("lg-prev-slide lg-next-slide"),e<l?(r=!0,0!==e||l!==a-1||s||(r=!1,d=!0)):e>l&&(d=!0,e!==a-1||0!==l||s||(r=!0,d=!1)),r?(this.$slide.eq(e).addClass("lg-prev-slide"),this.$slide.eq(l).addClass("lg-next-slide")):d&&(this.$slide.eq(e).addClass("lg-next-slide"),this.$slide.eq(l).addClass("lg-prev-slide")),setTimeout(function(){o.$slide.removeClass("lg-current"),o.$slide.eq(e).addClass("lg-current"),o.$outer.removeClass("lg-no-trans")},50);o.lGalleryOn?(setTimeout(function(){o.loadContent(e,!0,0)},this.s.speed+50),setTimeout(function(){o.lgBusy=!1,o.$el.trigger("onAfterSlide.lg",[l,e,t,s])},this.s.speed)):(o.loadContent(e,!0,o.s.backdropDuration),o.lgBusy=!1,o.$el.trigger("onAfterSlide.lg",[l,e,t,s])),o.lGalleryOn=!0,this.s.counter&&$("#lg-counter-current").text(e+1)}}},t.prototype.goToNextSlide=function(e){var t=this;!t.lgBusy&&(t.index+1<t.$slide.length?(t.index++,t.$el.trigger("onBeforeNextSlide.lg",[t.index]),t.slide(t.index,e,!1)):t.s.loop?(t.index=0,t.$el.trigger("onBeforeNextSlide.lg",[t.index]),t.slide(t.index,e,!1)):t.s.slideEndAnimatoin&&(t.$outer.addClass("lg-right-end"),setTimeout(function(){t.$outer.removeClass("lg-right-end")},400)))},t.prototype.goToPrevSlide=function(e){var t=this;!t.lgBusy&&(t.index>0?(t.index--,t.$el.trigger("onBeforePrevSlide.lg",[t.index,e]),t.slide(t.index,e,!1)):t.s.loop?(t.index=t.$items.length-1,t.$el.trigger("onBeforePrevSlide.lg",[t.index,e]),t.slide(t.index,e,!1)):t.s.slideEndAnimatoin&&(t.$outer.addClass("lg-left-end"),setTimeout(function(){t.$outer.removeClass("lg-left-end")},400)))},t.prototype.keyPress=function(){var e=this;this.$items.length>1&&$(window).on("keyup.lg",function(t){e.$items.length>1&&(37===t.keyCode&&(t.preventDefault(),e.goToPrevSlide()),39===t.keyCode&&(t.preventDefault(),e.goToNextSlide()))}),$(window).on("keydown.lg",function(t){!0===e.s.escKey&&27===t.keyCode&&(t.preventDefault(),e.$outer.hasClass("lg-thumb-open")?e.$outer.removeClass("lg-thumb-open"):e.destroy())})},t.prototype.arrow=function(){var e=this;this.$outer.find(".lg-prev").on("click.lg",function(){e.goToPrevSlide()}),this.$outer.find(".lg-next").on("click.lg",function(){e.goToNextSlide()})},t.prototype.arrowDisable=function(e){!this.s.loop&&this.s.hideControlOnEnd&&(e+1<this.$slide.length?this.$outer.find(".lg-next").removeAttr("disabled").removeClass("disabled"):this.$outer.find(".lg-next").attr("disabled","disabled").addClass("disabled"),e>0?this.$outer.find(".lg-prev").removeAttr("disabled").removeClass("disabled"):this.$outer.find(".lg-prev").attr("disabled","disabled").addClass("disabled"))},t.prototype.setTranslate=function(e,t,s){this.s.useLeft?e.css("left",t):e.css({transform:"translate3d("+t+"px, "+s+"px, 0px)"})},t.prototype.touchMove=function(e,t){var s=t-e;Math.abs(s)>15&&(this.$outer.addClass("lg-dragging"),this.setTranslate(this.$slide.eq(this.index),s,0),this.setTranslate($(".lg-prev-slide"),-this.$slide.eq(this.index).width()+s,0),this.setTranslate($(".lg-next-slide"),this.$slide.eq(this.index).width()+s,0))},t.prototype.touchEnd=function(e){var t=this;"lg-slide"!==t.s.mode&&t.$outer.addClass("lg-slide"),this.$slide.not(".lg-current, .lg-prev-slide, .lg-next-slide").css("opacity","0"),setTimeout(function(){t.$outer.removeClass("lg-dragging"),e<0&&Math.abs(e)>t.s.swipeThreshold?t.goToNextSlide(!0):e>0&&Math.abs(e)>t.s.swipeThreshold?t.goToPrevSlide(!0):5>Math.abs(e)&&t.$el.trigger("onSlideClick.lg"),t.$slide.removeAttr("style")}),setTimeout(function(){t.$outer.hasClass("lg-dragging")||"lg-slide"===t.s.mode||t.$outer.removeClass("lg-slide")},t.s.speed+100)},t.prototype.enableSwipe=function(){var e=this,t=0,s=0,i=!1;e.s.enableSwipe&&e.isTouch&&e.doCss()&&(e.$slide.on("touchstart.lg",function(s){e.$outer.hasClass("lg-zoomed")||e.lgBusy||(s.preventDefault(),e.manageSwipeClass(),t=s.originalEvent.targetTouches[0].pageX)}),e.$slide.on("touchmove.lg",function(l){e.$outer.hasClass("lg-zoomed")||(l.preventDefault(),s=l.originalEvent.targetTouches[0].pageX,e.touchMove(t,s),i=!0)}),e.$slide.on("touchend.lg",function(){e.$outer.hasClass("lg-zoomed")||(i?(i=!1,e.touchEnd(s-t)):e.$el.trigger("onSlideClick.lg"))}))},t.prototype.enableDrag=function(){var e=this,t=0,s=0,i=!1,l=!1;e.s.enableDrag&&!e.isTouch&&e.doCss()&&(e.$slide.on("mousedown.lg",function(s){!e.$outer.hasClass("lg-zoomed")&&($(s.target).hasClass("lg-object")||$(s.target).hasClass("lg-video-play"))&&(s.preventDefault(),e.lgBusy||(e.manageSwipeClass(),t=s.pageX,i=!0,e.$outer.scrollLeft+=1,e.$outer.scrollLeft-=1,e.$outer.removeClass("lg-grab").addClass("lg-grabbing"),e.$el.trigger("onDragstart.lg")))}),$(window).on("mousemove.lg",function(o){i&&(l=!0,s=o.pageX,e.touchMove(t,s),e.$el.trigger("onDragmove.lg"))}),$(window).on("mouseup.lg",function(o){l?(l=!1,e.touchEnd(s-t),e.$el.trigger("onDragend.lg")):($(o.target).hasClass("lg-object")||$(o.target).hasClass("lg-video-play"))&&e.$el.trigger("onSlideClick.lg"),i&&(i=!1,e.$outer.removeClass("lg-grabbing").addClass("lg-grab"))}))},t.prototype.manageSwipeClass=function(){var e=this.index+1,t=this.index-1,s=this.$slide.length;this.s.loop&&(0===this.index?t=s-1:this.index===s-1&&(e=0)),this.$slide.removeClass("lg-next-slide lg-prev-slide"),t>-1&&this.$slide.eq(t).addClass("lg-prev-slide"),this.$slide.eq(e).addClass("lg-next-slide")},t.prototype.mousewheel=function(){var e=this;e.$outer.on("mousewheel.lg",function(t){t.deltaY&&(t.deltaY>0?e.goToPrevSlide():e.goToNextSlide(),t.preventDefault())})},t.prototype.closeGallery=function(){var e=this,t=!1;this.$outer.find(".lg-close").on("click.lg",function(){e.destroy()}),e.s.closable&&(e.$outer.on("mousedown.lg",function(e){t=!!($(e.target).is(".lg-outer")||$(e.target).is(".lg-item ")||$(e.target).is(".lg-img-wrap"))}),e.$outer.on("mouseup.lg",function(s){($(s.target).is(".lg-outer")||$(s.target).is(".lg-item ")||$(s.target).is(".lg-img-wrap")&&t)&&!e.$outer.hasClass("lg-dragging")&&e.destroy()}))},t.prototype.destroy=function(e){var t=this;e||t.$el.trigger("onBeforeClose.lg"),$(window).scrollTop(t.prevScrollTop),e&&(t.s.dynamic||this.$items.off("click.lg click.lgcustom"),$.removeData(t.el,"lightGallery")),this.$el.off(".lg.tm"),$.each($.fn.lightGallery.modules,function(e){t.modules[e]&&t.modules[e].destroy()}),this.lGalleryOn=!1,clearTimeout(t.hideBartimeout),this.hideBartimeout=!1,$(window).off(".lg"),$("body").removeClass("lg-on lg-from-hash"),t.$outer&&t.$outer.removeClass("lg-visible"),$(".lg-backdrop").removeClass("in"),setTimeout(function(){t.$outer&&t.$outer.remove(),$(".lg-backdrop").remove(),e||t.$el.trigger("onCloseAfter.lg")},t.s.backdropDuration+50)},$.fn.lightGallery=function(e){return this.each(function(){if($.data(this,"lightGallery"))try{$(this).data("lightGallery").init()}catch(s){console.error("lightGallery has not initiated properly")}else $.data(this,"lightGallery",new t(this,e))})},$.fn.lightGallery.modules={}}()});

!function(i){"use strict";"function"==typeof define&&define.amd?define(["jquery"],i):"undefined"!=typeof exports?module.exports=i(require("jquery")):i(jQuery)}(function(i){"use strict";var e=window.Slick||{};(e=function(){var e=0;return function(t,o){var s,n=this;n.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:i(t),appendDots:i(t),arrows:!0,asNavFor:null,prevArrow:'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',nextArrow:'<button class="slick-next" aria-label="Next" type="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(e,t){return i('<button type="button" />').text(t+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,focusOnChange:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},n.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,scrolling:!1,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,swiping:!1,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},i.extend(n,n.initials),n.activeBreakpoint=null,n.animType=null,n.animProp=null,n.breakpoints=[],n.breakpointSettings=[],n.cssTransitions=!1,n.focussed=!1,n.interrupted=!1,n.hidden="hidden",n.paused=!0,n.positionProp=null,n.respondTo=null,n.rowCount=1,n.shouldClick=!0,n.$slider=i(t),n.$slidesCache=null,n.transformType=null,n.transitionType=null,n.visibilityChange="visibilitychange",n.windowWidth=0,n.windowTimer=null,s=i(t).data("slick")||{},n.options=i.extend({},n.defaults,o,s),n.currentSlide=n.options.initialSlide,n.originalSettings=n.options,void 0!==document.mozHidden?(n.hidden="mozHidden",n.visibilityChange="mozvisibilitychange"):void 0!==document.webkitHidden&&(n.hidden="webkitHidden",n.visibilityChange="webkitvisibilitychange"),n.autoPlay=i.proxy(n.autoPlay,n),n.autoPlayClear=i.proxy(n.autoPlayClear,n),n.autoPlayIterator=i.proxy(n.autoPlayIterator,n),n.changeSlide=i.proxy(n.changeSlide,n),n.clickHandler=i.proxy(n.clickHandler,n),n.selectHandler=i.proxy(n.selectHandler,n),n.setPosition=i.proxy(n.setPosition,n),n.swipeHandler=i.proxy(n.swipeHandler,n),n.dragHandler=i.proxy(n.dragHandler,n),n.keyHandler=i.proxy(n.keyHandler,n),n.instanceUid=e++,n.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,n.registerBreakpoints(),n.init(!0)}}()).prototype.activateADA=function(){this.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},e.prototype.addSlide=e.prototype.slickAdd=function(e,t,o){var s=this;if("boolean"==typeof t)o=t,t=null;else if(t<0||t>=s.slideCount)return!1;s.unload(),"number"==typeof t?0===t&&0===s.$slides.length?i(e).appendTo(s.$slideTrack):o?i(e).insertBefore(s.$slides.eq(t)):i(e).insertAfter(s.$slides.eq(t)):!0===o?i(e).prependTo(s.$slideTrack):i(e).appendTo(s.$slideTrack),s.$slides=s.$slideTrack.children(this.options.slide),s.$slideTrack.children(this.options.slide).detach(),s.$slideTrack.append(s.$slides),s.$slides.each(function(e,t){i(t).attr("data-slick-index",e)}),s.$slidesCache=s.$slides,s.reinit()},e.prototype.animateHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.animate({height:e},i.options.speed)}},e.prototype.animateSlide=function(e,t){var o={},s=this;s.animateHeight(),!0===s.options.rtl&&!1===s.options.vertical&&(e=-e),!1===s.transformsEnabled?!1===s.options.vertical?s.$slideTrack.animate({left:e},s.options.speed,s.options.easing,t):s.$slideTrack.animate({top:e},s.options.speed,s.options.easing,t):!1===s.cssTransitions?(!0===s.options.rtl&&(s.currentLeft=-s.currentLeft),i({animStart:s.currentLeft}).animate({animStart:e},{duration:s.options.speed,easing:s.options.easing,step:function(i){i=Math.ceil(i),!1===s.options.vertical?(o[s.animType]="translate("+i+"px, 0px)",s.$slideTrack.css(o)):(o[s.animType]="translate(0px,"+i+"px)",s.$slideTrack.css(o))},complete:function(){t&&t.call()}})):(s.applyTransition(),e=Math.ceil(e),!1===s.options.vertical?o[s.animType]="translate3d("+e+"px, 0px, 0px)":o[s.animType]="translate3d(0px,"+e+"px, 0px)",s.$slideTrack.css(o),t&&setTimeout(function(){s.disableTransition(),t.call()},s.options.speed))},e.prototype.getNavTarget=function(){var e=this,t=e.options.asNavFor;return t&&null!==t&&(t=i(t).not(e.$slider)),t},e.prototype.asNavFor=function(e){var t=this.getNavTarget();null!==t&&"object"==typeof t&&t.each(function(){var t=i(this).slick("getSlick");t.unslicked||t.slideHandler(e,!0)})},e.prototype.applyTransition=function(i){var e=this,t={};!1===e.options.fade?t[e.transitionType]=e.transformType+" "+e.options.speed+"ms "+e.options.cssEase:t[e.transitionType]="opacity "+e.options.speed+"ms "+e.options.cssEase,!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.autoPlay=function(){var i=this;i.autoPlayClear(),i.slideCount>i.options.slidesToShow&&(i.autoPlayTimer=setInterval(i.autoPlayIterator,i.options.autoplaySpeed))},e.prototype.autoPlayClear=function(){var i=this;i.autoPlayTimer&&clearInterval(i.autoPlayTimer)},e.prototype.autoPlayIterator=function(){var i=this,e=i.currentSlide+i.options.slidesToScroll;i.paused||i.interrupted||i.focussed||(!1===i.options.infinite&&(1===i.direction&&i.currentSlide+1===i.slideCount-1?i.direction=0:0===i.direction&&(e=i.currentSlide-i.options.slidesToScroll,i.currentSlide-1==0&&(i.direction=1))),i.slideHandler(e))},e.prototype.buildArrows=function(){var e=this;!0===e.options.arrows&&(e.$prevArrow=i(e.options.prevArrow).addClass("slick-arrow"),e.$nextArrow=i(e.options.nextArrow).addClass("slick-arrow"),e.slideCount>e.options.slidesToShow?(e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.prependTo(e.options.appendArrows),e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.appendTo(e.options.appendArrows),!0!==e.options.infinite&&e.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},e.prototype.buildDots=function(){var e,t,o=this;if(!0===o.options.dots){for(o.$slider.addClass("slick-dotted"),t=i("<ul />").addClass(o.options.dotsClass),e=0;e<=o.getDotCount();e+=1)t.append(i("<li />").append(o.options.customPaging.call(this,o,e)));o.$dots=t.appendTo(o.options.appendDots),o.$dots.find("li").first().addClass("slick-active")}},e.prototype.buildOut=function(){var e=this;e.$slides=e.$slider.children(e.options.slide+":not(.slick-cloned)").addClass("slick-slide"),e.slideCount=e.$slides.length,e.$slides.each(function(e,t){i(t).attr("data-slick-index",e).data("originalStyling",i(t).attr("style")||"")}),e.$slider.addClass("slick-slider"),e.$slideTrack=0===e.slideCount?i('<div class="slick-track"/>').appendTo(e.$slider):e.$slides.wrapAll('<div class="slick-track"/>').parent(),e.$list=e.$slideTrack.wrap('<div class="slick-list"/>').parent(),e.$slideTrack.css("opacity",0),!0!==e.options.centerMode&&!0!==e.options.swipeToSlide||(e.options.slidesToScroll=1),i("img[data-lazy]",e.$slider).not("[src]").addClass("slick-loading"),e.setupInfinite(),e.buildArrows(),e.buildDots(),e.updateDots(),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),!0===e.options.draggable&&e.$list.addClass("draggable")},e.prototype.buildRows=function(){var i,e,t,o,s,n,r,l=this;if(o=document.createDocumentFragment(),n=l.$slider.children(),l.options.rows>1){for(r=l.options.slidesPerRow*l.options.rows,s=Math.ceil(n.length/r),i=0;i<s;i++){var d=document.createElement("div");for(e=0;e<l.options.rows;e++){var a=document.createElement("div");for(t=0;t<l.options.slidesPerRow;t++){var c=i*r+(e*l.options.slidesPerRow+t);n.get(c)&&a.appendChild(n.get(c))}d.appendChild(a)}o.appendChild(d)}l.$slider.empty().append(o),l.$slider.children().children().children().css({width:100/l.options.slidesPerRow+"%",display:"inline-block"})}},e.prototype.checkResponsive=function(e,t){var o,s,n,r=this,l=!1,d=r.$slider.width(),a=window.innerWidth||i(window).width();if("window"===r.respondTo?n=a:"slider"===r.respondTo?n=d:"min"===r.respondTo&&(n=Math.min(a,d)),r.options.responsive&&r.options.responsive.length&&null!==r.options.responsive){s=null;for(o in r.breakpoints)r.breakpoints.hasOwnProperty(o)&&(!1===r.originalSettings.mobileFirst?n<r.breakpoints[o]&&(s=r.breakpoints[o]):n>r.breakpoints[o]&&(s=r.breakpoints[o]));null!==s?null!==r.activeBreakpoint?(s!==r.activeBreakpoint||t)&&(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):null!==r.activeBreakpoint&&(r.activeBreakpoint=null,r.options=r.originalSettings,!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e),l=s),e||!1===l||r.$slider.trigger("breakpoint",[r,l])}},e.prototype.changeSlide=function(e,t){var o,s,n,r=this,l=i(e.currentTarget);switch(l.is("a")&&e.preventDefault(),l.is("li")||(l=l.closest("li")),n=r.slideCount%r.options.slidesToScroll!=0,o=n?0:(r.slideCount-r.currentSlide)%r.options.slidesToScroll,e.data.message){case"previous":s=0===o?r.options.slidesToScroll:r.options.slidesToShow-o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide-s,!1,t);break;case"next":s=0===o?r.options.slidesToScroll:o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide+s,!1,t);break;case"index":var d=0===e.data.index?0:e.data.index||l.index()*r.options.slidesToScroll;r.slideHandler(r.checkNavigable(d),!1,t),l.children().trigger("focus");break;default:return}},e.prototype.checkNavigable=function(i){var e,t;if(e=this.getNavigableIndexes(),t=0,i>e[e.length-1])i=e[e.length-1];else for(var o in e){if(i<e[o]){i=t;break}t=e[o]}return i},e.prototype.cleanUpEvents=function(){var e=this;e.options.dots&&null!==e.$dots&&(i("li",e.$dots).off("click.slick",e.changeSlide).off("mouseenter.slick",i.proxy(e.interrupt,e,!0)).off("mouseleave.slick",i.proxy(e.interrupt,e,!1)),!0===e.options.accessibility&&e.$dots.off("keydown.slick",e.keyHandler)),e.$slider.off("focus.slick blur.slick"),!0===e.options.arrows&&e.slideCount>e.options.slidesToShow&&(e.$prevArrow&&e.$prevArrow.off("click.slick",e.changeSlide),e.$nextArrow&&e.$nextArrow.off("click.slick",e.changeSlide),!0===e.options.accessibility&&(e.$prevArrow&&e.$prevArrow.off("keydown.slick",e.keyHandler),e.$nextArrow&&e.$nextArrow.off("keydown.slick",e.keyHandler))),e.$list.off("touchstart.slick mousedown.slick",e.swipeHandler),e.$list.off("touchmove.slick mousemove.slick",e.swipeHandler),e.$list.off("touchend.slick mouseup.slick",e.swipeHandler),e.$list.off("touchcancel.slick mouseleave.slick",e.swipeHandler),e.$list.off("click.slick",e.clickHandler),i(document).off(e.visibilityChange,e.visibility),e.cleanUpSlideEvents(),!0===e.options.accessibility&&e.$list.off("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().off("click.slick",e.selectHandler),i(window).off("orientationchange.slick.slick-"+e.instanceUid,e.orientationChange),i(window).off("resize.slick.slick-"+e.instanceUid,e.resize),i("[draggable!=true]",e.$slideTrack).off("dragstart",e.preventDefault),i(window).off("load.slick.slick-"+e.instanceUid,e.setPosition)},e.prototype.cleanUpSlideEvents=function(){var e=this;e.$list.off("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.off("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.cleanUpRows=function(){var i,e=this;e.options.rows>1&&((i=e.$slides.children().children()).removeAttr("style"),e.$slider.empty().append(i))},e.prototype.clickHandler=function(i){!1===this.shouldClick&&(i.stopImmediatePropagation(),i.stopPropagation(),i.preventDefault())},e.prototype.destroy=function(e){var t=this;t.autoPlayClear(),t.touchObject={},t.cleanUpEvents(),i(".slick-cloned",t.$slider).detach(),t.$dots&&t.$dots.remove(),t.$prevArrow&&t.$prevArrow.length&&(t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.prevArrow)&&t.$prevArrow.remove()),t.$nextArrow&&t.$nextArrow.length&&(t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.nextArrow)&&t.$nextArrow.remove()),t.$slides&&(t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){i(this).attr("style",i(this).data("originalStyling"))}),t.$slideTrack.children(this.options.slide).detach(),t.$slideTrack.detach(),t.$list.detach(),t.$slider.append(t.$slides)),t.cleanUpRows(),t.$slider.removeClass("slick-slider"),t.$slider.removeClass("slick-initialized"),t.$slider.removeClass("slick-dotted"),t.unslicked=!0,e||t.$slider.trigger("destroy",[t])},e.prototype.disableTransition=function(i){var e=this,t={};t[e.transitionType]="",!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.fadeSlide=function(i,e){var t=this;!1===t.cssTransitions?(t.$slides.eq(i).css({zIndex:t.options.zIndex}),t.$slides.eq(i).animate({opacity:1},t.options.speed,t.options.easing,e)):(t.applyTransition(i),t.$slides.eq(i).css({opacity:1,zIndex:t.options.zIndex}),e&&setTimeout(function(){t.disableTransition(i),e.call()},t.options.speed))},e.prototype.fadeSlideOut=function(i){var e=this;!1===e.cssTransitions?e.$slides.eq(i).animate({opacity:0,zIndex:e.options.zIndex-2},e.options.speed,e.options.easing):(e.applyTransition(i),e.$slides.eq(i).css({opacity:0,zIndex:e.options.zIndex-2}))},e.prototype.filterSlides=e.prototype.slickFilter=function(i){var e=this;null!==i&&(e.$slidesCache=e.$slides,e.unload(),e.$slideTrack.children(this.options.slide).detach(),e.$slidesCache.filter(i).appendTo(e.$slideTrack),e.reinit())},e.prototype.focusHandler=function(){var e=this;e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick","*",function(t){t.stopImmediatePropagation();var o=i(this);setTimeout(function(){e.options.pauseOnFocus&&(e.focussed=o.is(":focus"),e.autoPlay())},0)})},e.prototype.getCurrent=e.prototype.slickCurrentSlide=function(){return this.currentSlide},e.prototype.getDotCount=function(){var i=this,e=0,t=0,o=0;if(!0===i.options.infinite)if(i.slideCount<=i.options.slidesToShow)++o;else for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else if(!0===i.options.centerMode)o=i.slideCount;else if(i.options.asNavFor)for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else o=1+Math.ceil((i.slideCount-i.options.slidesToShow)/i.options.slidesToScroll);return o-1},e.prototype.getLeft=function(i){var e,t,o,s,n=this,r=0;return n.slideOffset=0,t=n.$slides.first().outerHeight(!0),!0===n.options.infinite?(n.slideCount>n.options.slidesToShow&&(n.slideOffset=n.slideWidth*n.options.slidesToShow*-1,s=-1,!0===n.options.vertical&&!0===n.options.centerMode&&(2===n.options.slidesToShow?s=-1.5:1===n.options.slidesToShow&&(s=-2)),r=t*n.options.slidesToShow*s),n.slideCount%n.options.slidesToScroll!=0&&i+n.options.slidesToScroll>n.slideCount&&n.slideCount>n.options.slidesToShow&&(i>n.slideCount?(n.slideOffset=(n.options.slidesToShow-(i-n.slideCount))*n.slideWidth*-1,r=(n.options.slidesToShow-(i-n.slideCount))*t*-1):(n.slideOffset=n.slideCount%n.options.slidesToScroll*n.slideWidth*-1,r=n.slideCount%n.options.slidesToScroll*t*-1))):i+n.options.slidesToShow>n.slideCount&&(n.slideOffset=(i+n.options.slidesToShow-n.slideCount)*n.slideWidth,r=(i+n.options.slidesToShow-n.slideCount)*t),n.slideCount<=n.options.slidesToShow&&(n.slideOffset=0,r=0),!0===n.options.centerMode&&n.slideCount<=n.options.slidesToShow?n.slideOffset=n.slideWidth*Math.floor(n.options.slidesToShow)/2-n.slideWidth*n.slideCount/2:!0===n.options.centerMode&&!0===n.options.infinite?n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)-n.slideWidth:!0===n.options.centerMode&&(n.slideOffset=0,n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)),e=!1===n.options.vertical?i*n.slideWidth*-1+n.slideOffset:i*t*-1+r,!0===n.options.variableWidth&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,!0===n.options.centerMode&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow+1),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,e+=(n.$list.width()-o.outerWidth())/2)),e},e.prototype.getOption=e.prototype.slickGetOption=function(i){return this.options[i]},e.prototype.getNavigableIndexes=function(){var i,e=this,t=0,o=0,s=[];for(!1===e.options.infinite?i=e.slideCount:(t=-1*e.options.slidesToScroll,o=-1*e.options.slidesToScroll,i=2*e.slideCount);t<i;)s.push(t),t=o+e.options.slidesToScroll,o+=e.options.slidesToScroll<=e.options.slidesToShow?e.options.slidesToScroll:e.options.slidesToShow;return s},e.prototype.getSlick=function(){return this},e.prototype.getSlideCount=function(){var e,t,o=this;return t=!0===o.options.centerMode?o.slideWidth*Math.floor(o.options.slidesToShow/2):0,!0===o.options.swipeToSlide?(o.$slideTrack.find(".slick-slide").each(function(s,n){if(n.offsetLeft-t+i(n).outerWidth()/2>-1*o.swipeLeft)return e=n,!1}),Math.abs(i(e).attr("data-slick-index")-o.currentSlide)||1):o.options.slidesToScroll},e.prototype.goTo=e.prototype.slickGoTo=function(i,e){this.changeSlide({data:{message:"index",index:parseInt(i)}},e)},e.prototype.init=function(e){var t=this;i(t.$slider).hasClass("slick-initialized")||(i(t.$slider).addClass("slick-initialized"),t.buildRows(),t.buildOut(),t.setProps(),t.startLoad(),t.loadSlider(),t.initializeEvents(),t.updateArrows(),t.updateDots(),t.checkResponsive(!0),t.focusHandler()),e&&t.$slider.trigger("init",[t]),!0===t.options.accessibility&&t.initADA(),t.options.autoplay&&(t.paused=!1,t.autoPlay())},e.prototype.initADA=function(){var e=this,t=Math.ceil(e.slideCount/e.options.slidesToShow),o=e.getNavigableIndexes().filter(function(i){return i>=0&&i<e.slideCount});e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),null!==e.$dots&&(e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(t){var s=o.indexOf(t);i(this).attr({role:"tabpanel",id:"slick-slide"+e.instanceUid+t,tabindex:-1}),-1!==s&&i(this).attr({"aria-describedby":"slick-slide-control"+e.instanceUid+s})}),e.$dots.attr("role","tablist").find("li").each(function(s){var n=o[s];i(this).attr({role:"presentation"}),i(this).find("button").first().attr({role:"tab",id:"slick-slide-control"+e.instanceUid+s,"aria-controls":"slick-slide"+e.instanceUid+n,"aria-label":s+1+" of "+t,"aria-selected":null,tabindex:"-1"})}).eq(e.currentSlide).find("button").attr({"aria-selected":"true",tabindex:"0"}).end());for(var s=e.currentSlide,n=s+e.options.slidesToShow;s<n;s++)e.$slides.eq(s).attr("tabindex",0);e.activateADA()},e.prototype.initArrowEvents=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},i.changeSlide),i.$nextArrow.off("click.slick").on("click.slick",{message:"next"},i.changeSlide),!0===i.options.accessibility&&(i.$prevArrow.on("keydown.slick",i.keyHandler),i.$nextArrow.on("keydown.slick",i.keyHandler)))},e.prototype.initDotEvents=function(){var e=this;!0===e.options.dots&&(i("li",e.$dots).on("click.slick",{message:"index"},e.changeSlide),!0===e.options.accessibility&&e.$dots.on("keydown.slick",e.keyHandler)),!0===e.options.dots&&!0===e.options.pauseOnDotsHover&&i("li",e.$dots).on("mouseenter.slick",i.proxy(e.interrupt,e,!0)).on("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.initSlideEvents=function(){var e=this;e.options.pauseOnHover&&(e.$list.on("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.on("mouseleave.slick",i.proxy(e.interrupt,e,!1)))},e.prototype.initializeEvents=function(){var e=this;e.initArrowEvents(),e.initDotEvents(),e.initSlideEvents(),e.$list.on("touchstart.slick mousedown.slick",{action:"start"},e.swipeHandler),e.$list.on("touchmove.slick mousemove.slick",{action:"move"},e.swipeHandler),e.$list.on("touchend.slick mouseup.slick",{action:"end"},e.swipeHandler),e.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},e.swipeHandler),e.$list.on("click.slick",e.clickHandler),i(document).on(e.visibilityChange,i.proxy(e.visibility,e)),!0===e.options.accessibility&&e.$list.on("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),i(window).on("orientationchange.slick.slick-"+e.instanceUid,i.proxy(e.orientationChange,e)),i(window).on("resize.slick.slick-"+e.instanceUid,i.proxy(e.resize,e)),i("[draggable!=true]",e.$slideTrack).on("dragstart",e.preventDefault),i(window).on("load.slick.slick-"+e.instanceUid,e.setPosition),i(e.setPosition)},e.prototype.initUI=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.show(),i.$nextArrow.show()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.show()},e.prototype.keyHandler=function(i){var e=this;i.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===i.keyCode&&!0===e.options.accessibility?e.changeSlide({data:{message:!0===e.options.rtl?"next":"previous"}}):39===i.keyCode&&!0===e.options.accessibility&&e.changeSlide({data:{message:!0===e.options.rtl?"previous":"next"}}))},e.prototype.lazyLoad=function(){function e(e){i("img[data-lazy]",e).each(function(){var e=i(this),t=i(this).attr("data-lazy"),o=i(this).attr("data-srcset"),s=i(this).attr("data-sizes")||n.$slider.attr("data-sizes"),r=document.createElement("img");r.onload=function(){e.animate({opacity:0},100,function(){o&&(e.attr("srcset",o),s&&e.attr("sizes",s)),e.attr("src",t).animate({opacity:1},200,function(){e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")}),n.$slider.trigger("lazyLoaded",[n,e,t])})},r.onerror=function(){e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),n.$slider.trigger("lazyLoadError",[n,e,t])},r.src=t})}var t,o,s,n=this;if(!0===n.options.centerMode?!0===n.options.infinite?s=(o=n.currentSlide+(n.options.slidesToShow/2+1))+n.options.slidesToShow+2:(o=Math.max(0,n.currentSlide-(n.options.slidesToShow/2+1)),s=n.options.slidesToShow/2+1+2+n.currentSlide):(o=n.options.infinite?n.options.slidesToShow+n.currentSlide:n.currentSlide,s=Math.ceil(o+n.options.slidesToShow),!0===n.options.fade&&(o>0&&o--,s<=n.slideCount&&s++)),t=n.$slider.find(".slick-slide").slice(o,s),"anticipated"===n.options.lazyLoad)for(var r=o-1,l=s,d=n.$slider.find(".slick-slide"),a=0;a<n.options.slidesToScroll;a++)r<0&&(r=n.slideCount-1),t=(t=t.add(d.eq(r))).add(d.eq(l)),r--,l++;e(t),n.slideCount<=n.options.slidesToShow?e(n.$slider.find(".slick-slide")):n.currentSlide>=n.slideCount-n.options.slidesToShow?e(n.$slider.find(".slick-cloned").slice(0,n.options.slidesToShow)):0===n.currentSlide&&e(n.$slider.find(".slick-cloned").slice(-1*n.options.slidesToShow))},e.prototype.loadSlider=function(){var i=this;i.setPosition(),i.$slideTrack.css({opacity:1}),i.$slider.removeClass("slick-loading"),i.initUI(),"progressive"===i.options.lazyLoad&&i.progressiveLazyLoad()},e.prototype.next=e.prototype.slickNext=function(){this.changeSlide({data:{message:"next"}})},e.prototype.orientationChange=function(){var i=this;i.checkResponsive(),i.setPosition()},e.prototype.pause=e.prototype.slickPause=function(){var i=this;i.autoPlayClear(),i.paused=!0},e.prototype.play=e.prototype.slickPlay=function(){var i=this;i.autoPlay(),i.options.autoplay=!0,i.paused=!1,i.focussed=!1,i.interrupted=!1},e.prototype.postSlide=function(e){var t=this;t.unslicked||(t.$slider.trigger("afterChange",[t,e]),t.animating=!1,t.slideCount>t.options.slidesToShow&&t.setPosition(),t.swipeLeft=null,t.options.autoplay&&t.autoPlay(),!0===t.options.accessibility&&(t.initADA(),t.options.focusOnChange&&i(t.$slides.get(t.currentSlide)).attr("tabindex",0).focus()))},e.prototype.prev=e.prototype.slickPrev=function(){this.changeSlide({data:{message:"previous"}})},e.prototype.preventDefault=function(i){i.preventDefault()},e.prototype.progressiveLazyLoad=function(e){e=e||1;var t,o,s,n,r,l=this,d=i("img[data-lazy]",l.$slider);d.length?(t=d.first(),o=t.attr("data-lazy"),s=t.attr("data-srcset"),n=t.attr("data-sizes")||l.$slider.attr("data-sizes"),(r=document.createElement("img")).onload=function(){s&&(t.attr("srcset",s),n&&t.attr("sizes",n)),t.attr("src",o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),!0===l.options.adaptiveHeight&&l.setPosition(),l.$slider.trigger("lazyLoaded",[l,t,o]),l.progressiveLazyLoad()},r.onerror=function(){e<3?setTimeout(function(){l.progressiveLazyLoad(e+1)},500):(t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),l.$slider.trigger("lazyLoadError",[l,t,o]),l.progressiveLazyLoad())},r.src=o):l.$slider.trigger("allImagesLoaded",[l])},e.prototype.refresh=function(e){var t,o,s=this;o=s.slideCount-s.options.slidesToShow,!s.options.infinite&&s.currentSlide>o&&(s.currentSlide=o),s.slideCount<=s.options.slidesToShow&&(s.currentSlide=0),t=s.currentSlide,s.destroy(!0),i.extend(s,s.initials,{currentSlide:t}),s.init(),e||s.changeSlide({data:{message:"index",index:t}},!1)},e.prototype.registerBreakpoints=function(){var e,t,o,s=this,n=s.options.responsive||null;if("array"===i.type(n)&&n.length){s.respondTo=s.options.respondTo||"window";for(e in n)if(o=s.breakpoints.length-1,n.hasOwnProperty(e)){for(t=n[e].breakpoint;o>=0;)s.breakpoints[o]&&s.breakpoints[o]===t&&s.breakpoints.splice(o,1),o--;s.breakpoints.push(t),s.breakpointSettings[t]=n[e].settings}s.breakpoints.sort(function(i,e){return s.options.mobileFirst?i-e:e-i})}},e.prototype.reinit=function(){var e=this;e.$slides=e.$slideTrack.children(e.options.slide).addClass("slick-slide"),e.slideCount=e.$slides.length,e.currentSlide>=e.slideCount&&0!==e.currentSlide&&(e.currentSlide=e.currentSlide-e.options.slidesToScroll),e.slideCount<=e.options.slidesToShow&&(e.currentSlide=0),e.registerBreakpoints(),e.setProps(),e.setupInfinite(),e.buildArrows(),e.updateArrows(),e.initArrowEvents(),e.buildDots(),e.updateDots(),e.initDotEvents(),e.cleanUpSlideEvents(),e.initSlideEvents(),e.checkResponsive(!1,!0),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),e.setPosition(),e.focusHandler(),e.paused=!e.options.autoplay,e.autoPlay(),e.$slider.trigger("reInit",[e])},e.prototype.resize=function(){var e=this;i(window).width()!==e.windowWidth&&(clearTimeout(e.windowDelay),e.windowDelay=window.setTimeout(function(){e.windowWidth=i(window).width(),e.checkResponsive(),e.unslicked||e.setPosition()},50))},e.prototype.removeSlide=e.prototype.slickRemove=function(i,e,t){var o=this;if(i="boolean"==typeof i?!0===(e=i)?0:o.slideCount-1:!0===e?--i:i,o.slideCount<1||i<0||i>o.slideCount-1)return!1;o.unload(),!0===t?o.$slideTrack.children().remove():o.$slideTrack.children(this.options.slide).eq(i).remove(),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slidesCache=o.$slides,o.reinit()},e.prototype.setCSS=function(i){var e,t,o=this,s={};!0===o.options.rtl&&(i=-i),e="left"==o.positionProp?Math.ceil(i)+"px":"0px",t="top"==o.positionProp?Math.ceil(i)+"px":"0px",s[o.positionProp]=i,!1===o.transformsEnabled?o.$slideTrack.css(s):(s={},!1===o.cssTransitions?(s[o.animType]="translate("+e+", "+t+")",o.$slideTrack.css(s)):(s[o.animType]="translate3d("+e+", "+t+", 0px)",o.$slideTrack.css(s)))},e.prototype.setDimensions=function(){var i=this;!1===i.options.vertical?!0===i.options.centerMode&&i.$list.css({padding:"0px "+i.options.centerPadding}):(i.$list.height(i.$slides.first().outerHeight(!0)*i.options.slidesToShow),!0===i.options.centerMode&&i.$list.css({padding:i.options.centerPadding+" 0px"})),i.listWidth=i.$list.width(),i.listHeight=i.$list.height(),!1===i.options.vertical&&!1===i.options.variableWidth?(i.slideWidth=Math.ceil(i.listWidth/i.options.slidesToShow),i.$slideTrack.width(Math.ceil(i.slideWidth*i.$slideTrack.children(".slick-slide").length))):!0===i.options.variableWidth?i.$slideTrack.width(5e3*i.slideCount):(i.slideWidth=Math.ceil(i.listWidth),i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0)*i.$slideTrack.children(".slick-slide").length)));var e=i.$slides.first().outerWidth(!0)-i.$slides.first().width();!1===i.options.variableWidth&&i.$slideTrack.children(".slick-slide").width(i.slideWidth-e)},e.prototype.setFade=function(){var e,t=this;t.$slides.each(function(o,s){e=t.slideWidth*o*-1,!0===t.options.rtl?i(s).css({position:"relative",right:e,top:0,zIndex:t.options.zIndex-2,opacity:0}):i(s).css({position:"relative",left:e,top:0,zIndex:t.options.zIndex-2,opacity:0})}),t.$slides.eq(t.currentSlide).css({zIndex:t.options.zIndex-1,opacity:1})},e.prototype.setHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.css("height",e)}},e.prototype.setOption=e.prototype.slickSetOption=function(){var e,t,o,s,n,r=this,l=!1;if("object"===i.type(arguments[0])?(o=arguments[0],l=arguments[1],n="multiple"):"string"===i.type(arguments[0])&&(o=arguments[0],s=arguments[1],l=arguments[2],"responsive"===arguments[0]&&"array"===i.type(arguments[1])?n="responsive":void 0!==arguments[1]&&(n="single")),"single"===n)r.options[o]=s;else if("multiple"===n)i.each(o,function(i,e){r.options[i]=e});else if("responsive"===n)for(t in s)if("array"!==i.type(r.options.responsive))r.options.responsive=[s[t]];else{for(e=r.options.responsive.length-1;e>=0;)r.options.responsive[e].breakpoint===s[t].breakpoint&&r.options.responsive.splice(e,1),e--;r.options.responsive.push(s[t])}l&&(r.unload(),r.reinit())},e.prototype.setPosition=function(){var i=this;i.setDimensions(),i.setHeight(),!1===i.options.fade?i.setCSS(i.getLeft(i.currentSlide)):i.setFade(),i.$slider.trigger("setPosition",[i])},e.prototype.setProps=function(){var i=this,e=document.body.style;i.positionProp=!0===i.options.vertical?"top":"left","top"===i.positionProp?i.$slider.addClass("slick-vertical"):i.$slider.removeClass("slick-vertical"),void 0===e.WebkitTransition&&void 0===e.MozTransition&&void 0===e.msTransition||!0===i.options.useCSS&&(i.cssTransitions=!0),i.options.fade&&("number"==typeof i.options.zIndex?i.options.zIndex<3&&(i.options.zIndex=3):i.options.zIndex=i.defaults.zIndex),void 0!==e.OTransform&&(i.animType="OTransform",i.transformType="-o-transform",i.transitionType="OTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.MozTransform&&(i.animType="MozTransform",i.transformType="-moz-transform",i.transitionType="MozTransition",void 0===e.perspectiveProperty&&void 0===e.MozPerspective&&(i.animType=!1)),void 0!==e.webkitTransform&&(i.animType="webkitTransform",i.transformType="-webkit-transform",i.transitionType="webkitTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.msTransform&&(i.animType="msTransform",i.transformType="-ms-transform",i.transitionType="msTransition",void 0===e.msTransform&&(i.animType=!1)),void 0!==e.transform&&!1!==i.animType&&(i.animType="transform",i.transformType="transform",i.transitionType="transition"),i.transformsEnabled=i.options.useTransform&&null!==i.animType&&!1!==i.animType},e.prototype.setSlideClasses=function(i){var e,t,o,s,n=this;if(t=n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),n.$slides.eq(i).addClass("slick-current"),!0===n.options.centerMode){var r=n.options.slidesToShow%2==0?1:0;e=Math.floor(n.options.slidesToShow/2),!0===n.options.infinite&&(i>=e&&i<=n.slideCount-1-e?n.$slides.slice(i-e+r,i+e+1).addClass("slick-active").attr("aria-hidden","false"):(o=n.options.slidesToShow+i,t.slice(o-e+1+r,o+e+2).addClass("slick-active").attr("aria-hidden","false")),0===i?t.eq(t.length-1-n.options.slidesToShow).addClass("slick-center"):i===n.slideCount-1&&t.eq(n.options.slidesToShow).addClass("slick-center")),n.$slides.eq(i).addClass("slick-center")}else i>=0&&i<=n.slideCount-n.options.slidesToShow?n.$slides.slice(i,i+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):t.length<=n.options.slidesToShow?t.addClass("slick-active").attr("aria-hidden","false"):(s=n.slideCount%n.options.slidesToShow,o=!0===n.options.infinite?n.options.slidesToShow+i:i,n.options.slidesToShow==n.options.slidesToScroll&&n.slideCount-i<n.options.slidesToShow?t.slice(o-(n.options.slidesToShow-s),o+s).addClass("slick-active").attr("aria-hidden","false"):t.slice(o,o+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"));"ondemand"!==n.options.lazyLoad&&"anticipated"!==n.options.lazyLoad||n.lazyLoad()},e.prototype.setupInfinite=function(){var e,t,o,s=this;if(!0===s.options.fade&&(s.options.centerMode=!1),!0===s.options.infinite&&!1===s.options.fade&&(t=null,s.slideCount>s.options.slidesToShow)){for(o=!0===s.options.centerMode?s.options.slidesToShow+1:s.options.slidesToShow,e=s.slideCount;e>s.slideCount-o;e-=1)t=e-1,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t-s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");for(e=0;e<o+s.slideCount;e+=1)t=e,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t+s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");s.$slideTrack.find(".slick-cloned").find("[id]").each(function(){i(this).attr("id","")})}},e.prototype.interrupt=function(i){var e=this;i||e.autoPlay(),e.interrupted=i},e.prototype.selectHandler=function(e){var t=this,o=i(e.target).is(".slick-slide")?i(e.target):i(e.target).parents(".slick-slide"),s=parseInt(o.attr("data-slick-index"));s||(s=0),t.slideCount<=t.options.slidesToShow?t.slideHandler(s,!1,!0):t.slideHandler(s)},e.prototype.slideHandler=function(i,e,t){var o,s,n,r,l,d=null,a=this;if(e=e||!1,!(!0===a.animating&&!0===a.options.waitForAnimate||!0===a.options.fade&&a.currentSlide===i))if(!1===e&&a.asNavFor(i),o=i,d=a.getLeft(o),r=a.getLeft(a.currentSlide),a.currentLeft=null===a.swipeLeft?r:a.swipeLeft,!1===a.options.infinite&&!1===a.options.centerMode&&(i<0||i>a.getDotCount()*a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else if(!1===a.options.infinite&&!0===a.options.centerMode&&(i<0||i>a.slideCount-a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else{if(a.options.autoplay&&clearInterval(a.autoPlayTimer),s=o<0?a.slideCount%a.options.slidesToScroll!=0?a.slideCount-a.slideCount%a.options.slidesToScroll:a.slideCount+o:o>=a.slideCount?a.slideCount%a.options.slidesToScroll!=0?0:o-a.slideCount:o,a.animating=!0,a.$slider.trigger("beforeChange",[a,a.currentSlide,s]),n=a.currentSlide,a.currentSlide=s,a.setSlideClasses(a.currentSlide),a.options.asNavFor&&(l=(l=a.getNavTarget()).slick("getSlick")).slideCount<=l.options.slidesToShow&&l.setSlideClasses(a.currentSlide),a.updateDots(),a.updateArrows(),!0===a.options.fade)return!0!==t?(a.fadeSlideOut(n),a.fadeSlide(s,function(){a.postSlide(s)})):a.postSlide(s),void a.animateHeight();!0!==t?a.animateSlide(d,function(){a.postSlide(s)}):a.postSlide(s)}},e.prototype.startLoad=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.hide(),i.$nextArrow.hide()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.hide(),i.$slider.addClass("slick-loading")},e.prototype.swipeDirection=function(){var i,e,t,o,s=this;return i=s.touchObject.startX-s.touchObject.curX,e=s.touchObject.startY-s.touchObject.curY,t=Math.atan2(e,i),(o=Math.round(180*t/Math.PI))<0&&(o=360-Math.abs(o)),o<=45&&o>=0?!1===s.options.rtl?"left":"right":o<=360&&o>=315?!1===s.options.rtl?"left":"right":o>=135&&o<=225?!1===s.options.rtl?"right":"left":!0===s.options.verticalSwiping?o>=35&&o<=135?"down":"up":"vertical"},e.prototype.swipeEnd=function(i){var e,t,o=this;if(o.dragging=!1,o.swiping=!1,o.scrolling)return o.scrolling=!1,!1;if(o.interrupted=!1,o.shouldClick=!(o.touchObject.swipeLength>10),void 0===o.touchObject.curX)return!1;if(!0===o.touchObject.edgeHit&&o.$slider.trigger("edge",[o,o.swipeDirection()]),o.touchObject.swipeLength>=o.touchObject.minSwipe){switch(t=o.swipeDirection()){case"left":case"down":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide+o.getSlideCount()):o.currentSlide+o.getSlideCount(),o.currentDirection=0;break;case"right":case"up":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide-o.getSlideCount()):o.currentSlide-o.getSlideCount(),o.currentDirection=1}"vertical"!=t&&(o.slideHandler(e),o.touchObject={},o.$slider.trigger("swipe",[o,t]))}else o.touchObject.startX!==o.touchObject.curX&&(o.slideHandler(o.currentSlide),o.touchObject={})},e.prototype.swipeHandler=function(i){var e=this;if(!(!1===e.options.swipe||"ontouchend"in document&&!1===e.options.swipe||!1===e.options.draggable&&-1!==i.type.indexOf("mouse")))switch(e.touchObject.fingerCount=i.originalEvent&&void 0!==i.originalEvent.touches?i.originalEvent.touches.length:1,e.touchObject.minSwipe=e.listWidth/e.options.touchThreshold,!0===e.options.verticalSwiping&&(e.touchObject.minSwipe=e.listHeight/e.options.touchThreshold),i.data.action){case"start":e.swipeStart(i);break;case"move":e.swipeMove(i);break;case"end":e.swipeEnd(i)}},e.prototype.swipeMove=function(i){var e,t,o,s,n,r,l=this;return n=void 0!==i.originalEvent?i.originalEvent.touches:null,!(!l.dragging||l.scrolling||n&&1!==n.length)&&(e=l.getLeft(l.currentSlide),l.touchObject.curX=void 0!==n?n[0].pageX:i.clientX,l.touchObject.curY=void 0!==n?n[0].pageY:i.clientY,l.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(l.touchObject.curX-l.touchObject.startX,2))),r=Math.round(Math.sqrt(Math.pow(l.touchObject.curY-l.touchObject.startY,2))),!l.options.verticalSwiping&&!l.swiping&&r>4?(l.scrolling=!0,!1):(!0===l.options.verticalSwiping&&(l.touchObject.swipeLength=r),t=l.swipeDirection(),void 0!==i.originalEvent&&l.touchObject.swipeLength>4&&(l.swiping=!0,i.preventDefault()),s=(!1===l.options.rtl?1:-1)*(l.touchObject.curX>l.touchObject.startX?1:-1),!0===l.options.verticalSwiping&&(s=l.touchObject.curY>l.touchObject.startY?1:-1),o=l.touchObject.swipeLength,l.touchObject.edgeHit=!1,!1===l.options.infinite&&(0===l.currentSlide&&"right"===t||l.currentSlide>=l.getDotCount()&&"left"===t)&&(o=l.touchObject.swipeLength*l.options.edgeFriction,l.touchObject.edgeHit=!0),!1===l.options.vertical?l.swipeLeft=e+o*s:l.swipeLeft=e+o*(l.$list.height()/l.listWidth)*s,!0===l.options.verticalSwiping&&(l.swipeLeft=e+o*s),!0!==l.options.fade&&!1!==l.options.touchMove&&(!0===l.animating?(l.swipeLeft=null,!1):void l.setCSS(l.swipeLeft))))},e.prototype.swipeStart=function(i){var e,t=this;if(t.interrupted=!0,1!==t.touchObject.fingerCount||t.slideCount<=t.options.slidesToShow)return t.touchObject={},!1;void 0!==i.originalEvent&&void 0!==i.originalEvent.touches&&(e=i.originalEvent.touches[0]),t.touchObject.startX=t.touchObject.curX=void 0!==e?e.pageX:i.clientX,t.touchObject.startY=t.touchObject.curY=void 0!==e?e.pageY:i.clientY,t.dragging=!0},e.prototype.unfilterSlides=e.prototype.slickUnfilter=function(){var i=this;null!==i.$slidesCache&&(i.unload(),i.$slideTrack.children(this.options.slide).detach(),i.$slidesCache.appendTo(i.$slideTrack),i.reinit())},e.prototype.unload=function(){var e=this;i(".slick-cloned",e.$slider).remove(),e.$dots&&e.$dots.remove(),e.$prevArrow&&e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.remove(),e.$nextArrow&&e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.remove(),e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},e.prototype.unslick=function(i){var e=this;e.$slider.trigger("unslick",[e,i]),e.destroy()},e.prototype.updateArrows=function(){var i=this;Math.floor(i.options.slidesToShow/2),!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&!i.options.infinite&&(i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===i.currentSlide?(i.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-i.options.slidesToShow&&!1===i.options.centerMode?(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-1&&!0===i.options.centerMode&&(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},e.prototype.updateDots=function(){var i=this;null!==i.$dots&&(i.$dots.find("li").removeClass("slick-active").end(),i.$dots.find("li").eq(Math.floor(i.currentSlide/i.options.slidesToScroll)).addClass("slick-active"))},e.prototype.visibility=function(){var i=this;i.options.autoplay&&(document[i.hidden]?i.interrupted=!0:i.interrupted=!1)},i.fn.slick=function(){var i,t,o=this,s=arguments[0],n=Array.prototype.slice.call(arguments,1),r=o.length;for(i=0;i<r;i++)if("object"==typeof s||void 0===s?o[i].slick=new e(o[i],s):t=o[i].slick[s].apply(o[i].slick,n),void 0!==t)return t;return o}});