var hoveringcontent={
	contentoffsets: [20, -30], 
	fadeinspeed: 200, 
	rightclickstick: true, 
	hoveringbordercolors: ["black", "darkred"], 
	hoveringnotice1: ["Nyomd meg az \"h\"", " billentyűt vagy jobb klikk", "a dobozba lépéshez"], 
	hoveringnotice2: "A doboz eltüntetéséhez kattints a dobozon kívülre!", 

	

	isdocked: false,

	positioncontent:function($, $content, e){
		var x=e.pageX+this.contentoffsets[0], y=e.pageY+this.contentoffsets[1]
		var contentw=$content.outerWidth(), contenth=$content.outerHeight(), 
		x=(x+contentw>$(document).scrollLeft()+$(window).width())? x-contentw-(hoveringcontent.contentoffsets[0]*2) : x
		y=(y+contenth>$(document).scrollTop()+$(window).height())? $(document).scrollTop()+$(window).height()-contenth-10 : y
		$content.css({left:x, top:y})
	},
	
	showbox:function($, $content, e){
		$content.fadeIn(this.fadeinspeed)
		this.positioncontent($, $content, e)
	},

	hidebox:function($, $content){
		if (!this.isdocked){
			$content.stop(false, true).hide()
			$content.css({borderColor:'black'}).find('.hoveringstatus:eq(0)').css({background:this.hoveringbordercolors[0]}).html(this.hoveringnotice1)
		}
	},

	dockcontent:function($, $content, e){
		this.isdocked=true
		$content.css({borderColor:'darkred'}).find('.hoveringstatus:eq(0)').css({background:this.hoveringbordercolors[1]}).html(this.hoveringnotice2)
	},


	init:function(targetselector, contentid){
		jQuery(document).ready(function($){
			var $targets=$(targetselector)
			var $content=$('#'+contentid).appendTo(document.body)
			if ($targets.length==0)
				return
			var $allcontents=$content.find('div.acontent')
			if (!hoveringcontent.rightclickstick)
				hoveringcontent.hoveringnotice1[1]=''
			hoveringcontent.hoveringnotice1=hoveringcontent.hoveringnotice1.join(' ')
			hoveringcontent.hidebox($, $content)
			$targets.bind('mouseenter', function(e){
				$allcontents.hide().filter('#'+$(this).attr('data-content')).show()
				hoveringcontent.showbox($, $content, e)
			})
			$targets.bind('mouseleave', function(e){
				hoveringcontent.hidebox($, $content)
			})
			$targets.bind('mousemove', function(e){
				if (!hoveringcontent.isdocked){
					hoveringcontent.positioncontent($, $content, e)
				}
			})
			$content.bind("mouseenter", function(){
				hoveringcontent.hidebox($, $content)
			})
			$content.bind("click", function(e){
				e.stopPropagation()
			})
			$(this).bind("click", function(e){
				if (e.button==0){
					hoveringcontent.isdocked=false
					hoveringcontent.hidebox($, $content)
				}
			})
			$(this).bind("contextmenu", function(e){
				if (hoveringcontent.rightclickstick && $(e.target).parents().andSelf().filter(targetselector).length==1){ 
					hoveringcontent.dockcontent($, $content, e)
					return false
				}
			})
			$(this).bind('keypress', function(e){
				var keyunicode=e.charCode || e.keyCode
				if (keyunicode==104){ 
					hoveringcontent.dockcontent($, $content, e)
				}
			})
		}) 
	}
}

hoveringcontent.init("*[data-content]", "myhoveringcontent")