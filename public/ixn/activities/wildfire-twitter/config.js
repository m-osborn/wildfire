'use strict';

define([], function(){      
    return {
        "icon": "images/jb-icon.jpg",
        "iconSmall": "images/jb-icon.jpg", 
        "key": "jbdbc-wildfire-activity",
        "partnerApiObjectTypeId": "IXN.CustomActivity.REST",
        "lang": {
            "en-US": {        
                "name": "Wildfire Twitter",
                "description": "Activity simply posts the data into an array for display on the App's home page."
            }
        },
        "category": "messaging",
        "version": "1.0",
        "apiVersion": "1.0",
        "execute": {
            "uri": "https://jbdbc-wildfire.herokuapp.com/ixn/activities/wildfire-twitter/execute/",
            "inArguments": [],
            "outArguments": [],
            "verb": "POST",
            "body": "",
            "format": "json",
            "useJwt": false,
            "timeout": 3000
        },
        "save": {
            "uri": "https://jbdbc-wildfire.herokuapp.com/ixn/activities/wildfire-twitter/save/",
            "verb": "POST",
            "body": "",
            "format": "json",
            "useJwt": false,
            "timeout": 3000
        },
        "publish": {
            "uri": "https://jbdbc-wildfire.herokuapp.com/ixn/activities/wildfire-twitter/publish/",
            "verb": "POST",
            "body": "",
            "format": "json",
            "useJwt": false,
            "timeout": 3000
        },
        "validate": {
            "uri": "https://jbdbc-wildfire.herokuapp.com/ixn/activities/wildfire-twitter/validate/",
            "verb": "POST",
            "body": "",
            "format": "json",
            "useJwt": false,
            "timeout": 3000
        },
        "edit": {
            "uri": "https://jbdbc-wildfire.herokuapp.com/ixn/activities/wildfire-twitter/",
            "height": 400,
            "width": 500
        }
    };
});
