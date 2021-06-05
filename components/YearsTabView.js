import * as React from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import MonthsTabView from './MonthsTabView';

const getFakeYears = ()=>{
  return {
    "2022": true, "2021": true
  }
}
const getFakeYearData = (year) =>{
  return data[year];
}
const FirstRoute = (props) => {
  return (
    
    <View>
      { props.data && Object.keys(props.data).map(e => (
        <Text key={e}>{e}</Text>
      ))   
      }   
      {!props.data &&
      <Text >No data</Text>
      }
    </View>
    
  );
  // <MonthsTabView />
  }

const SecondRoute = () => (
  <MonthsTabView />
);

const renderTabBar = props => (
  <TabBar   
    {...props}    
    scrollEnabled
    bounces={true}
    indicatorStyle={{ backgroundColor: 'white' }}
    style={{ backgroundColor: '#3EB489' }}
    tabStyle={{width:'auto'}}
    //tabStyle={{width:Dimensions.get('window').width}}
  />
);
const  renderScene = ({ route }) => {
  return route.selected?<FirstRoute data={route.data} />: <View />;
  // return <FirstRoute data={route.data} />;
  // switch (route.key) {
  //   case 'first':
  //     return <FirstRoute foo={this.props.foo} />;
  //   case 'second':
  //     return <SecondRoute />;
  //   default:
  //     return null;
  // }
};
export default class YearsTab extends React.Component {
  state = {
    index: 0,
    // routes: [],
     routes: [
       { key: '2021', title: '' }
     ],
  };
  componentDidMount(){
    const data = getFakeYears();
    let routes = [];
    Object.keys(data).forEach((e, i)=>{
      routes.push({
        key: e, 
        title: e, 
        data: getFakeYearData(e),
        selected: i === this.state.index
      });
    });
    this.setState({routes});
  }
  _handleIndexChange = index => {
    this.setState({ index });
    console.log(index);
  }

  _renderLazyPlaceholder = ({ route }) => <LazyPlaceholder route={route} />;

  render() {
    return (
      <TabView
        renderTabBar={renderTabBar}
        scrollEnabled={true}
        swipeEnabled={false}
        navigationState={this.state}
        renderScene={renderScene}
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