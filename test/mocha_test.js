var url = require('url');
var request = require('request');
var chai = require('chai');


var config = require('./config');


var expect = chai.expect;


describe('Location API Test Suite', function() {
	var __msisdn = …;
	var __validation_code = …;
	var __X_MLM_Callback_Key = …;
	var __appkey = …;
	var __access_token;

	
    this.timeout(10000);
    
    
    before(function(done) {
        var urlObj = {
            protocol: config.PROTOCOL,
            hostname: config.BASE_URL_OAUTH,
         	pathname: config.URL_TOKEN,
        };


        var options = {
        	url : url.format(urlObj),
        	qs : {
            	client_id : config.CLIENT_ID,
            	client_secret : config.CLIENT_SECRET,
            	grant_type: config.GRANT_TYPE_CC,
            	scope : config.SCOPE
        		},
        		followRedirect : false
       	 	};            


    	request.get(options, function (err, res, body) {
        expect(res.statusCode).to.equal(200);


        data = JSON.parse(res.body);


        __access_token = data['access_token'];
        expect(__access_token).to.not.be.empty;
        console.log("Access Token: " + __access_token);


        setTimeout(done, config.THROTTLE_DELAY);                
        });
    });
       	
   	describe('Location API positive test cases', function() {
   	
                
        it('should send invite to device', function(done) {
            var urlObj = {
                protocol: config.PROTOCOL,
                hostname: config.BASE_URL_LOCATION,
                pathname: config.URL_INVITATIONS,
            };
            var postData = {
  				msisdn: __msisdn				
			};


            var options = {
                url : url.format(urlObj), 
                body: postData,
                json: true,             
                headers : {
                    Authorization : 'Bearer ' + __access_token
                },
                followRedirect : false
            };


            request.post(options, function(err, res, body) {
                console.log("Invitations Response: " + JSON.stringify(res.body));
                expect(res.statusCode).to.equal(200);                
                //data = JSON.parse(res.body);                
                setTimeout(done, config.THROTTLE_DELAY);
            });
        }); 
        
        it('should resend invitation', function(done) {
            var urlObj = {
                protocol: config.PROTOCOL,
                hostname: config.BASE_URL_LOCATION,
                pathname: config.URL_INVITATIONS + '/' + __msisdn,
            };            


            var options = {
                url : url.format(urlObj),                           
                headers : {
                    Authorization : 'Bearer ' + __access_token
                },
                followRedirect : false
            };


            request.put(options, function(err, res, body) {
                console.log("Resend invitation Response: " + res.body);
                expect(res.statusCode).to.equal(200);                
                //data = JSON.parse(res.body);                
                setTimeout(done, config.THROTTLE_DELAY);
            });
        });
        
        it('should get location', function(done) {
            var urlObj = {
                protocol: config.PROTOCOL,
                hostname: config.BASE_URL_LOCATION,
                pathname: config.URL_LOCATION + '/' + __msisdn,
            };


            var options = {
                url : url.format(urlObj), 
                qs : {
                    type : 'live',
                    max_loc_age : '3600'                    
                },              
                headers : {
                    Authorization : 'Bearer ' + __access_token
                },
                followRedirect : false
            };


            request.get(options, function(err, res, body) {
                console.log("Location: " + res.body);
                expect(res.statusCode).to.equal(200);                
                //data = JSON.parse(res.body);                
                setTimeout(done, config.THROTTLE_DELAY);
            });
        });                 		                    
     });
     
    describe('Location API negative test cases', function() {
    
    var __msisdnExists = xxx;
    var __msisdnInvalid = xxx;    
        
        it('should return an invalid PIN error', function(done) {
            var urlObj = {
                protocol: config.PROTOCOL,
                hostname: config.BASE_URL_LOCATION,
                pathname: config.URL_INVITATIONS + '/' + __msisdn,
            };
            var postData = {
  				validation_code: __validation_code				
			};


            var options = {
                url : url.format(urlObj), 
                body: postData,
                json: true,             
                headers : {
                    Authorization : 'Bearer ' + __access_token
                },
                followRedirect : false
            };


            request.post(options, function(err, res, body) {
                console.log("Register device with PIN Invalid PIN Response: " + JSON.stringify(res.body));
                expect(res.statusCode).to.equal(502);  
                expect(res.body.code).to.equal('5020'); 
                expect(res.body.message).to.equal('Invalid PIN');              
                //data = JSON.parse(res.body);                
                setTimeout(done, config.THROTTLE_DELAY);
            });
        });
        
        it('should return an invalid MSISDN error (remove from whitelist)', function(done) {
            var urlObj = {
                protocol: config.PROTOCOL,
                hostname: config.BASE_URL_LOCATION,
                pathname: config.URL_WHITELIST + '/' + __msisdnInvalid,
            };            


            var options = {
                url : url.format(urlObj),                           
                headers : {
                    Authorization : 'Bearer ' + __access_token
                },
                followRedirect : false
            };


            request.del(options, function(err, res, body) {
                console.log("Remove from whitelist Response (MSISDN invalid): " + res.body);
                expect(res.statusCode).to.equal(400);                
                data = JSON.parse(res.body);  
                expect(data.code).to.equal(4006);               
                setTimeout(done, config.THROTTLE_DELAY);
            });
        });           
    });
});
