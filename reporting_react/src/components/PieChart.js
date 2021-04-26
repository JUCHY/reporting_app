import Chart from "react-google-charts";


function PieChart(props){
    return <Chart
    width={'100%'}
    height={'600px'}
    chartType="PieChart"
    loader={<div>Loading Chart</div>}
    data={props.data}
    options={{
      title: props.title,
    }}
    rootProps={{ 'data-testid': '1' }}
  />
}

export default PieChart;