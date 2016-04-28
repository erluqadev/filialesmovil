
var _sizePage = $(window).height();

var resizeLevel = function(level){
    var elem;
    var sumaHeight = 0;
    var height;
    if(typeof level == 'undefined'){
        elem = $(".content-level.animate ul");
    }
    else{
        elem = $("#level-" + level);
    }
    $.each($(elem).find('li.active') , function(i,e){
        sumaHeight +=$(e).height();
    });
    height = sumaHeight;
    $(".content-menu-movil .content-level").css('height' , height + 'px');
};

var toggleMenuMovil = function(){
    var show = true;
    $.each($(".content-menu-movil .content-level"),function(i,elem){
        if($(elem).css('left') == '0px'){
            $(".content-menu-movil").removeClass('active');
            $("#header-movil button.navbar-toggle .icon-hide").removeClass('animate');
            $("#header-movil button.navbar-toggle .icon-x1").removeClass('animate');
            $("#header-movil button.navbar-toggle .icon-x2").removeClass('animate');
            setTimeout(function(){$('.content-menu-movil .content-level').removeClass('animate');} , 500);
            show = false;
        }
    });
    if(show){
        resizeLevel(1);
       $('.content-menu-movil ul#level-1').parent().addClass('animate');
       $("#header-movil button.navbar-toggle .icon-hide").addClass('animate');
       $("#header-movil button.navbar-toggle .icon-x1").addClass('animate');
       $("#header-movil button.navbar-toggle .icon-x2").addClass('animate');
       $(".content-menu-movil").addClass('active');
    }
    else{
      $('.content-menu-movil .content-level').css('left' , '-320px');
    }
};

var showSubMenu = function(){
    var id = $(this).attr('id');
    var level = parseInt($(this).parent().attr('id').split('-')[1]);
    $("#level-" + (level+1)).find('li').removeClass('active');
    $("#level-" + (level+1)).find('[data-parent='+id+']').addClass('active');
    var levelNow = level + 1;
    resizeLevel(levelNow);
    $("#level-" + levelNow).parent().addClass('animate');
    $.each($(".content-level") , function(i,elem){
        var l = parseInt($(elem).find('ul').attr('id').split('-')[1]);
        if(l !== levelNow){
            $(elem).removeClass('animate');
        }   
    });

};

var backMenu = function(){
    var currentLevel = parseInt($(this).parent().attr('id').split('-')[1]);
    var goLevel = parseInt($(this).data('level'));
    while(currentLevel > goLevel){
        resizeLevel(currentLevel - 1);
        $("#level-" + (currentLevel - 1)).parent().addClass('animate');
        $("#level-" + currentLevel).parent().removeClass('animate');
        currentLevel--;
    }
};

var addzindexlevels = function(){
    var elemlevels = $(".content-menu-movil ul");
    var zindex = 1000;
    $.each(elemlevels,function(i,elem){
        $(elem).parent().css({'z-index' : zindex});
        zindex = zindex + 1000;
    });
}

var windowsResize = function(){
    var sizePageNow = $(window).height();
    $(".content-menu-movil").css('min-height' , sizePageNow + 'px');
    $(".content-level").css('min-height' , sizePageNow + 'px');
    resizeLevel();
    _sizePage = sizePageNow;
};

var itemClickSelected = function(){
    toggleMenuMovil();
};


$(function(){
  $("#header-movil button.navbar-toggle").on('click',toggleMenuMovil);
  $(".content-menu-movil").css('min-height' , _sizePage + 'px');
  $(".content-menu-movil .content-level").css('min-height' , _sizePage + 'px');
  $("#header-movil ul .childs").on('click' , showSubMenu);
  $("#header-movil ul .back").on('click' , backMenu);
  addzindexlevels();
  $("#level-1 li").addClass('active');
  $(window).resize(windowsResize);
  resizeLevel(1);
  $("[data-click='item-selected']").on('click' , itemClickSelected);
});