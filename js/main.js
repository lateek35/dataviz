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
  'viewRapperList'
], function (fullpage, backbone, modelRapper, collectionRapper,viewRapperList) {


$('path').on('mouseenter',function(){$(this).css('fill', 'rgba(255,0,50,0.1)')});
$('path').on('mouseout',function(){$(this).css('fill', 'rgba(255,0,50,0)')});
$('#liste-rappeur li').on('mouseover',function(){ 
  $('#liste-rappeur-name li').eq($(this).index()).addClass('active');
});
$('#liste-rappeur li').on('mouseout',function(){ 
  $('#liste-rappeur-name li').eq($(this).index()).removeClass('active');
});
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
      ':slide/dep/:cp' : 'departement'
    }
  });

  var rapperList = new viewRapperList();

  var router = new Router();

  router.on('route:home',function(slide){
    moveSlide(slide);
    rapperList.render(-1);
  });
  router.on('route:departement',function(slide,cp){
    moveSlide(slide);
    rapperList.render(cp);
  })

  var moveSlide = function(slide){
    $.fn.fullpage.moveTo(slide); 
  };

  Backbone.history.start();
});