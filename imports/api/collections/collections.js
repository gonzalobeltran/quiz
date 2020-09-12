import { Mongo } from 'meteor/mongo';

export const Preguntas = new Mongo.Collection('preguntas');
export const Estado = new Mongo.Collection('estado');
export const Participantes = new Mongo.Collection('participantes');
