define(['backbone','modelRapper','collectionRapper','text!templates/page-rappeur.html'], function (backbone, modelRapper,collectionRapper,jstemplate) {

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
      var d3 = this.d3;
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
              d3(rapper.toJSON());/*------ICI----------*/
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
      "click": "affichedep"  
    },
    affichedep : function(){
      
    },
    d3 : function(donnee){
      console.log(donnee.blazz);/*------ICI----------*/
    }
  });
  return RapperPage;
 });
