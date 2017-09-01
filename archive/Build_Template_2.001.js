/*
//Converted Templates Rebuild

Please use the old "universal_template.jsx" for any garments that have already been converted
	baseball, softball, fastpitch, hoodies, full buttons, 2 buttons etc.

/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~
_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~/~_~

Script Name: Build_Template.js
Author: William Dowling
Build Date: 01 June, 2016
Description: Convert prepress file into scriptable template
Build number 2.000

Progress:
	
	Version: 2.001
		01 June, 2016
		Initial build. Set up containers and begin defining functions
		Set up script global variables and begin library object


*/

function container()
{
	///////Begin/////////
	///Logic Container///
	/////////////////////







	////////End//////////
	///Logic Container///
	/////////////////////

	///////Begin////////
	////Data Storage////
	////////////////////

	var library = 
	{
		"FD_5411" :
		{
			"mockupSize" : "XL";
			"sizes" : ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Right Sleeve", "Left Sleeve", "Right Cowl", "Left Cowl", "Additional Art"],
			"pieces" : ["Front", "Left Cuff", "Right Cuff", "Back", "Collar", "Left Side Panel", "Right Side Panel", "Left Sleeve", "Outside Cowl", "Right Sleeve", "Inside Cowl"],
			"placement" : 
			{

			}
		}
	}






	////////End/////////
	////Data Storage////
	////////////////////

	///////Begin////////
	///Function Calls///
	////////////////////

	//define script global variables

	var docRef = app.activedocument;
	var layers = docRef.layers;
	var garmentLayer = layers[1]
	var code = garmentLayer.name.substring(0,garmentLayer.name.indexOf("_0"));
	var prepress = garmentLayer.layers["Prepress"];
	var sourceLayer = layers["To Be Placed"];
	var infoLayer = garmentLayer.layers["Information"];
	var artLayer = garmentLayer.layers["Artwork Layer"];

	//





	////////End/////////
	///Function Calls///
	////////////////////


}
container();