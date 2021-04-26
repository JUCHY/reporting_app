//googlecharts
define(function(require){


    function drawChart(callback){

        // Set a callback to run when the Google Visualization API is loaded.
        google.charts.setOnLoadCallback(callback);

    }


    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawLineChart(id,columnlength=1,vtitle,money=false,data, data_length) {
        var options={
            'hAxis': {
              'title': data[0][0],
            },
            'vAxis': {
              'title': vtitle ? vtitle : data[0][1],
            },
            'width' : '100%',
            'height' : 400,
          }
        console.log(data);
        var datatable = new google.visualization.arrayToDataTable(data,false);
        function draw(){
            if(data_length<1){
                $('#'+id).empty()
                return;
            }
            const moneyformat = {
                  'prefix': '$',
                  'negativeColor': 'red',
                  'negativeParens': false,
            }
            if(money){
                const formatter = new google.visualization.NumberFormat(moneyformat)
                for(let i=0; i<columnlength;i++){
                    formatter.format(datatable,i+1)
                }

            }

            // Set chart options

            
            // Instantiate and draw our chart, passing in some options.
            console.log(google)
            console.log(id)
            const graph = document.getElementById(id)
            graph.style.display = 'block';
            console.log(graph)
            var chart = new google.visualization.LineChart(document.getElementById(id));
            console.log(datatable)
            console.log(chart)
            chart.draw(datatable, options);
        }

        draw();

    }


    function drawBarChart(id,title,vAxis,hAxis,data, data_length) {
        var options={
            'title':title,
            'chartArea' : { 'width' : '50%'},
            'hAxis': {
              'title': hAxis,
              'minValue' : 0,
            },
            'vAxis': {
              'title': vAxis,
            },
            'width' : '100%',
            'height' : 600,
          }

        var datatable = new google.visualization.arrayToDataTable(data,false);
        function draw(){

                if(data_length<1){
                    $('#'+id).empty()
                    return;
                }

            // Set chart options

            
            // Instantiate and draw our chart, passing in some options.
            console.log(google)
            console.log(id)
            const graph = document.getElementById(id)
            graph.style.display = 'block';
            console.log(graph)
            var chart = new google.visualization.BarChart(document.getElementById(id));
            console.log(datatable)
            console.log(chart)
            chart.draw(datatable, options);
        }

        draw();

    }


    function drawPieChart(id,title,data, data_length) {
        var options={
            'title':title,
            'width' : '100%',
            'height' : 600,
          }

        var datatable = new google.visualization.arrayToDataTable(data,false);
        function draw(){

                if(data_length<1){
                    $('#'+id).empty()
                    return;
                }

            // Set chart options

            
            // Instantiate and draw our chart, passing in some options.
            console.log(google)
            console.log(id)
            const graph = document.getElementById(id)
            graph.style.display = 'block';
            console.log(graph)
            var chart = new google.visualization.PieChart(document.getElementById(id));
            console.log(datatable)
            console.log(chart)
            chart.draw(datatable, options);
        }

        draw();

    }


    return { drawChart, drawLineChart, drawPieChart, drawBarChart }
})

