	/*global QUnit*/

	sap.ui.define([
		"sap/ui/test/opaQunit",
        "./pages/App",
        "./pages/Fcl",
        "./pages/Master",
        "./pages/Details",
        "./pages/Admin"
	], function (opaTest) {
		"use strict";

		QUnit.module("Navigation Journey");

		opaTest("Should see the initial page of the app", function (Given, When, Then) {
			// Arrangements
			Given.iStartMyApp({autoWait: false});
            
			// Assertions
            Then.onTheAppPage.iShouldSeeTheApp();
            // Then.onTheFclPage.iShouldSeeFclLayout();
            
			//Cleanup
			// Then.iTeardownMyApp();
        });

        opaTest("Should see the master page", function (Given, When, Then) {
            When.onTheAppPage.iClickOnPurchaseOrderMenuItem();
			// Assertions
			Then.onTheMasterPage.iShouldSeeTheMaster();
            //Purchase order table
            Then.onTheMasterPage.iShouldSeePurchaseOrderTableWithCount(10);
            // Then.iTeardownMyApp();
        });
 
        opaTest("Select the purchase order from the table should see the details", function (Given, When, Then) {
            When.onTheMasterPage.iSelectPurchaseOrder(0);
            Then.onTheDetailsPage.iShouldSeeSelectedPurchaseOrderId("47000000");
            //Then.iTeardownMyApp();
        });
        
         opaTest("Select close button in detail view should navigate back to purchase order list", function (Given, When, Then) {
            When.onTheDetailsPage.iSelectCloseButton();
            Then.onTheDetailsPage.iShouldNotSeeTheDetailView();
            //Then.iTeardownMyApp();
        });

        opaTest("Detail page should display order details from the route pattern", function (Given, When, Then) {
            When.onTheMasterPage.iDoNotFindPurchaseOrder();
            Then.onTheDetailsPage.iShouldShowOrderFromPattern();
            //Then.iTeardownMyApp();
        });

        opaTest("Should open user menu dialog", function(Given, When, Then) {
            When.onTheAppPage.iClickOnUserMenu();
            Then.onTheAppPage.iShouldSeeUserOption();
            // Then.iTeardownMyApp();
        });

        opaTest("Should open Admin page", function(Given, When, Then) {
            When.onTheAppPage.iClickOnAdminMenuItem();
            Then.onTheAdminPage.iShouldSeeTheAdmin();

            Then.iTeardownMyApp();
        });
	});