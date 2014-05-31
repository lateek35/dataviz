define(['backbone','modelRapper','collectionRapper'], function (backbone, modelRapper,collectionRapper) {

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
          var source = $("#template").html();
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
        }
      })
    }
  });
  return RapperList;
 });