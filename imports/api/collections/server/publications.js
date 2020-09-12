import { Preguntas } from '../collections.js';
import { Estado } from '../collections.js';
import { Participantes } from '../collections.js';

Meteor.publish('preguntas', function() {
  return Preguntas.find();
});

Meteor.publish('estado', function() {
  return Estado.find();
});

Meteor.publish('participantes', function() {
  return Participantes.find();
});
