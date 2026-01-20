'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/bible/chapter',
      handler: 'bible.chapter',
      config: {
        auth: false,
      },
    },
  ],
};
