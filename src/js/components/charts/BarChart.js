import {
  VictoryAxis,
  VictoryBar,
  VictoryChart, VictoryLabel,
  VictoryStack,
  VictoryTheme, VictoryTooltip
} from "victory";
import React from "react";

class CustomLabel extends React.Component {
  static defaultEvents = VictoryTooltip.defaultEvents

  render() {
    const { datum } = this.props;

    return (
      <VictoryLabel
        {...this.props}
        style={{ fontSize: 5 }}
        text={`${datum.y.toFixed(2)} g CO2-eq`}
        dx={15}
        textAnchor="start"
        dy={10}
        orientation={"right"}

      />)

  }
}

const BarChart = ({className, deviceType, networkType, hours, permuttedData, selectedIdx, hoveredIdx}) => {
  return (
    <div className={className}>
    {selectedIdx !== -1 &&

    <VictoryChart
      animate={{duration: 2000}}
      width={200}
    >
      <VictoryAxis
        crossAxis
        style={{tickLabels: {fontSize: 7, fontFamily: 'IBM Plex Sans'}}}
        theme={VictoryTheme.material}
        standalone={false}
      />
      <VictoryAxis
        dependentAxis
        style={{
          tickLabels: {fontSize: 10, fontFamily: 'IBM Plex Sans'}
        }}
      />
      <VictoryStack
        colorScale={["#457b9d", "#1d3557"]}
        barWidth={5}
        domainPadding={{x: 15}}
      >
        <VictoryBar
          barRatio={2}
          marginLeft={15}
          labelComponent={<CustomLabel/>}
          barWidth={20}
          data={[{
            x: `Selected\nDevice: ${deviceType}\nNetwork: ${networkType}`,
            y: permuttedData[selectedIdx].deviceEmission * hours,
            label: ""
          }, {
            x: hoveredIdx !== -1 && hoveredIdx !== selectedIdx ? `Hovered\nDevice: ${permuttedData[hoveredIdx].device}\nNetwork: ${permuttedData[hoveredIdx].network}` : "",
            y: hoveredIdx !== -1 ? permuttedData[hoveredIdx].deviceEmission * hours : 0,
            label: ""
          }]}
        />
        <VictoryBar
          barRatio={2}
          barWidth={20}
          labelComponent={<CustomLabel/>}
          data={[{
            x: `Selected\nDevice: ${deviceType}\nNetwork: ${networkType}`,
            y: permuttedData[selectedIdx].networkEmission * hours,
            label: ""
          }, {
            x: hoveredIdx !== -1 && hoveredIdx !== selectedIdx ? `Hovered\nDevice: ${permuttedData[hoveredIdx].device}\nNetwork: ${permuttedData[hoveredIdx].network}` : "",
            y: hoveredIdx !== -1 ? permuttedData[hoveredIdx].networkEmission * hours : 0,
            label: ""
          }]}
        />
      </VictoryStack>
    </VictoryChart>}
  </div>
  )};

export default BarChart;


