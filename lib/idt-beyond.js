var request = require('request');
var when = require('when');

var appId, appKey;
var url = 'https://api-dev.idtbeyond.com';

var idtBeyondApi = {
    initialize: function(options){
      if (!options || !options.hasOwnProperty('appId') || !options.hasOwnProperty('appKey')){
        throw new Error("Please pass in both appId and appKey to instantiate a new IDT Beyond object.");
      }
      return idtBeyond(options);
    }
};

var idtBeyond = function(options){
  var appId = options.appId;
  var appKey = options.appKey;
  var generateClientTransactionId = function(){
    return (appId ? appId.concat('-', ('000000' + Math.floor(Math.random() * (999999 - 1) + 1)).slice(-6)): null);
  };

  var headers = function(){
    return {
      'x-idt-beyond-app-id': appId,
      'x-idt-beyond-app-key': appKey
    }
  }
  return {
    getAppId: function () {
      return appId;
    },
    getAppKey: function () {
      return appKey;
    },
    getProducts: function () {
      var deferred = when.defer();
      request.get({url: url.concat('/v1/iatu/products/reports/all'), headers: headers()}, function (err, res, data) {
        if (err) {
          console.log(err);
          deferred.reject(err);
        }
        deferred.resolve(data);
      });
      return deferred;
    },
    validateNumber: function (params) {
      var deferred = when.defer();
      request.get({
        url: url.concat(
            'v1/iatu/number-validator?country_code=', params.countryCode, '&mobile_number=', params.mobileNumber),
        headers: headers()
      }, function (err, res, data) {
        if (err) {
          deferred.reject(err);
        }
        deferred.resolve(data);
      });
      return deferred;
    },
    getLocalValue: function (params) {
      var deferred = when.defer();
      request.get({
        url: url.concat(
            '/v1/iatu/products/reports/local-value?carrier_code=', params.carrierCode, '&country_code=',
            params.countryCode, '&amount=', params.amount, '&currency_code=USD'),
        headers: headers()
      }, function (err, res, data) {
        if (err) {
          deferred.reject(err);
        }
        deferred.resolve(data);
      });
      return deferred;
    },
    postTopup: function (params) {
      var deferred = when.defer();
      request.post({
        url: url.concat(
            '/v1/iatu/products/reports/local-value?carrier_code=', params.carrierCode, '&country_code=',
            params.countryCode, '&amount=', params.amount, '&currency_code=USD'),
        body: {
          'country_code': params.countryCode,
          'carrier_code': params.carrierCode,
          'mobile_number': params.phoneNumber,
          'plan': planType,
          'amount': params.amount,
          'client_transaction_id': generateClientTransactionId(),
          'terminal_id': termId
        },
        headers: headers()
      }, function (err, res, data) {
        if (err) {
          deferred.reject(err);
        }
        deferred.resolve(data);
      });
      return deferred;
    }
  };
};

module.exports = idtBeyondApi;
