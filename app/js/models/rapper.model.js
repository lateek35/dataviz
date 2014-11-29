define(['backbone'], function (backbone) {

/*==========================================================================================*/
/*---------------------------------  MODELE POUR UN RAPPER  --------------------------------*/
/*==========================================================================================*/
  var Rapper = Backbone.Model.extend({
    initialize: function() {

		var that = this;
    	var likes;
		var UrlGetLike = "https://api.facebook.com/method/fql.query?query=select%20like_count%20from%20link_stat%20where%20url=%27https://www.facebook.com/booba%27&format=json";
		$.getJSON( UrlGetLike, {
			format: "json"
		})
	    .done(function(data) {
	     	likes = data[0].like_count;
			that.set({
				'blazz' : 'PD'
			});
			that.returnn;
	    });
    },
    returnn: function(){
    	console.log('test');
  		return this;
    }
    // defaults : {
    //   blazz: "pas de blazz"
    // }
  });
return Rapper;
});
