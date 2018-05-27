/*https://github.com/edankwan/PerspectiveTransform.js*/
(function(a){a(function(){function b(e,f,c,d){this.element=e;this.style=e.style;this.computedStyle=window.getComputedStyle(e);this.width=f;this.height=c;this.useBackFacing=!!d;this.topLeft={x:0,y:0};this.topRight={x:f,y:0};this.bottomLeft={x:0,y:c};this.bottomRight={x:f,y:c}}b.prototype=(function(){var d={stylePrefix:""};var f;var k;var c;var m=[[0,0,1,0,0,0,0,0],[0,0,1,0,0,0,0,0],[0,0,1,0,0,0,0,0],[0,0,1,0,0,0,0,0],[0,0,0,0,0,1,0,0],[0,0,0,0,0,1,0,0],[0,0,0,0,0,1,0,0],[0,0,0,0,0,1,0,0]];var i=[0,0,0,0,0,0,0,0];function n(){var o=document.createElement("div").style;d.stylePrefix="webkitTransform" in o?"webkit":"MozTransform" in o?"Moz":"msTransform" in o?"ms":"";f=d.stylePrefix+(d.stylePrefix.length>0?"Transform":"transform");c="-"+d.stylePrefix.toLowerCase()+"-transform-origin"}function h(){var p=this.topLeft.x-this.topRight.x;var o=this.topLeft.y-this.topRight.y;if(Math.sqrt(p*p+o*o)<=1){return true}p=this.bottomLeft.x-this.bottomRight.x;o=this.bottomLeft.y-this.bottomRight.y;if(Math.sqrt(p*p+o*o)<=1){return true}p=this.topLeft.x-this.bottomLeft.x;o=this.topLeft.y-this.bottomLeft.y;if(Math.sqrt(p*p+o*o)<=1){return true}p=this.topRight.x-this.bottomRight.x;o=this.topRight.y-this.bottomRight.y;if(Math.sqrt(p*p+o*o)<=1){return true}p=this.topLeft.x-this.bottomRight.x;o=this.topLeft.y-this.bottomRight.y;if(Math.sqrt(p*p+o*o)<=1){return true}p=this.topRight.x-this.bottomLeft.x;o=this.topRight.y-this.bottomLeft.y;if(Math.sqrt(p*p+o*o)<=1){return true}return false}function j(q,p,o){return q.x*p.y+p.x*o.y+o.x*q.y-q.y*p.x-p.y*o.x-o.y*q.x}function l(){var p=j(this.topLeft,this.topRight,this.bottomRight);var o=j(this.bottomRight,this.bottomLeft,this.topLeft);if(this.useBackFacing){if(p*o<=0){return true}}else{if(p<=0||o<=0){return true}}var p=j(this.topRight,this.bottomRight,this.bottomLeft);var o=j(this.bottomLeft,this.topLeft,this.topRight);if(this.useBackFacing){if(p*o<=0){return true}}else{if(p<=0||o<=0){return true}}return false}function g(){if(h.apply(this)){return 1}if(l.apply(this)){return 2}return 0}function e(){var q=this.width;var D=this.height;var y=0;var w=0;var u=this.computedStyle.getPropertyValue(c);if(u.indexOf("px")>-1){u=u.split("px");y=-parseFloat(u[0]);w=-parseFloat(u[1])}else{if(u.indexOf("%")>-1){u=u.split("%");y=-parseFloat(u[0])*q/100;w=-parseFloat(u[1])*D/100}}var B=[this.topLeft,this.topRight,this.bottomLeft,this.bottomRight];var z=[0,1,2,3,4,5,6,7];for(var x=0;x<4;x++){m[x][0]=m[x+4][3]=x&1?q+y:y;m[x][1]=m[x+4][4]=(x>1?D+w:w);m[x][6]=(x&1?-y-q:-y)*(B[x].x+y);m[x][7]=(x>1?-w-D:-w)*(B[x].x+y);m[x+4][6]=(x&1?-y-q:-y)*(B[x].y+w);m[x+4][7]=(x>1?-w-D:-w)*(B[x].y+w);i[x]=(B[x].x+y);i[x+4]=(B[x].y+w);m[x][2]=m[x+4][5]=1;m[x][3]=m[x][4]=m[x][5]=m[x+4][0]=m[x+4][1]=m[x+4][2]=0}var C,A;var E;var r=[];var x,t,s,v;for(var t=0;t<8;t++){for(var x=0;x<8;x++){r[x]=m[x][t]}for(x=0;x<8;x++){E=m[x];C=x<t?x:t;A=0;for(var s=0;s<C;s++){A+=E[s]*r[s]}E[t]=r[x]-=A}var o=t;for(x=t+1;x<8;x++){if(Math.abs(r[x])>Math.abs(r[o])){o=x}}if(o!=t){for(s=0;s<8;s++){v=m[o][s];m[o][s]=m[t][s];m[t][s]=v}v=z[o];z[o]=z[t];z[t]=v}if(m[t][t]!=0){for(x=t+1;x<8;x++){m[x][t]/=m[t][t]}}}for(x=0;x<8;x++){z[x]=i[z[x]]}for(s=0;s<8;s++){for(x=s+1;x<8;x++){z[x]-=z[s]*m[x][s]}}for(s=7;s>-1;s--){z[s]/=m[s][s];for(x=0;x<s;x++){z[x]-=z[s]*m[x][s]}}return this.style[f]="matrix3d("+z[0].toFixed(9)+","+z[3].toFixed(9)+", 0,"+z[6].toFixed(9)+","+z[1].toFixed(9)+","+z[4].toFixed(9)+", 0,"+z[7].toFixed(9)+",0, 0, 1, 0,"+z[2].toFixed(9)+","+z[5].toFixed(9)+", 0, 1)"}n();d.update=e;d.checkError=g;return d})();return b})}(typeof define==="function"&&define.amd?define:function(a){window.PerspectiveTransform=a()}));

(function($) {

  $.fn.sketcher = function(options) {
    var settings = {
      points:{classname:"pt"}
    };

    $sketcher = this;
    return $sketcher.each(function(index) {
      if (options) {
          $.extend(settings, options);
      }
      var dom = this;
      var $img = $(this); 
      
      var $container = settings.container ? settings.container : $img.parent();
      var $points = $('<div class="' + settings.points.classname + ' tl"></div><div class="' + settings.points.classname + ' tr"></div><div class="' + settings.points.classname + ' bl"></div><div class="' + settings.points.classname + ' br"></div>');
      $container.append($points);
      
      var IMG_WIDTH = settings.width ? settings.width : $container.width();
      var IMG_HEIGHT = settings.height ? settings.height : $container.height();

      var transform = new PerspectiveTransform(dom, IMG_WIDTH, IMG_HEIGHT, true);
      var tl = $points.filter(".tl").css({
          left : transform.topLeft.x,
          top : transform.topLeft.y
      });
      var tr = $points.filter(".tr").css({
          left : transform.topRight.x,
          top : transform.topRight.y
      });
      var bl = $points.filter(".bl").css({
          left : transform.bottomLeft.x,
          top : transform.bottomLeft.y
      });
      var br = $points.filter(".br").css({
          left : transform.bottomRight.x,
          top : transform.bottomRight.y
      });
      var target;
      var targetPoint;
      
      var onmousemove = function (e) {
        targetPoint.x = e.pageX - $container.offset().left - 20;
        targetPoint.y = e.pageY - $container.offset().top - 20;
        target.css({
          left : targetPoint.x,
          top : targetPoint.y
        });

        // check the polygon error, if it's 0, which mean there is no error
        if(transform.checkError()==0){
          transform.update();
          $img.show();
        }else{
          $img.hide();
        }
      }; 

      $points.mousedown(function(e) {
        
        $img.addClass("no-transition");
        target = $(this);
        targetPoint = target.hasClass("tl") ? transform.topLeft : target.hasClass("tr") ? transform.topRight : target.hasClass("bl") ? transform.bottomLeft : transform.bottomRight;
        onmousemove.apply(this, Array.prototype.slice.call(arguments));
        $(window).mousemove(onmousemove);
        $(window).mouseup(function() {
          $img.removeClass("no-transition");
          $(window).unbind('mousemove', onmousemove);
        })
      });
                
    });
  };
})(jQuery);