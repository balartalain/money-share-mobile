import React from 'react'
import { View, StyleSheet, Dimensions, FlatList} from 'react-native'
import { TabView, TabBar } from 'react-native-tab-view'
import PropTypes from 'prop-types'
import { useNavigation } from '@react-navigation/native' 
import { Context } from '../Store'
import { AntDesign } from '@expo/vector-icons'
import Ripple from 'react-native-material-ripple'
import DayCard from './DayCard'
import {color} from '../utils'
import DateUtils from '../DateUtils'
import useWhyDidYouUpdate from '../hooks/useWhyDidYouUpdate'

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
const renderItem = ({item}) => {
    return <DayCard day={item} />               
}
const keyExtractor=(item) =>{
    return item.id.toString()
} 
const routes = DateUtils.MONTH_NAMES.map((month, i)=>({key:`route-${i}`, title:month}))

const MonthsTabView = (props)=> {
    const navigation = useNavigation()
    const [globalState, dispatch] = React.useContext(Context)
    useWhyDidYouUpdate('MonthsTabView', props, globalState)
    const index = globalState.currentMonth - 1 

    const _handleIndexChange = (index)=>{
        dispatch({type: 'SET_CURRENT_MONTH', month: index+1})
    }
    const _addExpenseBtnPress = ()=>{
        navigation.navigate('AddExpense')
    }
    const _changeExpenseView = ()=>{
        props.onChangeExpenseView()
    }
    
    const renderScene =  ({ route })=>{
        if (Math.abs(index - routes.indexOf(route)) > 0) {
            return <View />
        }   
        console.log('Render Scene '+ index)
        let data = globalState.data ?.[globalState.currentYear] ?.[globalState.currentMonth] ?.days || []

        return (            
            <View style={[styles.scene, { backgroundColor: '#F4F4F4' }]}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                />
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
    //return React.useMemo(()=>{   
    console.log('Month Tab View.js '+ globalState.currentMonth)
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
    )/*},[globalState.data, globalState.currentMonth, globalState.currentYear, globalState.currenUser])*/
}
MonthsTabView.propTypes = {
    onChangeExpenseView: PropTypes.func
}
export default MonthsTabView
//export default React.memo(MonthsTabView)
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