import express from 'express';
import { create } from 'express-handlebars';
import { fileURLToPath } from 'url';
import { writeFile, readFile, rename, unlink } from 'fs';
import * as path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware para acceder a archivos estáticos de Bootstrap
app.use('/bootstrapCss', express.static(`${__dirname}/node_modules/bootstrap/dist/css`));
app.use('/bootstrapJs', express.static(`${__dirname}/node_modules/bootstrap/dist/js`));

// Configuración de Handlebars
const hbs = create({
    partialsDir:[
        "views"
    ]
})

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Ruta principal
app.get('/', function( req, res ){
    res.render('home',{
        layout:'main'
    })
})

// Ruta para crear un archivo
app.get('/crear', function(req, res){
    const { archivo, contenido } = req.query;
    const fecha = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const contenidoConFecha = `${fecha} - ${contenido}`;
    writeFile(archivo, contenidoConFecha, (err) => { 
        if (err) {
            res.send('Error al crear el archivo.'); 
        } else {
            res.send('Archivo creado exitosamente.'); 
        }
    });
});


// Ruta para leer un archivo
app.get('/leer', function(req, res){
    const { archivo } = req.query;
    readFile(archivo, (err, data) =>{
        if (err) {
            res.send('Error al leer el archivo.'); 
        } else {
            const mensaje = `El contenido del archivo "${archivo}" es: ${data.toString()}`;
            res.send(mensaje); 
        }
    });
});

// Ruta para renombrar un archivo
app.get('/renombrar', function(req, res){
    const { nombreActual, nuevoNombre } = req.query;
    rename(nombreActual, nuevoNombre, (err) =>{
        if (err) {
            res.send('Error al renombrar el archivo.');
        } else {
            res.send(`Archivo renombrado correctamente de "${nombreActual}" a "${nuevoNombre}"`);
        }
    });
});

// Ruta para eliminar un archivo
app.get('/eliminar', function(req, res){
    const { archivo } = req.query;
    unlink(archivo, (err) => {
        if (err) {
            res.send('Error al eliminar el archivo.');
        } else {
            res.send('Archivo eliminado exitosamente.');
        }
    });
});

// Iniciar el servidor
app.listen('3000', ()=>console.log(`Servidor arriba en el puerto 3000`));

