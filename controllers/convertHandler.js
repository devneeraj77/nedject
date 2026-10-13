function ConvertHandler() {
  
  this.getNum = function(input) {
    if (typeof input !== 'string') return undefined;
    
    const trimmed = input.trim();
    if (!trimmed) return 1;
    
    const firstAlphaIndex = trimmed.search(/[a-zA-Z]/);
    let numStr;
    
    if (firstAlphaIndex === 0) {
      return 1;
    } else if (firstAlphaIndex === -1) {
      numStr = trimmed;
    } else {
      numStr = trimmed.slice(0, firstAlphaIndex).trim();
    }
    
    if (!numStr) return 1;
    
    const slashParts = numStr.split('/');
    if (slashParts.length > 2) {
      return undefined;
    }
    
    const numRegex = /^(\d+(\.\d+)?|\.\d+)$/;
    
    if (slashParts.length === 2) {
      const numPart = slashParts[0].trim();
      const denPart = slashParts[1].trim();
      
      if (!numRegex.test(numPart) || !numRegex.test(denPart)) {
        return undefined;
      }
      
      const numerator = parseFloat(numPart);
      const denominator = parseFloat(denPart);
      
      if (denominator === 0 || isNaN(numerator) || isNaN(denominator)) {
        return undefined;
      }
      
      const val = numerator / denominator;
      if (val <= 0 || !isFinite(val)) {
        return undefined;
      }
      return val;
    }
    
    if (!numRegex.test(numStr)) {
      return undefined;
    }
    
    const val = parseFloat(numStr);
    if (isNaN(val) || val <= 0 || !isFinite(val)) {
      return undefined;
    }
    return val;
  };
  
  this.getUnit = function(input) {
    if (typeof input !== 'string') return undefined;
    
    const trimmed = input.trim();
    const firstAlphaIndex = trimmed.search(/[a-zA-Z]/);
    if (firstAlphaIndex === -1) return undefined;
    
    const unitStr = trimmed.slice(firstAlphaIndex).trim().toLowerCase();
    const validUnits = ['gal', 'l', 'mi', 'km', 'lbs', 'kg'];
    
    if (!validUnits.includes(unitStr)) {
      return undefined;
    }
    
    return unitStr === 'l' ? 'L' : unitStr;
  };
  
  this.getReturnUnit = function(initUnit) {
    if (typeof initUnit !== 'string') return undefined;
    const unit = initUnit.toLowerCase();
    
    switch (unit) {
      case 'gal':
        return 'L';
      case 'l':
        return 'gal';
      case 'mi':
        return 'km';
      case 'km':
        return 'mi';
      case 'lbs':
        return 'kg';
      case 'kg':
        return 'lbs';
      default:
        return undefined;
    }
  };

  this.spellOutUnit = function(unit) {
    if (typeof unit !== 'string') return undefined;
    const u = unit.toLowerCase();
    
    switch (u) {
      case 'gal':
        return 'gallons';
      case 'l':
        return 'liters';
      case 'mi':
        return 'miles';
      case 'km':
        return 'kilometers';
      case 'lbs':
        return 'pounds';
      case 'kg':
        return 'kilograms';
      default:
        return undefined;
    }
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    
    if (typeof initNum !== 'number' || isNaN(initNum) || typeof initUnit !== 'string') {
      return undefined;
    }
    
    const unit = initUnit.toLowerCase();
    let result;
    
    switch (unit) {
      case 'gal':
        result = initNum * galToL;
        break;
      case 'l':
        result = initNum / galToL;
        break;
      case 'lbs':
        result = initNum * lbsToKg;
        break;
      case 'kg':
        result = initNum / lbsToKg;
        break;
      case 'mi':
        result = initNum * miToKm;
        break;
      case 'km':
        result = initNum / miToKm;
        break;
      default:
        return undefined;
    }
    
    return parseFloat(result.toFixed(5));
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    const spellInit = this.spellOutUnit(initUnit);
    const spellReturn = this.spellOutUnit(returnUnit);
    if (!spellInit || !spellReturn) return undefined;
    return `${initNum} ${spellInit} converts to ${returnNum} ${spellReturn}`;
  };
  
}

module.exports = ConvertHandler;
