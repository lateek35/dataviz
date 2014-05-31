
({
    appDir: './',
    baseUrl: './js',
    dir: './build',
    modules: [
        {
            name: 'main'
        }
    ],
    fileExclusionRegExp: /^(r|build)\.js$/,
    optimizeCss: 'standard',
    removeCombined: true,
    paths: {
        jquery:      'libs/require-jquery',
        fullpage: 'libs/jquery.fullPage',
        underscore:  'libs/underscore',
        handlebars : 'libs/handlebars.amd',
        backbone:    'libs/backbone',
        d3:    'libs/d3',
        modelRapper: 'models/rapper.model',
        collectionRapper: 'collections/rapper.collection',
        viewRapperList: 'views/rapperList.view'
    },
    shim: {
        fullpage: {
            deps: [
                'jquery'
            ]
        },
        underscore: {
            exports: '_'
        },
        d3: {
            exports: 'd3'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery',
                'handlebars'
            ],
            exports: 'Backbone'
        },
        backboneLocalstorage: {
            deps: ['backbone'],
            exports: 'Store'
        }
    }
})