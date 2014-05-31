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

/*==========================================================================================*/
/*----------------------------------  INIT OF FULLPAGE.JS  ---------------------------------*/
/*==========================================================================================*/
$('#fullpage').fullpage({
  verticalCentered: false,
  easing: 'swing',
  navigation: true,
  afterLoad: function(anchorLink, index){
    router.navigate(""+index);
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