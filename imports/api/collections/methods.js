import { Preguntas } from './collections.js';
import { Estado } from './collections.js';
import { Participantes } from './collections.js';


Meteor.methods({

  'NuevaPregunta'(numero, pregunta, alternativas, correcta) {
    Preguntas.insert({numero: numero, pregunta: pregunta, alternativas: alternativas, correcta: correcta});
  },

  'CambiaActiva'(numero) {
    Estado.update({}, {$set: {activa: numero, muestraCorrecta: 0, muestraParticipantes: 0}});
  },

  'MuestraCorrecta'() {
    Estado.update({}, {$set: {muestraCorrecta: 1}});
  },

  'MuestraParticipantes'() {
    Estado.update({}, {$set: {muestraParticipantes: 1}});
  },

  'NuevoParticipante'(nombre) {
    Participantes.upsert({nombre: nombre}, {$set: {nombre: nombre}});
  },

  'BorraParticipante'(nombre) {
    Participantes.remove({nombre: nombre});
  },

  'BorraPregunta'(numero) {
    Preguntas.remove({numero: numero});
  },

  'GuardaRespuesta'(nombre, numero, respuesta) {
    let pregunta = Preguntas.findOne({numero: numero});
    let punto = 0;
    if (respuesta == pregunta.correcta) punto = 1;
    Participantes.upsert({nombre: nombre, numero: numero}, {$set: {respuesta: respuesta, punto: punto}});
  },

});
