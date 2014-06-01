define(['backbone','modelRapper','collectionRapper','text!templates/liste-rappeur.html'], function (backbone, modelRapper,collectionRapper,jstemplate) {

/*==========================================================================================*/
/*----------------------------  VUE POUR COLLECTION DE RAPPERS  ----------------------------*/
/*==========================================================================================*/
  var RapperList = Backbone.View.extend({
    el:'#page',
    render: function(cp){
      var html = [];
      var that = this;
      var rappers = new collectionRapper();
      rappers.fetch({
        success: function(rappers){
          var source = jstemplate;
          var template = Handlebars.compile(source);
          if(cp == -1){
            html = rappers.toJSON();
          }else{
            var rappersFiltered = rappers.where({dep: parseInt(cp)});
            _.each(rappersFiltered, function(rapper){
              html.push(rapper.toJSON());
            });
          }

          // console.log(JSON.parse(rappersFiltered));
          // console.log(rappers.toJSON());
          // that.$el.html(template({rappers : rappersFiltered}));


          // populate the DOM with the resulting HTML
          that.$el.html(template(html));
          that.delegateEvents()
        }
      })
    },
    events: {
      "click": "affichedep"  
    },
    affichedep : function(){
      
    }
  });
  return RapperList;
 });

