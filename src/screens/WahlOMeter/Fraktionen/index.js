import React, { Component } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Dimensions } from 'react-native';

// Components
import PartyChart from '../../../components/Charts/PartyChart';
import Header from '../Header';
import ChartNote from '../ChartNote';
import VotedProceduresList from '../VotedProceduresList';

const Wrapper = styled.ScrollView`
  background-color: #fff;
  padding-top: 18;
  width: ${Dimensions.get('screen').width};
`;

const VoteResultNumbers = styled.View`
  width: ${() => Dimensions.get('window').width - 18 * 2};
  max-width: 464;
  flex-direction: row;
  justify-content: space-around;
`;

const VoteResult = styled.View`
  justify-content: center;
  align-items: center;
`;

const VoteResultCircleNumber = styled.View`
  flex-direction: row;
`;

const VoteResultNumber = styled.Text`
  color: #4a4a4a;
  font-size: 12;
`;
const VoteResultLabel = styled.Text`
  color: rgb(142, 142, 147);
  font-size: 10;
`;

const VoteResultCircle = styled.View`
  width: 10;
  height: 10;
  border-radius: 5;
  background-color: ${props => props.color};
  margin-top: 3;
  margin-right: 5;
`;

class Fraktionen extends Component {
  state = {
    chartWidth: Math.min(Dimensions.get('screen').width, Dimensions.get('screen').height),
    selected: 0,
  };
  onLayout = () => {
    const chartWidth = Math.min(Dimensions.get('screen').width, Dimensions.get('screen').height);
    if (this.state.chartWidth !== chartWidth) {
      this.setState({
        chartWidth,
      });
    }
  };

  onClick = index => () => {
    this.setState({ selected: index });
  };

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  render() {
    const {
      chartData,
      totalProcedures,
      votedProceduresCount,
      onProcedureListItemClick,
    } = this.props;
    const { chartWidth, selected } = this.state;
    return (
      <Wrapper
        onScroll={({ nativeEvent }) => {
          if (this.isCloseToBottom(nativeEvent)) {
            if (this.procedureList.fetchMore) this.procedureList.fetchMore();
          }
        }}
        onLayout={this.onLayout}
        scrollEventThrottle={4000}
      >
        <Header totalProcedures={totalProcedures} votedProceduresCount={votedProceduresCount} />
        <PartyChart
          width={chartWidth + 36}
          chartData={chartData}
          onClick={this.onClick}
          selected={selected}
          showPercentage
        />
        <VoteResultNumbers>
          <VoteResult>
            <VoteResultCircleNumber>
              <VoteResultCircle color="#f5a623" />
              <VoteResultNumber>{chartData[selected].values[0].value}</VoteResultNumber>
            </VoteResultCircleNumber>
            <VoteResultLabel>Übereinstimmungen</VoteResultLabel>
          </VoteResult>
          <VoteResult>
            <VoteResultCircleNumber>
              <VoteResultCircle color="#b1b3b4" />
              <VoteResultNumber>{chartData[selected].values[1].value}</VoteResultNumber>
            </VoteResultCircleNumber>
            <VoteResultLabel>Differenzen</VoteResultLabel>
          </VoteResult>
        </VoteResultNumbers>
        <ChartNote>
          Hohe Übereinstimmungen Ihrer Stellungnahmen mit mehreren Parteien bedeuten nicht
          zwangsläufig eine inhaltliche Nähe dieser Parteien zueinander
        </ChartNote>
        <VotedProceduresList
          onItemClick={onProcedureListItemClick}
          ref={el => (this.procedureList = el)}
        />
      </Wrapper>
    );
  }
}

Fraktionen.propTypes = {
  chartData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  totalProcedures: PropTypes.number.isRequired,
  votedProceduresCount: PropTypes.number.isRequired,
  onProcedureListItemClick: PropTypes.func.isRequired,
};

export default Fraktionen;
