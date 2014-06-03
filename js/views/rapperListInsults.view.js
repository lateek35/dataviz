define(['backbone','modelRapper','collectionRapper','d3'], function (backbone, modelRapper,collectionRapper,d3) {

/*==========================================================================================*/
/*----------------------------  VUE POUR COLLECTION DE RAPPERS  ----------------------------*/
/*==========================================================================================*/
  var RapperListInsults = Backbone.View.extend({
    el:'#container-module',
    initialize: function(collection){
      console.log(collection);
      console.log(this.collection);
      this.collection.fetch({
        render: function(rappers){
          _.each(console.log(rappers.toJSON()));
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

      this.chart = d3.select(this.el).append("div")
          .attr("class", "hard-rapper")
          .style("width", "970px")
          .style("height", "400px");

      d3.json(this.collection.toJSON(), function(error, data) {
          
      });

      return this;
    }
  });
  return RapperListInsults;
 });