import * as React from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions, StatusBar, TouchableOpacity, Animated} from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Constants } from 'expo';
import {color, monthNames } from '../utils'

// This is our placeholder component for the tabs
// This will be rendered when a tab isn't loaded yet
// You could also customize it to render different content depending on the route
// const LazyPlaceholder = ({ route }) => (
//   <View style={styles.scene}>
//     <Text>Loading {route.title}…</Text>
//   </View>
// );
const InnerCard = (props)=>{
  return (
        <View style={{
            backgroundColor: 'white', 
            flex:0,           
            flexDirection: 'row',
            paddingTop: 10,
            paddingBottom: 10,
            justifyContent:'space-around',
            borderLeftWidth: 5,
            borderLeftColor: `${props.amount < 0?'red': color.primaryGreen}`,
            marginHorizontal: 10,
            marginBottom: 10,
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
        }}>    
          <View style={{flex:1, marginLeft: 10}}>      
            <Text>{props.category}</Text>
            <Text style={{fontSize: 12}}>{props.comment}</Text>
          </View>
          <View style={{flex:1,marginRight:10}}><Text style={{textAlign: 'right', color:`${props.amount < 0?'red': color.primaryGreen}`}}>{props.amount} {props.currency}</Text></View>
        </View>
  );
}
const DayCard = (props)=> {
  console.log(props.data)
  console.log( Object.keys(props.data));
  return (
    <View style={{
      flex:0,
      flexDirection:'row', 
      marginTop: 10,
    }}>
      <View style={{flex:1, 
      paddingTop: 2, 
      alignItems: 'center',
      justifyContent: 'flex-start'
    
      }}>
        <Text style={{ alignItems: 'center'}}>{props.day}</Text>
        <Text style={{alignItems: 'center'}}>{props.month}</Text>
      </View>
      <View style={{flex:8,  flexDirection: 'column',
        marginBottom: 10,
      }}>
        {
          Object.keys(props.data).map((e)=>(
            <InnerCard key={e} 
              amount={props.data[e].amount} 
              category={props.data[e].category} 
              comment={props.data[e].comment}
              currency={props.data[e].currency}
            />     
          ))
        }     
      </View>           
    </View>
  );
}
const TotalAmount = ()=>{
  return (
    <View style={{flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: 'white',
      paddingVertical: 10
    }}>
    <View><Text style={{fontSize: 18,  fontWeight: 'bold', color: color.primaryGreen}}>10000.00 USD</Text></View>
    <View><Text style={{fontSize: 18,  fontWeight: 'bold', color: color.primaryGreen}}>100000.00 CUP</Text></View>
  </View>
  )
}
export default class MonthsTabView extends React.Component {
  constructor(props){
    super(props);
    const tabs = [];
    monthNames.forEach((e, i)=>{
      tabs.push({key:i+1, title:monthNames[i]});
    })
    this.state = {
      fadeAnim: new Animated.Value(1),
      index: this.props.index,
      routes: tabs
    }

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
  _handleIndexChange = index => this.setState({ index });

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
     if (this.props.data[route.key]){
     const data = this.props.data[route.key];
      return (        
          <View style={[styles.scene, { backgroundColor: '#F4F4F4' }]}
          >
            <TotalAmount />
            <ScrollView style={{flex:1}}            
              alwaysBounceVertical={true}
              bouncesZoom={true}
              //scrollEventThrottle={10}
              // onMomentumScrollBegin = {()=>{
              //   this.fadeOut();
              // }}
              
              onMomentumScrollEnd = {(e)=>{
                this.fadeIn();
              }}
              onScrollBeginDrag={(e)=>{
                this.fadeOut();
              }}
            > 
            {     
            Object.keys(data).map(day=>(
              <DayCard key={day} day={day.length === 1?("0"+day):day} month={monthNames[route.key-1].substring(0, 3)} data={data[day]}/>
              ))
            }
            </ScrollView>
            <Animated.View style={{opacity: this.state.fadeAnim}}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate("AddExpensive")} style={[styles.fab, {right: 20}]}>
                <Text><MaterialCommunityIcons name="plus" size={30} color="white" /></Text>
              </TouchableOpacity>
            
            <TouchableOpacity onPress={() => alert('FAB clicked')} style={[styles.fab, {left: 20}]}>
              <Text><MaterialCommunityIcons name="delete-sweep" size={30} color="white" /></Text>
            </TouchableOpacity>
            </Animated.View>
          </View>
        
      )
     }
     else{
       return <View />
     }
  };

  render() {
    return (
      <TabView
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
    bottom: 20,
    backgroundColor: color.primaryGreen,
    borderRadius: 30,
    elevation: 22,
    
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
