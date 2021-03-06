var config = require('./config')
var stylizer = require('stylizer')
var templatizer = require('templatizer')
var join = require('path').join

// for reuse
var appDir = join(__dirname, '/client/js')
var cssDir = join(__dirname, '/client/css')
var templatesDir = join(__dirname, '/client/templates')

module.exports = {
  // Tell the Hapi server what URLs the application should be served from.
  // Since we're doing clientside routing we want to serve this from some type
  // of wildcard url.
  // examples:
  //     '/{p*}' - match everything that isn't matched by something more specific
  //     '/dashboard/{p*}' - serve the app at all routes starting with '/dashboard'
  appPath: '/{p*}',
  // The moonboots config
  moonboots: {
    // The base name of the javascript file served in the <script src="the_name.*.js">
    jsFileName: 'eventdeck',
    // The base name of the css file served in the <link rel="stylesheet" src="the_name.*.css">
    cssFileName: 'eventdeck',
    main: appDir + '/app.js',
    developmentMode: config.isDev,
    // Specify any non-commonjs libraries we wish to include.
    // You can think of this as your list of <script> tags in your HTML.
    // These will simply be included before any of your application code in the
    // order you provide them. So for example, if you're using jQuery make sure
    // you list any plugins after jQuery itself.
    libraries: [],
    // Specify the stylesheets we want to bundle
    stylesheets: [
      cssDir + '/vendor/ink.css',
      cssDir + '/vendor/chosen.css',
      cssDir + '/vendor/pikaday.css',
      cssDir + '/vendor/fullcalendar.css',
      cssDir + '/app.css'
    ],
    beforeBuildJS: function () {
      // This re-builds our template files from jade each time the app's main
      // js file is requested. Which means you can seamlessly change jade and
      // refresh in your browser to get new templates.
      // if (config.isDev) {
      templatizer(templatesDir, appDir + '/templates.js')
    // }
    },
    beforeBuildCSS: function (done) {
      // We only want to do this in dev mode. If it's not in dev mode, this
      // function will only be run once.
      if (!config.isDev) {
        stylizer({
          infile: cssDir + '/app.styl',
          outfile: cssDir + '/app.css',
          development: config.isDev
        }, done)
        return
      }
      // Re-compile stylus to css each time the app's main css file is requested.
      // In addition there's a "watch" option that will make stylizer also be able
      // to talk to livereaload (http://livereload.com/) browser plugins for sneakily
      // refreshing styles without waiting for you to refresh or running/configuring
      // the live reload app.
      stylizer({
        infile: cssDir + '/app.styl',
        outfile: cssDir + '/app.css',
        development: config.isDev,
        // Beware there's an issue with watch on OSX that causes issues with
        // watch if you're not running node 0.10.25 or later.
        watch: cssDir + '/**/*.styl'
      }, done)
    }
  }
}
