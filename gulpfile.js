//npm install --save-dev Libreria

/*

// Contenedor de tareas
function tarea(callback) {
    console.log('La primer tarea gulp');

    callback(); //Forma anterior de tener código asincrono
}

exports.tarea = tarea;

//Terminal:
// npx gulp tarea

// Puede definir la función de compilar SASS, comprimir imágenes
// 

// También puede mandar a llamarse desde scripts en 
// package.json
// npm run tarea
*/

// Dependencias CSS
const{ src, dest, watch, parallel } = require("gulp"); //Extrae funciones de gulp
const sass = require("gulp-sass")(require("sass"));

// Post CSS
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps')


// Dependencias de imágenes
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache')
const avif = require('gulp-avif')

// Minificar JavaScript
const terser = require('gulp-terser-js')

const plumber = require('gulp-plumber');


function css(done) {
    // Identificar el archivo de SASS (src)
    src("src/scss/**/*.scss")
    // Saber el origen en SASS
    .pipe( sourcemaps.init() )
    .pipe( plumber() )
    // Compilar el archivo de SASS
    .pipe( sass() )
    // Post CSS, minificar CSS
    .pipe( postcss([autoprefixer(), cssnano()]))
    // Registrar el origen en SASS en mismo CSS
    .pipe( sourcemaps.write('.') )
    // Guardar en el disco duro (dest)
    .pipe( dest("build/css") );

    done();
}

function versionWebp(done) {
    const opciones = {
        quaility: 50
    }

    src('src/img/**/*.{png,jpg}') //Para entrar recursivamente y convertir todas las imágenes, coma sin espacio
    .pipe(webp(opciones))
    .pipe(dest('build/img'))

    done()
}

// Verisón avif

function versionAvif(done) {
    const opciones = {
        quaility: 50
    }

    src('src/img/**/*.{png,jpg}') //Para entrar recursivamente y convertir todas las imágenes, coma sin espacio
    .pipe(avif(opciones))
    .pipe(dest('build/img'))

    done()
}

// Para obtener compresión y jpg para legacy
function imagenes(done) {
    const opciones = {
        optimizationLevel: 3
    }

    src('src/img/**/*.{png,jpg}')
    .pipe(cache(imagemin(opciones)))
    .pipe(dest('build/img'))

    done()
}

function javascript(done) {
    src('src/js/**/*.js')
    .pipe(sourcemaps.init()) //Saber el origen
    .pipe(terser()) //Minificar JS
    .pipe(sourcemaps.write('.'))//Registrar el origen
    .pipe(dest('build/js'));
    done();
}

function dev(done) {
    watch("src/scss/**/*.scss", css); //Archivo a escuchar, función a correr. Con los asteriscos de forma recursiva, va a escuchar todos los archivos y directorios ahí
    watch("src/js/**/*.js", javascript);
    
    done();
}



exports.css = css
exports.js = javascript
exports.versionWebp = versionWebp
exports.versionAvif = versionAvif
exports.imagenes = imagenes
// Mandar a llamar con npx gulp css
// O npm run 
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev)

// Al finalizar, CSS
// npm i --save-dev cssnano autoprefixer postcss gulp-postcss

// Saber el origen en SASS
//npm install --svae-dev gulp-sourcemaps

// Minificar JS
// npm i gulp-terser-js