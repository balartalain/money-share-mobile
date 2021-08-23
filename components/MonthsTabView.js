import React from 'react'
import { View, ScrollView, Text, StyleSheet, Dimensions, TouchableOpacity, Animated} from 'react-native'
import { TabView, TabBar } from 'react-native-tab-view'
import { View as MotiView, AnimatePresence } from 'moti'
import { Context } from '../Store'
import { AntDesign } from '@expo/vector-icons'
import Ripple from 'react-native-material-ripple'
import DayCard from './DayCard'
import {color, toBoolean} from '../utils'
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
const Data = ({data})=>{
    return (
        <>
            { Object.keys(data) ?
                (
                    <View style={{flex:1}}>                
                        <ScrollView style={{flex:1}}            
                            alwaysBounceVertical={true}
                            bouncesZoom={true}                            
                        > 
                            {    
                                Object.keys(data).filter(day=> {                   
                                    return Object.keys(data[day]).filter(created=>!toBoolean(data[day][created].deleted)).length > 0
                                })
                                    .sort().reverse().map((day, i)=>(                                                            
                                        <DayCard 
                                            key={day+'-'+i}
                                            day={day}                   
                                        />)                 
                                    )
                            }
                        </ScrollView>
                    </View>
                ):<View />
            }
        </>
    )
}
const  renderTabBar = (props)=>{
    return <TabBar   
        {...props}    
        scrollEnabled
        indicatorStyle={{ backgroundColor: 'white' }}
        style={{ backgroundColor: '#3EB489' }}
        onTabPress={({ route, preventDefault }) => {
            if (route.key === 'route-16') {
                preventDefault()
        
                // Do something else
            }
        }}
    />
}
const routes = DateUtils.MONTH_NAMES.map((month, i)=>({key:`route-${i}`, title:month}))

export default function MonthsTabView(props) {
    const [globalState, dispatch] = React.useContext(Context)
    const index = globalState.currentMonth - 1 

    const _handleIndexChange = (index)=>{
        dispatch({type: 'SET_CURRENT_MONTH', month: index+1})
    }
    const _addExpenseBtnPress = ()=>{
        props.navigation.navigate('AddExpense')
    }
    const _changeExpenseView = ()=>{
        props.onChangeExpenseView()
    }
    const renderScene = ({ route })=>{  
        if (Math.abs(index - routes.indexOf(route)) > 0) {
            return <View />
        }    
        const data = globalState.data ?.[globalState.currentYear] ?.[globalState.currentMonth] || {}
        return (            
            <View style={[styles.scene, { backgroundColor: '#F4F4F4' }]}>
                <Data data={data}/>
                <View>
                    {globalState.itemsToDelete.length === 0 &&                     
                        <View>
                            <Ripple style={styles.fab}
                                onPress={_addExpenseBtnPress} >
                                <AntDesign name="plus" size={24} color="white" />
                            </Ripple>
                            <Ripple style={[styles.fab, {left: 30}]}
                                onPress={_changeExpenseView} >
                                <AntDesign name="bars" size={24} color="white" />
                            </Ripple>
                        </View>
                    }
                </View>
            </View>        
        )
    }
    console.log('Month Tab View.js')
        
    return (
        <TabView
            //lazy
            tabBarPosition='bottom' 
            renderTabBar={renderTabBar}
            navigationState={{index, routes }}
            renderScene={renderScene}       
            swipeEnabled = { true }
            onIndexChange={_handleIndexChange}
            initialLayout={{ width: Dimensions.get('window').width }}
            style={styles.container}
        />
    )    
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
})