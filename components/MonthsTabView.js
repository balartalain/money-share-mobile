import * as React from 'react'
import { View, ScrollView, Text, StyleSheet, Dimensions, TouchableOpacity, Animated} from 'react-native'
import { TabView, TabBar } from 'react-native-tab-view'
import { View as MotiView, AnimatePresence } from 'moti'
import { UserDataContext } from './UserDataContext'
import { AntDesign } from '@expo/vector-icons'
import Ripple from 'react-native-material-ripple'
import DayCard from './DayCard'
import {color} from '../utils'
import DateUtils from '../DateUtils'
import shallowCompare from '../shallowEquals'

// This is our placeholder component for the tabs
// This will be rendered when a tab isn't loaded yet
// You could also customize it to render different content depending on the route
const LazyPlaceholder = ({ route }) => (
    <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading {route.title}…</Text>
    </View>
)

export default class MonthsTabView extends React.Component {
    constructor(props){
        super(props)
        this._handleIndexChange = this._handleIndexChange.bind(this)
        this._addExpenseBtnPress = this._addExpenseBtnPress.bind(this)
        this._changeExpenseView = this._changeExpenseView.bind(this)
        this.renderScene = this.renderScene.bind(this)
    
        const tabs = []
        DateUtils.MONTH_NAMES.forEach((month, i)=>{
            tabs.push({key:i+1, title:month})
        })
        this.state = {
            index: props.index,
            routes: tabs
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.index !== this.state.index) {
            this.setState({ index: nextProps.index })
        }
    }
    // componentDidUpdate(prevProps, prevState) {
    //   if (prevState.pokemons !== this.state.pokemons) {
    //     console.log('pokemons state has changed.')
    //   }
    // }
  
    shouldComponentUpdate(nextProps, nextState){
        return shallowCompare(this, nextProps, nextState)
    }

    _handleIndexChange(index){
        this.context.setAppState({...this.context.appState, selectedMonth: index})
        this.setState({ index })
    }

    _renderLazyPlaceholder({ route }){
        return <LazyPlaceholder route={route} />
    }

    renderTabBar(props) {
        return <TabBar   
            {...props}    
            scrollEnabled
            indicatorStyle={{ backgroundColor: 'white' }}
            style={{ backgroundColor: '#3EB489' }}
        />
    }
    _addExpenseBtnPress(){
        this.props.navigation.navigate('AddExpense', {
            year: this.context.appState.selectedYear,
            month: this.state.index,
            day: new Date().getDate()
        })
    }
    _changeExpenseView(){
        this.props.onChangeExpenseView()
    }
    renderScene({ route }){  
        if (Math.abs(this.state.index - this.state.routes.indexOf(route)) > 0) {
            return <View />
        }    
        const {appState} = this.context
        const {userData, selectedYear} = appState
        const m = route.key < 10 ? '0'+route.key:String(route.key)
        const data = userData ?.[selectedYear] ?.[m] || userData ?.[selectedYear] ?.[route.key] || {}        
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
                                        return Object.keys(data[day]).filter(time=>data[day][time].deleted!=='true').length > 0
                                    })
                                        .sort().reverse().map((day, i)=>(                                                            
                                            <DayCard 
                                                key={day+'-'+i}
                                                day={day} 
                                                month={this.state.index}                     
                                            />)                 
                                        )
                                }
                            </ScrollView>
                        </View>
                    ):<View />
                }
                <View>
                    {this.context.markedItemsToDelete.length === 0 && selectedYear > 2021 &&
                    
                        <View>
                            <Ripple style={styles.fab}
                                onPress={this._addExpenseBtnPress} >
                                <AntDesign name="plus" size={24} color="white" />
                            </Ripple>
                            <Ripple style={[styles.fab, {left: 30}]}
                                onPress={this._changeExpenseView} >
                                <AntDesign name="bars" size={24} color="white" />
                            </Ripple>
                        </View>
                    }
                </View>
            </View>        
        )
    }

    render() {
        console.log('Month Tab View.js')
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
        )
    }
}
MonthsTabView.contextType = UserDataContext
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
})