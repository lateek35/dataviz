define(['backbone','modelRapper','collectionRapper','text!templates/page-rappeur.html','d3'], function (backbone, modelRapper,collectionRapper,jstemplate,d3) {

/*==========================================================================================*/
/*----------------------------  VUE POUR COLLECTION DE RAPPERS  ----------------------------*/
/*==========================================================================================*/
  var RapperPage = Backbone.View.extend({
    el:'#page-rapper',
    runFilter: function(rapper){
      this.filter = {blazz:rapper};
      this.render();
    },
    render: function(cp){
      var html = [];
      var that = this;
      //var d3 = this.d3;
      var filter = this.filter;
      this.collection.fetch({
        success: function(rappers){
          var source = jstemplate;
          var template = Handlebars.compile(source);
          if(cp == -1){
            html = rappers.toJSON();
          }else{
            var rappersFiltered = rappers.where(filter);
            _.each(rappersFiltered, function(rapper){
              //d3(rapper.toJSON());/*------ICI----------*/
              html.push(rapper.toJSON());
            });
          }

          // console.log(JSON.parse(rappersFiltered));
          // console.log(rappers.toJSON());
          // that.$el.html(template({rappers : rappersFiltered}));

          // populate the DOM with the resulting HTML
          that.$el.html(template(html));
        }
      })
    },
    events: {
      "click": "affichedep",
      "click #album-vendu" : "d3",
      "click #popularite" : "popularite",
      "click #bio" : "biographie"
    },
    affichedep : function(){
      
    },
    d3 : function(e){
      $('#conteiner-module-albums').attr('class','');
      $("#conteiner-popularite").attr('class','displayNonePage');
      $("#conteiner-biographie").attr('class','displayNonePage');
      $('#album-vendu').attr('class','activeLiFiche');
      $('#popularite').attr('class','');
      $('#bio').attr('class','');

      if(!($('#conteiner-module-albums svg').attr('class')=="already-rend")){

        $('#conteiner-module-albums svg').attr('class','already-rend');

          var idRapper = $(e.target).data('id');
          idRapper=idRapper-1;

          console.log(idRapper);

          var height = 280,
              width = 960;

          var svgAlbums = d3.select(this.el).select('#graph-albums');

          var pathArea;
          var pathLine;
          var gAlbum;

          var y = d3.scale.linear()
            .range([height, 0]);

          var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

          var yAxisAlbum = d3.svg.axis()
            .scale(y)
            .orient("left");

          var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

          d3.json(this.collection.url, function(error, data) {
              x.domain(data[idRapper].album.map(function(d,i) { return "ALBUM "+(i+1); }));
              y.domain([0, 1000000]);
              var nbAlbum = parseInt(data[idRapper].album.length);
              var posAlbum = width/(nbAlbum-1);

              svgAlbums.data(data[idRapper].album).enter();

              svgAlbums.append("g")
                .attr('class', 'g-axis-albums')
                .attr('transform', "translate(-10, 0)")
                .append("g")
                .attr("class", "y-album axis-album")
                .call(yAxisAlbum);

              svgAlbums.append("g")
                .attr('class', 'g-axis-albums-x')
                .append("g")
                .attr("class", "x-album axis-x-album")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

              d3.select(".axis-x-album").selectAll(".tick")
                .each(function(d,i) {
                    $(this).attr("transform","translate("+(posAlbum*i)+",0)");
                });

              d3.select(".axis-x-album").select(".tick").select("text")
                .style("text-anchor","start");

              pathArea = svgAlbums.append("path").attr('class','area-album');
              pathLine = svgAlbums.append("g").attr('class','g-line').append("path");
              gAlbum = svgAlbums.append("g").attr('class', 'g-album');

              var line = d3.svg.line()
                .x(function(d,i) { return (posAlbum*i); })
                .y(function(d) { return y(d.a_sells); });

              pathLine.datum(data[idRapper].album)
                .attr("class", "line")
                .attr("d", line);

              var area = d3.svg.area()
                .x(function(d,i) { return (posAlbum*i); })
                .y0(height)
                .y1(function(d) { return y(d.a_sells); });

              pathArea.datum(data[idRapper].album)
                .attr("class", "area")
                .attr("d", area);
              
              var barAlbums = gAlbum.selectAll("g")
                .data(data[idRapper].album).enter()
                .append("g")
                .attr("class", "g-rapper")
                .attr("transform", function(d,i){return "translate("+((posAlbum*i))+", 0)";});
                
              barAlbums.append("circle")
                  .attr("r",6)
                  .attr("fill","#e94953")
                  .attr("stroke","#f0f0f0") 
                  .attr("stroke-width","1")
                  .attr("cy", function(d) { return y(d.a_sells); });

              barAlbums.append("circle")
                  .attr("r",6)
                  .attr("fill","#e94953")
                  .attr("stroke","#f0f0f0") 
                  .attr("stroke-width","1")
                  .attr("cy", function(d) { return y(d.a_sells); })
                  .on("mouseover", function(d,i){
                    d3.selectAll("#album-text"+i).attr("class", "activeDisplay");
                    d3.select("#album-rect"+i).attr("class", "activeDisplay");
                  })
                  .on("mouseleave", function(d,i){
                    d3.selectAll("#album-text"+i).attr("class", "");
                    d3.select("#album-rect"+i).attr("class", "");
                  });

              barAlbums.append("rect")
                  .attr("id",function(d,i){return "album-rect"+i;})
                  .attr("width", "170px")
                  .attr("height", "50px")
                  .attr("rx","3")
                  .attr("ry","3")
                  .attr("fill", "#e94953")
                  .attr("x","-85")
                  .attr("y", function(d) { return y(d.a_sells)-62; });

              barAlbums.append("text")
                  .style("font-size","14px")
                  .style("font-family","source_sans_prolight")
                  .attr("id",function(d,i){return "album-text"+i;})
                  .attr("y",function(d) { return y(d.a_sells)-40; })
                  .text(function(d) { return d.a_name; });

              barAlbums.append("text")
                  .style("font-size","14px")
                  .style("font-family","source_sans_probold")
                  .attr("id",function(d,i){return "album-text"+i;})
                  .attr("y",function(d) { return y(d.a_sells)-20; })
                  .text(function(d) { return d.a_sells; });

          });

      }

    },
    popularite : function(e){
      $('#conteiner-module-albums').attr('class','displayNonePage');
      $("#conteiner-popularite").attr('class','');
      $("#conteiner-biographie").attr('class','displayNonePage');
      $('#album-vendu').attr('class','');
      $('#popularite').attr('class','activeLiFiche');
      $('#bio').attr('class','');

      if(!($('#conteiner-popularite ul').attr('class')=="already-rend")){

        $('#conteiner-popularite ul').attr('class','already-rend');

          var idRapper = $(e.target).data('id');
          idRapper=idRapper-1;

          var svgFans = d3.select(this.el).select('#graph-fans');
          var textFanVs = d3.select(this.el).select('.circle-total');
          var τ = 2 * Math.PI;
          var arc = d3.svg.arc()
            .innerRadius(92)
            .outerRadius(100)
            .startAngle(0);
          var group = svgFans.append("g")
              .attr("transform","translate(100,100)");

          d3.json(this.collection.url, function(error, data) {
            var angle = (data[idRapper].v3 * τ)/data[idRapper].total_fans;
            var percent = Math.floor((data[idRapper].v3 * 100)/data[idRapper].total_fans);
            var foreground = group.append("path")
            .datum({endAngle: angle})
            .style("fill", "#e94953")
            .attr("d", arc);

            foreground.transition()
              .duration(2000)
              .call(arcTween, angle);

            function arcTween(transition, newAngle) {
                transition.attrTween("d", function(d) {
                  var interpolate = d3.interpolate(d.endAngle, newAngle);
                  return function(t) {
                    d.endAngle = interpolate(t);
                      return arc(d);
                  };
                });
            }

            textFanVs.append("text")
              .text(0)
              .attr('fill','#e94953')
              .style('color','#e94953')
              .transition()
              .duration(500)
              .tween("text", function(d) {
                  var i = d3.interpolate(this.textContent, percent),
                      prec = (percent + "").split("."),
                      round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;
                  return function(t) {
                      this.textContent = (Math.round(i(t) * round) / round)+"%";
                  };
              });

              d3.select(".pLikes")
              .text(0)
              .transition()
              .duration(1000)
              .tween("text", function(d) {
                  var i = d3.interpolate(this.textContent, data[idRapper].likes),
                      prec = (data[idRapper].likes + "").split("."),
                      round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;
                  return function(t) {
                      this.textContent = Math.round(i(t) * round) / round;
                  };
              });

              d3.select(".pTwitter")
              .text(0)
              .transition()
              .duration(1000)
              .tween("text", function(d) {
                  var i = d3.interpolate(this.textContent, data[idRapper].followers),
                      prec = (data[idRapper].followers + "").split("."),
                      round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;
                  return function(t) {
                      this.textContent = Math.round(i(t) * round) / round;
                  };
              });

              d3.select(".pAbonne")
              .text(0)
              .transition()
              .duration(1000)
              .tween("text", function(d) {
                  var i = d3.interpolate(this.textContent, data[idRapper].abonnes),
                      prec = (data[idRapper].abonnes + "").split("."),
                      round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;
                  return function(t) {
                      this.textContent = Math.round(i(t) * round) / round;
                  };
              });

              d3.select(".pInstagram")
              .text(0)
              .transition()
              .duration(1000)
              .tween("text", function(d) {
                  var i = d3.interpolate(this.textContent, data[idRapper].instagram),
                      prec = (data[idRapper].instagram + "").split("."),
                      round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;
                  return function(t) {
                      this.textContent = Math.round(i(t) * round) / round;
                  };
              });

              d3.select(".fan-rapper")
              .text(0)
              .transition()
              .duration(1000)
              .tween("text", function(d) {
                  var i = d3.interpolate(this.textContent, data[idRapper].v3),
                      prec = (data[idRapper].v3 + "").split("."),
                      round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;
                  return function(t) {
                      this.textContent = Math.round(i(t) * round) / round;
                  };
              });

              d3.select(".total-rappers-fan")
              .text(0)
              .transition()
              .duration(1000)
              .tween("text", function(d) {
                  var i = d3.interpolate(this.textContent, data[idRapper].total_fans),
                      prec = (data[idRapper].total_fans + "").split("."),
                      round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;
                  return function(t) {
                      this.textContent = Math.round(i(t) * round) / round;
                  };
              });

          });

      }

    },
    biographie : function(){
      $('#conteiner-module-albums').attr('class','displayNonePage');
      $("#conteiner-popularite").attr('class','displayNonePage');
      $("#conteiner-biographie").attr('class','');
      $('#album-vendu').attr('class','');
      $('#popularite').attr('class','');
      $('#bio').attr('class','activeLiFiche');
    }
  });
  return RapperPage;
 });
