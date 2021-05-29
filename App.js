import * as React from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import MonthsTabView from './components/MonthsTabView';

const FirstRoute = () => (
  <MonthsTabView />
);

const SecondRoute = () => (
  <MonthsTabView />
);

const renderTabBar = props => (
  <TabBar   
    {...props}    
    scrollEnabled
    bounces={true}
    indicatorStyle={{ backgroundColor: 'white' }}
    style={{ backgroundColor: 'pink' }}
    tabStyle={{width:Dimensions.get('window').width}}
  />
);

export default class App extends React.Component {
  state = {
    index: 1,
    routes: [
      { key: 'first', title: '2020' },
      { key: 'second', title: '2021' }
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderLazyPlaceholder = ({ route }) => <LazyPlaceholder route={route} />;

  render() {
    return (
      <TabView
        renderTabBar={renderTabBar}
        scrollEnabled={true}
        swipeEnabled={false}
        navigationState={this.state}
        renderScene={SceneMap({
          first: FirstRoute,
          second: SecondRoute
        })}
        onIndexChange={this._handleIndexChange}
        initialLayout={{ width: Dimensions.get('window').width }}
        style={styles.container}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
  },
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});