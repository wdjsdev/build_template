/* beautify ignore:start */
function makeDialog()
{
	var dialogSuccess = true;

	var w = new Window("dialog", "Config Setup:");
		var topTxt = w.add("statictext", undefined, "Please input the necessary information for the garment.");

		//group for garment code entry:
		// var gcGroup = w.add("group");
		var gcGroup = w.add("panel",undefined,"Enter The Garment Code: ");
			// var gcTxt = UI.static(gcGroup,"Enter The Garment Code: ");
			var sampleGcInput = (config.garmentCode && config.garmentCode !== "") ? config.garmentCode : "eg.FD-161Y"
			var gcInput = UI.edit(gcGroup,sampleGcInput);
				gcInput.active = true;
				gcInput.characters = 12;

		//group for orientation of CAD:
		var oriGroup = w.add("panel",undefined,"Select the orientation of the CAD layout.");
			// var oriTxt = UI.static(oriGroup,"Select the orientation of the CAD layout.");
			
			//group for radio buttons
			var oriRadioGroup = oriGroup.add("group");
				var oriVert = oriRadioGroup.add("radiobutton", undefined, "Vertical");
					oriVert.onClick = function()
					{
						cadOrientation = "vertical";
					}
					
				var oriHorz = oriRadioGroup.add("radiobutton", undefined, "Horizontal");
					oriHorz.onClick = function()
					{
						cadOrientation = "horizontal";
					}

				var help = oriRadioGroup.add("radiobutton", undefined, "Help");
					help.onClick = function()
					{
						var h = new Window("dialog","Orientation Help");
							var msg = UI.static(h,"Orientation Help");
							var imgGroup = UI.group(h);
								imgGroup.orientation = "row";
								var vertImageGroup = UI.group(imgGroup);
									vertImageGroup.orientation = "column";
									var vertMsg = UI.static(vertImageGroup, "Vertical Orientation");
									var vertImg = UI.image(vertImageGroup, resourcePath + "/Images/vertical_orientation.jpg");
								var horzImageGroup = UI.group(imgGroup);
									horzImageGroup.orientation = "column";
									var horzMsg = UI.static(horzImageGroup, "Horizontal Orientation");
									var horzImg = UI.image(horzImageGroup, resourcePath + "/Images/horizontal_orientation.jpg");
							var btnGroup = UI.group(h);
								var thanks = UI.button(btnGroup,"Thanks",function()
								{
									h.close();
								});
						h.show();
						oriVert.value = true;
					}

				if(config.orientation && (config.orientation === "" || config.orientation === "vertical"))
				{
					oriVert.value = true;
				}
				else
				{
					oriHorz.value = true;
				}

		//group for selection of sizing structure
		var selectSizeStructureGroup = w.add("panel",undefined,"Select the appropriate sizing format.");
			selectSizeStructureGroup.orientation = "column";
			// var sssgTxt = selectSizeStructureGroup.add("statictext", undefined, "Select the appropriate sizing format.");

			var selectSizeStructureRadioGroup = UI.group(selectSizeStructureGroup);
				selectSizeStructureRadioGroup.orientation = "row";
				var sizeStructureRadioButtons = makeAssets(selectSizeStructureRadioGroup, sizingStructures,"radiobutton",function()
				{
					if(this.text === "Varying Inseams")
					{
						varyingInseamSizing = true;
						waistSizeGroup.input.enabled = true;
					}
					else
					{
						varyingInseamSizing = false;
						waistSizeGroup.input.enabled = false;
					}
				});
				sizeStructureRadioButtons[0].value = true;


		//get the rotation information if applicable
		//some garments need some pieces rotated during the add artwork script
		//to ensure proper pattern fills and fabric stretch direction etc.
		//user will input the angle of rotation and the names of the pieces that need
		//to be rotated. 
		
		var rotationGroup = w.add("panel",undefined,"If any pieces need to be rotated, input them here.");
			var rotTxt = UI.static(rotationGroup,"Enter the rotation angle. Positive numbers are counterclockwise.");
			var rg = UI.group(rotationGroup);
				rg.orientation = "row";
				var rotGroup = UI.group(rg);
					rotGroup.orientation = "column";
					var rot1 = rotationGroup.rot1 = UI.edit(rotGroup,"Rotation in degrees");
					var rot2 = rotationGroup.rot2 = UI.edit(rotGroup,"Rotation in degrees");
				
				var pieceGroup = UI.group(rg);
					pieceGroup.orientation = "column";
					var piece1 = rotationGroup.piece1 = UI.edit(pieceGroup,"eg. Front, Back, Left Sleeve, Right Sleeve",50);
					var piece2 = rotationGroup.piece2 = UI.edit(pieceGroup,"eg. Front, Back, Left Sleeve, Right Sleeve",50);

		var pieceNameGroup = createInputPanel(w,"pieces","piece names");
		var sizeGroup = createInputPanel(w,"sizes","sizes");
		var waistSizeGroup = createInputPanel(w,"waist","waist sizes");
		var artLocGroup = createInputPanel(w,"artLayers","art layers");




		//set the waist size input to disabled until
		//the user selects variable inseam 
		waistSizeGroup.input.enabled = false;
		

		//group for buttons
		var btnGroup = w.add("group");
			var cancel = btnGroup.add("button", undefined, "Cancel");
				cancel.onClick = function()
				{
					dialogSuccess = false;
					w.close();
				}
				
			var submit = btnGroup.add("button", undefined, "Submit");
				submit.onClick = function()
				{
					if(validate(gcInput.text,pieceNameGroup.input.text,sizeGroup.input.text,waistSizeGroup.input.text,artLocGroup.input.text,rotationGroup))
					{
						dialogSuccess = true;
						w.close();
					}
					else{};
				}
	w.show();

	return dialogSuccess;
}
/* beautify ignore:end */
