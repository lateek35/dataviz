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
      slimScroll:      'libs/slimScroll',
      fullpage: 'libs/jquery.fullPage',
      underscore:  'libs/underscore',
      handlebars : 'libs/handlebars.amd',
      backbone:    'libs/backbone',
      d3:    'libs/d3',
      modelRapper: 'models/rapper.model',
      collectionRapper: 'collections/rapper.collection',
      viewRapperList: 'views/rapperList.view',
      viewRapperListInsults: 'views/rapperListInsults.view',
      viewRapperPage: 'views/rapperPage.view',
      viewModuleComparaison: 'views/moduleComparaison.view'
  },
  
  shim: {
    fullpage: {
        deps: [
            'jquery'
        ]
    },
    slimScroll: {
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
      deps: ['fullpage','underscore','handlebars','jquery'],
      exports: 'Backbone'
    }
  }
});
/*==========================================================================================*/
/*-------------------------------------  REQUIRE APPEL  ------------------------------------*/
/*==========================================================================================*/
require([
  'slimScroll',
  'fullpage',
  'backbone',
  'modelRapper',
  'collectionRapper',
  'viewRapperList',
  'viewRapperPage',
  'viewModuleComparaison',
  'viewRapperListInsults',
  'd3'
], function (slimScroll,fullpage, backbone, modelRapper, collectionRapper,viewRapperList,viewRapperPage,viewModuleComparaison,viewRapperListInsults,d3) {
/*==========================================================================================*/
/*-----------------------------------  GESTION RESPONSIVE ----------------------------------*/
/*==========================================================================================*/

gestionResponsive();

window.addEventListener("orientationchange", function() {
  gestionResponsive();

}, false);

window.addEventListener("resize", function() {
  gestionResponsive();
}, false);


function gestionResponsive(){
  var wHeight = ($(window).height()-180)/700;
  var wWidth = $(window).width()/1100;
  var facteur = wHeight<wWidth?wHeight:wWidth;
  $('#container-module-comparaison').css({
    'transform':'scale('+facteur+')'
  });

  $('#container-module').css({
    'transform':'scale('+facteur/1+')'
  });

}


/*==========================================================================================*/
/*--------------------------------------  GESTION MAP  -------------------------------------*/
/*==========================================================================================*/
$( document ).ready(function() { 
/*__________________________________________________________________________________________*/
/*-----------------------------  Animation MAP (hover + zoom)  ----------------------------*/
function mouseenterMap(){
  $(this).css('fill', 'rgba(233,73,83,0.35)');
  switch (parseInt($(this)[0].id.substring(1))) 
  { 
  case 77: 
    $('.departement').text("77 - SEINE ET MARNE"); 
    break; 
  case 91: 
    $('.departement').text("91 - ESSONNE"); 
    break;
  case 78: 
    $('.departement').text("78 - YVELINES"); 
    break;
  case 95: 
    $('.departement').text("95 - VAL D'OISE"); 
    break; 
  case 93: 
    $('.departement').text("93 - SAINE-SAINT-DENIS"); 
    break; 
  case 94: 
    $('.departement').text("94 - VAL-DE-MARNE"); 
    break; 
  case 92: 
    $('.departement').text("92 - HAUTS-DE-SEINE"); 
    break; 
  case 75: 
    $('.departement').text("75 - PARIS"); 
    break;
  default: 
    $('.departement').text("selectionnez votre département");
    break; 
  }
}
function mouseoutMap(){
  $(this).css('fill', 'rgba(255,0,50,0)');
}
$('path').on('mouseenter',mouseenterMap);
$('path').on('mouseout',mouseoutMap);

$('svg#carte').mouseup(function(e){
  $('#carte path').show().attr('class','');
  $('#carte path').bind('mouseenter',mouseenterMap);
  router.navigate("#2/");
  $('.departement').stop().animate({
      bottom: "0"
    }, 500, function() {
      // Animation complete.
    });
    $('#list-bottom').stop().animate({
      top: "1rem"
    }, 500, function() {
      // Animation complete.
    });
});
/*__________________________________________________________________________________________*/
/*--------------------------------  Animation liste rappeur  -------------------------------*/
$('body').on('mouseover','#list-rapper li',function(){ 
  $('#list-rapper-name li').eq($(this).index()).addClass('active');
});
$('body').on('mouseout','#list-rapper li',function(){ 
  $('#list-rapper-name li').eq($(this).index()).removeClass('active');
});



$('body').on('click',".btn-play-pause",function(){
  myVid=$("#bgvid");
  if (myVid[0].muted) {
    myVid[0].muted=false;
    $('.btn-play-pause')[0].style.backgroundImage = 'url(./img/btn-pause.png)';
  }else{
    myVid[0].muted=true;  
    $('.btn-play-pause')[0].style.backgroundImage = 'url(./img/btn-play.png)';
  }

});
/*__________________________________________________________________________________________*/
/*----------------------------------  Animation liste fans  --------------------------------*/

$('.bottom').on('mouseover',function(){
  var moveList = setInterval(function(){ 
    if( parseInt($('.fans>ul').css('top'))>=-142 ){
      $('.fans>ul').css('top','-=5px');
    }
  }, 20);

  $(this).on('mouseout',function(){
    clearInterval(moveList);
  });
});

$('.up').on('mouseover',function(){
  var moveList = setInterval(function(){
    if( parseInt($('.fans>ul').css('top'))<0 ){
      $('.fans>ul').css('top','+=5px');
    }
  }, 20);

  $(this).on('mouseout',function(){
    clearInterval(moveList);
  });
});

/*__________________________________________________________________________________________*/
/*--------------------------------------  Menu appear --------------------------------------*/
$('#hamburger-icon').on('click', function(){
  $(this).toggleClass('active');
  $('#menu-overlay').toggleClass('open');
});

$('#menu-overlay a').on('click', function(e){
  $('#hamburger-icon').toggleClass('active');
  $('#menu-overlay').toggleClass('open');
});


/*__________________________________________________________________________________________*/
/*-------------------------------  Animation hardcore lyrics  ------------------------------*/
// console.log("taille fenêtre : "+window.innerHeight);
// console.log("position top head-rappers (dans body) : "+($('#head-rappers').offset().top-window.innerHeight*3));
// console.log("hauteur total : "+window.innerHeight*4);

/*__________________________________________________________________________________________*/
/*------------------------------  Gestion URL Departement MAP ----------------------------*/
$('path').on('click',function(){ 
  var suplmement = (Backbone.history.fragment).substring(0,2);
  router.navigate(suplmement+"dep/"+parseInt($(this)[0].id.substring(1)),true);
  $('.departement').stop().animate({
    bottom: "-1rem"
  }, 500, function() {
    // Animation complete.
  });
  $('#list-bottom').stop().animate({
    top: "0"
  }, 500, function() {
    // Animation complete.
  });
});
$('body').on('click','#btn-retour',function(){ 
  $.fn.fullpage.moveSlideRight();
  $("#bgvid")[0].muted=true;
  $('#fullPage-nav>ul').show();
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
  css3 : true,
  scrollingSpeed: 300,
  normalScrollElements: '#page-rapper',
  afterLoad: function(anchorLink, index){
    var suplmement = (Backbone.history.fragment).substring(2);
    router.navigate("//"+index+"/"+suplmement);
    if(index == '4'){
      rapperListInsults.render();
    }
  }
});
$.fn.fullpage.setKeyboardScrolling(false);
$(".section").find('.controlArrow').hide();
$('#home>a').on('click',function(event){
  event.preventDefault();
  $.fn.fullpage.moveSectionDown();
});

/*==========================================================================================*/
/*-------------------------------------  ROUTER GESTION  -----------------------------------*/
/*==========================================================================================*/
  var Router = Backbone.Router.extend({
    routes:{
      '5(/)' : 'module-fan',
      '4(/)' : 'module-hardcore',
      '3(/)' : 'module-hard',
      '2/dep/:cp/:rapper(/)' : 'rapperSolo',
      '2/dep/:cp(/)' : 'departement',
      '2(/)' : 'map',
      '1(/)' : 'home',
      '/' : 'home'
    }
  });

  var rappers = new collectionRapper();
  var rapperList = new viewRapperList({collection : rappers});
  var rapperListInsults = new viewRapperListInsults({collection : rappers});
  //var moduleComparaison = new viewModuleComparaison({collection : rappers});

  var router = new Router();

  router.on('route:home',function(slide){
    $.fn.fullpage.moveTo(1,0);
    rapperList.runFilter();
  });

  router.on('route:map',function(slide){
    $.fn.fullpage.moveTo(2,0);
  });

  router.on('route:departement',function(cp){
    $.fn.fullpage.moveTo(2,0);
    rapperList.runFilter(parseInt(cp));
    $('#carte path').show().attr('class','');
    $('#_'+cp).attr('class','zoom');
    $('#carte path').not('#_'+cp).attr('class','bouge');
    $('#carte path').unbind('mouseenter',mouseenterMap);
    setTimeout(function(){
      $('#carte path').not('#_'+cp).css('display','none');
      $('#carte path').bind('mouseenter',mouseenterMap);
    }, 500);
  }); 

  router.on('route:rapperSolo',function(cp,rapper){
    $.fn.fullpage.moveTo(2,1);
    var rapperPage = new viewRapperPage({collection : rappers});
    rapperPage.runFilter(rapper);
    $('#fullPage-nav>ul').hide();
  });

  router.on('route:module-hard',function(){
    $.fn.fullpage.moveTo(3,0);
    //moduleComparaison.render(-1);
  });

  router.on('route:module-hardcore',function(){
    $.fn.fullpage.moveTo(4,0);
  });

  router.on('route:module-fan',function(){
    $.fn.fullpage.moveTo(5,0);
  });


  Backbone.history.start();























$('body').on('click','.option',
    /*Event sur les boutton pour update les données*/
    function(event){
        eventPassed = event || window.event; //For IE
        /*Je passe l'event pour récuperer l'objet*/
        updateData(eventPassed);
    }
);
/*==========================================================================================*/
/*-----------------------------------  CREATION DU MODULE  ----------------------------------*/
/*==========================================================================================*/

    var r = 593;
    var p = Math.PI;
    var intervalScale = 6.2;
    var color = d3.scale.linear()
        .domain([-1, 0, 1])
        .range(["#515e44", "#4a4758", "#e84852"]);

    var colorB = d3.scale.linear()
        .domain([-1, 0, 1])
        .range(["#516839", "#453F61", "#F73943"]);

    var canvas = d3.select('#container-module-comparaison').append('svg')
        .attr('width','100%')
        .attr('height','100%');

    var group3 = canvas.append('g')
        .attr('class','popu')
        .attr('transform','translate('+(r+60)+','+(r)+')');
    var group2 = canvas.append('g')
        .attr('class','vente')
        .attr('transform','translate('+(r+60)+','+(r)+')');
    var group1 = canvas.append('g')
        .attr('class','album')
        .attr('transform','translate('+(r+60)+','+(r)+')');

    var debutScaleAlbum = 76;
    var finScaleAlbum = 76+(14*(intervalScale));

    var debutScaleVente = finScaleAlbum+intervalScale;
    var finScaleVente = debutScaleVente+(20*(intervalScale));

    var debutScalePopu = finScaleVente+intervalScale;
    var finScalePopu = debutScalePopu+(35*(intervalScale));


    var scale1 = d3.scale.linear();
        scale1.domain([1, 8]);
        scale1.range([76, finScaleAlbum]);

    var scale2 = d3.scale.linear();
        scale2.domain([0, 2000000]);
        scale2.range([debutScaleVente, finScaleVente]);

    var scale3 = d3.scale.linear();
        scale3.domain([0, 4000000]);
        scale3.range([debutScalePopu,finScalePopu]);

    var arc1,
        arc2,
        arc3,
        total;

    var radius = 100,
        radians = 2 * p,
        points = 30;

    var angle = d3.scale.linear()
        .domain([0, points-1])
        .range([0, radians/2]);

    var line = d3.svg.line.radial()
        .interpolate("basis")
        .tension(0)
        .radius(function(d, i) {return radius;})
        .angle(function(d, i) { return angle(i); });

d3.json('./js/data.json',function(data){

    total = data.length;

/*__________________________________________________________________________________________*/
/*-------------------------CREATION DES CERCLES RELIES A L'ECHELLE-------------------------*/
    arc1 = d3.svg.arc()
        .innerRadius(debutScaleAlbum)
        .outerRadius(function(d){
            return scale1(+d.v1);
          })
        .startAngle(function(d,i){
            return (-p/2)+(p/total)*i+1/100; 
            })
        .endAngle(function(d,i){
            return(-p/2)+(p/total)*(i+1);
        });

    arc2 = d3.svg.arc()
        .innerRadius(debutScaleVente)
        .outerRadius(function(d){
            var chiffre;
            if(+d.v2>1000000){
                chiffre = (+d.v2+1500000)/2.5;
            }else{
                chiffre = +d.v2;
            }
            return scale2(chiffre);
        })
        .startAngle(function(d,i){
            return (-p/2)+(p/total)*i+1/100; 
        })
        .endAngle(function(d,i){
            return(-p/2)+(p/total)*(i+1);
        });

    arc3 = d3.svg.arc()
        .innerRadius(debutScalePopu)
        .outerRadius(function(d){
            var chiffre;
            if(+d.v3>1000000){
                chiffre = (+d.v3+1500000)/2.5;
            }else{
                chiffre = +d.v3;
            }
            return scale3(chiffre);
        })
        .startAngle(function(d,i){
            return (-p/2)+(p/total)*i+1/100; 
        })
        .endAngle(function(d,i){
            return(-p/2)+(p/total)*(i+1);
        });

    group1.selectAll('path')
        .data(data)
        .enter()
        .append('path')
        .attr('d',arc1)
        .style("fill", function(d){
            return d3.rgb(color(-1));
        })
        .on('mouseover',function(d){
            d3.select(this).transition().duration(200).style('fill',function(d){
                return d3.rgb(colorB(-1));
            });
            /*------------------GESTION CARD---------------------*/
            $('#infos-comparaison').addClass('inactive-infos');
            $('#rapper-card-comparaison').addClass('active-card');
            d3.select('#rapper-card-comparaison>h4').text(d.blazz+" : ");
            d3.select('#rapper-card-comparaison>h3').text(d.v1+" Albums");
            $('.head-card').css('background-image', 'url(./img/rapper-min/min-'+d.id+'.jpg)');
            // $('.head-card').css('background-image', 'url(./img/rapper-min/min-'+d.id+'.jpg)');

        })
        .on('mouseout',function(){
            d3.select(this).transition().duration(200).style('fill',function(d){
                return d3.rgb(color(-1));
            });
        });

    group2.selectAll('path')
        .data(data)
        .enter()
        .append('path')
        .attr('d',arc2)
        .style("fill", function(d){
            return d3.rgb(color(0));
        })
        .on('mouseover',function(d){
            d3.select(this).transition().duration(200).style('fill',function(d){
                return d3.rgb(colorB(0));
            });
            /*------------------GESTION CARD---------------------*/
            $('#infos-comparaison').addClass('inactive-infos');
            $('#rapper-card-comparaison').addClass('active-card');
            d3.select('#rapper-card-comparaison>h4').text(d.blazz+" : ");
            d3.select('#rapper-card-comparaison>h3').text(d.v2+" Ventes");
            $('.head-card').css('background-image', 'url(./img/rapper-min/min-'+d.id+'.jpg)');

        })
        .on('mouseout',function(){
            d3.select(this).transition().duration(200).style('fill',function(d){
                return d3.rgb(color(0));
            });
        });

    group3.selectAll('path')
        .data(data)
        .enter()
        .append('path')
        .attr('d',arc3)
        .style("fill", function(d){
            return d3.rgb(color(1));
        })
        .on('mouseover',function(d){
            $('#tes').text(d.v3); /*ICI JE TEMPLATE !!*/
            d3.select(this).transition().duration(200).style('fill',function(d){
                return d3.rgb(colorB(1));
            });
            /*------------------GESTION CARD---------------------*/
            $('#infos-comparaison').addClass('inactive-infos');
            $('#rapper-card-comparaison').addClass('active-card');
            d3.select('#rapper-card-comparaison>h4').text(d.blazz+" : ");
            d3.select('#rapper-card-comparaison>h3').text(d.v3+" Fans");
            $('.head-card').css('background-image', 'url(./img/rapper-min/min-'+d.id+'.jpg)');
        })
        .on('mouseout',function(){
            d3.select(this).transition().duration(200).style('fill',function(d){
                return d3.rgb(color(1));
            });
        });

    /*J'ajoute le texte*/
    d3.select('#container-module-comparaison>svg').selectAll("text").data(data).enter()
        .append("text")
        .text(function(d,i) { return d.blazz; })
        .attr("transform", function(d, i){
                   /*Gère la rotation du texte, et le retourne passé les 90° pour ne pas avoirà lire à l'envers*/
                    var chiffre;
                    var donnee = +eval("d.v3");// jshint ignore:line
                    var angleRotation;
                    var x;
                    var y;
                    if(donnee>1000000){
                        chiffre = (donnee+1500000)/2.5;
                    }else{
                        chiffre = donnee;
                    }
                    if(((i+0.5)*180/total)<90){
                        angleRotation = ((i+0.5)*180/total);
                        x = ((eval('scale3')(chiffre)+93)*-Math.cos((i+0.5)*(Math.PI)/total)+r);// jshint ignore:line
                        y = ((eval('scale3')(chiffre)+93)*Math.sin((i+0.5)*(-Math.PI)/total)+r);// jshint ignore:line
                    }else{
                        angleRotation = ((i+0.5)*180/total)-180;
                        x = ((eval('scale3')(chiffre)+10)*-Math.cos((i+0.5)*(Math.PI)/total)+r);// jshint ignore:line
                        y = ((eval('scale3')(chiffre)+10)*Math.sin((i+0.5)*(-Math.PI)/total)+r);// jshint ignore:line
                    }
                    /*Placement du texte*/
                    return "translate("+(x+60)+","+ y + ")rotate(" + angleRotation + ")";
                });

    for(i=0; i<63; i++){
      //J'augmente le rayon du cercle pour chaque passage
      if(i>35){
           radius = 76+(i*intervalScale);
          canvas.append("path").datum(d3.range(points))
            .attr("class", "line-red")
            .attr("d", line)
            .attr("transform", "translate("+(r+60)+","+(r)+")" + ",rotate(-90)");
      }else if (i>14) {
          radius = 76+(i*intervalScale);
          canvas.append("path").datum(d3.range(points))
            .attr("class", "line-blue")
            .attr("d", line)
            .attr("transform", "translate("+(r+60)+","+(r)+")" + ",rotate(-90)");
      }else if(i%2===0){
          radius = 76+(i*intervalScale);
          canvas.append("path").datum(d3.range(points))
            .attr("class", "line-green")
            .attr("d", line)
            .attr("transform", "translate("+(r+60)+","+(r)+")" + ",rotate(-90)");
      }
    }
});
updateData();

function updateData(eventPassed) {

    /*Je récupère l'attribut data-class */
    if (eventPassed) {
        var classClicked = eventPassed.target.getAttribute('data-class');
    }

    // Get the data again
    d3.json('./js/data.json',function(data){
        /*Je selectionne les éléments qui ne possède pas la classe récupérer au-dessus*/
        var gNotChosen = d3.selectAll("svg g:not(."+classClicked+")").transition();
        var gChosen = d3.selectAll("svg g."+classClicked).transition();

      /*Je défini 1 à 1 mes 3 arcs qui serviront a représenté mes 3 données*/

            /*Je créer un arc de "reboot*/
            var arc0 = d3.svg.arc()
                .innerRadius(76)
                .outerRadius(76)
                .startAngle(function(d,i){
                    return (-p/2)+(p/total)*i; 
                })
                .endAngle(function(d,i){
                    return(-p/2)+(p/total)*(i+1);
                });

            /*Je défini un compteur j car le i revient à 0 au changement de donnée*/
            var j = 0;
            /*Variable d'incrémentation*/
            var incr = 1;
            var already_passed = false;
            /*Je selectionne tout les path (qui n'ont pas la classe du 'g' que l'on veut garder)*/
            gNotChosen.selectAll("path")
            /*Pour chaque path lui dit de revenir a 0*/
            /*Dans ce code je gère le repliement de chaque arc de manière continue*/
            .each(function(d,i) {
                if (j==total && already_passed===false) {
                    j=(total*2)-1;
                    incr=-1;
                    already_passed = true;
                }
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .delay(50*j)
                    .attr('d',arc0);
                j+=incr;
            });
            var arcToUpdate;
            var indice;
            switch(classClicked){
                case "popu":
                  arcToUpdate = arc3;
                  indice = "3";
                break;

                case "vente":
                  arcToUpdate = arc2;
                  indice = "2";
                break;

                case "album":
                  arcToUpdate = arc1;
                  indice = "1";
                break;
            }
        if (indice) {

        }else{
            indice = 3;
        }
            canvas.selectAll("text")
                .transition()
                .duration(1000)
                .delay(function(d,i){return 100*i;})
                .attr("transform", function(d, i){
                   /*Gère la rotation du texte, et le retourne passé les 90° pour ne pas avoirà lire à l'envers*/
                    var chiffre;
                    var donnee = +eval("d.v"+indice);// jshint ignore:line
                    var angleRotation;
                    var x;
                    var y;
                    if(donnee>1000000){
                        chiffre = (donnee+1500000)/2.5;
                    }else{
                        chiffre = donnee;
                    }
                    if(((i+0.5)*180/total)<90){
                        angleRotation = ((i+0.5)*180/total);
                        x = ((eval('scale'+indice)(chiffre)+93)*-Math.cos((i+0.5)*(Math.PI)/total)+r);// jshint ignore:line
                        y = ((eval('scale'+indice)(chiffre)+93)*Math.sin((i+0.5)*(-Math.PI)/total)+r);// jshint ignore:line
                    }else{
                        angleRotation = ((i+0.5)*180/total)-180;
                        x = ((eval('scale'+indice)(chiffre)+10)*-Math.cos((i+0.5)*(Math.PI)/total)+r);// jshint ignore:line
                        y = ((eval('scale'+indice)(chiffre)+10)*Math.sin((i+0.5)*(-Math.PI)/total)+r);// jshint ignore:line
                    }
                    /*Placement du texte*/
                    return "translate("+ (x+60) +","+ y +")rotate("+ angleRotation + ")";
                });


        if (classClicked === undefined || classClicked === "") {
            d3.select('g.popu').selectAll("path")
              .transition()
              .duration(1000)
              .delay(function(d,i){return 50*i;})
              .attr('d',arc3);
            d3.select('g.vente').selectAll("path")
              .transition()
              .duration(1000)
              .delay(function(d,i){return 50*i;})
              .attr('d',arc2);
            d3.select('g.album').selectAll("path")
              .transition()
              .duration(1000)
              .delay(function(d,i){return 50*i;})
              .attr('d',arc1);

        }else{
            gChosen.selectAll("path")
                .transition()
                .duration(1000)
                .delay(function(d,i){return 50*i;})
                .attr('d',arcToUpdate);
        }
    });
}














});

});