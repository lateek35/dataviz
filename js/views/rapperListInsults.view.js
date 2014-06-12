define(['backbone','modelRapper','collectionRapper','d3'], function (backbone, modelRapper,collectionRapper,d3) {

/*==========================================================================================*/
/*----------------------------  VUE POUR COLLECTION DE RAPPERS  ----------------------------*/
/*==========================================================================================*/
  var RapperListInsults = Backbone.View.extend({
    el:'#container-module',
    initialize: function(collection){
      _.bindAll(this, 'render');
      this.collection.fetch({
        success: function(collection, response){
          // _.each(console.log(rappers.toJSON()));
        }
      });
      // console.log(this.collection.toJson());
      // var datas = this.collection.toJSON();
      // console.log(datas);
    },
    render: function(){
      // this.collection.fetch({
      //   success: function(rappers){
      //     _.each(datas.push(rappers.toJSON()));
      //   }
      // });
      
      // console.log(datas);

      var chart = d3.select(this.el).append("div")
          .attr("class", "hard-rapper")
          .style("width", "970px")
          .style("height", "400px");

      console.log(this.chart);

      d3.json(this.collection.url, function(error, data) {

          chart.selectAll("div")
                    .data(data)
                  .enter().append("div")
                    .attr("class","mask")
                    .style("left", function(d, i) { return i * 100 + "px"; })
                    .text(function(d) { return d.blazz; });
      });

    }
  });
  return RapperListInsults;
 });