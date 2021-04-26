function createTableMonthly(year_transactions){

    const monthdata = {
      "Jan" :[],
      "Feb" : [],
      "Mar" : [],
      "Apr" : [],
      "May" : [],
      "Jun" : [],
      "Jul" : [],
      "Aug" : [],
      "Sep" : [],
      "Oct" : [],
      "Nov" : [],
      "Dec" : []
    }
    const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    console.log(year_transactions)
    year_transactions.map((transaction)=>{
        console.log(transaction)
        let date = new Date(transaction['CreateDateTime'])
        monthdata[months[date.getMonth()]].push(transaction)
    })
    console.log("this is month data")
    console.log(monthdata)
    return monthdata
}

function createTableWeekly(month_transactions){

    const weekdata = {
      '1' : [],
      '2' : [],
      '3' : [],
      '4' : [],
      '5' : []
    }
    const currDate = new Date()
    currDate.setDate(1)
    const offset = currDate.getDate()
    const thisweek = function(num){
      if(num<=7){
        return '1'
      }
      else if(num<=14){
        return '2'
      }
      else if(num<21){
        return '3'
      }
      else if(num<=28){
        return '4'
      }
      else{
        return '5'
      }
    }
    month_transactions.map((transaction)=>{
        let date = new Date(transaction['CreateDateTime'])
        weekdata[thisweek(date.getDate()+offset)].push(transaction)
    })
    
    return weekdata

  }

function createTableDaily(week_transactions){

    const days = ['Sun','Mon','Tues','Wed','Thu','Fri','Sat'];
    const daydata = {
      "Mon" :[],
      "Tue" : [],
      "Wed" : [],
      "Thu" : [],
      "Fri" : [],
      "Sat" : [],
      "Sun" : [],
    }
    let currDate=new Date()
    const starter = currDate.getDay()
    const starterdate = currDate.getDate()


    week_transactions.map((transaction)=>{
        let date = new Date(transaction['CreateDateTime'])
        daydata[days[date.getDay()]].push(transaction)
    })
    return daydata
  }

function getHourlyData(transactions){
  const data = [ [ 'hour' , 'Transactions Made']]

  const hours = {

  }
  transactions.map((transaction)=>{
    let date = new Date(transaction['CreateDateTime'])
    if(hours[parseInt(date.getHours())]===undefined){
      hours[parseInt(date.getHours())] = []

    }
    if(hours[parseInt(date.getHours())-1]===undefined){
      if(parseInt(date.getHours())-1<=23 && parseInt(date.getHours())+1>=0){
        hours[parseInt(date.getHours())+1] = []
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
    data.push([ key, hours[key].length])
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
  console.log(transactiontypes)
  Object.keys(transactiontypes).map((value,label)=>{
    pieData.push([value,transactiontypes[value]]);
  })
  return pieData

}

function getTopSellingItems(transactions){
  const topselling = []
  const items = {}
  transactions.map(transaction=>{
    console.log(transaction)
    transaction["ShoppingCart"].map(item=>{
        items[item['ItemName']] = items[item['ItemName']] ? items[item['ItemName']]+1 : 1
    })
  })
  console.log(items)
  Object.keys(items).map((value,label)=>{
    topselling.push([value,items[value]]);
  })
  topselling.sort((a,b)=>{
    return b[1]-a[1]
  })
  topselling.unshift(['Item', 'Amount Sold'])
  return topselling.slice(0,5)


}

function findMonthWeek(Date){

}

export { createTableDaily, createTableWeekly, createTableMonthly, getHourlyData, createTransactionTypeTable, getTopSellingItems}