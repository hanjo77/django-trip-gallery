module.exports = {
	src: {
		root: 'src',
		js: 'src/js',
		sass: 'src/scss',
		img: 'src/img',
		files: {
			html: 'src/*.html',
			sass: 'src/scss/*.{scss,sass}',
			js: {
				entry: ['src/js/main.js', 'src/js/head.js'],
				all: 'src/js/*.js'
			},
			img: 'src/img/*.{png,jpg,jpeg,svg,gif}',
			root: 'src/{*,}.{html,txt,xml,htaccess}',
			htmlBuild: 'dist/*.html'
		}
	},
	dist: {
		webRoot: 'dist',
		root: 'dist/media',
		js: 'dist/media/js',
		css: 'dist/media/css',
		img: 'dist/media/img',
		templates: '../django/imageupload/templates'
	}
};
