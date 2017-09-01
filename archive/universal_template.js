#target Illustrator-18

//Build Mockup/Prepress Template from current spread out CADs
//version 2.0
//Author: William Dowling
//Updated:9/1/15

/*
// Instructions for use:
	Open Blank Template file and place all shirt pieces of desired CAD onto "To Be Placed" layer.
	Run Script
	Folow Prompts 
*/
	
//Begin Script Container

function scriptContainer(){

	////////////////////
	//Global Variables//
	////////////////////
	
	//Related to Prompts//
	var valid = true;
	var whosWearing;
	var whatStyle;
	
	//Related to Template Creation
	var docRef = app.activeDocument;
	var layers = docRef.layers;
	var aB = docRef.artboards;
	var groups = layers.getByName("To Be Placed").groupItems;
	var groupList = [];
	var temp = [];
	var sortedRow = [];
	var finalSorted = [];
	var buffer = 160;
	
	//Defined by userAnswers
	var coords;
	var wearer; //this is mens/womens/youth
	var wearerLayer;
	var prepressLayer;
	var styleNumber;
	var style; // slowpitch, racerback etc
	var descriptor;
	var mockupSize;
	var artLoc;
	
	//Possible variables
	 
	
	
	////////////////////
	//COORDS CONTAINER//
	////////////////////
	var slowRegCoords = { //updated sleeves between front and back shirt pieces
		"XS" : [[74,-97],[536,-90],[309,-280],[480,-760],[310,-114]],
		"S" : [[69,-94],[530,-88],[306,-278],[480,-760],[307,-112]],
		"M" : [[63,-92],[525,-86],[303,-276],[480,-760],[304,-110]],
		"L" : [[58,-89],[519,-84],[301,-274],[480,-760],[302,-108]],
		"XL" : [[52,-86],[514,-83],[298,-272],[480,-760],[299,-106]],
		"2XL" : [[47,-83],[509,-81],[295,-271],[480,-760],[296,-105]],
		"3XL" : [[41,-81],[503,-79],[292,-269],[480,-760],[293,-103]],
		"4XL" : [[37,-78],[498,-77],[289,-267],[480,-760],[290,-101]],
		"5XL" : [[31,-75],[492,-76],[286,-266],[480,-760],[287,-99]],
		"Sizes" : ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
		"Pieces" : ["Front", "Back", "Right Sleeve", "Collar", "Left Sleeve"]
	};
	
	var slowRagCoords = { //updated sleeves between front and back shirt pieces
		"XS" : [[75,-97],[537,-90],[312,-249],[480,-760],[312,-83]],
		"S" : [[70,-95],[531,-88],[310,-242],[480,-760],[309,-76]],
		"M" : [[64,-92],[526,-86],[307,-235],[480,-760],[307,-69]],
		"L" : [[59,-90],[520,-85],[305,-229],[480,-760],[305,-63]],
		"XL" : [[53,-88],[515,-83],[303,-222],[480,-760],[303,-56]],
		"2XL" : [[48,-86],[510,-81],[301,-215],[480,-760],[301,-49]],
		"3XL" : [[42,-82],[504,-80],[299,-208],[480,-760],[298,-42]],
		"4XL" : [[38,-82],[499,-78],[296,-200],[480,-760],[296,-34]],
		"5XL" : [[32,-79],[493,-76],[294,-194],[480,-760],[293,-28]],
		"Sizes" : ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
		"Pieces" : ["Front", "Back", "Right Sleeve", "Collar", "Left Sleeve"]
	};
	
	var slowwRegCoords = {
		"XXS" : [[83,-107],[545,-96],[327,-283],[480,-760],[328,-117]],
		"XS" : [[80,-104],[541,-96],[324,-284],[480,-760],[325,-118]],
		"S" : [[76,-97],[537,-94],[320,-285],[480,-760],[321,-119]],
		"M" : [[73,-95],[534,-92],[317,-284],[480,-760],[318,-118]],
		"L" : [[69,-91],[530,-91],[316,-283],[480,-760],[317,-117]],
		"XL" : [[66,-89],[526,-89],[313,-282],[480,-760],[314,-116]],
		"2XL" : [[62,-86],[523,-87],[311,-280],[480,-760],[312,-114]],
		"3XL" : [[58,-84],[519,-85],[309,-279],[480,-760],[310,-113]],
		"Sizes" : ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"],
		"Pieces" : ["Front", "Back", "Right Sleeve", "Collar", "Left Sleeve"]
	};
	
	var slowwRagCoords = {
		"XXS" : [[84,-110],[547,-102],[319,-249],[480,-760],[319,-82]],
		"XS" : [[80,-107],[543,-100],[317,-248],[480,-760],[317,-81]],
		"S" : [[76,-105],[539,-98],[316,-247],[480,-760],[315,-80]],
		"M" : [[73,-103],[536,-96],[313,-244],[480,-760],[313,-77]],
		"L" : [[69,-100],[532,-94],[312,-240],[480,-760],[311,-74]],
		"XL" : [[65,-97],[528,-93],[310,-238],[480,-760],[310,-71]],
		"2XL" : [[62,-95],[525,-91],[307,-233],[480,-760],[307,-66]],
		"3XL" : [[58,-93],[521,-89],[305,-230],[480,-760],[305,-63]],
		"Sizes" : ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"],
		"Pieces" : ["Front", "Back", "Right Sleeve", "Collar", "Left Sleeve"]
}
	
	var slowyRegCoords = {
		"YXS" : [[90,-110],[551,-109],[329,-309],[480,-760],[329,-140]],
		"YS" : [[86,-108],[547,-108],[325,-305],[480,-760],[324,-136]],
		"YM" : [[81,-106],[542,-106],[322,-301],[480,-760],[321,-132]],
		"YL" : [[77,-104],[538,-104],[318,-296],[480,-760],[318,-127]],
		"YXL" : [[72,-101],[533,-102],[314,-290],[480,-760],[314,-121]],
		"Sizes" : ["YXS", "YS", "YM", "YL", "YXL"],
		"Pieces" : ["Front", "Back", "Right Sleeve", "Collar", "Left Sleeve"]
	}
	
	var slowyRagCoords = {
		"YXS" : [[90,-120],[554,-117],[329,-269],[480,-760],[329,-103]],
		"YS" : [[86,-119],[550,-115],[325,-263],[480,-760],[325,-97]],
		"YM" : [[81,-116],[545,-113],[322,-257],[480,-760],[322,-91]],
		"YL" : [[77,-114],[541,-111],[318,-248],[480,-760],[318,-82]],
		"YXL" : [[72,-111],[536,-109],[314,-240],[480,-760],[314,-74]],
		"Sizes" : ["YXS", "YS", "YM", "YL", "YXL"],
		"Pieces" : ["Front", "Back", "Right Sleeve", "Collar", "Left Sleeve"]
	};	
	
	var fdmhCoords = {
		"S" : [[-14.73,-27],[236.4,-26],[14.23,-617.43],[11.93,-330],[49,-535],[234.06,-330],[268,-535],[487.29,-4.45],[487.29,-158.11],[590,-4.45],[590,-158.11],[292,-642.99]],
		"M" : [[-20.13,-23.39],[231,-22.44],[12.17,-616.51],[6.31,-326.55],[47,-535],[228.43,-326.58],[266,-535],[484,-4.34],[484,-158],[590,-4.34],[590,-158],[282,-642.99]],
		"L" : [[-25.53,-19.83],[225.6,-18.86],[10.1,-615.61],[0.96,-322.68],[46,-535],[223.09,-322.68],[265,-535],[480.63,-4.23],[480.63,-157.88],[590,-4.23],[590,-157.88],[271,-642.99]],
		"XL" : [[-30.92,-16.24],[220.2,-15.21],[8.03,-614.7],[-3.36,-318.62],[44,-535],[218.77,-318.62],[262,-535],[476.94,-4.1],[476.94,-157.75],[590,-4.1],[590,-157.75],[258,-642.99]],
		"2XL" : [[-36.32,-12.67],[214.8,-11.6],[5.97,-613.8],[-8.06,-314.4],[43,-535],[214.07,-314.4],[259,-535],[473.24,-2.14],[473.24,-155.8],[590,-2.14],[590,-155.8],[246,-642.99]],
		"3XL" : [[-41.72,-9.06],[209.4,-8],[3.9,-612.89],[-12.81,-310.51],[42,-535],[209.32,-310.34],[258,-535],[469.45,-2],[469.45,-155.66],[590,-2],[590,-155.66],[239,-643.04],[454,-643.04]],
		"4XL" : [[-47.12,-5.48],[204,-4.42],[1.83,-611.98],[-17.6,-306.44],[40,-535],[204.53,-306.44],[257,-535],[465.66,-0.04],[465.66,-153.7],[590,-0.04],[590,-153.7],[214,-642.99],[442,-642.99]],
		"5XL" : [[-52.52,-1.89],[198.6,-0.75],[-0.24,-611.08],[-22.39,-302.38],[39,-535],[199.74,-302.38],[256,-535],[461.87,1.92],[461.87,-151.74],[590,1.92],[590,-151.74],[205,-642.99],[440,-642.99]],
		"Sizes" : ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
		"Pieces" : 	["Front", "Back", "Pocket", "Right Sleeve", "Right Cuff", "Left Sleeve", "Left Cuff", //
 					"Right Outside Hood", "Left Inside Hood", "Left Outside Hood", "Right Inside Hood", "Waistband", "Waistband 2"]
	}

	var fdwhCoords = {
		"XS" : [[-4.16,-31.42],[248.01,-31.7],[20.4,-636.93],[23.04,-333.49],[53.89,-534.57],[245.59,-333.68],[276.78,-534.48],[490.82,-6.89],[490.82,-160.55],[592.77,-6.89],[592.77,-160.54],[308.34,-642.78]],
		"S" : [[-7.77,-27.81],[244.41,-28.03],[18.79,-635.11],[18.47,-330.47],[52.99,-534.57],[241.01,-330.65],[275.88,-534.66],[487.71,-6.57],[487.71,-160.22],[592.77,-6.56],[592.77,-160.21],[301.14,-643.16]],
		"M" : [[-11.38,-24.23],[240.81,-24.37],[17.16,-633.29],[13.52,-327.46],[52.09,-534.63],[236.05,-327.62],[274.98,-534.52],[485.48,-6.33],[485.48,-159.99],[592.77,-6.33],[592.77,-159.98],[293.94,-643.08]],
		"L" : [[-14.99,-20.85],[237.21,-20.7],[15.52,-631.47],[8.94,-324.4],[51.17,-534.6],[231.48,-324.59],[274.08,-534.67],[482.29,-5.99],[482.29,-159.64],[592.77,-5.99],[592.77,-159.64],[286.74,-642.97]],
		"XL" : [[-20.4,-17.27],[231.8,-17.05],[13.86,-629.67],[3.44,-321.36],[50.29,-534.57],[225.98,-321.55],[273.18,-534.65],[479.74,-4.8],[479.73,-158.45],[592.77,-4.8],[592.77,-158.45],[275.94,-643.2]],
		"2XL" : [[-25.81,-15.34],[226.4,-15.36],[12.2,-627.84],[1.61,-319.56],[49.39,-534.53],[224.14,-319.73],[272.18,-534.5],[478.71,-4.52],[478.7,-158.18],[592.77,-4.53],[592.77,-158.18],[265.14,-642.99]],		"Sizes" : ["XS", "S", "M", "L", "XL", "2XL"],
		"Pieces" : 	["Front", "Back", "Pocket", "Right Sleeve", "Right Cuff", "Left Sleeve", "Left Cuff", //
 					"Right Outside Hood", "Left Inside Hood", "Left Outside Hood", "Right Inside Hood", "Waistband"]
	}
	
	var fdyhCoords = {
		"YS" : [[7.43,-34.09],[257.04,-32.37],[15.88,-628.81],[31,-349.73],[54.08,-537.08],[254.94,-349.7],[278.09,-537.08],[493.66,-8.24],[493.66,-162.88],[597.04,-8.24],[597.04,-162.89],[300.49,-643.03]],
		"YM" : [[2.03,-30.14],[251.64,-30.4],[12.28,-628.81],[25.5,-347.04],[54,-537.08],[249.44,-347.04],[277.18,-537.08],[490.06,-7.55],[490.07,-162.19],[597.04,-7.54],[597.04,-162.19],[289.92,-643.03]],
		"YL" : [[-3.37,-26.15],[246.24,-28.4],[10.37,-627.01],[20.2,-344.38],[52.69,-537.08],[244.13,-344.36],[276.44,-537.08],[486.47,-5.26],[486.47,-159.91],[597.04,-5.25],[597.04,-159.91],[279.37,-643.03]],
		"YXL" : [[-8.77,-22.14],[240.84,-26.51],[8.47,-625.21],[16.04,-341.24],[51.43,-537.08],[239.98,-341.21],[274.69,-537.08],[482.86,-2.99],[482.86,-157.64],[597.04,-2.99],[597.04,-157.64],[267.38,-643.03]],
		"Sizes" : ["YS", "YM", "YL", "YXL"],
		"Pieces" : 	["Front", "Back", "Pocket", "Right Sleeve", "Right Cuff", "Left Sleeve", "Left Cuff", //
					"Right Outside Hood", "Left Inside Hood", "Left Outside Hood", "Right Inside Hood", "Waistband"]
	}
	
	var fastSLCoords = {
		"XXS" : [[470,-758],[142,-110],[486,-102]],
		"XS" : [[468,-758],[138,-107],[483,-100]],
		"S" : [[466,-758],[135,-105],[479,-99]],
		"M" : [[464,-758],[131,-102],[475,-97]],
		"L" : [[463,-758],[128,-99],[472,-95]],
		"XL" : [[463,-758],[124,-95],[468,-93]],
		"2XL" : [[463,-758],[121,-93],[465,-91]],
		"3XL" : [[463,-758],[117,-91],[461,-89]],
		"Sizes" : ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"],
		"Pieces" : [ "Collar", "Front", "Back"]
	};	
	
	var fastRBCoords = {
		"XXS" : [[470,-758],[144,-110],[488,-116]],
		"XS" : [[468,-758],[140,-107],[484,-111]],
		"S" : [[466,-758],[137,-105],[481,-107]],
		"M" : [[464,-758],[133,-103],[477,-103]],
		"L" : [[463,-758],[129,-100],[474,-99]],
		"XL" : [[463,-758],[126,-98],[470,-95]],
		"2XL" : [[463,-758],[122,-95],[466,-90]],
		"3XL" : [[463,-758],[119,-92],[463,-85]],
		"Sizes" : ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"],
		"Pieces" : [ "Collar", "Front", "Back"]
	}
	
	var base2BCoords = {
		"S" : [[511,-756],[297,-183],[365,-212],[406,-183],[302,-281],[302,-97],[63,-86],[524,-79]],
		"M" : [[510,-755],[296,-182],[365,-212],[405,-182],[297,-279],[297,-95],[58,-83],[519,-77]],
		"L" : [[510,-755],[296,-182],[365,-212],[405,-182],[294,-275],[294,-91],[53,-84],[514,-77]],
		"XL" : [[509,-754],[296,-181],[365,-212],[404,-181],[291,-270],[291,-87],[48,-82],[508,-75]],
		"2XL" : [[509,-754],[296,-180],[365,-211],[404,-180],[287,-267],[287,-84],[43,-81],[503,-75]],
		"3XL" : [[508,-754],[295,-179],[365,-211],[404,-179],[282,-270],[282,-86],[38,-79],[498,-75]],
		"4XL" : [[507,-754],[295,-178],[365,-211],[403,-178],[278,-272],[278,-89],[32,-77],[492,-75]],
		"5XL" : [[506,-754],[294,-178],[365,-211],[403,-178],[273,-275],[273,-91],[27,-75],[486,-75]],
		"Sizes" : ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
		"Pieces" : ["Collar", "Left Placard", "Center Placard", "Right Placard", "Right Sleeve", "Left Sleeve", "Front", "Back"]
	}
	
	var base2BYCoords = {
		"YS" : [[517,-754],[296,-182],[365,-212],[405,-182],[304,-292],[304,-110],[76,-91],[537,-78]],
		"YM" : [[516,-754],[296,-182],[365,-212],[405,-182],[302,-292],[302,-110],[73,-89],[533,-78]],
		"YL" : [[515,-755],[296,-181],[365,-212],[404,-181],[300,-292],[300,-110],[68,-88],[529,-78]],
		"YXL" : [[514,-755],[296,-180],[365,-211],[404,-180],[297,-292],[297,-110],[64,-86],[525,-78]],
		"Sizes" : ["YS", "YM", "YL", "YXL"],
		"Pieces" : ["Collar", "Left Placard", "Center Placard", "Right Placard", "Right Sleeve", "Left Sleeve", "Front", "Back"]
	}
	
	var fast2BCoords = {
		"XXS" : [[518,-749],[317,-296],[312,-212],[373,-235],[409,-212],[317,-126],[77,-93],[534,-86]],
		"XS" : [[517,-749],[313,-296],[312,-211],[373,-235],[408,-211],[313,-126],[73,-92],[531,-86]],
		"S" : [[516,-749],[310,-296],[311,-210],[373,-235],[408,-210],[310,-126],[68,-92],[527,-87]],
		"M" : [[515,-749],[306,-295],[311,-209],[373,-235],[407,-209],[306,-125],[66,-91],[524,-87]],
		"L" : [[513,-749],[303,-294],[310,-208],[373,-235],[407,-208],[303,-124],[62,-90],[520,-87]],
		"XL" : [[513,-749],[301,-293],[310,-207],[373,-235],[407,-207],[301,-123],[60,-89],[517,-87]],
		"2XL" : [[512,-749],[298,-291],[309,-207],[373,-235],[406,-207],[298,-121],[56,-88],[514,-86]],
		"3XL" : [[511,-750],[295,-291],[309,-206],[373,-235],[406,-206],[295,-121],[53,-87],[510,-87]],
		"Sizes" : ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"],
		"Pieces" : ["Collar", "Right Sleeve", "Left Placard", "Center Placard", "Right Placard",  "Left Sleeve", "Front", "Back"]
	}
	
	var fastFBCoords = {
		"XXS" : [[513,-755],[316,-102],[396,-104],[72,-97],[134,-97],[534,-94],[315,-285],[315,-111]],
		"XS" : [[512,-755],[315,-102],[396,-104],[69,-96],[134,-96],[531,-94],[312,-285],[312,-111]],
		"S" : [[511,-755],[314,-102],[396,-104],[65,-95],[134,-95],[528,-94],[308,-285],[308,-111]],
		"M" : [[510,-755],[313,-102],[396,-104],[62,-94],[134,-94],[524,-94],[304,-284],[304,-110]],
		"L" : [[509,-755],[313,-102],[396,-104],[58,-94],[134,-94],[521,-94],[301,-283],[301,-109]],
		"XL" : [[508,-755],[312,-102],[396,-104],[55,-93],[134,-93],[517,-94],[299,-282],[299,-108]],
		"2XL" : [[507,-755],[311,-102],[396,-104],[51,-92],[134,-92],[514,-94],[296,-281],[296,-108]],
		"3XL" : [[506,-755],[310,-102],[396,-104],[48,-91],[134,-91],[511,-94],[293,-280],[293,-107]],
		"Sizes" : ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"],
		"Pieces" : ["Collar", "Right Placard", "Left Placard", "Right Front", "Left Front", "Back", "Right Sleeve", "Left Sleeve"]
	}
	
	var fastFBSLCoords = {
		"XXS" : [[513,-755],[316,-102],[396,-104],[79.36,-101.2],[134.57,-101.2],[542.15,-92.98]],
		"XS" : [[512,-755],[315,-102],[396,-104],[76.06,-100.26],[134.51,-100.26],[538.87,-93.04]],
		"S" : [[511,-755],[314,-102],[396,-104],[72.67,-99.28],[134.52,-99.26],[535.55,-93.09]],
		"M" : [[510,-755],[313,-102],[396,-104],[69.23,-98.48],[134.55,-98.46],[532.2,-93.09]],
		"L" : [[509,-755],[313,-102],[396,-104],[65.81,-97.57],[134.53,-97.55],[528.84,-93.16]],
		"XL" : [[508,-755],[312,-102],[396,-104],[62.38,-96.68],[134.52,-96.68],[525.45,-93.2]],
		"2XL" : [[507,-755],[311,-102],[396,-104],[58.91,-95.85],[134.52,-95.83],[522.04,-93.2]],
		"3XL" : [[506,-755],[310,-102],[396,-104],[55.45,-95.09],[134.52,-95.09],[518.62,-93.25]],
		"Sizes" : ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"],
		"Pieces" : ["Collar", "Right Placard", "Left Placard", "Right Front", "Left Front", "Back"]
	}
	
	var baseFBCoords = {
		"S" : [[510,-756],[317,-86],[391,-86],[64.77,-83.99],[135.77,-83.99],[524.75,-77]],
		"M" : [[508,-755],[315,-86],[391,-86],[59.84,-82.75],[135.84,-82.75],[519.32,-75]],
		"L" : [[508,-755],[315,-86],[391,-86],[53.78,-82.85],[134.85,-81.8],[514.53,-75.17]],
		"XL" : [[508,-754],[314,-86],[391,-86],[49,-81],[135,-81],[509.4,-73.27]],
		"2XL" : [[508,-754],[314,-86],[391,-86],[43.87,-81.06],[134.87,-81.06],[504.61,-73.2]],
		"3XL" : [[507,-754],[313,-86],[391,-86],[38.33,-79.42],[135.33,-79.42],[499.69,-73.48]],
		"4XL" : [[506,-754],[312,-86],[391,-86],[33.38,-77.67],[135.37,-77.67],[494.19,-73.3]],
		"5XL" : [[505,-754],[311,-86],[391,-86],[28.02,-75.84],[136.02,-75.84],[489.51,-73.27]],
		"Sizes" : ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
		"Pieces" : ["Collar", "Right Placard", "Left Placard", "Right Front", "Left Front", "Back", "Right Sleeve", "Left Sleeve"]
	}
	
	var baseFBSLCoords = {
		"S" : [[524.72,-76.99],[136.1,-81.56],[63.98,-81.56],[391,-86],[317,-86],[510,-756]],
		"M" : [[519.29,-75.06],[136.06,-80.27],[58.98,-80.27],[391,-86],[315,-86],[508,-755]],
		"L" : [[514.5,-75.1],[136.41,-80.39],[52.67,-80.37],[391,-86],[315,-86],[508,-755]],
		"XL" : [[509.37,-73.31],[136.43,-78.48],[47.88,-78.48],[391,-86],[314,-86],[508,-754]],
		"2XL" : [[504.58,-73.18],[136.12,-78.53],[42.85,-78.55],[391,-86],[314,-86],[508,-754]],
		"3XL" : [[499.66,-73.51],[136.07,-76.89],[37.43,-76.89],[391,-86],[313,-86],[507,-754]],
		"4XL" : [[494.17,-73.39],[136.1,-75.17],[32.38,-75.17],[391,-86],[312,-86],[506,-754]],
		"5XL" : [[489.48,-73.31],[136.12,-73.34],[27.05,-73.34],[391,-86],[311,-86],[505,-754]],
		"Sizes" : ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
		"Pieces" : ["Collar", "Right Placard", "Left Placard", "Right Front", "Left Front", "Back"]
	}
	
	var baseFBYCoords = {
		"YS" : [[517,-757],[329,-111],[395,-111],[82,-113],[137,-113],[540,-101],[310,-123],[310,-288]],
		"YM" : [[516,-757],[328,-111],[395,-111],[78,-112],[137,-112],[537,-101],[308,-122],[308,-287]],
		"YL" : [[515,-757],[327,-111],[395,-111],[73,-110],[137,-110],[532,-101],[305,-286],[305,-121]],
		"YXL" : [[514,-757],[326,-111],[395,-111],[69,-108],[137,-108],[528,-101],[303,-285],[303,-120]],
		"Sizes" : ["YS", "YM", "YL", "YXL"],
		"Pieces" : ["Collar", "Right Placard", "Left Placard", "Right Front", "Left Front", "Back", "Right Sleeve", "Left Sleeve"]
	}
	
	var baseFBYSLCoords = {
		"YS" : [[517,-757],[329,-111],[395,-111],[81.57,-113.93],[137,-113.93],[540,-101]],
		"YM" : [[516,-757],[328,-111],[395,-111],[78.17,-112],[137,-112],[537,-101]],
		"YL" : [[515,-757],[327,-111],[395,-111],[73.24,-110.12],[137,-110.09],[532,-101]],
		"YXL" : [[514,-757],[326,-111],[395,-111],[69,-108.24],[137,-108.23],[528,-101]],
		"Sizes" : ["YS", "YM", "YL", "YXL"],
		"Pieces" : ["Collar", "Right Placard", "Left Placard", "Right Front", "Left Front", "Back"]
	}
	
	fdVolCsCoords = {
		"XXS" : [[91.11,-124.12],[553.93,-118.42],[326.89,-253.07],[475.25,-758.44],[326.89,-126.31]],
		"XS" : [[87.37,-120.88],[550.19,-116.83],[326.89,-253.07],[475.25,-758.44],[326.89,-126.31]],
		"S" : [[85.85,-117.96],[544.79,-115.46],[326.89,-253.07],[475.25,-758.44],[326.89,-126.31]],
		"M" : [[81.97,-115.18],[541.2,-113.82],[325.58,-252.14],[473.45,-758.44],[325.58,-125.38]],
		"L" : [[78.81,-112.64],[538.14,-112.06],[325.94,-251.35],[473.45,-758.44],[325.94,-124.59]],
		"XL" : [[75.26,-109.88],[534.47,-108.5],[324.94,-250.49],[469.85,-758.44],[324.94,-123.73]],
		"2XL" : [[71.29,-107.2],[531.08,-106.73],[323.71,-249.39],[469.85,-758.44],[323.71,-122.63]],
		"Sizes" : ["XXS", "XS", "S", "M", "L", "XL", "2XL"],
		"Pieces" : ["Front", "Back", "Right Sleeve", "Collar", "Left Sleeve"]
	}
	
	fdVolLsCoords = {
		"XXS" : [[91.11,-124.12],[553.93,-118.42],[398.74,-114.67],[475.25,-758.44],[270.12,-114.67]],
		"XS" : [[87.37,-120.7],[550.19,-116.8],[398.74,-114.67],[475.25,-758.44],[270.12,-114.67]],
		"S" : [[85.85,-117.65],[544.79,-115.51],[397.19,-114.67],[475.25,-758.44],[268.56,-114.67]],
		"M" : [[81.97,-115.03],[541.2,-113.84],[395.21,-114.67],[473.45,-758.44],[266.58,-114.67]],
		"L" : [[78.81,-112.51],[538.14,-112.07],[392.28,-114.67],[473.45,-758.44],[263.65,-114.67]],
		"XL" : [[75.26,-109.67],[534.47,-108.48],[388.97,-114.67],[469.85,-758.44],[260.34,-114.67]],
		"2XL" : [[71.29,-107.15],[531.08,-106.76],[385.77,-114.67],[469.85,-758.44],[257.15,-114.67]],
		"Sizes" : ["XXS", "XS", "S", "M", "L", "XL", "2XL"],
		"Pieces" : ["Front", "Back", "Right Sleeve", "Collar", "Left Sleeve"]
	}
	
	fdSocSSCoords = {
		"S" : [[66.54,-100.42],[525.93,-92.9],[301.11,-272.29],[501.5,-752.63],[504.99,-792.78],[301.11,-105.03]],
		"M" : [[61.14,-97.77],[520.53,-91.1],[297.98,-270.49],[500.74,-752.63],[503.06,-792.78],[297.98,-103.23]],
		"L" : [[55.74,-95.11],[515.13,-87.47],[295.16,-268.69],[498.63,-752.63],[502.43,-792.78],[295.16,-101.43]],
		"XL" : [[50.34,-92.45],[509.73,-85.75],[292.07,-266.89],[497.89,-752.63],[500.52,-792.78],[292.07,-99.63]],
		"2XL" : [[44.94,-89.79],[504.32,-84.13],[289.26,-265.09],[496.28,-752.63],[499.9,-792.78],[289.26,-97.83]],
		"Sizes" : ["S", "M", "L", "XL", "2XL"],
		"Pieces" : ["Front", "Back", "Right Sleeve", "Collar", "Collar 2", "Left Sleeve"]
	}

	fdBaskRVCoords = {
		var fastSLCoords = {
		"S" : [[466,-758],[135,-105],[479,-99]],
		"M" : [[464,-758],[131,-102],[475,-97]],
		"L" : [[463,-758],[128,-99],[472,-95]],
		"XL" : [[463,-758],[124,-95],[468,-93]],
		"2XL" : [[463,-758],[121,-93],[465,-91]],
		"3XL" : [[463,-758],[117,-91],[461,-89]],
		"Sizes" : ["S", "M", "L", "XL", "2XL", "3XL"],
		"Pieces" : ["Front", "Back"]
	}
	
	
	
	////////////////////
	//COORDS CONTAINER//
	////////////////////
	
	/////////////////////
	//Artwork Locations//
	/////////////////////
	
	var slowPitchArt = ["Front Logo", 
						"Front Number",  
						"Player Name",
						"Back Number", 
						"Left Sleeve", 
						"Right Sleeve", 
						"Locker Tag", 
						"Sponsor Logo", 
						"Additional Art"];
	var hoodieArt = 	["Front Logo",
						"Front Number",
						"Player Name",
						"Back Number",
						"Left Sleeve",
						"Right Sleeve",
						"Locker Tag",
						"Sponsor Logo",
						"Right Hood",
						"Left Hood",
						"Front Pocket",
						"Additional Art"];
	var fastPitchArt =  ["Front Logo",
						"Front Number",
						"Player Name",
						"Back Number",
						"Locker Tag",
						"Sponsor Logo",
						"Additional Art"];

		
	
	/////////////////////////
	//Begin Logic Container//
	/////////////////////////
	
	//Prompt User for Garment and Wearer

	function garment(){
		var invalidAlert = "Sorry, Your selection was invalid.";
		var shirtInfo;
		whosWearing = 	prompt("Gender?" + ('\n') +
								"Mens (1)" + ('\n') +
								"Womens (2)" +('\n') +
								"Youth (3)",
								
								//default answer
								"Enter the number here..."
								)
		if (whosWearing == 1){//User Answered Mens
			//prompt for the kind of garment
			whatStyle = 	prompt("What Kind of Garment?" + ('\n') +
							"Slowpitch (1)" + ('\n') +
							"Hoodie (2)" + ('\n') + 
							"2Button (3)" + ('\n') + 
							"Full Button (4)" + ('\n') +
							"Full Button Sleeveless (5)"+ ('\n') +
							"Soccer SS (6)"+ ('\n') +
							"Bask Reversible (7)",
							"Enter the number for the garment here..."//default answer
							)
			mockupSize = "XL";
			if(whatStyle == 1){//User Answered Slowpitch
				wearer = "FD_SLOW_";
				var whichCut = 	prompt("Regular or Raglan?" + ('\n') + 
							"Regular (1)" + ('\n') + "Raglan (2)",
							"Enter the number for the cut here...");
				if(whichCut==1){
					coords = slowRegCoords;
					shirtInfo = wearer + "Mens Regular";
				}
				else if(whichCut==2){
					coords = slowRagCoords;
					shirtInfo = wearer + "Mens Raglan";
				}
				
				style = "_SLOW_SS";
				descriptor = "FULL DYE MENS SLOW PITCH SHORT SLEEVE";
				artLoc = slowPitchArt;
			}
			else if(whatStyle ==2){//User answered hoodie
				wearer = "FDMH_";
				coords = fdmhCoords;
				style = "MH";
				descriptor = "FULL DYE MENS HOODIE";
				artLoc = hoodieArt;
				shirtInfo = wearer;
			}
			else if(whatStyle == 3){
				wearer = "FD_BASE_2B_SS_";
				coords = base2BCoords;
				style = "_BASE_2B";
				descriptor = "FULL DYE MENS 2BUTTON";
				artLoc = slowPitchArt;
				shirtInfo = wearer;
				
			}
			else if(whatStyle == 4){
				wearer = "FD_BASE_FB_SS_";
				coords = baseFBCoords;
				style = "_BASE_FB_SS";
				descriptor = "FULL DYE MENS FULL BUTTON";
				artLoc = slowPitchArt;
				shirtInfo = wearer;
			}
			else if(whatStyle == 5){
				wearer = "FD_BASE_FB_SL_";
				coords = baseFBSLCoords;
				style = "_BASE_FB_SL";
				descriptor = "FULL DYE MENS FULL BUTTON SLEEVELESS";
				artLoc = fastPitchArt;
				shirtInfo = wearer;
			}
			else if(whatStyle == 6){
				wearer = "FD_SOC_SS_";
				coords = fdSocSSCoords;
				style = "_SOC_SS";
				descriptor = "FULL DYE MENS SOCCER SHORT SLEEVE";
				artLoc = slowPitchArt;
				shirtInfo = wearer;
			}
			else if(whatStyle == 7){
				wearer = "FD_BASK_SLRV2P_";
				coords = fdBaskRVCoords;
				style = "_FD_BASK_SLRV2P";
				descriptor = "FULL DYE MENS REVERSIBLE BASKETBALL SLEEVELESS JERSEY";
				artLoc = fastPitchArt;
				shirtInfo = wearer;

			}
			else{
				alert(invalidAlert);
				valid = false;
				return;
			}
		}
		else if(whosWearing == 2){
			whatStyle = prompt("What Kind of Garment?" + ('\n') +
							"Slowpitch (1)" + ('\n') +
							"Fastpitch (2)" + ('\n') + 
							"Hoodie (3)" + ('\n') + 
							"Volleyball (4)"+ ('\n') +
							"Volleyball LS (5)",
							"Enter the number for the garment here..."//default answer
							)
			if(whatStyle == 1){
				wearer = "FD_SLOWW_"
				var whichCut = prompt	("Regular or Raglan?" + ('\n') +
									"Regular (1)" + ('\n') +
									"Raglan (2)",
									"Enter the number for the cut here");
				if(whichCut==1){
					coords = slowwRegCoords;
					shirtInfo = wearer + "Womens Regular";
				}
				else if (whichCut==2){
					coords = slowwRagCoords;
					shirtInfo = wearer + "Womens Raglan";
				}
				else{
					alert(invalidAlert);
					valid = false;
					return;
				}
				
				mockupSize = "M";
				style = "_SLOWW_SS";
				descriptor = "FULL DYE WOMENS SLOW PITCH SHORT SLEEVE";
				artLoc = slowPitchArt;
			}
			else if(whatStyle == 2){
				var whichCut = prompt("Sleeveless, Racerback or 2Button?" + ('\n') +
										"Sleeveless (1)" + ('\n') + 
										"Racerback (2)" +('\n') + 
										"2Button (3)" + ('\n') + 
										"Full Button (4)"+ ('\n') +
										"Full Button Sleeveless (5)",
										"Enter number for style here"
							)
				if(whichCut == 1){
					wearer = "FD_FAST_SL_";
					coords = fastSLCoords;
					shirtInfo = wearer;
					style = "_FAST_SL";
					descriptor = "FULL DYE WOMENS FASTPITCH SLEEVELESS";
					artLoc = fastPitchArt;
				}
				else if(whichCut == 2){
					wearer = "FD_FAST_RB_";
					coords = fastRBCoords;
					shirtInfo = wearer;
					style = "_FAST_RB";
					descriptor = "FULL DYE WOMENS FASTPITCH RACERBACK";
					artLoc = fastPitchArt;
				}
				else if(whichCut == 3){
					wearer = "FD_FAST_2B_W_";
					coords=  fast2BCoords;
					shirtInfo = wearer;
					style = "_FAST_2B_W"
					descriptor = "FULL DYE WOMENS 2 BUTTON SHORT SLEEVE";
					artLoc = slowPitchArt;
				}
				else if(whichCut == 4){
					wearer = "FD_FAST_FB_W_SS_";
					coords = fastFBCoords;
					shirtInfo = wearer;
					style = "_FAST_FB_SS";
					descriptor = "FULL DYE WOMENS FULL BUTTON SHORT SLEEVE";
					artLoc = slowPitchArt;
				}
				else if(whichCut == 5){
					wearer = "FD_FAST_FB_W_SL_";
					coords = fastFBSLCoords;
					shirtInfo = wearer;
					style = "_FAST_FB_SL";
					descriptor = "FULL DYE WOMENS FULL BUTTON SLEEVELESS";
					artLoc = fastPitchArt;
				}
				else{
					alert(invalidAlert)
					valid = false;
					return;
				}
				mockupSize = "M";
				
				
				
			}
			else if(whatStyle ==3){
				wearer = "FDWH_";
				coords = fdwhCoords;
				shirtInfo = wearer;
				mockupSize = "M";
				style = "_FDWH";
				descriptor = "FULL DYE WOMENS HOODIE";
				artLoc = hoodieArt;
			}
			else if(whatStyle == 4){
				wearer = "FD_VOL_CS_";
				coords = fdVolCsCoords;
				shirtInfo = wearer;
				mockupSize = "M";
				style = "_VOL_CS";
				descriptor = "FULL DYE WOMENS VOLLEYBALL CAP SLEEVE";
				artLoc = fastPitchArt;
			}
			else if(whatStyle = 5){
				wearer = "FD_VOL_LS_";
				coords = fdVolLsCoords;
				shirtInfo = wearer;
				mockupSize = "M";
				style = "_VOL_LS";
				descriptor = "FULL DYE WOMENS VOLLEYBALL LONG SLEEVE";
				artLoc = slowPitchArt;
			}
			else{
				alert(invalidAlert);
			}
		}
		else if(whosWearing == 3){
			whatStyle = prompt("What Kind of Garment?" + ('\n') +
							"Slowpitch (1)" + ('\n') + 
							"2Button (2)" + ('\n') +
							"Full Button (3)"+ ('\n') +
							"Full Button Sleeveless (4)" + ('\n') + 
							"Hoodie (5)",
							"Enter the number for the garment here..."//default answer
							)
			if(whatStyle == 1){
				wearer = "FD_SLOWY_"
				var whichCut = prompt	("Regular or Raglan?" + ('\n') +
									"Regular (1)" + ('\n') +
									"Raglan (2)",
									"Enter the number for the cut here");
				if(whichCut ==1){
					coords = slowyRegCoords;
					shirtInfo = "Youth Regular";
				}
				else if(whichCut == 2){
					coords = slowyRagCoords;
					shirtInfo = "Youth Raglan";
				}
				mockupSize = "YXL";
				style = "_SLOWY_SS";
				descriptor = "FULL DYE YOUTH SLOW PITCH SHORT SLEEVE";
				artLoc = slowPitchArt;

			}
			else if(whatStyle == 2){
				wearer = "FD_BASE_2B_Y_"
				coords = base2BYCoords;
				shirtInfo = wearer;
				style = "_BASE_2B_Y";
				descriptor = "FULL DYE YOUTH 2 BUTTON SHORT SLEEVE";
				artLoc = slowPitchArt;
				mockupSize = "YXL";
			}
			else if(whatStyle == 3){
				wearer = "FD_BASE_FB_Y_SS_";
				coords = baseFBYCoords;
				shirtInfo = wearer;
				style = "_BASE_FB_Y_SS";
				descriptor = "FULL DYE YOUTH FULL BUTTON SHORT SLEEVE";
				artLoc = slowPitchArt;
				mockupSize = "YXL";
			}
			else if(whatStyle == 4){
				wearer = "FD_BASE_FB_Y_SL_";
				coords = baseFBYSLCoords;
				shirtInfo = wearer;
				style = "_BASE_FB_Y_SL";
				descriptor = "FULL DYE YOUTH FULL BUTTON SLEEVELESS";
				artLoc = fastPitchArt;
				mockupSize = "YXL";
			}
			else if(whatStyle == 5){
				wearer = "FDYH_";
				coords = fdyhCoords;
				shirtInfo = wearer;
				style = "_FDYH";
				descriptor = "FULL DYE YOUTH HOODIE";
				artLoc = hoodieArt;
				mockupSize = "YXL";
			}
			else{
				alert(invalidAlert);
			}
		}
		else {
			alert(invalidAlert);
			valid = false;
			return;
		}
		var shirtInfoLayer = layers.getByName("Information").layers.add();
		shirtInfoLayer.name = shirtInfo;
		styleNumber = prompt("What's the style number?", "000");
		wearerLayer = layers.add();
		wearerLayer.name = wearer + styleNumber;
	}
	
	function groupPush(){
		if(layers.getByName("To Be Placed").pathItems.length>0 ||//
			layers.getByName("To Be Placed").textFrames.length>0 ||//
			layers.getByName("To Be Placed").compoundPathItems.length>0){
				alert("Make sure the shirt pieces are grouped properly");
				valid = false;
				return;
			}
		for(var a=0;a<groups.length;a++){
			groupList.push(groups[a]);
		}
	}
	
	function getRow(){
		var sortH;
		var rowMarker;
		var top;
		var bot;
		var compare;
		var curGroup;
		var cGTop;
		var cGBot;
		var vCenter;
		var placeholder;
		var farLeft;
		var deleteIndex;
		while(groupList.length > 0){
			sortH = [];
			temp = [];
			rowMarker = groupList[0];
			top = rowMarker.visibleBounds[1];
			bot = rowMarker.visibleBounds[3];
			compare = (top - (rowMarker.height/2));
			temp.push(rowMarker);
			groupList.splice(0,1);
			for(var r=groupList.length-1;r>-1;r--){
				curGroup = groupList[r];
				cGTop = curGroup.visibleBounds[1];
				cGBot = curGroup.visibleBounds[3];
				vCenter = (cGTop - (curGroup.height/2));
				if(vCenter + buffer > compare && vCenter - buffer < compare){
					temp.push(curGroup);
					groupList.splice(r,1);
				}
			}
	
			for(var s=temp.length-1;s>-1;s--){
				placeholder = 0;
				deleteIndex;
				docRef.selection = null;
				for(var a=0;a<temp.length;a++){
					if(placeholder ==0){
						placeholder = temp[a].visibleBounds[0];
						farLeft = temp[a];
						deleteIndex = a;
					}
					else if(temp[a].visibleBounds[0]<placeholder){
						placeholder = temp[a].visibleBounds[0];
						farLeft = temp[a];
						deleteIndex = a;
					}
				}
				sortH.push(farLeft);
				temp.splice(deleteIndex,1);
			}
	
			if(sortH.length>0){
				sortedRow.push(sortH);
			}
			else if(sortH.length<1){
				alert("nothing was added to sortH");
			}
		}
				}
				
	function vSort(){
		var placeholder;
		var topRow;
		var deleteIndex;
		for(var v=sortedRow.length-1;v>-1;v--){
			placeholder = 0;
			for(var s=0;s<sortedRow.length;s++){
				if(placeholder == 0){
					placeholder = sortedRow[s][0].visibleBounds[1];
					topRow = sortedRow[s];
					deleteIndex = s;
				}
				else if(sortedRow[s][0].visibleBounds[1] > placeholder){
					placeholder = sortedRow[s][0].visibleBounds[1];
					topRow = sortedRow[s];
					deleteIndex = s;
				}
			}
	
			finalSorted.push(topRow);
			sortedRow.splice(deleteIndex,1);
		}
		if(finalSorted.length<1){
			alert("nothing in finalSorted");
		}
	}
	
	function placeOnTemplate(){
		prepressLayer = wearerLayer.layers.add();
		prepressLayer.name = "Prepress";
		
		var curRow;
		var curSize;
		var sizeLayer;
		var curGroup;
		
		for (var a=0;a<finalSorted.length;a++){
			prepressLayer.locked = false;
			prepressLayer.visible = true;
			curRow = finalSorted[a];
			curSize = coords["Sizes"][a];
			try{
				sizeLayer = prepressLayer.layers.getByName(curSize);
			}
			catch(e){
				sizeLayer = prepressLayer.layers.add();
				sizeLayer.name = curSize;
			}
			for(var b=0;b<curRow.length;b++){
				curGroup = curRow[b];
				sizeLayer.zOrder (ZOrderMethod.SENDTOBACK);
				curGroup.left = coords[curSize][b][0];
				curGroup.top = coords[curSize][b][1];
				curGroup.moveToBeginning(sizeLayer);
				curGroup.name = curSize + " " + coords["Pieces"][b];
			}
		}
		if(wearer == "FD_BASE_FB_SS_" || wearer == "FD_BASE_FB_Y_SS_"){
			var size;
			var theGroup
			for(var b=0;b<prepressLayer.layers.length;b++){
				size = prepressLayer.layers[b].name;
				theGroup = prepressLayer.layers[b].groupItems.getByName(size + " Right Front");
				theGroup.zOrder(ZOrderMethod.BRINGTOFRONT);
			}
		}
		layers.getByName("To Be Placed").remove();
	}
	
	function writeInfo(){
		var info = layers.getByName("Information");
		info.locked = false;
		var garmentCode = info.textFrames.getByName("Garment Code");
		garmentCode.contents = "FD" + style + "_|" + styleNumber + "|";
		var description = info.textFrames.getByName("Garment Description");
		description.contents = descriptor;
		info.name = "Information";
		info.moveToBeginning(wearerLayer);
		info.zOrder(ZOrderMethod.SENDTOBACK);
		info.locked = true;
		
	}
	
	function clipPaths(){
		var clipLayer = layers.getByName("Clip Paths")
		clipLayer.locked = false;
		clipLayer.zOrder(ZOrderMethod.BRINGTOFRONT);
		var sourceLayer = prepressLayer.layers.getByName(mockupSize);
		var curObject;
		for(var a=sourceLayer.groupItems.length-1;a>-1;a--){
			curObject = sourceLayer.groupItems[a];
			if (curObject.name.indexOf("Collar")==-1 && curObject.name.indexOf("Placard")==-1){
				curObject.duplicate(clipLayer);
				clipLayer.groupItems[0].zOrder(ZOrderMethod.SENDTOBACK);
			}
		}
		if(wearerLayer.name.indexOf("FDMH")>-1){
			for(var a=0;a< coords["Pieces"].length-1;a++){
				var curGroup = clipLayer.groupItems[mockupSize + " " + coords["Pieces"][a]];
				var curName = curGroup.name;
				var clipPath = clipLayer.pageItems[curName.substring(3,curName.length) + " Clip"];
				var clipGroup = clipLayer.groupItems.add();
				clipGroup.name = curName + " Clip";
				curGroup.moveToBeginning(clipGroup);
				clipPath.moveToBeginning(clipGroup);
				clipPath.clipping = true;
				clipGroup.clipped = true;
				if(curName == "XL Front"){
					clipLayer.pageItems["Pocket Stitches"].moveToBeginning(clipGroup);
				}
			}
		}
		else if(wearerLayer.name.indexOf("FDWH")>-1){
			for(var a=0;a<coords["Pieces"].length;a++){
				var curGroup = clipLayer.groupItems[mockupSize + " " + coords["Pieces"][a]];
				var curName = curGroup.name;
				var clipPath = clipLayer.pageItems[curName.substring(2,curName.length) + " Clip"];
				var clipGroup = clipLayer.groupItems.add();
				clipGroup.name = curName + " Clip";
				curGroup.moveToBeginning(clipGroup);
				clipPath.moveToBeginning(clipGroup);
				clipPath.clipping = true;
				clipGroup.clipped = true;
				if(curName == "M Front"){
					clipLayer.pageItems["Pocket Stitches"].moveToBeginning(clipGroup);
				}
			}
		}
		else if(wearerLayer.name.indexOf("FDYH")>-1){
			for(var a=0;a<coords["Pieces"].length;a++){
				var curGroup = clipLayer.groupItems[mockupSize + " " + coords["Pieces"][a]];
				var curName = curGroup.name;
				var clipPath = clipLayer.pageItems[curName.substring(4,curName.length) + " Clip"];
				var clipGroup = clipLayer.groupItems.add();
				clipGroup.name = curName + " Clip";
				curGroup.moveToBeginning(clipGroup);
				clipPath.moveToBeginning(clipGroup);
				clipPath.clipping = true;
				clipGroup.clipped = true;
				if(curName == "YXL Front"){
					clipLayer.pageItems["Pocket Stitches"].moveToBeginning(clipGroup);
				}
			}
		}
		else{
			for(var a=0;a<coords["Pieces"].length;a++){
				if(coords["Pieces"][a].indexOf("Collar")==-1){
					var curGroup = clipLayer.groupItems[mockupSize + " " + coords["Pieces"][a]];
					var curName = curGroup.name;
					var clipPath = clipLayer.pageItems[curName.substring(mockupSize.length+1, curName.length) + " Clip"];
					var clipGroup = clipLayer.groupItems.add();
					clipGroup.name = curName + " Clip";
					curGroup.moveToBeginning(clipGroup);
					clipPath.moveToBeginning(clipGroup);
					clipPath.clipping = true;
					clipGroup.clipped = true;
				}
			}
		}
		clipLayer.name = "Mockup";
		clipLayer.moveToBeginning(wearerLayer);
	}
	
	function artworkLayers(){
		var artLayer = layers.getByName("Artwork Layer");
		artLayer.locked = false;

		var curLayer;
		for(var a=artLoc.length-1;a>-1;a--){
			curLayer = artLayer.layers.add();
			curLayer.name = artLoc[a];
		}
		artLayer.moveToBeginning(wearerLayer);
		prepressLayer.visible = false;
	}
	
	
	/////////////////////////
	//Begin script callouts//
	/////////////////////////
	
	garment();
	if(valid){
		groupPush();
	}
	if(valid){
		getRow();
		vSort();
		placeOnTemplate();
		writeInfo();
		clipPaths();
		artworkLayers();
		app.doScript("Finish","Templates");
	}//end if valid
	
} // end scriptContainer();

scriptContainer();