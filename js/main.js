function SliderOptions(container, color, min, max, step, radius) {
    this.container = container;
    this.color = color;
    this.min = min;
    this.max = max;
    this.step = step;
    this.radius = radius;
}


function CircularSlider(options) {



    clicked = false;

    //get a container to work with
    var container = document.getElementById(options.container),
        counter;



    var i = 1;
    while (true) {
        var element = document.getElementById('circle' + i);
        if (typeof(element) == 'undefined' || element == null) {
            counter = i;
            break;
        }
        i++;
    }






    //create elements needed
    circle = document.createElement('div');
    circleIn = document.createElement('div');
    picker = document.createElement('div');
    pickerCircle = document.createElement('div');


    //adding ids
    circle.setAttribute("id", "circle" + counter);
    circleIn.setAttribute("id", "circle-in" + counter);
    picker.setAttribute("id", "picker" + counter);
    picker.setAttribute("min", options.min);
    picker.setAttribute("max", options.max);
    picker.setAttribute("step", options.step);
    picker.setAttribute("color", options.color);


    pickerCircle.setAttribute("id", "pic-circle" + counter);


    container.appendChild(circle);
    circle.appendChild(circleIn);
    circle.appendChild(picker);
    picker.appendChild(pickerCircle);

    //styling the elements
    circle.style.width = 2 * options.radius + "px";
    circle.style.height = 2 * options.radius + "px";
    circleIn.style.width = (2 * options.radius - 30) + "px";
    circleIn.style.height = (2 * options.radius - 30) + "px";
    picker.style.width = (options.radius + 9) + "px";

    circle.style.zIndex = counter;

    //drawing lines on the circle
    var numberOfSteps = (options.max - options.min) / options.step;
    var oneStepAngle = 360 / numberOfSteps;
    for (var i = 0; i < numberOfSteps; i++) {
        picker.insertAdjacentHTML('afterend', '<div class="line" style=" transform: rotate(' + ((i * oneStepAngle) - 90) + 'deg);width:' + options.radius + 'px;"></div>');
    }


    var rect = circle.getBoundingClientRect();
    center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    }


    //current position of a slider
    currentPositionPicker = -90;


    //using the right transform
    transform = (function() {
        var prefs = ['t', 'WebkitT', 'MozT', 'msT', 'OT'],
            style = document.documentElement.style,
            p
        for (var i = 0, len = prefs.length; i < len; i++) {
            if ((p = prefs[i] + 'ransform') in style) return p
        }

        alert('your browser doesnt support css transforms!')
    })();



    //function returns an angle from the coordinates of a mouse and center of the container
    getAngle = function(x, y) {
        //get the actual distances from the center
        var deltaX = x - this.center.x,
            deltaY = y - this.center.y,

            angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

        return angle;
    };


    //function returns current angle rounded on closest step value
    getRoundedAngle = function(currentAngle, min, max, step) {

        var range = max - min,
            singleStep = range / step;

        //currentAngle = getAngle(event.pageX, event.pageY);

        if (currentAngle < -90) {
            selectedValue = Math.round((range * (currentAngle + 450) / 360) / step) * step;
            roundedAngle = ((selectedValue / range) * 360) - 90;

        } else {
            selectedValue = Math.round((range * (currentAngle + 90) / 360) / step) * step;

            roundedAngle = ((selectedValue / range) * 360) - 90;
        }

        return roundedAngle;
    };


    //var angle = this.getAngle(this.center.x, this.center.y);
    colorToPicker = function(angle, parent, color) {

        if (angle >= -90 && angle <= 90) {
            parent.style.background = "linear-gradient(" + (angle + 180) + "deg, transparent 50%, #ccc 50%), linear-gradient(90deg, #ccc 50%, transparent 50%) " + color;
        } else {
            parent.style.background = "linear-gradient(" + (angle) + "deg, transparent 50%, " + color + " 50%), linear-gradient(90deg, #ccc 50%, transparent 50%)" + color;
        }
    };



    mouseMove = function(){
   			//get the selected picker to rotate
            var pickerRotate = document.getElementById(currentPicker).parentNode;

            //get data of active slider
            step = pickerRotate.getAttribute("step");
            min = pickerRotate.getAttribute("min");
            max = pickerRotate.getAttribute("max");
            color = pickerRotate.getAttribute("color");


            roundedAngle = getRoundedAngle( getAngle(event.pageX, event.pageY), min, max, step);


            pickerRotate.style[transform] = 'rotate(' + roundedAngle + 'deg)';

            colorToPicker(roundedAngle, pickerRotate.parentNode, color);
    }

    //initialize starting color of the circuar slider
    colorToPicker(currentPositionPicker, circle, options.color);

    //rotating to zero/top
    picker.style[transform] = 'rotate(-90deg)';


    pickerCircle.addEventListener("mousedown", function(event) {
        event.preventDefault();

        clicked = true;
        currentPicker = this.id;

    });

    document.addEventListener("mousemove", function(event) {

        event.preventDefault();

        if (clicked) {
        	document.body.style.cursor = "pointer";
        	mouseMove();
        } else {
            document.body.style.cursor = null;
        }

    });

    document.addEventListener("mouseup", function(event) {
        event.preventDefault();

        clicked = false;

        localStorage.setItem(currentPicker, roundedAngle);

    });




    /*

            // DRAGSTART
            //triggers a mousemove listener
            //waits for mouseup event
            mousedown = function(event) {
                event.preventDefault()
                document.body.style.cursor = 'pointer'

                mousemove(event)
                document.addEventListener('mousemove', mousemove)
                document.addEventListener('touchmove', mousemove)
                document.addEventListener('mouseup', mouseup)
                document.addEventListener('touchcancel', mouseup)
            },

            // DRAG
            //setting the location of a picker depending on angle
            mousemove = function(event) {


                var roundedAngle = rounded(options);


                picker.style[transform] = 'rotate(' + roundedAngle + 'deg)';


                colorToPicker(roundedAngle, options.color, circle);


                resultValue.innerHTML = selectedValue;


            },

            // DRAGEND
            //removing event listeners
            mouseup = function() {
                document.body.style.cursor = null;
                document.removeEventListener('mouseup', mouseup)
                document.removeEventListener('touchcancel', mouseup)
                document.removeEventListener('mousemove', mousemove)
                document.removeEventListener('touchmove', mousemove)
            }


        //set inital color
        colorToPicker(currentPositionPicker, options.color, circle);


        // DRAG START
        //on page load we listen to mousedown on pi
        pickerCircle.addEventListener('mousedown', mousedown)
        pickerCircle.addEventListener('touchstart', mousedown)

        // ENABLE STARTING THE DRAG IN THE BLACK CIRCLE
        circle.addEventListener('mousedown', function(event) {
            if (event.target == this) mousedown(event)
        })

        circle.addEventListener('touchstart', function(event) {
            if (event.target == this) mousedown(event)
        });*/


}


var firstOptions = new SliderOptions("container", "lightgreen", 0, 1000, 20, 150);
var secondOptions = new SliderOptions("container", "brown", 0, 1000, 20, 120);
var thirdOptions = new SliderOptions("container", "yellow", 0, 1000, 30, 90);
var fourthOptions = new SliderOptions("container", "green", 0, 1000, 40, 60);
var fifthOptions = new SliderOptions("container", "blue", 0, 1000, 50, 30);

var oneSlider = CircularSlider(firstOptions);
var secondSlider = CircularSlider(secondOptions);
var tretjiSlider = CircularSlider(thirdOptions);
var fourthSlider = CircularSlider(fourthOptions);
var fifthSlider = CircularSlider(fifthOptions);
