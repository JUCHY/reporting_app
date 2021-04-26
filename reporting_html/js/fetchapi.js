define(function(require){

  const myHeaders = new Headers();

  const myRequest = new Request('http://pos.yenni.cloud/Playground/GetAllTransactions', {
    method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
  });


  const TransactionData = async () => fetch(myRequest).then( res => res.json()).then((response)=>{
      console.log(response.length);
      const data = response.map((point)=>{
          const curr = JSON.parse(point['Details'])
          const start = point['CreateDateTime'].indexOf('(')
          const end = point['CreateDateTime'].indexOf(')')
          const epoch = point['CreateDateTime'].slice(start+1,end)
          const epochmilli = parseInt(epoch)
          const date = new Date(epochmilli).toUTCString()
          let category = point['CategoryName']
          if(category==null){
            let category = 'NA'
          }
          curr['CreateDateTime'] = date;
          curr["ShoppingCart"] = curr["ShoppingCart"].map(item=>{
                const newItem = item;
                if(newItem["CategoryName"]==null){
                  newItem["CategoryName"] = "NA";
                }
                return newItem;
            })
          return curr
        })
      return data
      }
  )


  function dateDiffInDays(a, b) {
      const _MS_PER_DAY = 1000 * 60 * 60 * 24;

      // Discard the time and time-zone information.
      const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
      const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

      return Math.floor((Math.abs(utc2 - utc1)) / _MS_PER_DAY);
      }

  function filterDataYear(Transactions,currDate=new Date()){
      let filtereddata = Transactions.filter((transaction)=>{
        let date = new Date(transaction['CreateDateTime'])
        return currDate.getFullYear() === date.getFullYear()
      })
      return filtereddata
    }


  function filterDataMonth(Transactions, currDate=new Date()){

    const filtereddata = filterDataYear(Transactions, currDate)
    const filtereddata2 = filtereddata.filter((transaction)=>{
      let date = new Date(transaction['CreateDateTime'])
      let currmonth = currDate.getMonth()
      let month = date.getMonth()
      return currmonth == month

    })
    
    return filtereddata2

    }

  function getWeekNum(currDate){
    let day = currDate.getDate()
    currDate.setDate(1)
    const offset = currDate.getDay()
    return Math.floor((day-offset)/7)+1
  }

  function filterDataWeek(Transactions, currDate=new Date()){

    let filtereddata = filterDataMonth(Transactions, currDate)
    const week = getWeekNum(currDate)

    filtereddata = filtereddata.filter((transaction)=>{
      let date = new Date(transaction['CreateDateTime'])
      const weeknum = getWeekNum(date)
      return weeknum==week
    })
    return filtereddata
  }

  function filterPrevYear(Transactions){
    const dateOffset = (24*60*60*1000) * 365; //365 days
    let myDate = new Date();
    myDate.setTime(myDate.getTime() - dateOffset);
    return filterDataYear(Transactions, myDate)

  }

  function filterPrevMonth(Transactions){
    const dateOffset = (24*60*60*1000) * 31; //31 days
    let myDate = new Date();
    myDate.setTime(myDate.getTime() - dateOffset);
    return filterDataMonth(Transactions, myDate)
  }

  function filterPrevWeek(Transactions){
    const dateOffset = (24*60*60*1000) * 7; //7days
    let myDate = new Date();
    myDate.setTime(myDate.getTime() - dateOffset);
    return filterDataWeek(Transactions, myDate)

  }

  return {
    TransactionData, filterDataYear, filterDataMonth, filterDataWeek, getWeekNum, filterPrevYear, filterPrevMonth, filterPrevWeek 
  }
    
})