define(['backbone','modelRapper','collectionRapper','text!templates/liste-rappeur.html'], function (backbone, modelRapper,collectionRapper,jstemplate) {

/*==========================================================================================*/
/*----------------------------  VUE POUR COLLECTION DE RAPPERS  ----------------------------*/
/*==========================================================================================*/
  var RapperList = Backbone.View.extend({
    el:'#list-bottom',
    events: {
      "click #list-rapper": "runFilter",
      "click": "affichedep"
    },
    initialize: function(){

    },
    runFilter: function(cp){
      this.filter = {dep:cp};
      this.render();
    },
    render: function(cp){
      var html = [] ;
      var that = this;
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
              html.push(rapper.toJSON());
            });
          }

          // console.log(JSON.parse(rappersFiltered));
          // console.log(rappers.toJSON());
          // that.$el.html(template({rappers : rappersFiltered}));

          // populate the DOM with the resulting HTML
          that.$el.html(template(html));
        }
      });
    },
    affichedep : function(){
      
    }
  });
  return RapperList;
 });

