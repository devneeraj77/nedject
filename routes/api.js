'use strict';

const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  let convertHandler = new ConvertHandler();

  app.route('/api/convert')
    .get(function (req, res) {
      let input = req.query.input;
      if (typeof input !== 'string') {
        input = '';
      }
      
      let initNum = convertHandler.getNum(input);
      let initUnit = convertHandler.getUnit(input);

      if (initNum === undefined && initUnit === undefined) {
        return res.send('invalid number and unit');
      }
      if (initNum === undefined) {
        return res.send('invalid number');
      }
      if (initUnit === undefined) {
        return res.send('invalid unit');
      }

      let returnNum = convertHandler.convert(initNum, initUnit);
      let returnUnit = convertHandler.getReturnUnit(initUnit);
      let toString = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);

      res.json({
        initNum: initNum,
        initUnit: initUnit,
        returnNum: returnNum,
        returnUnit: returnUnit,
        string: toString
      });
    });

};
