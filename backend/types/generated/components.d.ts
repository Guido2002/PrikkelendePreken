import type { Schema, Struct } from '@strapi/strapi';

export interface SharedBibleReference extends Struct.ComponentSchema {
  collectionName: 'components_shared_bible_references';
  info: {
    description: 'Een gestructureerde bijbelverwijzing met boek, hoofdstuk en verzen';
    displayName: 'Bijbelverwijzing';
  };
  attributes: {
    book: Schema.Attribute.Enumeration<
      [
        'Genesis',
        'Exodus',
        'Leviticus',
        'Numeri',
        'Deuteronomium',
        'Jozua',
        'Richteren',
        'Ruth',
        '1 Samu\u00EBl',
        '2 Samu\u00EBl',
        '1 Koningen',
        '2 Koningen',
        '1 Kronieken',
        '2 Kronieken',
        'Ezra',
        'Nehemia',
        'Esther',
        'Job',
        'Psalmen',
        'Spreuken',
        'Prediker',
        'Hooglied',
        'Jesaja',
        'Jeremia',
        'Klaagliederen',
        'Ezechi\u00EBl',
        'Dani\u00EBl',
        'Hosea',
        'Jo\u00EBl',
        'Amos',
        'Obadja',
        'Jona',
        'Micha',
        'Nahum',
        'Habakuk',
        'Sefanja',
        'Hagga\u00EF',
        'Zacharia',
        'Maleachi',
        'Matthe\u00FCs',
        'Markus',
        'Lukas',
        'Johannes',
        'Handelingen',
        'Romeinen',
        '1 Korinthe',
        '2 Korinthe',
        'Galaten',
        'Efeze',
        'Filippenzen',
        'Kolossenzen',
        '1 Thessalonicenzen',
        '2 Thessalonicenzen',
        '1 Timothe\u00FCs',
        '2 Timothe\u00FCs',
        'Titus',
        'Filemon',
        'Hebree\u00EBn',
        'Jakobus',
        '1 Petrus',
        '2 Petrus',
        '1 Johannes',
        '2 Johannes',
        '3 Johannes',
        'Judas',
        'Openbaring',
      ]
    > &
      Schema.Attribute.Required;
    chapter: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 150;
          min: 1;
        },
        number
      >;
    verseEnd: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    verseStart: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.bible-reference': SharedBibleReference;
    }
  }
}
