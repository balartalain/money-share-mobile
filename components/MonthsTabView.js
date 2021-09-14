import React from 'react'
import { View, StyleSheet, Dimensions, FlatList} from 'react-native'
import { TabView, TabBar } from 'react-native-tab-view'
import PropTypes from 'prop-types'
import { Context } from '../Store'
import DayCard from './DayCard'
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

const InnerMonthsTabView =React.memo(({ monthData, currentYear, currentMonth, itemsToDelete, onIndexChange, onChangeExpenseView })=> {
    //const [index, setIndex] = React.useState(currentMonth - 1)
    useWhyDidYouUpdate('Inner MonthsTabView', { currentYear, currentMonth, itemsToDelete, onIndexChange, onChangeExpenseView })
    const index = currentMonth - 1 

    const _handleIndexChange = (_index)=>{
        //setIndex(_index)
        onIndexChange(_index)
    }
    
    const renderScene =  ({ route })=>{
        if (Math.abs(index - routes.indexOf(route)) > 0) {
            return <View />
        }   
        console.log('Render Scene '+ index)
        let data = monthData || []
        return (            
            <View style={[styles.scene, { backgroundColor: '#F4F4F4' }]}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                />                
            </View>        
        )
    }
    //return React.useMemo(()=>{   
    console.log('Inner Month Tab View '+ currentMonth)
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
        />
    )/*},[globalState.data, globalState.currentMonth, globalState.currentYear, globalState.currenUser])*/
}, areEqual)
function areEqual(prevProps, nextProps) {    
    return prevProps.monthData === nextProps.monthData    
}
InnerMonthsTabView.displayName = 'InnerMonthsTabView'
InnerMonthsTabView.propTypes = {
    monthData: PropTypes.array, 
    currentYear: PropTypes.number, 
    currentMonth: PropTypes.number, 
    itemsToDelete: PropTypes.array, 
    onIndexChange: PropTypes.func,
    onChangeExpenseView: PropTypes.func
}
const MonthsTabView = ({onChangeExpenseView})=>{
    const [globalState, dispatch] = React.useContext(Context)
    const {data, currentYear, currentMonth, itemsToDelete} = globalState

    const onIndexChange = React.useCallback((index)=>{
        dispatch({type: 'SET_CURRENT_MONTH', month: index+1})
    },[currentYear, currentMonth])
    const monthData = data ?.[currentYear] ?.[currentMonth] ?.days || []
    return <InnerMonthsTabView 
        monthData={monthData} 
        currentYear={currentYear} 
        currentMonth={currentMonth} 
        itemsToDelete={itemsToDelete}  
        onChangeExpenseView={onChangeExpenseView}  
        onIndexChange={onIndexChange} />
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
    }
})