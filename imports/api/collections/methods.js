import { Preguntas } from './collections.js';
import { Estado } from './collections.js';
import { Participantes } from './collections.js';


Meteor.methods({

  'NuevaPregunta'(numero, pregunta, alternativas, correcta) {
    Preguntas.insert({numero: numero, pregunta: pregunta, alternativas: alternativas, correcta: correcta});
  },

  'CambiaNumero'(oldN, newN) {
    Preguntas.update({numero: oldN}, {$set: {numero: -1}});
    Preguntas.update({numero: {$gt: oldN}}, {$inc:{numero: -1}}, {multi:true});
    Preguntas.update({numero: {$gte: newN}}, {$inc:{numero: 1}}, {multi:true});
    Preguntas.update({numero: -1}, {$set: {numero: newN}});
  },

  'SiguientePregunta'(numero) {
    Estado.update({}, {$set: {activa: numero + 1, muestraCorrecta: 0, muestraParticipantes: 0}});
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
    Preguntas.update({numero: {$gt: numero}}, {$inc:{numero: -1}}, {multi:true});
  },

  'GuardaRespuesta'(nombre, numero, respuesta, texto) {
    let pregunta = Preguntas.findOne({numero: numero});
    let punto = 0;
    if (respuesta == pregunta.correcta) punto = 1;
    Participantes.upsert({nombre: nombre, numero: numero}, {$set: {respuesta: respuesta, punto: punto, texto: texto}});
  },

});
