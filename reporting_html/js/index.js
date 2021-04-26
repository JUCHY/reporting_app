
define(function(require){

  const api = require('./fetchapi');
  const table = require('./createtable');
  const chart = require('./googlecharts');



  const currDate = new Date()
  const yeardate = currDate.getFullYear()
  const monthdate = table.getMonth(currDate.getMonth()+1)
  const weekdate = api.getWeekNum(currDate)

  var state = {
      'TransactionData' : [],
      'year' : [],
      'month' : [],
      'week' : [],
      'prevyear' : [],
      'prevmonth' : [],
      'prevweek' : [],
      'filter' : [],
      'showFilter' : false,
      'curr' : "week",
      'yeardate' : yeardate,
      'monthdate' : monthdate,
      'weekdate' : weekdate,
      'currYear' : yeardate
    }
  //populate data
  async function getData(){
    const transactions = await api.TransactionData();
    state['TransactionData'] = transactions,
    state['year'] = api.filterDataYear(transactions),
    state['month'] = api.filterDataMonth(transactions),
    state['week'] = api.filterDataWeek(transactions),
    state['prevyear'] = api.filterPrevYear(transactions),
    state['prevmonth'] = api.filterPrevMonth(transactions),
    state['prevweek'] = api.filterPrevWeek(transactions)
    return;
  }

  function renderInfoCard(){

  }


  function getTotalData(data){
      //revenue
      let totalrevenue = getTotalRevenue(data);
      //profits
      //avg transaction value
      let avgtransaction = getAvgTransactionValue(totalrevenue, data);
      //avg units per transaction
      let avgunits = getAvgUnitValue(data); 

      return { totalrevenue,avgtransaction, avgunits}

    }

  function getAvgUnitValue(data) {
      if(data.length===0){
        return 0
      }
      function reducer1(accumulator, current){
        return accumulator + current['ItemQty']
      }
      function reducer2(accumulator, current) {
        return accumulator + current["ShoppingCart"].reduce(reducer1,0)
      }
      let totalunits = data.reduce(reducer2, 0);
      let avgunits = totalunits / data.length;
      avgunits = Math.round(avgunits);
      return avgunits;
    }

  function getAvgTransactionValue(totalrevenue, data) {
      if(data.length===0){
        return 0
      }
      let avgtransaction = totalrevenue / data.length;
      avgtransaction = Math.round(avgtransaction);
      return avgtransaction;
    }
  //
  function getTotalRevenue(data) {
      if(data.length===0){
        return 0
      }
      const reducer = (accumulator, current) => accumulator + current["Totals"]["TotalDue"];
      let totalrevenue = data.reduce(reducer, 0);
      totalrevenue = Math.round(totalrevenue);
      return totalrevenue;
    }

  function getYearData(){
      state['curr'] = 'year',
      state['showFilter'] = false
    }

  function filterButton(){
      const filter = table.filterData(state.TransactionData,state.yeardate, state.monthdate,state.weekdate)
      state.filter = filter[1];
      state.showFilter = true;
      state.curr = filter[0]
  }

  function getMonthData(data){
    state['curr'] = 'month',
    state['showFilter'] = false
  }

  function getWeekData(){
      state['curr'] = 'week',
      state['showFilter'] = false
  }

  function getGrowth(num1,num2,reverse){
    if(reverse){
      return Math.round(((num2-num1)/num1)*100)
    }
    return Math.round(((num1-num2)/num2)*100)
    }

  function createTable(type,data,currDate=new Date()){
      if(type==='year'){
        const dataset = table.createTableMonthly(data)
        const monthlyTable = {}
        const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
        Object.keys(dataset).map((value,label)=>{
          if(value<=currDate.getMonth() || state.showFilter && state.yeardate<currDate.getFullYear()){
            monthlyTable[months[value]] = dataset[value]
          }
        })
        return monthlyTable
      }
      else if(type==='month'){
        return table.createTableWeekly(data)
      }
      else{
        return table.createTableDaily(data)
      }
    }

  function getProfitRevenueTable(time,tabledata){
      const revenuetable = {}
      for(const [key, value] of Object.entries(tabledata)){
        if(value && !(value.length===0)){
          revenuetable[key] = getTotalRevenue(value)

        }
        else{
          revenuetable[key] = 0
        }
      };

      let increment = time === 'year' ? 'month' : (time==='month') ? 'week' : 'day'
      if(increment==='week'){
        increment = 'weeks'
      }
      var columndata = [ [increment ,'Revenue', "Profits"]]
      Object.keys(revenuetable).map((value,label)=>{
        columndata.push([value,revenuetable[value], revenuetable[value]/2])
      })
      return columndata
    }

  function getTransactionsTable(time,tabledata){
      const transtable = {}
      for(const [key, value] of Object.entries(tabledata)){
        if(value && !(value.length===0)){
          transtable[key] = getAvgTransactionValue(getTotalRevenue(value),value)

        }
        else{
          transtable[key] = 0
        }
      };

      let increment = time === 'year' ? 'month' : (time==='month') ? 'week' : 'day'
      if(increment==='week'){
        increment = 'weeks'
      }
      var columndata = [ [increment ,'Avg Transaction Value'] ]
      Object.keys(transtable).map((value,label)=>{
        columndata.push([value,transtable[value]])
      })
      return columndata
    }

  function getAvgTransactionTable(time,tabledata){
      const avgtranstable = {}
      for(const [key, value] of Object.entries(tabledata)){
        if(value && !(value.length===0)){
          avgtranstable[key] = getAvgUnitValue(value)

        }
        else{
          avgtranstable[key] = 0
        }
      };

      let increment = time === 'year' ? 'month' : (time==='month') ? 'week' : 'day'
      if(increment==='week'){
        increment = 'weeks'
      }
      var columndata = [ [increment ,'Avg Units'] ]
      Object.keys(avgtranstable).map((value,label)=>{
        columndata.push([value,avgtranstable[value]])
      })
      return columndata
    }

    //look at full dataset and pick up avaiilable year values
  function getYearOptions(data=state.TransactionData){
      const values = new Set()
      data.map((transaction)=>{
        const date = new Date(transaction['CreateDateTime'])
        values.add(date.getFullYear())
      })

      return Array.from(values)

    }
  //january-december except current year
  function getMonthOptions(curr=true){
      const months = [ "None", "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
      if(curr){
        let currDate = new Date()
        return months.slice(0,currDate.getMonth()+2)
      }
      return months
    }

  function handleFormChange(e){
      if(e.target.name=='yeardate'){
        state.monthdate = 'None'
      }
      if(e.target.name!='weekdate'){
        state.weekdate = 'None'
      }
      changeStateEvt(e)
      setTimeout( filterButton,50);
  }


  function hideTables(element){
    var children = element.children;
    for (var i = 0; i < children.length; i++) {
      var eleChild = children[i];
      // Do stuff
      eleChild.style.display = 'none'
    }
  }

  function populateTables(){
      const node = document.getElementById('nodata')
      node.style.display = 'none'
      console.log(node)
      let time = state.curr
      let prevtime = 'prev'+state.curr
      let usearr = state[time]
      let prevarr = state[prevtime]

      if(state[time].length<0){
        return;
      }

      if(state.showFilter){
          usearr = state.filter
          prevarr = state.filter
      }

      const totalrevenue =getTotalRevenue(state.TransactionData)
      const totalprofits = totalrevenue
      const totaltransactions = getAvgTransactionValue(totalrevenue,state.TransactionData)
      const totalunits = getAvgUnitValue(state.TransactionData)

      const revenue = getTotalRevenue(state[time])
      const transactions = getAvgTransactionValue(revenue,state[time])
      const profits = revenue/2
      const units = getAvgUnitValue(state[time])

      const prevrevenue = getTotalRevenue(prevarr)
      const prevtransactions = getAvgTransactionValue(prevrevenue,prevarr)
      const prevprofits = prevrevenue
      const prevunits = getAvgUnitValue(prevarr)
      let reverse = false
      const growthrev = getGrowth(revenue,prevrevenue,reverse)
      const growthprofits = growthrev
      const growthunits = getGrowth(units,prevunits, reverse)
      const growthtransactions = getGrowth(transactions,prevtransactions, reverse)

      populateInfoCards('sales_revenue', state['curr'], state['showFilter'], prevrevenue, true, revenue, growthrev)
      populateInfoCards('sales_profits', state['curr'], state['showFilter'], prevprofits, true, profits, growthprofits)
      populateInfoCards('avg_transaction_value', state['curr'], state['showFilter'], prevtransactions, true, profits, growthtransactions)
      populateInfoCards('avg_units_transaction', state['curr'], state['showFilter'], prevunits, false, units, growthunits)
      //handles line graphs
      const tabledata = createTable(time,usearr)
      const profitrevenuetable = getProfitRevenueTable(time,tabledata)
      const avgtransactiontable = getAvgTransactionTable(time,tabledata)
      const transactionstable = getTransactionsTable(time,tabledata) 
      const hourlydata = table.getHourlyData(usearr)
      const categoriesSold = table.getTopSellingCategories(usearr);
      const itemsSold = table.getTopSellingItems(usearr)
      const pieData = table.createTransactionTypeTable(usearr)
      let yearSelect = getYearOptions()
      console.log(yearSelect)
      console.log(state)
      $('#ControlSelect1').empty();
      yearSelect = yearSelect.map((year)=>{
        let doc = document.createElement('option');
        doc.innerText = year;
        doc.setAttribute("value", year);
        if(year==state.yeardate){
          console.log("this year date")
          console.log(state.yeardate)
          doc.setAttribute("selected", true)
        }
        dropdown = document.getElementById('ControlSelect1')
        dropdown.appendChild(doc)
          
      })
      $('#ControlSelect2').empty();
      let monthSelect = getMonthOptions(state.yeardate==state.currYear)
      monthSelect = monthSelect.map((month)=>{
          let doc = document.createElement('option');
          doc.innerText = month;
          doc.setAttribute("value",month);
          if(month==state.monthdate){
            console.log("this month date")
            console.log(state.monthdate)
            doc.setAttribute("selected",true)
          }
          dropdown = document.getElementById('ControlSelect2')

          dropdown.appendChild(doc)
      })
      $('#ControlSelect3').empty();
      let weekSelect = null
      if(state.monthdate){
      weekSelect = table.getWeekOptions(state.yeardate,state.monthdate)
      weekSelect = weekSelect.map((week)=>{
          let doc = document.createElement('option');
          doc.innerText = week;
          doc.setAttribute("value",week);
          if(week==state.weekdate){
            console.log("this week date")
            console.log(state.weekdate)
            doc.setAttribute("selected",true)
          }
          dropdown = document.getElementById('ControlSelect3')
          dropdown.appendChild(doc)
      })
      }
      const main = document.getElementById('main')
      
      if(usearr.length<1){
        console.log('reached"')
        const node = document.getElementById('nodata')
        node.style.display = 'block'
  
      }
      chart.drawChart(chart.drawLineChart('revenue_profits_graph',2, 'Total', true, profitrevenuetable, usearr.length));
      chart.drawChart(chart.drawLineChart('avg_units_graph',1, null, false, avgtransactiontable, usearr.length));
      chart.drawChart(chart.drawLineChart('avg_transaction_value_graph',1, null, true, transactionstable, usearr.length));
      chart.drawChart(chart.drawLineChart('transactions_made_graph',1, null, false, hourlydata, usearr.length));
      chart.drawChart(chart.drawBarChart('top_items_graph', 'Top Selling Items', 'Items', 'Amount Sold', itemsSold, usearr.length));
      chart.drawChart(chart.drawBarChart('top_category_graph', 'Top Selling Categories', 'Categories', 'Amount Sold', categoriesSold, usearr.length));
      chart.drawChart(chart.drawPieChart('transaction_type_graph', 'Transaction Types', pieData, usearr.length));




  }

  function populateInfoCards(id,time, filtered, prev, money, curr, growth){
      const growthdiv = document.createElement('div');
      const percentgrowth = growth ? growth===Infinity ? '+100' : growth : 0
      growthdiv.innerText = 'Growth: '+percentgrowth+'%'
      const currentdiv = document.createElement('div')
      const symb = money ? '$' : ''
      const curramount = curr || 0
      currentdiv.innerText = 'Current '+time+':'+' '+symb+''+curramount
      const infodiv = document.createElement('div');
      const isfiltered = filtered ? 'Selected' :'Previous';
      const prevamount = prev || 0
      infodiv.innerText = isfiltered+' '+time+':'+' '+ symb+''+prevamount;
      sendTo = document.getElementById(id);
      $('#'+id).empty();
      sendTo.appendChild(growthdiv);
      sendTo.appendChild(currentdiv);
      sendTo.appendChild(infodiv);
      console.log(id+": "+"success");
  }
  var element = document.getElementById('btn1');
  var element2 = document.getElementById('btn2');
  var element3 = document.getElementById('btn3');
  
  document.getElementById('btn1').onclick = function(){
      state['curr'] ='year';
      state['showFilter'] = false;
      state.yeardate = state.currYear;
      element.classList.add('active')
      element2.classList.remove('active')
      element3.classList.remove('active')
      populateTables();


  }

  document.getElementById('btn2').onclick = function(){
      state['curr'] = 'month';
      state['showFilter'] = false;
      state.yeardate = state.currYear;
      element2.classList.add('active')
      element.classList.remove('active')
      element3.classList.remove('active')
      populateTables();
      
  }

  document.getElementById('btn3').onclick = function(){
      state['curr'] = 'week';
      state['showFilter'] = false;
      state.yeardate = state.currYear;
      element3.classList.add('active')
      element.classList.remove('active')
      element2.classList.remove('active')
      populateTables();
      
  }
  dropdown1 = document.getElementById('ControlSelect1');
  dropdown2 = document.getElementById('ControlSelect2');
  dropdown3 = document.getElementById('ControlSelect3');
  dropdown1.addEventListener('change', (event) => {
    state.yeardate = event.target.value
    state.monthdate = 'None'
    state.weekdate = 'None'
    console.log(state)
    $('#ControlSelect1').attr("selected",true).siblings().removeAttr('selected');
    filterButton()
    populateTables()
  });
  dropdown2.addEventListener('change', (event) => {
    state.monthdate = event.target.value
    state.weekdate = 'None'
    console.log(state)
    filterButton()
    populateTables()

  });
  dropdown3.addEventListener('change', (event) => {
    state.weekdate = event.target.value
    filterButton()
    console.log(state)
    populateTables()

  });

  getData();
  setTimeout(populateTables, 1000);

})
