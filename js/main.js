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
      deps: ['underscore','handlebars','jquery'],
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
  $(this).css('fill', 'rgba(255,0,50,0)')
}
$('path').on('mouseenter',mouseenterMap);
$('path').on('mouseout',mouseoutMap);

$('svg#carte').mouseup(function(e){
  $('path').show().attr('class','');
  $('path').bind('mouseenter',mouseenterMap);
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
  normalScrollElements: '#page-rapper',
  afterLoad: function(anchorLink, index){
    var suplmement = (Backbone.history.fragment).substring(2);
    router.navigate(""+index+"/"+suplmement);
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
      ':3/' : 'module-hard',
      ':3' : 'module-hard',
      ':2/dep/:cp/:rapper' : 'rapperSolo',
      ':2/dep/:cp' : 'departement',
      ':slide' : 'home',
      ':slide/' : 'home'
    }
  });

  var rappers = new collectionRapper();
  var rapperList = new viewRapperList({collection : rappers});
  var rapperListInsults = new viewRapperListInsults({collection : rappers});
  //var moduleComparaison = new viewModuleComparaison({collection : rappers});

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
  router.on('route:rapperSolo',function(slide,cp,rapper){
    $.fn.fullpage.moveTo(2,1);
    var rapperPage = new viewRapperPage({collection : rappers});
    rapperPage.runFilter(rapper);
  });
  router.on('route:module-hard',function(){
    $.fn.fullpage.moveTo(3,0);
    //moduleComparaison.render(-1);
  });

  var moveSlide = function(slide){
    $.fn.fullpage.moveTo(slide); 
  };

  Backbone.history.start();
























$('body').on('click','.option',
    /*Event sur les boutton pour update les données*/
    function(event){
        eventPassed = event || window.event //For IE
        /*Je passe l'event pour récuperer l'objet*/
        updateData(eventPassed);
    }
);
/*==========================================================================================*/
/*-----------------------------------  CREATION DU MODULE  ----------------------------------*/
/*==========================================================================================*/

    var r = 593;
    var p = Math.PI;
    var intervalScale = 8;
    var color = d3.scale.linear()
        .domain([-1, 0, 1])
        .range(["#515e44", "#4a4758", "#e84852"]);

    var colorB = d3.scale.linear()
        .domain([-1, 0, 1])
        .range(["#516839", "#453F61", "#F73943"]);

    var canvas = d3.select('#container-module-comparaison').append('svg')
        .attr('width','100%')
        .attr('height','100%')

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
    var finScalePopu = debutScalePopu+(27*(intervalScale));


    var scale1 = d3.scale.linear();
        scale1.domain([1, 8]);
        scale1.range([76, finScaleAlbum]);

    var scale2 = d3.scale.linear();
        scale2.domain([0, 2000000]);
        scale2.range([debutScaleVente, finScaleVente]);

    var scale3 = d3.scale.linear();
        scale3.domain([0, 3000000]);
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
        .radius(function(d, i) {return radius})
        .angle(function(d, i) { return angle(i); });

d3.json('./js/data2.json',function(data){

    total = data.length

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
            console.log(chiffre);
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
            $('#tes').text(d.v1); /*ICI JE TEMPLATE !!*/
            d3.select(this).transition().duration(200).style('fill',function(d){
                return d3.rgb(colorB(-1));
            });
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
            $('#tes').text(d.v2); /*ICI JE TEMPLATE !!*/
            d3.select(this).transition().duration(200).style('fill',function(d){
                return d3.rgb(colorB(0));
            });
        })
        .on('mouseout',function(){
            d3.select(this).transition().duration(200).style('fill',function(d){
                return d3.rgb(color(0));
            });
        })

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
        })
        .on('mouseout',function(){
            d3.select(this).transition().duration(200).style('fill',function(d){
                return d3.rgb(color(1));
            });
        });

    /*J'ajoute le texte*/
    d3.select('#container-module-comparaison>svg').selectAll("text").data(data).enter()
        .append("text")
        .text(function(d) { return d.name; });

    for(i=0; i<65; i++){
      //J'augmente le rayon du cercle pour chaque passage
      if(i>35){
           radius = 76+(i*intervalScale);
          canvas.append("path").datum(d3.range(points))
            .attr("class", "line-red")
            .attr("d", line)
            .attr("transform", "translate("+(r+60)+","+(r)+")" + ",rotate(-90)");
      }else if (i>15) {
          radius = 76+(i*intervalScale);
          canvas.append("path").datum(d3.range(points))
            .attr("class", "line-blue")
            .attr("d", line)
            .attr("transform", "translate("+(r+60)+","+(r)+")" + ",rotate(-90)");
      }else if(i%2==0){
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
    d3.json('./js/data2.json',function(data){
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
                if (j==total && already_passed==false) {
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
            switch(classClicked){
                case "popu":
                    var arcToUpdate = arc3;
                    var indice = "3";
                break;

                case "vente":
                    var arcToUpdate = arc2;
                    var indice = "2";
                break;

                case "album":
                    var arcToUpdate = arc1;
                    var indice = "1";
                break;
            }
        if (indice) {

        }else{
            indice = 3;
        }
            canvas.selectAll("text")
                .transition()
                .duration(1000)
                .delay(function(d,i){return 100*i})
                .attr("transform", function(d, i){
                   /*Gère la rotation du texte, et le retourne passé les 90° pour ne pas avoirà lire à l'envers*/
                    var chiffre;
                    var donnee = +eval("d.v"+indice);
                    if(donnee>1000000){
                        chiffre = (donnee/10)+900000;
                    }else{
                        chiffre = donnee;
                    }
                    if(((i+0.5)*180/total)<90){
                        var angleRotation = ((i+0.5)*180/total);
                        var x = ((eval('scale'+indice)(chiffre)+70)*-Math.cos((i+0.5)*(Math.PI)/total)+r)
                        var y = ((eval('scale'+indice)(chiffre)+70)*Math.sin((i+0.5)*(-Math.PI)/total)+r)
                    }else{
                        var angleRotation = ((i+0.5)*180/total)-180;
                        var x = ((eval('scale'+indice)(chiffre)+10)*-Math.cos((i+0.5)*(Math.PI)/total)+r)
                        var y = ((eval('scale'+indice)(chiffre)+10)*Math.sin((i+0.5)*(-Math.PI)/total)+r)
                    }
                    /*Placement du texte*/
                    return "translate("
                    + (x+60) +
                    ","
                    + y + ")" +
                    "rotate(" 
                    + angleRotation + ")";
                })


        if (classClicked == undefined || classClicked =="") {
            d3.select('g.popu').selectAll("path")
                .transition()
                .duration(1000)
                .delay(function(d,i){return 50*i})
                .attr('d',arc3);
            d3.select('g.vente').selectAll("path")
                .transition()
                .duration(1000)
                .delay(function(d,i){return 50*i})
                .attr('d',arc2);
            d3.select('g.album').selectAll("path")
                .transition()
                .duration(1000)
                .delay(function(d,i){return 50*i})
                .attr('d',arc1);

        }else{
            gChosen.selectAll("path")
                .transition()
                .duration(1000)
                .delay(function(d,i){return 50*i})
                .attr('d',arcToUpdate);
        }
    });
}















});

});