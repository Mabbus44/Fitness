var daysPerPage = 50;
var currentDate = new Date();
var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var weightData = [];
var workoutData = [];
var goalsData = [];
var startDate;
var startYear;
var startMonth;
var selectedDate = new Date();
selectedDate.setDate(selectedDate.getDate()-14);
var selectedYear = selectedDate.getYear()+1900;
var selectedMonth = selectedDate.getMonth();
selectedDate = new Date(selectedYear, selectedMonth, 1);

var weightGraphConfig = {
    title: {
        text: 'Weight'   
    },
    xAxis: {
        type: "datetime",
        labels: {
            formatter: function() {
                return Highcharts.dateFormat('%Y-%m-%d', this.value);
            }
        }
    },
    yAxis: {
        title: {
            text: 'Kg'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
    tooltip: {
        valueSuffix: 'Kg'
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
    },
    series: [{
        name: 'Weight'
    }]
}

var workoutGraphConfig = {
    chart: {
        type: 'heatmap',
        plotBorderWidth: 1,
    },
    title: {
        text: 'Workouts'
    },
    yAxis: {
        visible: false,
        max: 1,
    },
    xAxis: {
        min: 0,
        max: daysPerPage-1,
        categories: null,
        plotLines: [{
            value: 5.5,
            width: 5,
            color: '#FF0000',
            zIndex: 10
        }],
    },
    tooltip: {
        formatter: function() {
            var tooltip = "";
            if(this.point.value.activity !== undefined){
                tooltip = tooltip + "Workout<br>" + this.point.value.activity + "<br>" + this.point.value.value + " min";
            }
            if(this.point.value.workoutPerformed !== undefined){
                tooltip += "Goal<br>Work out: ";
                if(this.point.value.workoutPerformed)
                    tooltip += "Achieved";
                if(!this.point.value.workoutPerformed)
                    tooltip += "Not achieved";
            }
            if(this.point.value.timeLeft !== undefined){
                if(this.point.value.timeLeft === 0)
                    tooltip = tooltip + "<br>Workout time: Achieved";
                else
                    tooltip = tooltip + "<br>Workout time: " + this.point.value.timeLeft + " min left";
            }
            return tooltip;
        }
    },
    legend: {
        enabled: false
    },
    series: [{
        name: 'Workouts and goals',
        borderWidth: 1,
        dataLabels: {
            enabled: true,
            color: '#000000',
            formatter () {
                var retStr = "";
                if(this.point.value.activity !== undefined)
                    retStr = retStr + this.point.value.value;
                if(this.point.value.workoutPerformed !== undefined){
                    if(this.point.value.workoutPerformed)
                        retStr = retStr + "\u2611";
                    else
                        retStr = retStr + "\u2610";
                }
                if(this.point.value.timeLeft !== undefined)
                    retStr = retStr + "<br>" + this.point.value.timeLeft;
                return retStr;
            }
        }
    }]
}

function compareName(obj){
    return obj.name === this.valueOf();
}

function getElementsBetween(arr, firstElement, lastElement){
    //Only works for sorted arrays
    var firstSlice=0;
    var lastSlice=0;
    for(var i=0; i<arr.length; i++){
        if(arr[i][0]<firstElement)
            firstSlice++;
        if(arr[i][0]<lastElement)
            lastSlice++;
        else
            break;
    }
    if(firstSlice === arr.length || lastSlice === 0)
        return [];
    var newArr = structuredClone(arr.slice(firstSlice, lastSlice));
    for(var i=0; i<newArr.length; i++)
        newArr[i][0] -= firstElement;
    return newArr;
}

function buildEmptyGoalsData(days){
    var goalsData = [];
    var nextWorkoutA = 0;
    var nextWorkoutB = 2;
    var nextTime = 7;
    for(var dayId=0; dayId<days; dayId++){
        var goal = {};
        if(nextWorkoutA===0){
            nextWorkoutA += 5;
            goal.workoutPerformed = false;
        }
        if(nextWorkoutB===0){
            nextWorkoutB += 5;
            goal.workoutPerformed = false;
        }
        if(nextTime===0){
            nextTime += 10;
            goal.timeLeft = 40*4;
        }
        if(goal.workoutPerformed !== undefined)
            goalsData.push([dayId,0,goal]);
        nextWorkoutA--;
        nextWorkoutB--;
        nextTime--;
    }
    return goalsData;
}

function buildDates(startYear, startMonth){
    var dates = [];
    var date = new Date(startYear, startMonth, 1);
    for(var dayId=0; dayId<daysPerPage; dayId++){
        if(dayId>0)
            date.setDate(date.getDate()+1);
        var year = (date.getFullYear()).toString();
        var month = monthNames[date.getMonth()];
        var day = ("0" + date.getDate()).slice(-2);
        var yearObj = dates.find(compareName, year);
        if(yearObj === undefined){
            yearObj = {name: year, categories:[]};
            dates.push(yearObj);
        }
        var monthObj = yearObj.categories.find(compareName, month);
        if(monthObj === undefined){
            monthObj = {name: month, categories:[]};
            yearObj.categories.push(monthObj);
        }
        if(!(monthObj.categories.includes(day))){
            monthObj.categories.push(day);
        }
    }   
    return dates;
}

function formatData(obj, textstatus){
    var rawData = JSON.parse(obj);
    if(rawData.length > 0){
        var splitDate = (rawData[0].timestamp).split("-");
        startDate = new Date(splitDate[0], splitDate[1]-1, 1);
    }
    else
        startDate = new Date();
    startYear = startDate.getYear()+1900;
    startMonth = startDate.getMonth();
    weightData = [];
    workoutData = [];
    goalsData = buildEmptyGoalsData(Math.round((currentDate.getTime() - startDate.getTime())/(1000 * 3600 * 24))+14);

    for(var i=0; i<rawData.length; i++){
		var splitDate = (rawData[i].timestamp).split("-");
        var workoutDate = new Date(splitDate[0], splitDate[1]-1, splitDate[2]);
        var day = Math.round((workoutDate.getTime() - startDate.getTime())/(1000 * 3600 * 24));
        if(rawData[i].activity === "weight"){
    		weightData.push([Date.UTC(splitDate[0], splitDate[1]-1, splitDate[2]), rawData[i].value/10]);
        }else{
            workoutData.push([day,1,{activity: rawData[i].activity, value: rawData[i].value}]);
        }
    }
    workoutData.sort(function (a, b) {return a[0] - b[0];});
    goalsData.sort(function (a, b) {return a[0] - b[0];});

    var workoutIndex=0;
    var goalsIndex=0;
    var nextTimeGoal=0;
    while(workoutIndex<workoutData.length){
        var done = false;
        while(!done && goalsIndex<goalsData.length && goalsData[goalsIndex][0]<=workoutData[workoutIndex][0]+2){
            if(!(goalsData[goalsIndex][2].workoutPerformed) && goalsData[goalsIndex][0]>=workoutData[workoutIndex][0]-2){
                done=true;
                goalsData[goalsIndex][2].workoutPerformed = true;
                var nextTimeGoal=goalsIndex;
                while(nextTimeGoal < goalsData.length && goalsData[nextTimeGoal][2].timeLeft === undefined)
                    nextTimeGoal++;
                if(nextTimeGoal < goalsData.length)
                    goalsData[nextTimeGoal][2].timeLeft -= workoutData[workoutIndex][2].value;
            }
            goalsIndex++;
        }
        workoutIndex++;
    }

    drawGraphs();
}

function drawGraphs(){
    var todayId = Math.round((currentDate.getTime() - selectedDate.getTime())/(1000 * 3600 * 24));
    workoutGraphConfig.xAxis.plotLines[0].value = todayId-0.5;

    weightGraphConfig.series[0].data = weightData;
    weightGraphConfig.xAxis.min = Date.UTC(selectedYear, selectedMonth, 1);
    var lastDay = new Date(selectedYear, selectedMonth, 1);
    lastDay.setDate(lastDay.getDate()+daysPerPage);
    weightGraphConfig.xAxis.max = Date.UTC(lastDay.getYear()+1900, lastDay.getMonth(), lastDay.getDate());

    var dates = buildDates(selectedYear, selectedMonth);
    var startIndex = Math.round((selectedDate.getTime() - startDate.getTime())/(1000 * 3600 * 24));
    var endIndex = startIndex + daysPerPage;
    workoutGraphConfig.xAxis.categories = dates;
    workoutGraphConfig.series[0].data = getElementsBetween(workoutData, startIndex, endIndex).concat(getElementsBetween(goalsData, startIndex, endIndex));

    Highcharts.chart('weightGraph', weightGraphConfig);
    Highcharts.chart('workoutGraph', workoutGraphConfig);
}

function getData(){
    try {
    	$.ajax({
    		type: "POST",
    		url: "./Fitness/getFitness.php",
    		data: {},
    		success: formatData
    	});
    }
    catch(err) {
    	window.alert(err.message);
    }
}

function prevMonth(){
    selectedMonth -= 1;
    if(selectedMonth<0){
        selectedMonth = 11;
        selectedYear-=1;
    }
    selectedDate = new Date(selectedYear, selectedMonth, 1);
    drawGraphs();
}

function nextMonth(){
    selectedMonth += 1;
    if(selectedMonth>11){
        selectedMonth = 0;
        selectedYear+=1;
    }
    selectedDate = new Date(selectedYear, selectedMonth, 1);
    drawGraphs();
}