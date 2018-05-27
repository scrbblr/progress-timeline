(function($) {
  $.fn.audio = function(options) {
    var settings = {'preload':true};
    var unique_id = 0;
    var playing = {};
    var sounds = {};
      
      if (options) {
        $.extend(settings, options);
      }
      
      var $player = $(this);
      
      var add = function(name,audio){
        sounds[name] = audio;
      };
      
      var preload = function(){
        $player.find("audio").each(function(){
          console.log("Preloading sound",this.id);
          add(this.id,$(this));
        });
      };
      
      var last = 0;
      
      var play = function(name) {
        delta = new Date().getTime() - last;
        console.log("DELTA",delta);
        if(sounds[name] && delta > 50){
          last = new Date().getTime();
          playing[name] = true;
          var sound = sounds[name].clone();
          sound.attr({
            'id': (unique_id++),
            'autoplay': 'autoplay',
            'style': 'display:none;'
          }).appendTo('body');
          sound.on('ended', function(){
            sound.remove();
            delete playing[name];
          });
        }
        else{
          console.log("!!" + name + "!!")
        }
      };
      
      if(settings.preload){
        $(document).ready(function(){
          preload();
        });
      }
      
      $player.on("play",function(e,data){
        play(data);
      });
      
      return {
        add: add,
        preload: preload,
        play: play
      }
  };
})(jQuery);

var audio = $(document).audio();