var gulp = require('gulp'),
	compass = require('gulp-sass'),
	livereload = require('gulp-livereload'),
	imagemin = require('gulp-imagemin'),
	pngcrush = require('imagemin-pngcrush'),
	clean = require('gulp-clean'),
	size = require('gulp-filesize'),
	changed = require('gulp-changed'),
	plumber = require('gulp-plumber'),
	jshint = require('gulp-jshint'),
	scsslint = require('gulp-scss-lint'),
	gulpFilter = require('gulp-filter'),
	runSequence = require('run-sequence'),
	minifyCSS = require('gulp-minify-css'),
    rjs = require('gulp-requirejs'),
    uglify = require('gulp-uglify'),
    notify = require("gulp-notify"),
    ftp = require('gulp-ftp'),
	yesno = require('yesno'),
	filelog = require("gulp-filelog"),
	open = require('open'),
	Notification = require('node-notifier');



//CLEAN DU DOSSIER DIST
gulp.task('clean', function () {
    return gulp.src(["./dist/*","!./dist/{img,img/*}"], {read: false})
        .pipe(clean({force: true}));
});

//MASTERCLEAN DU DOSSIER DIST
gulp.task('master-clean', function () {
    return gulp.src("./dist", {read: false})
        .pipe(clean({force: true}));
});

//TRANSFERT DES FONTS
gulp.task('fonts', function(){
	return gulp.src('app/fonts/**/*.{eot,svg,ttf,woff}')
		.pipe(changed('dist/fonts'))
		.pipe(gulp.dest('dist/fonts'))
});

//CONTROLES ET TRANSFERT DES CSS
gulp.task('style', function(){

	var allscss = gulpFilter(['**/*.scss']);
	var master = gulpFilter(['master.scss']);

	return gulp.src('app/style/**')
		.pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(allscss)
		.pipe(changed('dist/style'))
  //   	.pipe(scsslint({
		//     'config': 'lint.yml',
		// }))
    .pipe(allscss.restore())
		.pipe(master)
		.pipe(compass({}))
    .on('error', function(err) {
      // Would like to catch the error here
    })
		.pipe(size())
		.pipe(minifyCSS({
			keepSpecialComments : 0,

		}))
		.pipe(size())
		.pipe(gulp.dest('dist/style'))
});

//CONTROLES ET TRANSFERT DES JS
gulp.task('jshint', function(){
	return gulp.src(["./app/js/**/*.js", "!./app/js/libs/*.js"])
		.pipe(changed('./dist/js/**/*.js'))
		.pipe(jshint())
  		.pipe(jshint.reporter('jshint-stylish'));
});

//CONTROLES ET TRANSFERT DES JS
gulp.task('js', function(){
	return gulp.src("./app/js/**/*.js")
		.pipe(changed('./dist/js'))
		.pipe(gulp.dest('./dist/js'));
});


gulp.task('requirejsBuild', function() {
    rjs({
    	baseUrl: './app/js',
    	name:'main',
        out: 'main.js',
        shim: {
		    fullpage: {
		        deps: [
		            'jquery'
		        ]
		    },
		    slimScroll: {
		        deps: [
		            'jquery'
		        ]
		    },
		    underscore: {
		        exports: '_'
		    },
		    handlebars: {
		        exports: 'Handlebars'
		    },
		    d3: {
		        exports: 'd3'
		    },
		    backbone: {
		      deps: ['fullpage','underscore','handlebars','jquery'],
		      exports: 'Backbone'
		    }
		},
		paths: {
			jquery:      'libs/require-jquery',
			slimScroll:      'libs/slimScroll',
			fullpage: 'libs/jquery.fullPage',
			underscore:  'libs/underscore',
			handlebars : 'libs/handlebars.amd',
			backbone:    'libs/backbone',
			d3:    'libs/d3',
			modelRapper: 'models/rapper.model',
			collectionRapper: 'collections/rapper.collection',
			viewRapperList: 'views/rapperList.view',
			viewRapperListInsults: 'views/rapperListInsults.view',
			viewRapperPage: 'views/rapperPage.view',
			viewModuleComparaison: 'views/moduleComparaison.view'
		},
		optimize: "uglify"
    })
	.pipe(size())
    .pipe(uglify())
	.pipe(size())
    .pipe(gulp.dest('./dist/js')); // pipe it to the output DIR
});


//TRANSFERT DES JSON
gulp.task('json', function(){
	return gulp.src('app/js/**/*.json')
		.pipe(changed('./dist/js'))
		.pipe(gulp.dest('./dist/js'));
});


//TRANSFERT DES HTML
gulp.task('html', function(){
	return gulp.src('app/**/*.{html,php}')
		.pipe(changed('./dist'))
		.pipe(gulp.dest('./dist'))
});

//COMPRESSION ET TRANSFERT DES IMAGES
gulp.task('images', function(){
	return gulp.src('app/img/**/*.{jpg,jpeg,png,tiff,svg}')
        .pipe(changed('./dist/img'))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest('./dist/img'));
});

//COMMANDE DE BUILD SEQUENCER
gulp.task('build', function() {
  runSequence('clean',
  	['fonts','style','json','html','jshint','js','images'],'watch'
  );
});

//COMMANDE DE BUILD-PREPROD SEQUENCER
gulp.task('deploy', function() {
  runSequence('master-clean',
  	['fonts','style','json','html','jshint','js','requirejsBuild','images'],'ask'
  );
});


//ASK DE BUILD-PREPROD SEQUENCER
gulp.task('ask', function() {
	return yesno.ask('All works fine in local?, so are you sur to push files in preprod ?', true, function(ok) {
	    if(ok) {
	        runSequence('deploy-preprod');
	    } else {
	        console.log("Preprod deploy aborted.");
	        process.exit();
	    }
	});
});

//COMANDE DE DEPLOIEMENT
gulp.task('deploy-preprod', function () {
    return gulp.src('dist/**/*')
        .pipe(ftp({
            host: 'ftp.panamallstarz.fr',
            user: 'panamall',
            pass: 'paname93',
            remotePath : 'preprod'
        }))
        .pipe(filelog());
});

//COMANDE DE DEPLOIEMENT
gulp.task('exit', function () {
	var notifier = new Notification();
	notifier.notify({
	  title: 'Task success :D',
	  message: 'Deploy ok, try to open the preprod'
	});
	open('http://preprod.panamallstarz.fr');
	setTimeout(function () {
    	process.exit();
    }, 3000); 
});

gulp.task('default',['build'], function(){

});


//COMMANDE DE WATCH
gulp.task('watch', function(){

	var server = livereload();
	livereload.listen();

    gulp.watch('app/style/**/*.scss', ['style']);
    gulp.watch('app/fonts/**/*.{eot,svg,ttf,woff}', ['fonts']);
    gulp.watch('app/js/**/*.json', ['json']);
    gulp.watch('app/js/**/*.js', ['jshint','js']);
    gulp.watch('app/*.{html,php}', ['html']);
    gulp.watch('app/js/**/*.html', ['template']);
    gulp.watch('app/img/**/*.{jpg,jpeg,png,tiff,svg}', ['images']);


	gulp.watch([
        'app/style/**/*.scss',
        'app/fonts/**/*.{eot,svg,ttf,woff}',
        'app/js/**/*.json',
        'app/js/**/*.js',
        'app/*.{html,php}',
        'app/js/**/*.html',
        'app/img/**/*.{jpg,jpeg,png,tiff,svg}'
    ]).on('change', function (file) {
        console.log('change on :\n'+"\x1b[32m"+file.path);
        var filepath = file.path;
         setTimeout(function () {
    		server.changed(filepath);
        }, 200); // wai
    });
});




