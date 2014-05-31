define(['backbone','modelRapper'], function (backbone, modelRapper) {

/*==========================================================================================*/
/*---------------------------------  COLLECTION DE RAPPERS  --------------------------------*/
/*==========================================================================================*/
  var Rappers = Backbone.Collection.extend({
    // defaults : {
    //   blazz: "pas de blazz"
    // },
    model : modelRapper,
    url : './js/data.json'
  })

  return Rappers;
});