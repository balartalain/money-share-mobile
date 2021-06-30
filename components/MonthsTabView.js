import * as React from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions, StatusBar, TouchableOpacity, Animated} from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Constants } from 'expo';
import DayCard from './DayCard'
import {color, monthNames, dayOfWeek } from '../utils'
import shallowCompare from '../shallowEquals'

// This is our placeholder component for the tabs
// This will be rendered when a tab isn't loaded yet
// You could also customize it to render different content depending on the route
const LazyPlaceholder = ({ route }) => (
  <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>Loading {route.title}…</Text>
  </View>
);

export default class MonthsTabView extends React.Component {
  constructor(props){
    super(props);
    this._handleIndexChange = this._handleIndexChange.bind(this);
    this._addExpenseBtnPress = this._addExpenseBtnPress.bind(this);
    const tabs = [];
    monthNames.forEach((e, i)=>{
      tabs.push({key:i+1, title:monthNames[i]});
    })
    const selectedDate = new Date();
    this.state = {
      fadeAnim: new Animated.Value(1),
      index: props.index,
      routes: tabs,
      selectedDate: selectedDate,
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.index !== this.state.index) {
      this.setState({ index: nextProps.index });
    }
  }
  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.pokemons !== this.state.pokemons) {
  //     console.log('pokemons state has changed.')
  //   }
  // }
  
  shouldComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState);
 }
  fadeIn = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false
    }).start();
  };

  fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(this.state.fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false
    }).start();
  };
  _addExpenseBtnPress = () =>{
    this.props.navigation.navigate("AddExpense", {
      year: this.props.selectedYear,
      month: this.state.index,
      day: new Date().getDate()
    })
  }
  _changeExpenseView = ()=>{
    this.props.onChangeExpenseView();
  }
  _handleIndexChange = index => {
    //const _selectedDate = 
    console.log('index '+ index)
    this.state.selectedDate.setMonth(index);
    this.setState({ index, selectedDate: this.state.selectedDate });
    this.props.onSelectedMonth(index);
  }

  _renderLazyPlaceholder = ({ route }) => <LazyPlaceholder route={route} />;

  renderTabBar = props => (
    <TabBar   
      {...props}    
      scrollEnabled
      indicatorStyle={{ backgroundColor: 'white' }}
      style={{ backgroundColor: '#3EB489' }}
    />
  );
  
   renderScene = ({ route }) => {  
    if (Math.abs(this.state.index - this.state.routes.indexOf(route)) > 0) {
      return <View />;
    }
      const data = this.props.data[route.key] || {}
      return (            
          <View style={[styles.scene, { backgroundColor: '#F4F4F4' }]}>
            { Object.keys(data) ?
              ( 
              <View style={{flex:1}}>                
                <ScrollView style={{flex:1}}            
                  alwaysBounceVertical={true}
                  bouncesZoom={true}
                  //scrollEventThrottle={10}
                  // onMomentumScrollBegin = {()=>{
                  //   this.fadeOut();
                  // }}
                  
                  onMomentumScrollEnd = {(e)=>{
                    //this.fadeIn();
                  }}
                  onScrollBeginDrag={(e)=>{
                    //this.fadeOut();
                  }}
                > 
                {    
                  Object.keys(data).filter(day=> {                   
                    return Object.keys(data[day]).filter(time=>data[day][time].deleted!=="true").length > 0
                  })
                  .sort().reverse().map((day, i)=>(                                                            
                      <DayCard 
                        key={day+'-'+i}
                        day={day} 
                        month={this.state.index} 
                        selectedYear={this.props.selectedYear} 
                        data={data[day]}
                        itemsToDelete={this.props.itemsToDelete}
                        onPress={(day, time)=>this.props.onPress(this.state.index, day, time)}
                        onLongPress={(day, time)=>this.props.onLongPress(this.state.index, day, time)}
                      />)                 
                  )
                }
                </ScrollView>
              </View>
              ):<View />
            }
            <Animated.View style={{opacity: this.state.fadeAnim}}>
              { Object.keys(this.props.itemsToDelete).length === 0 &&
                <>
                <TouchableOpacity style={styles.fab}
                    onPress={this._addExpenseBtnPress} >
                  <Text style={styles.fabIcon}><MaterialCommunityIcons name="plus" size={30} color="white" /></Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.fab, {left: 30}]}
                  onPress={this._changeExpenseView} >
                  <Text style={styles.fabIcon}><MaterialCommunityIcons name="format-list-bulleted" size={30} color="white" /></Text>
                </TouchableOpacity>
                </>
              }
            </Animated.View>
         </View>        
      )
  };

  render() {
    console.log('Month tab view')
    return (
      <TabView
        //lazy
        tabBarPosition='bottom' 
        renderTabBar={this.renderTabBar}
        navigationState={this.state}
        renderScene={this.renderScene}
        //renderLazyPlaceholder={this._renderLazyPlaceholder}
        onIndexChange={this._handleIndexChange}
        initialLayout={{ width: Dimensions.get('window').width }}
        style={styles.container}
      />
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 25,
    backgroundColor: color.primaryGreen,
    borderRadius: 28,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 30,
    color: 'white',
  }
});

// moment.monthsShort()
// Array.apply(0, Array(12)).map(function(_,i){return moment().month(i).format('MMM')})
// const d = new Date()
// monthNames[d.getMonth()]


// moment.locale('es');
// console.log(moment(Date.now()).fromNow()); 
// console.log(moment(Date.now())); 
// console.log(moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a'));

// var options = {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
// var prnDt = 'Printed on ' + new Date().toLocaleTimeString('en-us', options);
