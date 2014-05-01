'use strict';
define( function( require ) {
    // Dependencies
    var Postmonger = require('postmonger');
    require( 'jquery.min' );
    require( 'underscore' );

    // Vars
    var connection = new Postmonger.Session();
    var $oes = $('#originEventStart');
    var data, uiPayload, etPayload;

    // Once we know the window is loaded
    $(window).ready( function() {
        // Notify Journey Builder our window is loaded
        connection.trigger('ready');

        // Allow Marketers to configure the value
        $oes.removeAttr( 'disabled' );
    });

    connection.on( 'updateStep', function( step ) {
        /*
        console.log( 'Journey Builder sent Wildfire Twitter Trigger an updateStep notice with the following data' );
        if( step ) {
            console.log( 'STEP: ', step );
        }
        */
        var value = $oes.val();
        if( !value ) {
            // Notify user they need to select a value 
            $('#wildfireTwitterTriggerConfigError').html('<strong style="color: red;">You must enter something</strong>');
        } else {
            // Successful change
            // When we're all done, define our payload
            data = {
                originEventStart: $oes.val()
            };

            uiPayload = {
                options: data,
                description: 'This is a wildfire twitter trigger configuration instance.'
            };

            etPayload = {
                filter: ""//<FilterDefinition Source='SubscriberAttribute'><ConditionSet Operator='AND' ConditionSetName='Grouping'><Condition ID='03461c53-cccf-e311-9ae6-ac162db18844' isParam='false' Operator='Equal' operatorTemplate='undefined' operatorEditable='1' valueEditable='1' conditionValid='1'><Value><![CDATA[" + data.originEventStart + "]]></Value></Condition></ConditionSet></FilterDefinition>"
            };

            connection.trigger( 'save', uiPayload, etPayload );
        }
    });

    // Populate Fields is sent from Journey Builder to this Custom
    // Trigger UI via Postmonger (iframe-to-iframe communication).
    connection.on('populateFields', function( options ) {
        //console.log( 'Journey Builder sent Wildfire Twitter Trigger a populateFields notice with the following data' );
        if( options ) {
            //console.log( 'OPTIONS: ', options );
            // Persist
            $('#originEventStart').val( options.originEventStart );
        }
    });

/*
FILTER XML IDS FROM: https://jbprod.exacttargetapps.com/rest/v1/contact/definition/?oauth_token=NONE&_=1392167891474
*/
});
