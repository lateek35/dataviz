/*!

PANAM ALL STARZ v1.0.0

Copyright (C) 2014 - Raquin Allan - Chapron Kevin - Mourgues Antoine - Florian Pygmalion - Aquaviva Julien

@under MIT license
*/

/*==========================================================================================*/
/*-------------------------------------  REQUIRE CONFIG  -----------------------------------*/
/*==========================================================================================*/
require.config({
  paths: {
      jquery:      'libs/require-jquery',
      fullpage: 'libs/jquery.fullPage',
      underscore:  'libs/underscore',
      handlebars : 'libs/handlebars.amd',
      backbone:    'libs/backbone',
      d3:    'libs/d3',
      modelRapper: 'models/rapper.model',
      collectionRapper: 'collections/rapper.collection',
      viewRapperList: 'views/rapperList.view'
  },
  
  shim: {
    fullpage: {
        deps: [
            'jquery'
        ]
    },
    zoomooz: {
        deps: [
            'jquery'
        ]
    },
    underscore: {
        exports: '_'
    },
    handlebars: {
        exports: 'Handlebars'
    },
    d3: {
        exports: 'd3'
    },
    backbone: {
      deps: ['underscore','handlebars','jquery'],
      exports: 'Backbone'
    }
  }
});
/*==========================================================================================*/
/*-------------------------------------  REQUIRE APPEL  ------------------------------------*/
/*==========================================================================================*/
require([
  'fullpage',
  'backbone',
  'modelRapper',
  'collectionRapper',
  'viewRapperList',
  'd3'
], function (fullpage, backbone, modelRapper, collectionRapper,viewRapperList,d3) {

/*==========================================================================================*/
/*--------------------------------------  GESTION MAP  -------------------------------------*/
/*==========================================================================================*/
$( document ).ready(function() {
/*__________________________________________________________________________________________*/
/*-----------------------------  Animation MAP (hover + zoom)  ----------------------------*/
function mouseenterMap(){
  $(this).css('fill', 'rgba(255,0,50,0.1)');
  rapperList.runFilter(parseInt($(this)[0].id.substring(1)));
}
function mouseoutMap(){
  $(this).css('fill', 'rgba(255,0,50,0)')
}
$('path').on('mouseenter',mouseenterMap);
$('path').on('mouseout',mouseoutMap);

$('svg').mouseup(function(e){
  $('path').show().attr('class','');
  router.navigate("#2/");
});
/*__________________________________________________________________________________________*/
/*--------------------------------  Animation liste rappeur  -------------------------------*/
$('body').on('mouseover','#list-rapper li',function(){ 
  $('#list-rapper-name li').eq($(this).index()).addClass('active');
});
$('body').on('mouseout','#list-rapper li',function(){ 
  $('#list-rapper-name li').eq($(this).index()).removeClass('active');
});

/*__________________________________________________________________________________________*/
/*------------------------------  Gestion URL Departement MAP ----------------------------*/
$('path').on('click',function(){ 
  var suplmement = (Backbone.history.fragment).substring(0,2);
  router.navigate(suplmement+"dep/"+parseInt($(this)[0].id.substring(1)),true);
});
/*__________________________________________________________________________________________*/
/*---------------------------------  Gestion URL Rappeur MAP -------------------------------*/
// $('path').on('click',function(){ 
//   var suplmement = (Backbone.history.fragment).substring(0,9);
//   router.navigate("caca/"+$(this)[0].id);
// });
/*==========================================================================================*/
/*----------------------------------  INIT OF FULLPAGE.JS  ---------------------------------*/
/*==========================================================================================*/
$('#fullpage').fullpage({
  verticalCentered: false,
  easing: 'swing',
  navigation: true,
  afterLoad: function(anchorLink, index){
    var suplmement = (Backbone.history.fragment).substring(2);
    router.navigate(""+index+"/"+suplmement);
  }
});

$('#home>a').on('click',function(event){
  event.preventDefault();
  $.fn.fullpage.moveSectionDown();
});

/*==========================================================================================*/
/*-------------------------------------  ROUTER GESTION  -----------------------------------*/
/*==========================================================================================*/
  var Router = Backbone.Router.extend({
    routes:{
      ':slide' : 'home',
      ':slide/' : 'home',
      ':2/dep/:cp' : 'departement'
    }
  });

  var rappers = new collectionRapper();
  var rapperList = new viewRapperList({collection : rappers});

  var router = new Router();
  router.on('route:home',function(slide){
    moveSlide(slide);
    rapperList.runFilter();
  });
  router.on('route:departement',function(slide,cp){
    moveSlide(slide);
    rapperList.runFilter(parseInt(cp));
    $('path').show().attr('class','');
    $('#_'+cp).attr('class','zoom');
    $('path').not('#_'+cp).attr('class','bouge');
    $('path').unbind('mouseenter',mouseenterMap);
    setTimeout(function(){
      $('path').not('#_'+cp).css('display','none');
      $('path').bind('mouseenter',mouseenterMap);
    }, 500);

  })

  var moveSlide = function(slide){
    $.fn.fullpage.moveTo(slide); 
  };

  Backbone.history.start();
});

});