const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function(){

  suite('Function convertHandler.getNum(input)', function() {
    
    test('convertHandler should correctly read a whole number input.', function() {
      let input = '32L';
      assert.equal(convertHandler.getNum(input), 32);
    });
    
    test('convertHandler should correctly read a decimal number input.', function() {
      let input = '32.2L';
      assert.equal(convertHandler.getNum(input), 32.2);
    });
    
    test('convertHandler should correctly read a fractional input.', function() {
      let input = '3/2L';
      assert.equal(convertHandler.getNum(input), 1.5);
    });
    
    test('convertHandler should correctly read a fractional input with a decimal.', function() {
      let input = '5.4/3L';
      assert.equal(convertHandler.getNum(input), 1.8);
    });
    
    test('convertHandler should correctly return an error on a double-fraction (i.e. 3/2/3).', function() {
      let input = '3/2/3L';
      assert.isUndefined(convertHandler.getNum(input));
    });
    
    test('convertHandler should correctly default to a numerical input of 1 when no numerical input is provided.', function() {
      let input = 'L';
      assert.equal(convertHandler.getNum(input), 1);
    });

  });

  suite('Function convertHandler.getUnit(input)', function() {
    
    test('convertHandler should correctly read each valid input unit.', function() {
      let input = ['gal','l','mi','km','lbs','kg','GAL','L','MI','KM','LBS','KG'];
      let output = ['gal','L','mi','km','lbs','kg','gal','L','mi','km','lbs','kg'];
      input.forEach(function(ele, index) {
        assert.equal(convertHandler.getUnit(ele), output[index]);
      });
    });
    
    test('convertHandler should correctly return an error for an invalid input unit.', function() {
      let input = '34kilograms';
      assert.isUndefined(convertHandler.getUnit(input));
    });

  });

  suite('Function convertHandler.getReturnUnit(initUnit)', function() {
    
    test('convertHandler should return the correct return unit for each valid input unit.', function() {
      let input = ['gal','l','mi','km','lbs','kg'];
      let expect = ['L','gal','km','mi','kg','lbs'];
      input.forEach(function(ele, i) {
        assert.equal(convertHandler.getReturnUnit(ele), expect[i]);
      });
    });

  });

  suite('Function convertHandler.spellOutUnit(unit)', function() {
    
    test('convertHandler should correctly return the spelled-out string unit for each valid input unit.', function() {
      let input = ['gal','l','mi','km','lbs','kg'];
      let expect = ['gallons','liters','miles','kilometers','pounds','kilograms'];
      input.forEach(function(ele, i) {
        assert.equal(convertHandler.spellOutUnit(ele), expect[i]);
      });
    });

  });

  suite('Function convertHandler.convert(num, unit)', function() {
    
    test('convertHandler should correctly convert gal to L.', function() {
      let input = [5, 'gal'];
      let expected = 18.92705;
      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1);
    });
    
    test('convertHandler should correctly convert L to gal.', function() {
      let input = [5, 'L'];
      let expected = 1.32086;
      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1);
    });
    
    test('convertHandler should correctly convert mi to km.', function() {
      let input = [5, 'mi'];
      let expected = 8.0467;
      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1);
    });
    
    test('convertHandler should correctly convert km to mi.', function() {
      let input = [5, 'km'];
      let expected = 3.10686;
      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1);
    });
    
    test('convertHandler should correctly convert lbs to kg.', function() {
      let input = [5, 'lbs'];
      let expected = 2.26796;
      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1);
    });
    
    test('convertHandler should correctly convert kg to lbs.', function() {
      let input = [5, 'kg'];
      let expected = 11.02312;
      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1);
    });

  });

});
