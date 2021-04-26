define(function(require){

  const api = require('./fetchapi')

  function createTableMonthly(year_transactions){

      const monthdata = {
        0 :[],
        1 : [],
        2 : [],
        3 : [],
        4 : [],
        5 : [],
        6 : [],
        7 : [],
        8 : [],
        9 : [],
        10 : [],
        11 : []
      }
      const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
      year_transactions.map((transaction)=>{
          let date = new Date(transaction['CreateDateTime'])
          monthdata[date.getMonth()].push(transaction)
      })
      return monthdata
  }

  const thisweek = function(num){
    if(num<=7){
      return '1'
    }
    else if(num<=14){
      return '2'
    }
    else if(num<=21){
      return '3'
    }
    else if(num<=28){
      return '4'
    }
    else if(num<=35){
      return '5'
    }
    else{
      return '6'
    }
  }

  function populateWeekdata(offset,currDate= new Date()){
    const data = {}
    for(let x = 1; x <=thisweek(currDate.getDate()); x++){
      data[x] = []
    }
    return data
  }

  function createTableWeekly(month_transactions){
      const currDate = new Date()
      currDate.setDate(1)
      const offset = currDate.getDay()
      const weekdata = populateWeekdata(offset)

      month_transactions.map((transaction)=>{
          let date = new Date(transaction['CreateDateTime'])
          weekdata[thisweek(date.getDate()+offset)] = weekdata[thisweek(date.getDate()+offset)] ? weekdata[thisweek(date.getDate()+offset)]: []
          weekdata[thisweek(date.getDate()+offset)].push(transaction)
      })
      
      return weekdata

    }
  function monthsToNum(month){
    const ref = {
      "Jan" : 0,
      "Feb" : 1,
      "Mar" : 2,
      "Apr" : 3,
      "May" : 4,
      "Jun" : 5,
      "Jul" : 6,
      "Aug" : 7,
      "Sep" : 8,
      "Oct" : 9,
      "Nov" : 10,
      "Dec" : 11
    }
    return ref[month]
  }
  //1-52 except current year
  function getWeekOptions(year,month){
    
    const date= new Date(year,monthsToNum(month),1)
    const offset = date.getDay()
    const end_date = new Date(year,monthsToNum(month)+1,0)
    let val1 = date.getDate()-1
    let val2 = end_date.getDate()-1
    const values = new Set()
    values.add('None')
    for(let x=val1+offset; x<=val2+offset;x+=1){
      values.add(Math.floor(x/7)+1)
    }
    return Array.from(values)
  }

  function createTableDaily(week_transactions){

      const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      const daydata = {
        "Sun" : [],
        "Mon" :[],
        "Tue" : [],
        "Wed" : [],
        "Thu" : [],
        "Fri" : [],
        "Sat" : [],
      }
      let currDate=new Date()
      // const starter = currDate.getDay()
      // const starterdate = currDate.getDate()


      week_transactions.map((transaction)=>{
          let date = new Date(transaction['CreateDateTime'])
          daydata[days[date.getDay()]].push(transaction)
      })
      return daydata
    }
    

  function formatAMPM(hours) {
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var strTime = hours+ ampm;
    return strTime;
  }
    
  function getHourlyData(transactions){
    const data = [ [ 'hour' , 'Total Transactions']]

    const hours = {

    }
    transactions.map((transaction)=>{
      let date = new Date(transaction['CreateDateTime'])
      if(hours[parseInt(date.getHours())]===undefined){
        hours[parseInt(date.getHours())] = []

      }
      if(hours[parseInt(date.getHours())-1]===undefined){
        if(parseInt(date.getHours())-1<=23 && parseInt(date.getHours())-1>=0){
          hours[parseInt(date.getHours())-1] = []
          }
  
      }
      if(hours[parseInt(date.getHours())+1]===undefined){
        if(parseInt(date.getHours())+1<=23 && parseInt(date.getHours())+1>=0){
        hours[parseInt(date.getHours())+1] = []
        }

      }

      hours[parseInt(date.getHours())].push(transaction)
    })
    Object.keys(hours).map((key)=>{
      data.push([ formatAMPM(key), hours[key].length])
    })

    return data
  }

  function createTransactionTypeTable(transactions){
    var pieData = [['TransactionType','Number of Transactions']]
    var transactiontypes = {}
    transactions.map(transaction=>{
      transaction['Payment'].map(payments=>{
        transactiontypes[payments['PaymentType']] = transactiontypes[payments['PaymentType']] ? transactiontypes[payments['PaymentType']]+1 : 1;
      })
    })
    Object.keys(transactiontypes).map((value,label)=>{
      pieData.push([value,transactiontypes[value]]);
    })
    return pieData

  }

  function getTopSellingItems(transactions){
    const topselling = []
    const items = {}
    transactions.map(transaction=>{
      transaction["ShoppingCart"].map(item=>{
          items[item['ItemName']] = items[item['ItemName']] ? items[item['ItemName']]+parseInt(item['ItemQty']) : parseInt(item['ItemQty'])
      })
    })
    Object.keys(items).map((value,label)=>{
      topselling.push([value,items[value]]);
    })
    topselling.sort((a,b)=>{
      return b[1]-a[1]
    })
    topselling.unshift(['Item', 'Amount Sold'])
    return topselling.slice(0,6)


  }

  function getTopSellingCategories(transactions){
    const topselling = []
    const categories  = {}
    transactions.map(transaction=>{
      transaction["ShoppingCart"].map(item=>{
          categories[item['CategoryName']] = categories[item['CategoryName']] ? categories[item['CategoryName']]+parseInt(item['ItemQty']) : parseInt(item['ItemQty'])
      })
    })
    Object.keys(categories).map((value,label)=>{
      topselling.push([value,categories[value]]);
    })
    topselling.sort((a,b)=>{
      return b[1]-a[1]
    })
    topselling.unshift(['Category', 'Amount Sold'])
    return topselling.slice(0,6)


  }


  function filterYear(transactions,year){
    const filterDate = new Date(year,0,1)
    const data = api.filterDataYear(transactions,filterDate)
    return data
  }

  function filterMonth(transactions,year,month){
    const filterDate = new Date(year,month,1)
    const data = api.filterDataMonth(transactions,filterDate)
    return data
  }

  function filterWeek(transactions,year,month,day){
    const filterDate = new Date(year,month,day)
    const data = api.filterDataWeek(transactions,filterDate)
    return data

  }
  function getMonth(num){
    const months = [ "None", "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    return months[num]
  } 

  function filterData(transactions,year,month,week){
    let time = 'year'
    
    if(month && month!='None'){
      time = 'month';
      if(week && week!='None') time = 'week';
    } 
    month = month && month!='None' ? monthsToNum(month) : 0
    if(time==='year'){
      return [ time, filterYear(transactions,year)]
    }
    if(time==='month'){
      return [time, filterMonth(transactions,year,month)]
    }
    const filterDate = new Date(year,month,1)
    const offset = filterDate.getDay()
    let day = (week-1)*7
    day = day - offset
    day = day+7
    return [ time, filterWeek(transactions,year,month,day)]

  }

  return { createTableMonthly, createTableWeekly, createTableDaily, getHourlyData, createTransactionTypeTable, getTopSellingItems, getTopSellingCategories, getWeekOptions, filterData, getMonth };

})

