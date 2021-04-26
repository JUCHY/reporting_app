import Chart from "react-google-charts";


function BarChart(props){
    return <Chart
    width={'100%'}
    height={'600px'}
    chartType="BarChart"
    loader={<div>Loading Chart</div>}
    data={props.data}
    options={{
      title: props.title,
      chartArea: { width: '50%' },
      hAxis: {
        title: props.hAxis,
        minValue: 0,
      },
      vAxis: {
        title: props.vAxis,
      },
    }}
    // For tests
    rootProps={{ 'data-testid': '1' }}
  />
}

export default BarChart;