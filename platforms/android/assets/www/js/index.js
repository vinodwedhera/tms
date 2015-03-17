/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
	
		$("#calendar").jqmCalendar({
		  events : [ ],
		  months : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		  days : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
		  startOfWeek : 0
		});
		
		var unix = Math.round(+new Date()/1000);
		changepayperiod(unix);
		
		
		
   
   
			
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
	
	
	
};

app.initialize();


function changepayperiod(unix)
	{
	var db = window.sqlitePlugin.openDatabase({name: "my.db"});
		db.transaction(function(tx) {
			tx.executeSql('SELECT PayPeriodId FROM PayPeriod where PayPeriodStartDate <= ? and PayPeriodEndDate >= ?',[unix,unix],function(tx, res)
				{
					$('#billable').html('0');
					$('#nonbillable').html('0');
					//alert(res.rows.item(0).PayPeriodId);
					tx.executeSql('SELECT sum(b.BillableHours) as total,sum(b.NonBillableHours) as nonbillable FROM Timesheets a inner join TimesheetsEntry b where a.TimeSheetId = b.TimeSheetId and a.PayPeriodId >= ?',[res.rows.item(0).PayPeriodId],function(tx, res)
						{
							var wh = res.rows.item(0).total;
							var nonbillable = res.rows.item(0).nonbillable;
							
						
							if(wh == null)
							$('#billable').html('0');
							else
							$('#billable').html(wh);
							
							if(nonbillable == null)
							$('#nonbillable').html('0');
							else
							$('#nonbillable').html(nonbillable);
						});
					
				// results is a http://dev.w3.org/html5/webdatabase/#sqlresultset .  
				// It has insertId, rowsAffected, and rows, which is
				// essentially (not exactly) an array of arrays. 
				}
			);
		});
	}