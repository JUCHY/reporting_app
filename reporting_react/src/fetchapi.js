const myHeaders = new Headers();

//insert API URL here
const myRequest = new Request('', {
  method: 'GET',
  headers: myHeaders,
   mode: 'cors',
  cache: 'default',
});


const TransactionData = async () => fetch(myRequest).then( res => res.json()).then((response)=>{
    const data = response.map((point)=>{
        const curr = JSON.parse(point['Details'])
        const start = point['CreateDateTime'].indexOf('(')
        const end = point['CreateDateTime'].indexOf(')')
        const epoch = point['CreateDateTime'].slice(start+1,end)
        const epochmilli = parseInt(epoch)
        const date = new Date(epochmilli).toUTCString()
        curr['CreateDateTime'] = date
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
    console.log("filterDataYear")
    console.log(Transactions)
    console.log(filtereddata)

    return filtereddata
  }


function filterDataMonth(Transactions, currDate=new Date()){

  const filtereddata = filterDataYear(Transactions)
  const filtereddata2 = filtereddata.filter((transaction)=>{
    let currDate = new Date()
    let date = new Date(transaction['CreateDateTime'])
    let currmonth = currDate.getMonth()
    let month = date.getMonth()
    return currmonth == month

  })
  
  return filtereddata2

  }

function filterDataWeek(Transactions, currDate=new Date()){

  let filtereddata = filterDataMonth(Transactions)
  const starter = currDate.getDay()

  filtereddata = filtereddata.filter((transaction)=>{
    let currDate = new Date()
    let date = new Date(transaction['CreateDateTime'])
    let daydiff = dateDiffInDays(currDate,date)
    return daydiff<=starter
  })
  return filtereddata
}

function filterPrevYear(Transactions){
  const dateOffset = (24*60*60*1000) * 365; //5 days
  let myDate = new Date();
  myDate.setTime(myDate.getTime() - dateOffset);
  return filterDataYear(Transactions, myDate)

}

function filterPrevMonth(Transactions){
  const dateOffset = (24*60*60*1000) * 31; //5 days
  let myDate = new Date();
  myDate.setTime(myDate.getTime() - dateOffset);
  return filterDataMonth(Transactions, myDate)
}

function filterPrevWeek(Transactions){
  const dateOffset = (24*60*60*1000) * 7; //5 days
  let myDate = new Date();
  myDate.setTime(myDate.getTime() - dateOffset);
  return filterDataWeek(Transactions, myDate)

}


  export { TransactionData, filterDataMonth, filterDataWeek, filterDataYear, filterPrevYear, filterPrevMonth, filterPrevWeek }