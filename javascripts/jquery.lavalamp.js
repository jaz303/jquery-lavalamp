/**
 * jquery-lavalamp
 * Copyright (c) 2008 Jason Frame (jason@onehackoranother.com)
 *
 * Released under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * This is a rewrite of the jQuery LavaLamp plugin in a more OO style.
 * An interface is exposed allowing interaction with the menu through
 * an object.
 *
 * It is (read: "should be") backwards compatible. All of the original
 * stylesheets, images and demos have been carried across.
 *
 * Tested with jQuery 1.2.6, might work with lower versions.
 *
 * Original LavaLamp plugin:
 * Copyright (c) 2007 Ganeshji Marwaha (gmarwaha.com)
 * http://gmarwaha.com/blog/?p=7
 */

jQuery.fn.lavaLamp = function(options) {
	this.each(function() { new LavaLamp(this, options); });
	return this;
};

function LavaLamp(ele, options) {
	this.$root		= jQuery(ele);
	this.options	= jQuery.extend(LavaLamp.DEFAULTS, options || {});
	this._init();
}

jQuery.extend(LavaLamp, {
	
	DEFAULTS: {
		fx: 	"linear",
		speed: 	500,
		click: 	function() {}
	},
	
	get: function(ele) {
		return jQuery.data(ele, 'active.lavalamp');
	}
	
});

LavaLamp.prototype = {
	setCurr: function(ele) {
		ele = this._resolveElement(ele);
		this.$back.css({ "left": ele.offsetLeft + "px", "width": ele.offsetWidth + "px" });
        this.curr = ele;
	},
	
	_init: function() {
		
		var self = this;
		
		this.$li = this.$root.find('li').hover(function() {
			self._move(this);
		}, function() {}).click(function(evt) {
			self.setCurr(this);
			return self.options.click.apply(this, [evt, this]);
		});
		
		this.curr = this.$root.find('li.current')[0] || this.$li.eq(0).addClass('current')[0];
		this.$root.hover(function() {}, function() { self._move(self.curr) });
		this.$back = jQuery('<li class="back"><div class="left"></div></li>').appendTo(this.$root);
		
		this.setCurr(this.curr);
		
		this.$root.data('active.lavalamp', this);
		
	},
	
	_move: function(ele) {
		ele = this._resolveElement(ele);
		this.$back.each(function() {
            jQuery(this).dequeue("fx"); }
        ).animate({
            width: ele.offsetWidth,
            left: ele.offsetLeft
        }, this.options.speed, this.options.fx);
	},
	
	_resolveElement: function(thing) {
		if (typeof thing == 'number') {
			return this.$li.eq(thing)[0];
		} else if (typeof thing == 'string') {
			return this.$li.filter(thing)[0];
		} else {
			return thing;
		}
	}
};