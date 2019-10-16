function help()
{
	var valid = true;
	//Production Utilities
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Batch_Framework.jsxbin\"");
	
	if(!valid)
	{
		return;
	}

	var title = "Converted Template Builder Help:"
	var msg = "Step 1:\n\n";
	msg += "**Build your blank mockup and save it to your computer as an .ait. You will repeatedly come back to this file, so make sure you have this saved ";
	msg += "before you continue. You will make more work for yourself if you do steps 3,4,5 on your only copy of the blank mockup.\n";
	msg += "_NOTE_ Make sure you have renamed the main garment layer to include the garment code (i.e. FD-161_0000). The 5_Build_Template.jsx script uses the layer name ";
	msg += "to determine which data to use when building the template.\n\n";

	msg += "Step 2:\n\n";
	msg += "**Run the 1_Configure.jsx script and fill out the fields in the prompt. Enter the garment code and select the orientation of the CAD.\n";
	// msg += "**The orientation refers to the relative placement between two sizes. For example, if size \"M\" is above size \"L\" the orientation is \"Vertical\".\n";
	// msg += "For Example: If size \"M\" is to the left of size \"L\" then the orientation is \"Horizontal\".\n";
	msg += "**Input the appropriate sizing, piece names, and artwork locations. You can type these directly into the input boxes or utilize the \"Show Lists\" dialog.\n";
	msg += "Piece names should be input in order as they appear on the CAD, ";
	msg += "from left to right, and if two pieces share the same left edge coordinate, order them from top to bottom. ";
	msg += "If you're still unsure, click the \"Piece Name Help\" button below.\n\n";

	msg += "Step 3:\n\n";
	msg += "**Open a copy of your blank mockup.ait file and paste the artwork from the CAD onto the \"To Be Placed\" layer.\n";
	msg += "**Run the 2_Initial_Rename.jsx script. This script will rename the pieces and place them on the prepress layer inside their respective size layers.\n\n";

	msg += "Step 4: \n\n";
	msg += "**Place the artwork to the left side of the artboard (the way things look after the Add_Artwork.jsx script).\n";
	msg += "**Run the 3_Log_Add_Art_Placement_Data.jsx script.\n";
	msg += "This tells the Add_Artwork.jsx script where to place the garment pieces after the artwork is added.\n\n"
	
	msg += "Step 5:\n\n";
	msg += "**Align the pieces to one another (take care to line up the sew lines, don't just do a simple alignment by center or top).\n";
	msg += "**Move the pieces to the location in which you want them to live on the mockup.\n";
	msg += "**Run the 4_Log_Template_Placement_Data.jsx script.\n";
	msg += "This tells the 5_Build_Template.jsx script where to place the garment pieces when building a new template.\n\n";
	
	msg += "Step 6:\n\n";
	msg += "**Close the file that you have been configuring. The data has been logged, and we need to start with a fresh copy of your blank mockup template.\n\n"

	msg += "Step 7: \n\n";
	msg += "**Open your blank mockup template.\n";
	msg += "**Open the CAD for the garment/style number that you're converting.\n";
	msg += "**Copy the artwork and paste it onto the \"To Be Placed\" layer of the blank mockup template.\n";
	msg += "**Run the 5_Build_Template.jsx script and enter the 4 digit style number in the dialog.\n";
	msg += "**Double check for accuracy. Then save the file and move on to the next style number.\n\n";

	msg += "**IMPORTANT NOTE**\n\n";
	msg += "You are responsible for making sure that everything looks correct when the script is finished. If you see anything odd, please let William know. ";
	msg += "This script is just a tool, it is not a replacement for your eyes and analytical skills.";



	var w = new Window("dialog",title);
		var topTxt = UI.static(w,title);
		var txt = w.add("statictext", undefined, msg, {"multiline":true})
		txt.minimumSize.width = 650;
		txt.maximumSize.height = 875;

		var btnGroup = UI.group(w);
			var pnhBtn = UI.button(btnGroup,"Piece Name Help",function()
			{
				var pnh = new Window("dialog","Piece Name Help");
					var pnhMsg1 = "In the below example, the pieces are numbered in the correct order.\n";
					var pnhMsg2 = "When two or more pieces are left aligned (in other words, you cannot sort them from left to right,\n";
					var pnhMsg3 = "because neither is farther to the left), then list them top to bottom.";
					var msg = UI.static(pnh,pnhMsg1);
					var msg2 = UI.static(pnh,pnhMsg2);
					var msg3 = UI.static(pnh,pnhMsg3);
					var imgFile = File(resourcePath + "/Images/piece_name_help.jpg");
					var img = UI.image(pnh,imgFile);
					var ok = UI.button(pnh,"Ok",function()
					{
						pnh.close();
					})
				pnh.show();
			});
			var close = UI.button(btnGroup,"Thanks, Bro.",function()
			{
				w.close();
			})
	w.show();


	
}
help();

