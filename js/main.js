function SliderOptions(container, color, min, max, step, radius) {
    this.container = container;
    this.color = color;
    this.min = min;
    this.max = max;
    this.step = step;
    this.radius = radius;
}


function colorToPicker(angle, color, circleToColor) {

    if (angle >= -90 && angle <= 90) {
        circleToColor.style.background = "linear-gradient(" + (angle + 180) + "deg, transparent 50%, #ccc 50%), linear-gradient(90deg, #ccc 50%, transparent 50%) " + color;
    } else {
        circleToColor.style.background = "linear-gradient(" + (angle) + "deg, transparent 50%, " + color + " 50%), linear-gradient(90deg, #ccc 50%, transparent 50%)" + color;
    }
}

function drawLines(picker, options) {

    var numberOfSteps = (options.max - options.min) / options.step;

    var oneStepAngle = 360 / numberOfSteps;

    for (var i = 0; i < numberOfSteps; i++) {

        picker.insertAdjacentHTML('afterend', '<div class="line" style=" transform: rotate(' + i * oneStepAngle + 'deg);width:'+options.radius+'px;"></div>');

    }

}


function CircularSlider(options){


	var container = document.getElementById(options.container);

	//if first slider
	if(container.firstChild){
		
		var counter = 1;

		//creating elements
		circle = document.createElement('div');
		circleIn = document.createElement('div');
		picker = document.createElement('div');
		pickerCircle = document.createElement('div'); 
		//value = document.createElement('div'); 

		//setting ids
		circle.setAttribute("id", "circle" + counter);
		circleIn.setAttribute("id", "circle-in" + counter);
		picker.setAttribute("id", "picker" + counter);
		pickerCircle.setAttribute("id", "pic-circle" + counter);
		//value.setAttribute("id", "value" + counter);

		//inserting elements
		container.appendChild(circle);
		circle.appendChild(circleIn);
		circle.appendChild(picker);
		picker.appendChild(pickerCircle);


		circle.style.width = 2 * options.radius + "px";
		circle.style.height = 2 * options.radius + "px";

		circleIn.style.width = (2 * options.radius - 30) + "px";
		circleIn.style.height = (2 * options.radius - 30) + "px";

	}

	var rect = circle.getBoundingClientRect(),
	resultValue = document.getElementById('value'),
    currentPositionPicker = 0,
    range = options.max - options.min,
    singleStep = range / options.step,

    //getting the center of a container rectangle
    center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    },

    //using the right transform
    transform = (function() {
        var prefs = ['t', 'WebkitT', 'MozT', 'msT', 'OT'],
            style = document.documentElement.style,
            p
        for (var i = 0, len = prefs.length; i < len; i++) {
            if ((p = prefs[i] + 'ransform') in style) return p
        }

        alert('your browser doesnt support css transforms!')
    })(),


     //function returns an angle from the center
    rotate = function(x, y) {
        //get the actual distances from the center
        var deltaX = x - center.x,
            deltaY = y - center.y,
        
        angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

        return angle;
    },


    // DRAGSTART
    //triggers a mousemove listener
    //waits for mouseup event
    mousedown = function(event) {
        event.preventDefault()
        document.body.style.cursor = 'pointer'


        mousemove(event)
        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
    },

    // DRAG
    //setting the location of a picker depending on angle
    mousemove = function(event) {

        currentAngle = rotate(event.pageX, event.pageY);

        if (currentAngle < -90) {
            selectedValue = Math.round((range * (currentAngle + 450) / 360) / options.step) * options.step;
            roundedAngle = ((selectedValue / range) * 360) - 90;

        } else {
            selectedValue = Math.round((range * (currentAngle + 90) / 360) / options.step) * options.step;

            roundedAngle = ((selectedValue / range) * 360) - 90;
        }


        picker.style[transform] = 'rotate(' + roundedAngle + 'deg)';


        colorToPicker(roundedAngle, options.color, circle);


        resultValue.innerHTML = selectedValue;

        //picker.style[transform] = 'rotate(' + currentAngle + 'deg)';

    },

    // DRAGEND
    //removing event listeners
    mouseup = function() {
        document.body.style.cursor = null;
        document.removeEventListener('mouseup', mouseup)
        document.removeEventListener('mousemove', mousemove)
    }

    drawLines(picker, options);

	//set inital color
	colorToPicker(currentPositionPicker, options.color, circle);


	// DRAG START
	//on page load we listen to mousedown on pi
	pickerCircle.addEventListener('mousedown', mousedown)

	// ENABLE STARTING THE DRAG IN THE BLACK CIRCLE
	circle.addEventListener('mousedown', function(event) {
	    if (event.target == this) mousedown(event)

	})
}







    





