import { Meteor } from 'meteor/meteor';
import '../imports/api/collections/collections.js';
import '../imports/api/collections/methods.js'
import '../imports/api/collections/server/publications.js'

import { Estado } from '../imports/api/collections/collections.js';

Meteor.startup(() => {
  // code to run on server at startup
  if ( Estado.find().count() === 0 ) {
    let estado = {
      activa: 1,
      muestraCorrecta: 0,
      muestraParticipantes: 0,
      campana: false,
      quienCampana: '',
    }
    Estado.insert(estado);
  }
});
