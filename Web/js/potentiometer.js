var knobValue = 0;
var knobTimer;

$(document).ready(function () {

    $(".knob").knob({
        "displayPrevious":true,
        "value": 0,
        change: function change(value) {
            if (value <= knobValue + 5) { //Avoid hard jumps
                //console.log(value);
                clearTimeout(knobTimer);
                knobTimer = setTimeout(function () {
                    setParameter("fslipspnt", value);
                }, 80);
                knobValue = value;
            } else {
                console.log("!" + value + ">" + knobValue);
                $(".knob").val(knobValue).trigger('change');
            }
        }
    });
    
    $(".knob").val(0).trigger('change');
});