define(['backbone','d3','modelRapper','collectionRapper','text!templates/module-comparaison.html'], function (backbone, d3, modelRapper,collectionRapper,jstemplate) {

/*==========================================================================================*/
/*----------------------------  VUE POUR COLLECTION DE RAPPERS  ----------------------------*/
/*==========================================================================================*/
  var RapperList = Backbone.View.extend({
    el:'#module-comparaison',
    initialize: function(){

    },
    runFilter: function(cp){
      this.filter = {dep:cp};
      this.render();
    },
    render: function(cp){
      var html = [];
      var that = this;
      var filter = this.filter;
      var d3 = this.d3;
      this.collection.fetch({
        success: function(rappers){
          var source = jstemplate;
          var template = Handlebars.compile(source);
          html = rappers.toJSON();
          console.log(html);
          d3(html);

          // console.log(JSON.parse(rappersFiltered));
          // console.log(rappers.toJSON());
          // that.$el.html(template({rappers : rappersFiltered}));

          // populate the DOM with the resulting HTML
           that.$el.html(template(html));  ///!\ A remettre poour templater
        }
      })
    },
    d3 : function(html){





        
    }
  });
  return RapperList;
 });

