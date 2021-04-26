import Chart from "react-google-charts";

function LineGraph(props){
    const format = props.money ? 'currency' : null
    const moneyformat = [
      {
        type: 'NumberFormat',
        column: 1,
        options: {
          prefix: '$',
          negativeColor: 'red',
          negativeParens: true,
        }
      },
      {
        type: 'NumberFormat',
        column: 2,
        options: {
          prefix: '$',
          negativeColor: 'red',
          negativeParens: true,
        }
      },
    ] 
    const formatters = props.money ? moneyformat : null
    return <>{ !props.data.length>1 ? <div>No Data</div> : <Chart className="graph"
    width={'100%'}
    height={'400px'}
    chartType="LineChart"
    loader={<div>Loading Chart</div>}
    data={ 
    props.data
    }
    formatters={formatters}
    options={{
      hAxis: {
        title: props.data[0][0],
      },
      vAxis: {
        title: props.vtitle ? props.vtitle : props.data[0][1],
        format: format
      },
    }}
    rootProps={{ 'data-testid': '1' }}
  />}
  </>

}

export default LineGraph;