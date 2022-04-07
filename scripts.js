var states = ["Alaska", "Alabama", "Arkansas", "Arizona", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Iowa", "Idaho", "Illinois", "Indiana", "Kansas", "Kentucky", "Louisiana", "Massachusetts", "Maryland", "Maine", "Michigan", "Minnesota", "Missouri", "Mississippi", "Montana", "North Carolina", "North Dakota", "Nebraska", "New Hampshire", "New Jersey", "New Mexico", "Nevada", "New York", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Virginia", "Vermont", "Washington", "Wisconsin", "West Virginia", "Wyoming"];
var st = [ "AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"];
var done = [];
var randState = 0;
var gameStarted = false;
var clicked = true;
var currentFill;
var percentage = 100;
var numClicks = 0;
var numCorrect = 0;

function stopClock()
{
	clearInterval(timer);
	document.getElementById("click").innerHTML = "Finished!";
	document.getElementById("timer").style.fill = '#229954';
	var f = document.getElementById('timer');
	setInterval(function()
	{
      f.style.visibility = (f.style.visibility == 'hidden' ? '' : 'hidden');
  	}, 400);
  	document.getElementById("perc").style.fill = '#229954';
	var g = document.getElementById("perc");
	setInterval(function()
	{
      g.style.visibility = (g.style.visibility == 'hidden' ? '' : 'hidden');
  	}, 400);
}

function complete()
{
	stopClock();

}

function pollChoice()
{
	if (clicked == true)
	{
		gameStarted = true;
		randState = Math.floor(Math.random()*states.length);
		document.getElementById("click").innerHTML = "Click on " + states[randState] + "!";
		clicked = false;
	}
	else
	{
		setTimeout(pollChoice, 10);
	}
}

function game()
{
	document.getElementById("startbut").style.display = "none";
	document.getElementById("resetbut").style.display = "inline";
	document.getElementById("timer").innerHTML = "0m:0s";
	start = new Date().getTime();
	timer = setInterval(function()
		{
			var now = new Date().getTime();
			var distance;
			var mins;
			var secs;
			distance = now - start;
			mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			secs = Math.floor((distance % (1000 * 60)) / 1000);

			document.getElementById("timer").innerHTML = mins + "m:" + secs + "s";
		}, 1000);
	for (i = 0; i < states.length; i++)
	{
		pollChoice();
	}
}

function choice(pick)
{
	if (gameStarted == true)
	{
		numClicks++;
		if (st[randState] == pick)
		{
			numCorrect++;
			document.getElementById(pick).style.fill = '#229954';
			clicked = true;
			states.splice(randState,1);
			st.splice(randState,1);
			if (states.length == 0)
			{
				complete();
			}
		}
		else
		{
			currentFill = document.getElementById(pick).style.fill;
			document.getElementById(pick).style.fill="#E74C3C";
			setTimeout(() => { document.getElementById(pick).style.fill=currentFill; }, 200);
		}
		percentage = (numCorrect / numClicks) * 100;
		percentage = percentage.toFixed(2);
		document.getElementById("perc").innerHTML = percentage + "% Accuracy";
	}
}
