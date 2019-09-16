function help()
{
	var title = "Converted Template Builder Help:"
	var msg = "Step 1:\n\n";
	msg += "Run the Configure.jsx script and fill out the fields in the prompt. Enter the garment code and select the orientation of the CAD. ";
	msg += "\nThe orientation refers to the relative placement between two sizes. For example, if size \"M\" is above size \"L\" the orientation is \"Vertical\".";
	msg += "If size \"M\" is to the left of size \"L\" then the orientation is \"Horizontal\".\n";
	msg += "Check a box for each size in which this garment is available, then check a box for each possible artwork location. If you have questions ";
	msg += "please ask William. If the garment could have art in a location that does not have an associated checkbox, type the name(s) into the input box, ";
	msg += "separated by commas.\n\n";

	msg += "Step 2:\n\n";
	msg += "Run the Initial_Rename.jsx script. This script will rename the pieces and place them on the prepress layer insie their respective size layers. ";
	msg += "\nAt this point, you should align the pieces to one another (take care to line up the sew lines, don't just do a simple alignment by center or top). "
	msg += "\nNow you should move the pieces so the sew line of the mockup size sits on the edge of the mockup piece.\n\n";

	msg += "Step 3: \n\n";
	msg += "Run the Log_Placement_Data.jsx script. This will generate the data structure for the coordinates for each piece and save it to the configuration file.\n\n";

	msg += "Step 4: \n\n";
	msg += "Now you're ready to create your templates. At this point all you should need to do is open the mockup, open the CAD, copy the CAD artwork ";
	msg += "to the \"To Be Placed\" layer in the mockup file.\n";
	msg += "When the artwork has been pasted, run 4_Build_Template.jsx and enter the 4 digit style number in the dialog.\n\n";

	msg += "**IMPORTANT NOTE**\n\n";
	msg += "You are responsible for making sure that everything looks correct when the script is finished. If you see anything odd, please let William know. ";
	msg += "This script is just a tool, it is not a replacement for your eyes and analytical skills.";



	var w = new Window("dialog","Template Converter Help");
		// w.minimumSize.width = 700;
		// w.maximumSize.height = 700;
		var topTxt = w.add("statictext", undefined, title);
		var txt = w.add("statictext", undefined, msg, {"multiline":true})
		txt.minimumSize.width = 650;
		txt.maximumSize.height = 550;

		var close = w.add("button", undefined, "Thanks Bro.");
			close.onClick = function()
			{
				w.close();
			}
	w.show();
}
help();

