var currentSlide = -1;
var stepThroughBullets = true;
var autoPlaySlides = false;
var autoPlayMedia = true;
var autoNextOnMediaEnd = true;
var slideDuration = 1000;
var bulletDuration = 500;
var loop = true;
var timer, avTotal, avCount;

$(function(){
	avTotal = $('audio,video').length;
	avCount = 0;
	$('audio,video').mediaelementplayer({pluginPath:'media/', features:[], enableKeyboard:false, iPadUseNativeControls:true, iPhoneUseNativeControls:true, AndroidUseNativeControls:false, success: function (mediaElement, domObject) {
			mediaElement.addEventListener('ended', function(m) { if(autoNextOnMediaEnd) next();});
			avCount++;
			if(avCount == avTotal) initSlides();
			
		}
	});
	
	$(document).keyup(function(e) {
		 if(e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 32) next();
		 else if(e.keyCode == 37 || e.keyCode == 38) back();
	});
	
	$('.slides, video, .mejs-overlay').swipe({
		allowPageScroll:'vertical',
		swipe:function(event, direction, distance, duration, fingerCount) {
			switch(direction) {
				case "left":
					next();
					break;
				case "right":
					back();
					break;	
			}
		}
	});
	
	$(document).dblclick(function(){
			window.fullScreenApi.requestFullScreen(document.body);
	});
	if(avTotal == 0) initSlides(); 
});

function initSlides(){
	goto(0);
}

function next(){
	if(stepThroughBullets && $('section.active li:hidden').length) {
		$('section.active li:hidden').first().fadeIn();
		if(autoPlaySlides) autoNext();
		return;
	}
	goto(currentSlide+1);
}

function back(){
	goto(currentSlide-1);
	if(stepThroughBullets) $('section.active li').show();
}

function goto(n){
	if(autoPlaySlides) clearTimeout(timer);
	stopPageMedia();
	var forward = n > currentSlide;
	if(loop) {
		if(n < 0) currentSlide = $('section').length - 1;
		else if(n > $('section').length - 1) currentSlide = 0;
		else currentSlide = n;
	} else {
		if(n > -1 && n < $('section').length) currentSlide = n;
		else return;
	}
	$('section').removeClass('active').eq(currentSlide).addClass('active');
	if(stepThroughBullets) $('section.active li').hide();
	if(autoPlaySlides && forward && !$('section.active').find('audio,video').length) autoNext();
	if(autoPlayMedia) playMedia();
}

function playMedia(){
	var mediaElem = $('section.active').find('audio,video');
	if(mediaElem.length) {
		mediaElem = mediaElem[0];
		try { mediaElem.player.play(); } catch(e){}
	}
}

function stopPageMedia() {
	$('section.active').find('audio,video').each(function() {
		var media = $(this)[0];
		var player = media.player;
		try{player.pause(); media.currentTime = 0;}catch(e){}
	})
}

function autoNext() {
	var duration = (stepThroughBullets && $('section.active li').length) ? bulletDuration : slideDuration;
	timer = setTimeout(function(){next();}, duration);
}

/*
Source: http://johndyer.name/native-fullscreen-javascript-api-plus-jquery-plugin/
Native FullScreen JavaScript API
-------------
Assumes Mozilla naming conventions instead of W3C for now
*/

(function() {
	var 
		fullScreenApi = { 
			supportsFullScreen: false,
			isFullScreen: function() { return false; }, 
			requestFullScreen: function() {}, 
			cancelFullScreen: function() {},
			fullScreenEventName: '',
			prefix: ''
		},
		browserPrefixes = 'webkit moz o ms khtml'.split(' ');
	
	// check for native support
	if (typeof document.cancelFullScreen != 'undefined') {
		fullScreenApi.supportsFullScreen = true;
	} else {	 
		// check for fullscreen support by vendor prefix
		for (var i = 0, il = browserPrefixes.length; i < il; i++ ) {
			fullScreenApi.prefix = browserPrefixes[i];
			if (typeof document[fullScreenApi.prefix + 'CancelFullScreen' ] != 'undefined' ) {
				fullScreenApi.supportsFullScreen = true;
				break;
			}
		}
	}
	
	// update methods to do something useful
	if (fullScreenApi.supportsFullScreen) {
		fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';
		
		fullScreenApi.isFullScreen = function() {
			switch (this.prefix) {	
				case '':
					return document.fullScreen;
				case 'webkit':
					return document.webkitIsFullScreen;
				default:
					return document[this.prefix + 'FullScreen'];
			}
		}
		fullScreenApi.requestFullScreen = function(el) {
			return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
		}
		fullScreenApi.cancelFullScreen = function(el) {
			return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
		}		
	}

	// jQuery plugin
	if (typeof jQuery != 'undefined') {
		jQuery.fn.requestFullScreen = function() {
	
			return this.each(function() {
				var el = jQuery(this);
				if (fullScreenApi.supportsFullScreen) {
					fullScreenApi.requestFullScreen(el);
				}
			});
		};
	}

	// export api
	window.fullScreenApi = fullScreenApi;	
})();

//navigation toggle
$(function() {
    $(".toggle").on("click", function() {
        if ($(".item").hasClass("active")) {
            $(".item").removeClass("active");
            $(this).find("a").html("<i class='fas fa-bars'></i>");
        } else {
            $(".item").addClass("active");
            $(this).find("a").html("<i class='fas fa-times'></i>");
        }
    });
});