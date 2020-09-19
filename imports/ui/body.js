import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Preguntas } from '../api/collections/collections.js';
import { Estado } from '../api/collections/collections.js';
import { Participantes } from '../api/collections/collections.js';

import './body.html';

Template.quiz.onCreated(function quizOnCreated() {
  this.autorun( () => {
    Meteor.subscribe('preguntas');
    Meteor.subscribe('participantes');
    const handle = Meteor.subscribe('estado');
    if (handle.ready()) {
      let estado = Estado.findOne({});
      Session.set('numero', estado.activa);
      Session.set('muestraCorrecta', estado.muestraCorrecta);
      Session.set('muestraParticipantes', estado.muestraParticipantes);
    }
  });

  Session.set('nombre','');
  Session.set('editar', false);

});

Template.quiz.helpers({
  nombre() {
    return Session.get('nombre');
  },
  preguntaActual() {
    let pregunta = Preguntas.findOne({numero: Session.get('numero')});
    let txt = '';
    return txt.concat(Session.get('numero'), '. ', pregunta.pregunta);
  },
  alternativas() {
    let pregunta = Preguntas.findOne({numero: Session.get('numero')});
    return pregunta.alternativas;
  },
  muestraParticipantes() {
    return Session.get('muestraParticipantes');
  },
  marcar(alternativa) {
    if (Session.get('muestraCorrecta')) {
      let pregunta = Preguntas.findOne({numero: Session.get('numero')});
      if (alternativa == pregunta.correcta) return "correcta";
    }

    let participante = Participantes.findOne({nombre: Session.get('nombre'), numero: Session.get('numero')});
    let respuesta = -1;

    if (participante)
      if (participante.respuesta >= 0) respuesta = participante.respuesta;

    if (respuesta == alternativa) return "seleccionada";

    return ('');
  },

  preguntaActiva(pregunta) {
    if (pregunta == Session.get('numero') -1 ) return "seleccionada";
    return '';
  },

  isAdmin() {
    return Session.get('nombre') == 'Gonzalo-k93n8f';
  },
  listaPreguntas() {
    let preguntas = Preguntas.find({},{sort: {numero: 1}});
    return preguntas;
  },
  participantes() {
    let nombres = _.uniq( Participantes.find({}, {sort: {nombre: 1}}).fetch().map( (x) => {return x.nombre;}) );

    nombres = _.without(nombres, 'Gonzalo-k93n8f');

    let participantes = [];
    for (n in nombres) {
      let puntos = 0;
      Participantes.find({nombre: nombres[n]}).fetch().map( (x) => { if (x.punto) puntos += x.punto; });
      participantes.push({
        nombre: nombres[n],
        puntos: puntos
      });
    }
    return participantes;
  },

  respuestas() {
    let nombres = _.uniq( Participantes.find({}, {sort: {nombre: 1}}).fetch().map( (x) => {return x.nombre}) );
    let participantes = [];
    for (n in nombres) {
      let respuesta = -1;
      Participantes.find({nombre: nombres[n], numero:Session.get('numero')}).fetch().map( (x) => { respuesta = x.texto; });
      participantes.push({
        nombre: nombres[n],
        respuesta: respuesta,
      });
    }
    return participantes;
  },

  editar() {
    return Session.get('editar');
  },

});

Template.quiz.events({
  'change .js-nombre'(event) {
    Session.set('nombre', event.target.value);
    Meteor.call('NuevoParticipante', event.target.value);
  },
  'click .js-alternativa'(event) {
    if (Session.get('muestraCorrecta')) return '';
    respuesta = event.target.value;
    Meteor.call('GuardaRespuesta', Session.get('nombre'), Session.get('numero'), respuesta, event.target.innerText);
  },
  'click .js-muestraCorrecta'(event) {
    Meteor.call('MuestraCorrecta');
  },
  'click .js-muestraParticipantes'(event) {
    Meteor.call('MuestraParticipantes');
  },
  'click .js-mostrarPregunta'(event) {
    Meteor.call('CambiaActiva', this.numero);
  },
  'click .js-siguientePregunta'(event) {
    Meteor.call('SiguientePregunta', Session.get('numero'));
  },
  'click #editar'(event) {
    Session.set('editar',event.target.checked);
  },
  'click .js-borraParticipante'(event) {
    Meteor.call('BorraParticipante', event.target.value);
  },
  'click .js-borraPregunta'() {
    Meteor.call('BorraPregunta', this.numero);
  },
  'change .js-nuevoNumero'(event) {
    nuevoNumero = parseInt(event.target.value);
    Meteor.call('CambiaNumero', this.numero, nuevoNumero);
  },
  'submit #nuevaPreguntaForm'(event, template) {
    event.preventDefault();
    Meteor.call('NuevaPregunta',
                parseInt(event.target.numero.value),
                event.target.nuevaPregunta.value,
                [event.target.alt1.value, event.target.alt2.value, event.target.alt3.value, event.target.alt4.value],
                event.target.correcta.value - 1);

    template.find("form").reset();
  },
});
