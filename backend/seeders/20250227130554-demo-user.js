'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        login: 'Кот И.И.' ,
        tabel: '001',
        password: '111',
      },
      {
        login: 'Кошкина А. П.',
        tabel: '002',
        password: '222',
      },
      {
        login: 'Кошаков В.Г.',
        tabel: '003',
        password: '333',
      },
      {
        login: 'Котафьева М.М.',
        tabel: '004',
        password: '444',
      },
      {
        login: 'Котиков В.В.',
        tabel: '005',
        password: '555',
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null);
  }
};
