import React from "react";
import {
  VictoryChart,
  VictoryPolarAxis,
  VictoryLabel,
  VictoryBar,
  VictoryStack,
  VictoryTheme,
  VictoryLegend
} from "victory"

class CompassCenter extends React.Component {

  render() {
    const { origin } = this.props;
    const circleStyle = {
      stroke: "#f1faee", strokeWidth: .5, fill: "#a8dadc"
    };
    return (
      <g>
        <circle
          cx={origin.x} cy={origin.y} r={30} style={circleStyle}
        />
      </g>
    );
  }
}

class CenterLabel extends React.Component {
  render() {
    const { datum, index, hours, selectedIdx } = this.props;
    const text = [ `${(datum.totalEm * hours).toFixed(2)}`, "g CO2-eq" ];
    const baseStyle = { fill: "#e63946", textAnchor: "middle" };
    const style = [
      { ...baseStyle, fontSize: 14, fontFamily: 'IBM Plex Sans' },
      { ...baseStyle, fontSize: 10, fontFamily: 'IBM Plex Sans' }];

    return index == selectedIdx ?
      (
        <VictoryLabel
          text={text} style={style} x={175} y={175} renderInPortal
        />
      ) : null;
  }
}

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { em: this.getEmData() };
  }

  getEmData() {
    return this.props.data.map((d, idx) => {
      return {
        device: d.device,
        network: d.network,
        devEm: d.deviceEmission,
        totalEm: d.deviceEmission + d.networkEmission,
      };
    });
  }

  render() {
    const {selectedIdx, setDeviceType, setNetworkType, hours, hoveredIdx, setHoveredIdx, className} = this.props;


    return (
      <div className={className}>
      <VictoryChart
        polar
        animate={{ duration: 500, onLoad: { duration: 500 } }}
        theme={VictoryTheme.material}
        innerRadius={30}
        domainPadding={{ y: 6 }}
        events={[{
          childName: "all",
          target: "data",
          eventHandlers: {
            onClick: () => {
              return [
                { target: "data", mutation: (props) => {
                    console.log(props);
                    setDeviceType(props.datum.device)
                    setNetworkType(props.datum.network)
                    return { active: true }
                  } }
              ];
            },
            onMouseOver: () => {
              return [
                { target: "labels", mutation: () => ({ active: true }) },
                { target: "data", mutation: (props) => {

                  setHoveredIdx(props.index)
                  return { active: true }

                }}
              ];
            },
            onMouseOut: () => {
              return [
                { target: "labels", mutation: () => ({ active: false }) },
                { target: "data", mutation: (props) => {

                    setHoveredIdx(-1)
                    return { active: false }

                  }}
              ];
            }
          }
        }]}
      >
        <VictoryPolarAxis
          dependentAxis
          style={{ axis: { stroke: "none" } }}
          tickFormat={() => ""}
        />
        <VictoryPolarAxis
          style={{ axis: { stroke: "none" }, grid: { stroke: "none" } }}
          tickFormat={() => ""}
        />
        <VictoryStack
          //groupComponent={<g transform="rotate(0 0 100)" />} Ne pas oublier
          // de soustraire le domaine
          domain={{x: [-3, 5]}}
        >
          <VictoryBar
            style={{ data: {
                fill: "#457b9d",
                stroke: "#e63946",
                strokeWidth: ({index}) => index === selectedIdx || index === hoveredIdx ? 1.5 : 0,
                width: 40,
                cursor: "pointer"
              } }}
            data={this.state.em}
            y="devEm"
            labels={() => ""}
            labelComponent={<CenterLabel selectedIdx={selectedIdx} hours={hours}/>}
          />
          <VictoryBar
            style={{ data: {
                fill: "#1d3557",
                stroke: "#e63946",
                strokeWidth: ({index}) => index === selectedIdx || index === hoveredIdx  ? 1.5 : 0,
                width: 40,
                cursor: "pointer"
              } }}
            data={this.state.em}
            y={(d) => d.totalEm - d.devEm}
            labels={() => ""}
            labelComponent={<CenterLabel selectedIdx={selectedIdx} hours={hours}/>}
          />
        </VictoryStack>
        <CompassCenter/>
        <VictoryLegend
          x={200}
          y={250}
          centerTitle
          orientation="vertical"
          gutter={5}
          style={{ labels: {fontSize: 8 } }}
          data={[
            { name: "Total Emissions", symbol: { fill: "#a8dadc", type: "square" } },
            { name: "Device Emissions", symbol: { fill: "#457b9d", type: "square" } },
            { name: "Network Emissions", symbol: { fill: "#1d3557", type: "square" } },
            { name: "All values are expressed in g CO2-eq", symbol: { fill: "#e63946", type: "star"}, labels: {fill: "#e63946"}  }
          ]}
        />
      </VictoryChart>
      </div>
    );
  }
}

export default Chart;
