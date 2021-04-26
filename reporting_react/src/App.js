import logo from './logo.svg';
import './App.css';
import Chart from "react-google-charts";
import { TransactionData, filterDataYear, filterDataWeek, filterDataMonth, filterPrevYear, filterPrevMonth, filterPrevWeek } from './fetchapi.js';
import { createTableMonthly, createTableWeekly, createTableDaily, getHourlyData, createTransactionTypeTable, getTopSellingItems } from './createtable.js'
import { Transactions } from './Data.js';
import LineGraph from './components/LineGraph.js';
import PieChart from './components/PieChart.js';
import BarChart from './components/BarChart.js';
import InfoCard from './components/InfoCard.js';
import {Container, Row, Col} from 'react-bootstrap';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import React from 'react';



class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      TransactionData : [],
      year : [],
      month : [],
      week : [],
      prevyear : [],
      prevmonth : [],
      prevweek : [],
      curr : "year"
    }
    this.getData = this.getData.bind(this)
    this.getYearData = this.getYearData.bind(this)
    this.getMonthData = this.getMonthData.bind(this)
    this.getWeekData = this.getWeekData.bind(this)
    this.getTotalData = this.getTotalData.bind(this)
    this.filterData = this.filterData.bind(this)
    this.getProfitRevenueTable = this.getProfitRevenueTable.bind(this)
    this.getTotalRevenue = this.getTotalRevenue.bind(this)
  }

  componentDidMount(){
    this.getData()

  }

  filterData(){
    const year = filterDataYear(this.state.TransactionData)
    const month = filterDataMonth(this.state.TransactionData)
    const week = filterDataWeek(this.state.TransactionData)
    console.log("test functions")
    console.log(this.state.TransactionData)
    console.log(year)
    console.log(month)
    console.log(week)

  }

  async getData(){
    const transactions = await TransactionData();
    console.log('check')
    console.log(transactions)
    this.setState({
      TransactionData : transactions,
      year : filterDataYear(transactions),
      month : filterDataMonth(transactions),
      week : filterDataWeek(transactions),
      prevyear : filterPrevYear(transactions),
      prevmonth : filterPrevMonth(transactions),
      prevweek : filterPrevWeek(transactions)
      

    })
  }

  getTotalData(data){
    //revenue
    let totalrevenue = this.getTotalRevenue(data);
    //profits
    //avg transaction value
    let avgtransaction = this.getAvgTransactionValue(totalrevenue, data);
    //avg units per transaction
    let avgunits = this.getAvgUnitValue(data); 

    return { totalrevenue,avgtransaction, avgunits}

  }

  getAvgUnitValue(data) {
    function reducer2(accumulator, current) {
      return accumulator + current["ShoppingCart"].length;
    }
    let totalunits = data.reduce(reducer2, 0);
    let avgunits = totalunits / data.length;
    avgunits = Math.round(avgunits);
    return avgunits;
  }

  getAvgTransactionValue(totalrevenue, data) {
    let avgtransaction = totalrevenue / data.length;
    avgtransaction = Math.round(avgtransaction);
    console.log(avgtransaction);
    return avgtransaction;
  }

  getTotalRevenue(data) {
    const reducer = (accumulator, current) => accumulator + current["Totals"]["TotalDue"];
    let totalrevenue = data.reduce(reducer, 0);
    totalrevenue = Math.round(totalrevenue);
    console.log(totalrevenue);
    console.log(data)
    return totalrevenue;
  }

  getYearData(data){
    this.setState({
      curr : 'year'
    })
  }

  getMonthData(data){
    this.setState({
      curr : 'month'
    })
  }

  getWeekData(data){
    this.setState({
      curr : 'week'
    })
  }

  getGrowth(num1,num2){
    return Math.round(((num1-num2)/num2)*100)
  }

  createTable(type,data){
    console.log('create table')
    console.log(data)
    if(type==='year'){
      return createTableMonthly(data)

    }
    else if(type==='month'){
      return createTableWeekly(data)
    }
    else{
      return createTableDaily(data)
    }
  }

  getProfitRevenueTable(time,tabledata){
    const revenuetable = {}
    for(const [key, value] of Object.entries(tabledata)){
      console.log(key)
      console.log(tabledata[key])
      if(value && !(value.length===0)){
        revenuetable[key] = this.getTotalRevenue(value)

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
    console.log(columndata)
    return columndata
  }

  getTransactionsTable(time,tabledata){
    const transtable = {}
    for(const [key, value] of Object.entries(tabledata)){
      if(value && !(value.length===0)){
        transtable[key] = this.getAvgTransactionValue(this.getTotalRevenue(value),value)

      }
      else{
        transtable[key] = 0
      }
    };

    let increment = time === 'year' ? 'month' : (time==='month') ? 'week' : 'day'
    if(increment==='week'){
      increment = 'weeks'
    }
    var columndata = [ [increment ,'Avg Value'] ]
    Object.keys(transtable).map((value,label)=>{
      columndata.push([value,transtable[value]])
    })
    return columndata
  }

  getAvgTransactionTable(time,tabledata){
    const avgtranstable = {}
    for(const [key, value] of Object.entries(tabledata)){
      if(value && !(value.length===0)){
        avgtranstable[key] = this.getAvgUnitValue(value)

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

  
  render(){
/*     console.log('state')
    console.log(this.state)

    var columndata = [ ['transactionTime','transactionAmount']]
    var transactionDates = {}
    this.state.TransactionData.map(transaction=>{
      let transactionDate = new Date(transaction['Timestamp'])
      transactionDates[transactionDate.toDateString()] = transactionDates[transactionDate.toDateString()] ? transactionDates[transactionDate.toDateString()] + transaction['Totals']['TotalDue'] : transaction['Totals']['TotalDue'];
    })
    Object.keys(transactionDates).map((value,label)=>{
      columndata.push([value,transactionDates[value]])
    })
    columndata.sort((a,b)=>{ return new Date(a[0]).date-new Date(b[0]).date})
    console.log(columndata)
    var pieData = [['TransactionType','Number of Transactions']]
    var transactiontypes = {}
    this.state.TransactionData.map(transaction=>{
      transaction['Payment'].map(payments=>{
        transactiontypes[payments['PaymentType']] = transactiontypes[payments['PaymentType']] ? transactiontypes[payments['PaymentType']]+1 : 1;
      })
    })
    console.log(transactiontypes)
    Object.keys(transactiontypes).map((value,label)=>{
      pieData.push([value,transactiontypes[value]]);
    })
    console.log(pieData) */ 
    //handles infocards
    let time = this.state.curr
    let prevtime = 'prev'+this.state.curr
    const totalrevenue =this.getTotalRevenue(this.state.TransactionData)
    const totalprofits = totalrevenue
    const totaltransactions = this.getAvgTransactionValue(totalrevenue,this.state.TransactionData)
    const totalunits = this.getAvgUnitValue(this.state.TransactionData)
    const revenue = this.getTotalRevenue(this.state[time])
    const transactions = this.getAvgTransactionValue(revenue,this.state[time])
    const profits = revenue
    const units = this.getAvgUnitValue(this.state[time])
    const prevrevenue = this.getTotalRevenue(this.state[prevtime])
    const prevtransactions = this.getAvgTransactionValue(revenue,this.state[prevtime])
    const prevprofits = prevrevenue
    const prevunits = this.getAvgUnitValue(this.state[prevtime])
    const growthrev = this.getGrowth(revenue,prevrevenue)
    const growthprofits = growthrev
    const growthunits = this.getGrowth(units,prevunits)
    const growthtransactions = this.getGrowth(transactions,prevtransactions)
    //handles line graphs
    const tabledata = this.createTable(time,this.state[time])
    const profitrevenuetable = this.getProfitRevenueTable(time,tabledata)
    const avgtransactiontable = this.getAvgTransactionTable(time,tabledata)
    const transactionstable = this.getTransactionsTable(time,tabledata) 
    const hourlydata = getHourlyData(this.state[time])
    console.log(hourlydata)
    const categoriesSold = [
      ['Category', 'Amount Sold'],
      ['Food', 8175000],
      ["Woman's Wear", 3792000 ],
      ['Toys', 2695000 ],
      ['Cleaning Supplies', 2099000 ],
      ["Men's Wear", 1526000 ],
    ]
    const itemsSold = getTopSellingItems(this.state[time])
    const pieData = createTransactionTypeTable(this.state[time])


    
    return(
    <>
    <Container fluid>
      <Row>
        <Col md={4}></Col>
        <Col md={4} style={{textAlign : "center"}}>
        <ButtonGroup aria-label="Basic example" style={{margin:'auto',width:'100%'}}>
        <Button onClick={this.getYearData} variant="primary">Year</Button>
        <Button onClick={this.getMonthData} variant="success">Month</Button>
        <Button onClick={this.getWeekData} variant="dark">Week</Button>
        </ButtonGroup>
        </Col>
        <Col md={4}></Col>
      </Row>
      <Row>
      <Col><InfoCard name={"Sales Revenue"} total={totalrevenue} prev={this.state.curr ==='year' ? prevrevenue : null } money={true} curr={revenue} growth={growthrev}></InfoCard></Col>
      <Col><InfoCard name={"Profits"} total={totalprofits} curr={profits} prev={this.state.curr ==='year' ? prevprofits : null } money={true} growth={growthprofits}></InfoCard></Col>
      <Col><InfoCard name={"Transactions"} total={totaltransactions} curr={transactions} growth={growthtransactions}></InfoCard></Col>
      <Col><InfoCard name={"Avg Units Per Transactions"} total={totalunits} curr={units} growth={growthunits}></InfoCard></Col>
      </Row>
      {this.state[time].length > 0 ?
      <>
      <Row>
      <Col md={6}>
        {this.state[time].length > 0 ? <LineGraph vtitle={'Total'} money={true} data={profitrevenuetable}></LineGraph> : <div className='center-text2'>No Data</div>}
        </Col>
      <Col md={6}>
        {this.state[time].length > 0 ? <LineGraph data={avgtransactiontable}></LineGraph> : <div className='center-text2'>No Data</div>}
      </Col>
      </Row>
      <Row>
      <Col md={6}>
        {this.state[time].length > 0 ? <LineGraph money={true} data={transactionstable}></LineGraph> : <div className='center-text2'>No Data</div>}
      </Col>
      <Col md={6}>
      {this.state[time].length > 0 ? <LineGraph data={hourlydata}></LineGraph> : <div className='center-text2'>No Data</div>}
      </Col>
      </Row>
    <Row className="column-charts">
      <Col>
      {this.state[time].length > 0 ? <BarChart title={'Top Selling Categories'} vAxis={'Categories'} hAxis={'Amount Sold'} data={categoriesSold} /> : <div className='center-text2'>No Data</div>}
      </Col>
      <Col>
      {this.state[time].length > 0 ? <BarChart title={'Top Selling Items'} vAxis={'Items'} hAxis={'Amount Sold'} data={itemsSold}/> : <div className='center-text2'>No Data</div>}
      </Col>
      <Col>
      {this.state[time].length > 0 ? <PieChart data={pieData} title={"Transaction Types"}/> : <div className='center-text2'>No Data</div>}
      </Col>    
    </Row></> : <div className='center-text2'>No Data for this {this.state.curr}</div>} }
    </Container>
    </>)
    
  }
}

export default App;
