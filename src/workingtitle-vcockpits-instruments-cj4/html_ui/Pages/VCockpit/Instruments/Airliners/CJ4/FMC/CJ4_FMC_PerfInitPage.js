class CJ4_FMC_PerfInitPage {
    static ShowPage1(fmc) {
        fmc.clearDisplay();
        const advSwitch = fmc._templateRenderer.renderSwitch(["ENABLE", "DISABLE"], 1);
        fmc._templateRenderer.setTemplateRaw([
            ["", "", "PERF MENU[blue]"],
            [""],
            ["<PERF INIT", "FUEL MGMT>"],
            [""],
            ["<VNAV SETUP[disabled]", "FLT LOG>"], //Page 3, 4, 5 ----12
            [""],
            ["<TAKEOFF", "APPROACH>"], //Page 6, 7, 8 ---13, 14, 15
            [""],
            [""],
            [" ADVISORY VNAV[blue]"],
            [advSwitch],
            [" VNAV PLAN SPD[blue]"],
            ["        --- KT[s-text white]"]
        ]);
        fmc.onLeftInput[0] = () => { CJ4_FMC_PerfInitPage.ShowPage2(fmc); };
        fmc.onLeftInput[1] = () => { CJ4_FMC_PerfInitPage.ShowPage3(fmc); };
        fmc.onLeftInput[2] = () => { CJ4_FMC_TakeoffRefPage.ShowPage1(fmc); };
        fmc.onRightInput[0] = () => { CJ4_FMC_FuelMgmtPage.ShowPage1(fmc); };
        fmc.onRightInput[1] = () => { CJ4_FMC_PerfInitPage.ShowPage12(fmc); };
        fmc.onRightInput[2] = () => { CJ4_FMC_ApproachRefPage.ShowPage1(fmc); };
        fmc.updateSideButtonActiveStatus();
    }
    static ShowPage2(fmc) { //PERF INIT
        fmc.clearDisplay();
		
        let crzAltCell = "□□□□□";
		let zFW = 0;
		let paxNumber = "/170[d-text]LB[s-text]";
		let bow = 10280;
        if (fmc.cruiseFlightLevel) {
            crzAltCell = fmc.cruiseFlightLevel;
        }
        fmc.onRightInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (fmc.setCruiseFlightLevelAndTemperature(value)) {
                CJ4_FMC_PerfInitPage.ShowPage2(fmc);
            }
        };
        let fuelQuantityLeft = Math.trunc(6.7 * SimVar.GetSimVarValue("FUEL LEFT QUANTITY", "Gallons"));
        let fuelQuantityRight = Math.trunc(6.7 * SimVar.GetSimVarValue("FUEL RIGHT QUANTITY", "Gallons"));
        let fuelQuantityTotal = fuelQuantityRight + fuelQuantityLeft;
        let fuelCell = Math.trunc(fuelQuantityTotal);

		if (fmc.zFWActive == 1) {
			zFW = fmc.zFWPilotInput;
			bow = "-----";
			fmc.paxNumber = "--";
			paxNumber = "--";
			fmc.cargoWeight = "----";
		} else {
			zFW = 10280 + (fmc.paxNumber * 170) + fmc.cargoWeight;
		}
		fmc.grossWeight = zFW + fuelCell;
		
		if (zFW > 12500) {
			zFW = zFW + "[yellow]";
		}
		
		

        fmc._templateRenderer.setTemplateRaw([
            [" ACT PERF INIT[blue]","",""],
            [" BOW[blue]", "CRZ ALT[blue] "],
            [bow + "[d-text]LB[s-text]", "FL" + crzAltCell],
            [" PASS/WT[blue]"],
            [" " + fmc.paxNumber + paxNumber],
            [" CARGO[blue]", "= ZFW[blue] "],
            [" " + fmc.cargoWeight + "[d-text] LB[s-text]", zFW + " LB[s-text]"],
            [" SENSED FUEL[blue]", "= GWT[blue] "],
            [" " + fuelCell + "[d-text] LB[s-text]", fmc.grossWeight + " LB[s-text]"],
            ["------------------------[blue]"],
            ["", "TAKEOFF>"],
            ["", ""],
            ["", "VNAV SETUP>"]
        ]);
        fmc.onLeftInput[1] = () => {
            fmc.paxNumber = fmc.inOut;
            zFW = ((fmc.inOut * 170) + fmc.cargoWeight + fmc.basicOperatingWeight) / 2200;
            fmc.clearUserInput();
            { CJ4_FMC_PerfInitPage.ShowPage2(fmc); }
        };
        fmc.onLeftInput[2] = () => {
            fmc.cargoWeight = parseInt(fmc.inOut); //ParseInt changes from string to number
            zFW = (fmc.cargoWeight + (fmc.paxNumber * 170) + fmc.basicOperatingWeight) / 2200;
            fmc.clearUserInput();
            { CJ4_FMC_PerfInitPage.ShowPage2(fmc); }
        };
		fmc.onRightInput[2] = () => {
			if (fmc.inOut == FMCMainDisplay.clrValue){
				fmc.zFWActive = 0;
				fmc.paxNumber = 0;
				fmc.cargoWeight = 0;
			} else {
            zFW = parseInt(fmc.inOut);
			fmc.zFWPilotInput = parseInt(fmc.inOut);
			fmc.zFWActive = 1;
			}
			fmc.clearUserInput();
            CJ4_FMC_PerfInitPage.ShowPage2(fmc);
        };
        fmc.onRightInput[4] = () => { CJ4_FMC_TakeoffRefPage.ShowPage1(fmc); };
        fmc.onRightInput[5] = () => { CJ4_FMC_PerfInitPage.ShowPage3(fmc); };
        fmc.updateSideButtonActiveStatus();
    }
    static ShowPage3(fmc) { //VNAV SETUP Page 1
        fmc.clearDisplay();
        fmc._templateRenderer.setTemplateRaw([
            [" ACT VNAV CLIMB[blue]", "1/3[blue]"],
            [" TGT SPEED[blue]", "TRANS ALT [blue]"],
            ["240/.64", "18000"],
            [" SPD/ALT LIMIT[blue]"],
            ["250/10000"],
            [""],
            ["---/-----"],
            [""],
            [""],
            [""],
            [""],
            ["-----------------------[blue]"],
            ["", "PERF INIT>"]
        ]);
        fmc.onPrevPage = () => { CJ4_FMC_PerfInitPage.ShowPage5(fmc); };
        fmc.onNextPage = () => { CJ4_FMC_PerfInitPage.ShowPage4(fmc); };
        fmc.onRightInput[5] = () => { CJ4_FMC_PerfInitPage.ShowPage2(fmc); };
        fmc.updateSideButtonActiveStatus();
    }
    static ShowPage4(fmc) { //VNAV SETUP Page 2
        fmc.clearDisplay();
        fmc._templateRenderer.setTemplateRaw([
            [" ACT VNAV CRUISE[blue]", "2/3[blue]"],
            [" TGT SPEED[blue]", "CRZ ALT [blue]"],
            ["300/.74", "crzAltCell"],
            [""],
            [""],
            [""],
            [""],
            [""],
            [""],
            [""],
            [""],
            ["-----------------------[blue]"],
            ["", "PERF INIT>"]
        ]);
        fmc.onPrevPage = () => { CJ4_FMC_PerfInitPage.ShowPage3(fmc); };
        fmc.onNextPage = () => { CJ4_FMC_PerfInitPage.ShowPage5(fmc); };
        fmc.onRightInput[5] = () => { CJ4_FMC_PerfInitPage.ShowPage2(fmc); };
        fmc.updateSideButtonActiveStatus();
    }
    static ShowPage5(fmc) { //VNAV SETUP Page 3
        fmc.clearDisplay();

        let vnavDescentIas = WTDataStore.get('CJ4_vnavDescentIas', 290);
        let vnavDescentMach = WTDataStore.get('CJ4_vnavDescentMach', 0.74);
        let vpa = WTDataStore.get('CJ4_vpa', 3);
        let arrivalSpeedLimit = WTDataStore.get('CJ4_arrivalSpeedLimit', 250);
        let arrivalSpeedLimitAltitude = WTDataStore.get('CJ4_arrivalSpeedLimitAltitude', 10000);
        let arrivalTransitionFl = WTDataStore.get('CJ4_arrivalTransitionFl', 180);

        fmc._templateRenderer.setTemplateRaw([
            [" ACT VNAV DESCENT[blue]", "3/3[blue]"],
            [" TGT SPEED[blue]", "TRANS FL [blue]"],
            [vnavDescentMach + "/" + vnavDescentIas, "FL" + arrivalTransitionFl],
            [" SPD/ALT LIMIT[blue]"],
            [arrivalSpeedLimit + "/" + arrivalSpeedLimitAltitude],
            ["", "VPA [blue]"],
            ["---/-----", vpa + "\xB0"],
            [""],
            ["<VNAV WPTS", "VNAV MONITOR>"],
            [""],
            [""],
            ["-----------------------[blue]"],
            ["<DESC INFO", "PERF INIT>"]
        ]);
        fmc.onPrevPage = () => { CJ4_FMC_PerfInitPage.ShowPage4(fmc); };
        fmc.onNextPage = () => { CJ4_FMC_PerfInitPage.ShowPage3(fmc); };
        fmc.onRightInput[5] = () => { CJ4_FMC_PerfInitPage.ShowPage2(fmc); };

        fmc.onLeftInput[0] = () => {
            let value = fmc.inOut.split("/");
            value[0] = parseFloat(value[0]).toPrecision(2);
            value[1] = parseInt(value[1]);
            if (value.length == 2 && value[0] >= 0.4 && value[0] <= 0.77 && value[1] >= 110 && value[1] <= 305) {
                vnavDescentMach = value[0];
                vnavDescentIas = value[1];
                WTDataStore.set('CJ4_vnavDescentMach', vnavDescentMach);
                WTDataStore.set('CJ4_vnavDescentIas', vnavDescentIas);
            }
            else {
                fmc.showErrorMessage("INVALID");
            }
            fmc.clearUserInput();
            CJ4_FMC_PerfInitPage.ShowPage2(fmc);
        };

        fmc.onLeftInput[1] = () => {
            let value = fmc.inOut.split("/");
            value[0] = parseInt(value[0]);
            value[1] = parseInt(value[1]);
            if (value.length == 2 && value[0] > 0 && value[0] <= 305 && value[1] >= 0 && value[1] <= 45000) {
                arrivalSpeedLimit = value[0];
                arrivalSpeedLimitAltitude = value[1];
                WTDataStore.set('CJ4_arrivalSpeedLimit', arrivalSpeedLimit);
                WTDataStore.set('CJ4_arrivalSpeedLimitAltitude', arrivalSpeedLimitAltitude);
            }
            else {
                fmc.showErrorMessage("INVALID");
            }
            fmc.clearUserInput();
            CJ4_FMC_PerfInitPage.ShowPage2(fmc);
        };

        fmc.onRightInput[0] = () => {
            let value = parseInt(fmc.inOut);
            if (value >= 0 && value <= 450) {
                arrivalTransitionFl = value;
                WTDataStore.set('CJ4_arrivalTransitionFl', arrivalTransitionFl);
            }
            else {
                fmc.showErrorMessage("INVALID");
            }
            fmc.clearUserInput();
            CJ4_FMC_PerfInitPage.ShowPage2(fmc);
        };

        fmc.onRightInput[2] = () => {
            let value = parseFloat(fmc.inOut).toPrecision(2);
            if (value > 0 && value <= 6) {
                vpa = value;
                WTDataStore.set('CJ4_vpa', vpa);
            }
            else {
                fmc.showErrorMessage("INVALID");
            }
            fmc.clearUserInput();
            CJ4_FMC_PerfInitPage.ShowPage2(fmc);
        };

        fmc.onRightInput[3] = () => {
            CJ4_FMC_PerfInitPage.ShowPage7(fmc);
        };

        fmc.onLeftInput[3] = () => {
            CJ4_FMC_PerfInitPage.ShowPage6(fmc);
        };

        
        fmc.updateSideButtonActiveStatus();
    }

    static ShowPage12(fmc) { //FLIGHT LOG
        fmc.clearDisplay();

        // Set takeoff time
        let toTime = "---";
        const takeOffTime = SimVar.GetSimVarValue("L:TAKEOFF_TIME", "seconds");
        if(takeOffTime && takeOffTime > 0){
            const hours = Math.floor(takeOffTime / 60 / 60);
            const hoursString = hours > 9 ? "" + hours : "0" + hours;

            const minutes = Math.floor(takeOffTime / 60) - (hours * 60);
            const minutesString = minutes > 9 ? "" + minutes : "0" + minutes;
            toTime = hoursString + ":" + minutesString;
        }

        // Set landing time
        let ldgTime = "---";
        const landingTime = SimVar.GetSimVarValue("L:LANDING_TIME", "seconds");
        if(landingTime && landingTime > 0){
            const hours = Math.floor(landingTime / 60 / 60);
            const hoursString = hours > 9 ? "" + hours : "0" + hours;

            const minutes = Math.floor(landingTime / 60) - (hours * 60);
            const minutesString = minutes > 9 ? "" + minutes : "0" + minutes;
            ldgTime = hoursString + ":" + minutesString;
        }

        // Set enroute time
        let eteTime = "---";
        const enrouteTime = SimVar.GetSimVarValue("L:ENROUTE_TIME", "seconds");
        if(enrouteTime && enrouteTime > 0){
            const hours = Math.floor(enrouteTime / 60 / 60);
            const hoursString = hours > 9 ? "" + hours : "0" + hours;

            const minutes = Math.floor(enrouteTime / 60) - (hours * 60);
            const minutesString = minutes > 9 ? "" + minutes : "0" + minutes;
            eteTime = hoursString + ":" + minutesString;
        }

        let fuelUsed = "---";
        let avgTas = "---";
        let avgGs = "---";
        let airDis = "---";
        let gndDis = "---";
        fmc._templateRenderer.setTemplateRaw([
            ["", "", "FLIGHT LOG[blue]"],
            [" T/O[s-text blue]", "LDG [s-text blue]", "EN ROUTE[s-text blue]"],
            [toTime, ldgTime, eteTime],
            [" FUEL USED[blue]", "AVG TAS/GS [blue]"],
            [fuelUsed, avgTas + "/" + avgGs],
            [" AIR DIST[blue]", "GND DIST [blue]"],
            [airDis, gndDis],
            ["     NM[s-text]", "NM[s-text]"],
            [""],
            [""],
            [""],
            ["-------------------------[blue]"],
            ["", "PERF MENU>"]
        ]);
        fmc.onRightInput[5] = () => { CJ4_FMC_PerfInitPage.ShowPage1(fmc); };
        fmc.updateSideButtonActiveStatus();
    }

    static ShowPage6(fmc) { //VNAV WPTS
        fmc.clearDisplay();

        let waypoints = [];
        let rows = [
            [""], [""], [""], [""], [""], [""], [""], [""], [""]
        ];

        //FETCH WAYPOINTS WITH CONSTRAINTS
        if (fmc.getConstraints().length > 0) {
            waypoints = fmc.getConstraints();
            let activeWaypoint = waypoints.find(wp => { return (wp && wp.icao.substr(-5) == fmc.flightPlanManager.getActiveWaypointIdent()); })
            if (activeWaypoint) {
                let activeWaypointIndex = waypoints.indexOf(activeWaypoint);
                waypoints = waypoints.slice(activeWaypointIndex);
            }
            if (waypoints.length > 0) {
                //console.log("waypoints.length > 0");
                let rowNumber = 0;
                for (let i = 0; i < waypoints.length; i++) {
                    let wpt = waypoints[i];
                    let waypointIdent = wpt.icao.substr(-5);
                    let type = "none";
                    let altitudeConstraint = "none";
                    if (wpt && wpt.legAltitudeDescription && wpt.legAltitudeDescription > 0 && wpt.legAltitude1 > 1000 && rowNumber < 9) {
                        if (wpt.legAltitudeDescription == 1 && wpt.legAltitude1 > 100) {
                            altitudeConstraint = wpt.legAltitude1.toFixed(0) >= 18000 ? "FL" + wpt.legAltitude1.toFixed(0) / 100
                                : wpt.legAltitude1.toFixed(0);
                            type = "AT"
                        }
                        else if (wpt.legAltitudeDescription == 2 && wpt.legAltitude1 > 100) {
                            altitudeConstraint = wpt.legAltitude1.toFixed(0) >= 18000 ? "FL" + wpt.legAltitude1.toFixed(0) / 100 + "A"
                                : wpt.legAltitude1.toFixed(0) + "A";
                            type = "ABOVE"
                        }
                        else if (wpt.legAltitudeDescription == 3 && wpt.legAltitude1 > 100) {
                            altitudeConstraint = wpt.legAltitude1.toFixed(0) >= 18000 ? "FL" + wpt.legAltitude1.toFixed(0) / 100 + "B"
                                : wpt.legAltitude1.toFixed(0) + "B";
                            type = "BELOW"
                            }
                        else if (wpt.legAltitudeDescription == 4 && wpt.legAltitude2 > 100 && wpt.legAltitude1 > 100) {
                            let altitudeConstraintA = wpt.legAltitude2.toFixed(0) >= 18000 ? "FL" + wpt.legAltitude2.toFixed(0) / 100 + "A"
                                : wpt.legAltitude2.toFixed(0) + "A";
                            let altitudeConstraintB = wpt.legAltitude1.toFixed(0) >= 18000 ? "FL" + wpt.legAltitude1.toFixed(0) / 100 + "B"
                                : wpt.legAltitude1.toFixed(0) + "B";
                            altitudeConstraint = altitudeConstraintB + altitudeConstraintA;
                            type = "BOTH"
                        }
                        altitudeConstraint = altitudeConstraint.padStart(6, " ");
                        rows[rowNumber] = [waypointIdent.padStart(5, " ") + " " + type.padStart(5, " ") + "[s-text]", altitudeConstraint + "[s-text]"];
                        rowNumber++;
                    }
                }
            }
        }

        fmc._templateRenderer.setTemplateRaw([
            [" VNAV WAYPOINTS[blue]", "1/1[blue]"],
            [" WPT   TYPE[blue]", "CONST [blue]"],
            ...rows,
            ["-----------------------[blue]"],
            ["", "VNAV DESCENT>"]
        ]);
        //fmc.onPrevPage = () => { CJ4_FMC_PerfInitPage.ShowPage3(fmc); };
        //fmc.onNextPage = () => { CJ4_FMC_PerfInitPage.ShowPage5(fmc); };
        fmc.onRightInput[5] = () => { CJ4_FMC_PerfInitPage.ShowPage5(fmc); };
        fmc.updateSideButtonActiveStatus();
    }

    static ShowPage7(fmc) { //VNAV MONITOR
        fmc.clearDisplay();

        //VARIABLE SETUP
        let destination = undefined;
        let destinationIdent = undefined;
        let destinationDistance = undefined;
        let activeWaypoint = undefined;
        let activeWaypointIdent = undefined;
        let activeWptIndex = undefined;
        let activeWaypointDist = undefined;
        let currentDistanceInFP = undefined;
        let _lastActiveWaypointIdent = undefined;

        //COMPONENTS TO REFRESH ONLY WHEN THERE IS A FLIGHT PLAN CHANGE
        let desiredFPA = WTDataStore.get('CJ4_vpa', 3);
        let vnavType = false;
        let waypoints = [];

        //DESTINATION DATA
        if (fmc.flightPlanManager.getDestination()) {
            destination = fmc.flightPlanManager.getDestination();
            destinationIdent = destination.ident;
            vnavType = "destination";
        }

        //FLIGHT PLAN DATA
        if (destination && fmc.flightPlanManager.getWaypoints() && fmc.getConstraints()) {
            waypoints = [...fmc.getConstraints()];
            if (waypoints.length > 0) {
                vnavType = "route";
            }
        }

        if (vnavType) {
            fmc.registerPeriodicPageRefresh(() => {
                //COLLECT AIRCRAFT VARIABLES
                let currPos = new LatLong(SimVar.GetSimVarValue("GPS POSITION LAT", "degree latitude"), SimVar.GetSimVarValue("GPS POSITION LON", "degree longitude"));
                let groundSpeed = SimVar.GetSimVarValue("GPS GROUND SPEED", "knots");
                //let apCurrentAltitude = SimVar.GetSimVarValue("AUTOPILOT ALTITUDE LOCK VAR", "Feet");
                let apCurrentVerticalSpeed = SimVar.GetSimVarValue("AUTOPILOT VERTICAL HOLD VAR", "Feet/minute");
                let altitude = SimVar.GetSimVarValue("PLANE ALTITUDE", "Feet");

                //VNAV SETUP
                let vnavTargetDistance = undefined;
                let topOfDescent = undefined;
                let vnavTargetWaypoint = undefined;
                let vnavTargetAltitude = undefined;
                let vnavTargetFpWaypoint = undefined;

                //LOAD DEFAULT DESTINATION VNAV
                if (vnavType == "destination") {
                    let destinationElevation = destination.infos.oneWayRunways[0].elevation * 3.28;
                    vnavTargetAltitude = destinationElevation + 1500;
                    if (fmc.flightPlanManager.getActiveWaypoint()) {
                        activeWaypointDist = Avionics.Utils.computeDistance(currPos, activeWaypoint.infos.coordinates);
                        currentDistanceInFP = activeWaypoint.cumulativeDistanceInFP - activeWaypointDist;
                        destinationDistance = destination.cumulativeDistanceInFP - currentDistanceInFP;
                    }
                    else {
                        destinationDistance = Avionics.Utils.computeDistance(currPos, destination.infos.coordinates);
                        currentDistanceInFP = destinationDistance;
                    }
                    vnavTargetDistance = destinationDistance - 10;
                    topOfDescent = 10 + ((altitude - vnavTargetAltitude) / (Math.tan(desiredFPA * (Math.PI / 180)))) / 6076.12;
                    vnavTargetWaypoint = destination;
                }
                //LOAD ROUTE VNAV ONLY WHEN ACTIVE WAYPOINT HAS CHANGED OR ON FIRST RUN
                else if (vnavType == "route" && fmc.flightPlanManager.getWaypoints() && fmc.flightPlanManager.getActiveWaypoint() && fmc.flightPlanManager.getActiveWaypoint().ident != _lastActiveWaypointIdent) {

                    //COLLECT NAVIGATION VARIABLES
                    activeWaypoint = fmc.flightPlanManager.getActiveWaypoint();
                    activeWaypointIdent = activeWaypoint.ident;
                    _lastActiveWaypointIdent = activeWaypoint.ident;
                    activeWptIndex = fmc.flightPlanManager.getActiveWaypointIndex();
                    activeWaypointDist = Avionics.Utils.computeDistance(currPos, activeWaypoint.infos.coordinates);
                    currentDistanceInFP = activeWaypoint.cumulativeDistanceInFP - activeWaypointDist;

                    //COLLECT ACTUAL FLIGHT PLAN WAYPOINTS
                    let fpWaypoints = [];
                    if (fmc.flightPlanManager.getWaypoints()) {
                        fpWaypoints = [...fmc.flightPlanManager.getWaypoints()];
                    }
                    if (!fmc.flightPlanManager.isActiveApproach() && fmc.flightPlanManager.getApproachWaypoints()) {
                        if (fpWaypoints[fpWaypoints.length - 1].ident == destinationIdent) {
                            fpWaypoints.pop();
                        }
                        let approachWaypoints = [...fmc.flightPlanManager.getApproachWaypoints()];
                        if (approachWaypoints[0].ident == fpWaypoints[fpWaypoints.length - 1].ident) {
                            approachWaypoints.pop();
                        }
                        fpWaypoints = fpWaypoints.concat(approachWaypoints);
                    }
                    else if (fmc.flightPlanManager.isActiveApproach()) {
                        let approachWaypoints = [...fmc.flightPlanManager.getApproachWaypoints()];
                        fpWaypoints = approachWaypoints;
                    }

                    //PLAN DESCENT PROFILE
                    for (let i = waypoints.length - 1; i >= 0; i--) {
                        let waypoint = waypoints[i];
                        let fpWaypoint = fpWaypoints.find(wp => { return (wp && wp.icao.substr(-5) == waypoint.icao.substr(-5)); })
                        let legAltitudeDescription = waypoint.legAltitudeDescription;
                        if (legAltitudeDescription == 1 && waypoint.legAltitude1 > 1000) { //AT CASE
                            vnavTargetAltitude = waypoint.legAltitude1;
                            vnavTargetDistance = fpWaypoint == activeWaypoint ? activeWaypointDist
                                : fpWaypoint.cumulativeDistanceInFP - currentDistanceInFP;
                            topOfDescent = ((altitude - vnavTargetAltitude) / (Math.tan(desiredFPA * (Math.PI / 180)))) / 6076.12;
                            vnavTargetWaypoint = waypoint;
                            vnavTargetFpWaypoint = fpWaypoint;
                        }
                        else if (legAltitudeDescription == 2 && waypoint.legAltitude1 > 1000) { //ABOVE CASE
                            let distanceFromVnavTargetWaypoint = vnavTargetFpWaypoint.cumulativeDistanceInFP - fpWaypoint.cumulativeDistanceInFP;
                            let vnavTargetAltitudeAtWaypoint = vnavTargetAltitude + (6076.12 * distanceFromVnavTargetWaypoint * (Math.tan(desiredFPA * (Math.PI / 180))));
                            if (vnavTargetAltitudeAtWaypoint < waypoint.legAltitude1) {
                                vnavTargetAltitude = waypoint.legAltitude1;
                                vnavTargetDistance = fpWaypoint == activeWaypoint ? activeWaypointDist
                                : fpWaypoint.cumulativeDistanceInFP - currentDistanceInFP;
                                topOfDescent = ((altitude - vnavTargetAltitude) / (Math.tan(desiredFPA * (Math.PI / 180)))) / 6076.12;
                                vnavTargetWaypoint = waypoint;
                                vnavTargetFpWaypoint = fpWaypoint;
                            }
                        }
                        else if (legAltitudeDescription == 3 && waypoint.legAltitude1 > 1000) { //BELOW CASE
                            let distanceFromVnavTargetWaypoint = vnavTargetFpWaypoint.cumulativeDistanceInFP - fpWaypoint.cumulativeDistanceInFP;
                            let vnavTargetAltitudeAtWaypoint = vnavTargetAltitude + (6076.12 * distanceFromVnavTargetWaypoint * (Math.tan(desiredFPA * (Math.PI / 180))));
                            if (vnavTargetAltitudeAtWaypoint > waypoint.legAltitude1) {
                                vnavTargetAltitude = waypoint.legAltitude1;
                                vnavTargetDistance = fpWaypoint == activeWaypoint ? activeWaypointDist
                                : fpWaypoint.cumulativeDistanceInFP - currentDistanceInFP;
                                topOfDescent = ((altitude - vnavTargetAltitude) / (Math.tan(desiredFPA * (Math.PI / 180)))) / 6076.12;
                                vnavTargetWaypoint = waypoint;
                                vnavTargetFpWaypoint = fpWaypoint;
                            }
                        }
                        else if (legAltitudeDescription == 4 && waypoint.legAltitude1 > 1000) { //ABOVE AND BELOW CASE
                            let distanceFromVnavTargetWaypoint = vnavTargetFpWaypoint.cumulativeDistanceInFP - fpWaypoint.cumulativeDistanceInFP;
                            let vnavTargetAltitudeAtWaypoint = vnavTargetAltitude + (6076.12 * distanceFromVnavTargetWaypoint * (Math.tan(desiredFPA * (Math.PI / 180))));
                            if (vnavTargetAltitudeAtWaypoint > waypoint.legAltitude1) {
                                vnavTargetAltitude = waypoint.legAltitude1;
                                vnavTargetDistance = fpWaypoint == activeWaypoint ? activeWaypointDist
                                : fpWaypoint.cumulativeDistanceInFP - currentDistanceInFP;
                                topOfDescent = ((altitude - vnavTargetAltitude) / (Math.tan(desiredFPA * (Math.PI / 180)))) / 6076.12;
                                vnavTargetWaypoint = waypoint;
                                vnavTargetFpWaypoint = fpWaypoint;
                            }
                            else if (vnavTargetAltitudeAtWaypoint < waypoint.legAltitude2) {
                                vnavTargetAltitude = waypoint.legAltitude2;
                                vnavTargetDistance = fpWaypoint == activeWaypoint ? activeWaypointDist
                                : fpWaypoint.cumulativeDistanceInFP - currentDistanceInFP;
                                topOfDescent = ((altitude - vnavTargetAltitude) / (Math.tan(desiredFPA * (Math.PI / 180)))) / 6076.12;
                                vnavTargetWaypoint = waypoint;
                                vnavTargetFpWaypoint = fpWaypoint;
                            }
                        }
                    }
    
                }

                /////////////////// I GOT THIS FAR











                //default values
                let prevWaypointIdent = "-----";
                let prevWaypointDist = "----";
                let activeWaypointIdent = "-----";
                let activeWaypointDist = "----";
                let nextWaypointIdent = "-----";
                let nextWaypointDist = "----";
                let destinationIdent = "----";
                let destinationDistance = "----";
                let prevWaypoint = false;
                let activeWaypoint = false;
                let nextWaypoint = false;
                let destination = false;
                
                //destination data
                if (fmc.flightPlanManager.getDestination()) {
                    destination = fmc.flightPlanManager.getDestination();
                    destinationIdent = new String(fmc.flightPlanManager.getDestination().ident);
                    let destinationDistanceDirect = Avionics.Utils.computeDistance(currPos, destination.infos.coordinates);
                    let destinationDistanceFlightplan = 0;
                    destinationDistance = destinationDistanceDirect;
                    if (activeWaypoint) {
                        destinationDistanceFlightplan = new Number(destination.cumulativeDistanceInFP - activeWaypoint.cumulativeDistanceInFP + activeWaypointDist);
                    }
                    else {
                        destinationDistanceFlightplan = destination.cumulativeDistanceInFP;
                    }
                    destinationDistance = destinationDistanceDirect > destinationDistanceFlightplan ? destinationDistanceDirect
                        : destinationDistanceFlightplan;
                }


                //previous waypoint data
                if (fmc.flightPlanManager.getPreviousActiveWaypoint()) {
                    prevWaypoint = fmc.flightPlanManager.getPreviousActiveWaypoint();
                    prevWaypointIdent = new String(fmc.flightPlanManager.getPreviousActiveWaypoint().ident);
                    prevWaypointDist = new Number(Avionics.Utils.computeDistance(currPos, prevWaypoint.infos.coordinates));
                }

                //current active waypoint data
                if (fmc.flightPlanManager.getActiveWaypoint()) {
                    activeWaypoint = fmc.flightPlanManager.getActiveWaypoint();
                    activeWaypointIdent = new String(fmc.flightPlanManager.getActiveWaypoint().ident);
                    activeWaypointDist = new Number(fmc.flightPlanManager.getDistanceToActiveWaypoint());
                    //activeWaypointEte = groundSpeed < 50 ? new String("-:--")
                    //    : new Date(fmc.flightPlanManager.getETEToActiveWaypoint() * 1000).toISOString().substr(11, 5);
                }

                //next waypoint data
                if (fmc.flightPlanManager.getNextActiveWaypoint()) {
                    nextWaypoint = fmc.flightPlanManager.getNextActiveWaypoint();
                    nextWaypointIdent = new String(fmc.flightPlanManager.getNextActiveWaypoint().ident);
                    nextWaypointDist = new Number(activeWaypointDist + Avionics.Utils.computeDistance(fmc.flightPlanManager.getActiveWaypoint().infos.coordinates, nextWaypoint.infos.coordinates));
                    //nextWaypointEte = groundSpeed < 50 ? new String("-:--")
                    //    : new Date(this.calcETEseconds(nextWaypointDist, groundSpeed) * 1000).toISOString().substr(11, 5);
                }



                
                
                //FETCH WAYPOINTS WITH CONSTRAINTS
                if (fmc.getConstraints().length > 0 && fmc.flightPlanManager.getWaypoints()) {
                    let allWaypoints = [];
                    let enrouteWaypoints = [...fmc.flightPlanManager.getWaypoints()];
                    enrouteWaypoints.pop();
                    let approachWaypoints = [];
                    let activeWptIndex = fmc.flightPlanManager.getActiveWaypointIndex();
                    // ENROUTE
                    if (fmc.flightPlanManager.getWaypoints() && !fmc.flightPlanManager.isActiveApproach()) {
                        // get enroute waypoints
            
                        if (fmc.flightPlanManager.getApproachWaypoints()) {
                            approachWaypoints = [...fmc.flightPlanManager.getApproachWaypoints()];
                            allWaypoints = enrouteWaypoints.concat(approachWaypoints);
                        }
                        else {
                            allWaypoints = enrouteWaypoints;
                        }
                        waypoints = allWaypoints;
                        // if (activeWptIndex <= 1) {
                        //     waypoints = allWaypoints;
                        // }
                        // else if (activeWptIndex > 1) {
                        //     waypoints = allWaypoints.splice(activeWptIndex - 1);
                        // }
                    }
                    // APPROACH
                    else if (fmc.flightPlanManager.isActiveApproach()) {
                        if (fmc.flightPlanManager.getApproachWaypoints()) {
                            approachWaypoints = [...fmc.flightPlanManager.getApproachWaypoints()];
                            allWaypoints = approachWaypoints;
                        }
                        waypoints = allWaypoints;        
                        // // on first wp show em all
                        // if (activeWptIndex == 1) {
                        //     waypoints = allWaypoints;
                        // }
                        // // skip previous legs
                        // else if (activeWptIndex > 1) {
                        //     waypoints = allWaypoints.splice(activeWptIndex - 1);
                        // }
                    }
                    let constraints = fmc.getConstraints();
                    for (let i = 0; i < waypoints.length; i++) {
                        let waypointIcao = waypoints[i].icao;
                        let constraintWpt = constraints.find(wp => { return (wp && wp.icao == waypointIcao); })
                        if (constraintWpt) {
                            waypoints[i].legAltitudeDescription = constraintWpt.legAltitudeDescription;
                            waypoints[i].legAltitude1 = constraintWpt.legAltitude1;
                            waypoints[i].legAltitude2 = constraintWpt.legAltitude2;
                        }
                        else {
                            waypoints[i].legAltitudeDescription = 0;
                            waypoints[i].legAltitude1 = 0;
                            waypoints[i].legAltitude2 = 0;
                        }
                    }
                    let currentWpt = waypoints.find(wp => { return (wp && wp.icao.substr(-5) == activeWaypoint.icao.substr(-5)); });
                    let currentIndex = waypoints.indexOf(currentWpt);
                    waypoints = waypoints.slice(currentIndex);
                }

                console.log("waypoints.length: " + waypoints.length);
                //console.log(waypoints[0].icao + " " + waypoints[waypoints.length - 1].icao);

                //IF THERE ARE CONSTRAINTS
                if (waypoints.length > 0 && destination) {
                    //console.log("waypoints.length > 0: " + waypoints.length);
                    //console.log("first waypoint " + waypoints[waypoints.length - 1].icao + " " + waypoints[waypoints.length - 1].legAltitudeDescription + " " + waypoints[waypoints.length - 1].legAltitude1);
                    let currentDistanceInFP = activeWaypoint.cumulativeDistanceInFP - activeWaypointDist;
                    for (let i = waypoints.length - 1; i >= 0; i--) {
                        //console.log("processing wpt: " + i + " " + waypoints[i].icao);
                        let waypoint = waypoints[i];
                        let legAltitudeDescription = waypoint.legAltitudeDescription
                        if (legAltitudeDescription == 1 && waypoint.legAltitude1 > 1000) { //AT CASE
                            vnavTargetAltitude = waypoint.legAltitude1;
                            vnavTargetDistance = waypoint == activeWaypoint ? activeWaypointDist
                                : waypoint.cumulativeDistanceInFP - currentDistanceInFP;
                            topOfDescent = ((altitude - vnavTargetAltitude) / (Math.tan(desiredFPA * (Math.PI / 180)))) / 6076.12;
                            vnavTargetWaypoint = waypoint;
                            //console.log("currentDistanceInFP " + currentDistanceInFP + "waypoint.cumulativeDistanceInFP " + waypoint.cumulativeDistanceInFP);
                        }
                        else if (legAltitudeDescription == 2 && waypoint.legAltitude1 > 1000) { //ABOVE CASE
                            let distanceFromVnavTargetWaypoint = vnavTargetWaypoint.cumulativeDistanceInFP - waypoint.cumulativeDistanceInFP;
                            let vnavTargetAltitudeAtWaypoint = vnavTargetAltitude + (6076.12 * distanceFromVnavTargetWaypoint * (Math.tan(desiredFPA * (Math.PI / 180))));
                            if (vnavTargetAltitudeAtWaypoint < waypoint.legAltitude1) {
                                vnavTargetAltitude = waypoint.legAltitude1;
                                vnavTargetDistance = waypoint == activeWaypoint ? activeWaypointDist
                                : waypoint.cumulativeDistanceInFP - currentDistanceInFP;
                                topOfDescent = ((altitude - vnavTargetAltitude) / (Math.tan(desiredFPA * (Math.PI / 180)))) / 6076.12;
                                vnavTargetWaypoint = waypoint;
                                //console.log("currentDistanceInFP " + currentDistanceInFP + "waypoint.cumulativeDistanceInFP " + waypoint.cumulativeDistanceInFP);
                            }
                        }
                        else if (legAltitudeDescription == 3 && waypoint.legAltitude1 > 1000) { //BELOW CASE
                            let distanceFromVnavTargetWaypoint = vnavTargetWaypoint.cumulativeDistanceInFP - waypoint.cumulativeDistanceInFP;
                            let vnavTargetAltitudeAtWaypoint = vnavTargetAltitude + (6076.12 * distanceFromVnavTargetWaypoint * (Math.tan(desiredFPA * (Math.PI / 180))));
                            if (vnavTargetAltitudeAtWaypoint > waypoint.legAltitude1) {
                                vnavTargetAltitude = waypoint.legAltitude1;
                                vnavTargetDistance = waypoint == activeWaypoint ? activeWaypointDist
                                : waypoint.cumulativeDistanceInFP - currentDistanceInFP;
                                topOfDescent = ((altitude - vnavTargetAltitude) / (Math.tan(desiredFPA * (Math.PI / 180)))) / 6076.12;
                                vnavTargetWaypoint = waypoint;
                                //console.log("currentDistanceInFP " + currentDistanceInFP + "waypoint.cumulativeDistanceInFP " + waypoint.cumulativeDistanceInFP);
                            }
                        }
                        else if (legAltitudeDescription == 4 && waypoint.legAltitude1 > 1000) { //ABOVE AND BELOW CASE
                            let distanceFromVnavTargetWaypoint = vnavTargetWaypoint.cumulativeDistanceInFP - waypoint.cumulativeDistanceInFP;
                            let vnavTargetAltitudeAtWaypoint = vnavTargetAltitude + (6076.12 * distanceFromVnavTargetWaypoint * (Math.tan(desiredFPA * (Math.PI / 180))));
                            if (vnavTargetAltitudeAtWaypoint > waypoint.legAltitude1) {
                                vnavTargetAltitude = waypoint.legAltitude1;
                                vnavTargetDistance = waypoint == activeWaypoint ? activeWaypointDist
                                : waypoint.cumulativeDistanceInFP - currentDistanceInFP;
                                topOfDescent = ((altitude - vnavTargetAltitude) / (Math.tan(desiredFPA * (Math.PI / 180)))) / 6076.12;
                                vnavTargetWaypoint = waypoint;
                                //console.log("currentDistanceInFP " + currentDistanceInFP + "waypoint.cumulativeDistanceInFP " + waypoint.cumulativeDistanceInFP);
                            }
                            else if (vnavTargetAltitudeAtWaypoint < waypoint.legAltitude2) {
                                vnavTargetAltitude = waypoint.legAltitude2;
                                vnavTargetDistance = waypoint == activeWaypoint ? activeWaypointDist
                                : waypoint.cumulativeDistanceInFP - currentDistanceInFP;
                                topOfDescent = ((altitude - vnavTargetAltitude) / (Math.tan(desiredFPA * (Math.PI / 180)))) / 6076.12;
                                vnavTargetWaypoint = waypoint;
                                //console.log("currentDistanceInFP " + currentDistanceInFP + "waypoint.cumulativeDistanceInFP " + waypoint.cumulativeDistanceInFP);
                            }
                        }
                        //i--;
                    }
                }
                //PREPARE VNAV VARIABLES
                let desiredVerticalSpeed = -101.2686667 * groundSpeed * Math.tan(desiredFPA * (Math.PI / 180));
                let desiredAltitude = vnavTargetAltitude + (Math.tan(desiredFPA * (Math.PI / 180)) * vnavTargetDistance * 6076.12);
                let altDeviation = altitude - desiredAltitude;
                let setVerticalSpeed = 0;

                if (vnavTargetDistance > topOfDescent + 0.5) {
                    setVerticalSpeed = 0;
                }
                else if (vnavTargetDistance < 1 && vnavTargetDistance > 0) {
                    setVerticalSpeed = desiredVerticalSpeed;
                }
                else {
                    if (altDeviation >= 500) {
                        setVerticalSpeed = desiredVerticalSpeed * 1.5;
                    }
                    else if (altDeviation <= -500) {
                        setVerticalSpeed = desiredVerticalSpeed * 0;
                    }
                    else if (altDeviation >= 400) {
                        setVerticalSpeed = desiredVerticalSpeed * 1.4;
                    }
                    else if (altDeviation <= -400) {
                        setVerticalSpeed = desiredVerticalSpeed * 0;
                    }
                    else if (altDeviation >= 300) {
                        setVerticalSpeed = desiredVerticalSpeed * 1.3;
                    }
                    else if (altDeviation <= -300) {
                        setVerticalSpeed = desiredVerticalSpeed * 0.25;
                    }
                    else if (altDeviation >= 200) {
                        setVerticalSpeed = desiredVerticalSpeed * 1.2;
                    }
                    else if (altDeviation <= -200) {
                        setVerticalSpeed = desiredVerticalSpeed * 0.5;
                    }
                    else if (altDeviation >= 100) {
                        setVerticalSpeed = desiredVerticalSpeed * 1.1;
                    }
                    else if (altDeviation <= -100) {
                        setVerticalSpeed = desiredVerticalSpeed * 0.8;
                    }
                    else if (altDeviation >= 20) {
                        setVerticalSpeed = desiredVerticalSpeed * 1.05;
                    }
                    else if (altDeviation <= -20) {
                        setVerticalSpeed = desiredVerticalSpeed * 0.9;
                    }
                    else {
                        setVerticalSpeed = desiredVerticalSpeed;
                    }
                }
                setVerticalSpeed = Math.round(setVerticalSpeed);
                //console.log("setVerticalSpeed: " + setVerticalSpeed);
                //SimVar.SetSimVarValue('K:HEADING_BUG_SET', 'degrees', setHeading.toFixed(0));

                // let deltaVS = setVerticalSpeed - apCurrentVerticalSpeed;
                // let iMax = deltaVS > 0 ? Math.min(deltaVS / 100)
                //     : deltaVS < 0 ? Math.max(deltaVS / 100)
                //         : 0;
                // let iMaxAbs = Math.abs(iMax);
                // for (let i = 0; i < iMaxAbs; i++) {
                //     if (deltaVS < 0) {
                //         SimVar.SetSimVarValue("K:AP_VS_VAR_DEC", "number", 0);
                //     }
                //     else if (deltaVS > 0) {
                //         SimVar.SetSimVarValue("K:AP_VS_VAR_INC", "number", 0);
                //     }
                // }
                //SimVar.SetSimVarValue("K:AP_VS_VAR_SELECT", "feet per minute", setVerticalSpeed.toFixed(0));
                Coherent.call("AP_VS_VAR_SET_ENGLISH", 0, setVerticalSpeed);

                const distanceToTod = vnavTargetDistance > topOfDescent ? Math.round(vnavTargetDistance - topOfDescent) : "N/A";
                //SET VNAV TARGET ALTITUDE AS SELECTED ALTITUDE
                if (distanceToTod <= 0 || distanceToTod == "N/A") {
                    Coherent.call("AP_ALT_VAR_SET_ENGLISH", 0, vnavTargetAltitude, true);
                }

                fmc._templateRenderer.setTemplateRaw([
                    ["", "", "WORKING TITLE VPATH" + "[blue]"],
                    [" target alt[blue]", "target dist [blue]"],
                    [vnavTargetAltitude.toFixed(0) + "ft", vnavTargetDistance.toFixed(1) + "nm"],
                    [" VNAV Target[blue]", "ground spd [blue]"],
                    [vnavTargetWaypoint.ident + "", groundSpeed.toFixed(0) + "kts"],
                    [" target FPA[blue]", "target VS [blue]"],
                    [desiredFPA.toFixed(1) + "°", desiredVerticalSpeed.toFixed(0) + "fpm"],
                    [" alt dev[blue]", "ap vs [blue]"],
                    [altDeviation.toFixed(0) + "ft", apCurrentVerticalSpeed.toFixed(0) + "fpm"],
                    [" set vs[blue]", "TOD Dist"],
                    [setVerticalSpeed.toFixed(0) + "fpm[green]", distanceToTod + " nm"],
                    [""],
                    ["", "VNAV DESCENT>"]
                ]);

            }, 1000, true);
        }
        else {
            fmc._templateRenderer.setTemplateRaw([
                ["", "", "WORKING TITLE VPATH" + "[blue]"],
                [""],
                [""],
                [""],
                ["", "", "UNABLE VNAV"],
                [""],
                [""],
                [""],
                [""],
                [""],
                [""],
                [""],
                ["", "VNAV DESCENT>"]
            ]);
        }
    fmc.onRightInput[5] = () => { CJ4_FMC_PerfInitPage.ShowPage5(fmc); };

    fmc.updateSideButtonActiveStatus();
    }

}
//# sourceMappingURL=CJ4_FMC_PerfInitPage.js.map