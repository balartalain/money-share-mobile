import React, {useState, useEffect, useRef, useContext, memo} from 'react'
import { ScrollView, View, TouchableOpacity, Pressable, Text, StyleSheet, Dimensions } from 'react-native'
import PropTypes from 'prop-types'
import { DataUserContext, useDataUserContextHook } from './DataUserContext'
import Constants from 'expo-constants'
import {equalsIntegers} from '../utils'
import DateUtils from '../DateUtils'
const { width } = Dimensions.get('window')

const Menu = () =>{

    //const {appState, setAppState} = useContext(DataUserContext)
    const {appState, changeYear} = useDataUserContextHook()
    const {selectedYear, years} = appState

    const transformItems = ()=>{
        return years.map(item=>({
            item: parseInt(item),
            selected: parseInt(item) === selectedYear
        }))
    }
    const [items, setItems] = useState([{item:null}, ...transformItems(), {item:null}])  
    const scrollRef = useRef()
    const mountedRef = useRef(false)
    const selectedItem = items.find(item=>item.selected).item
    useEffect(()=>{  
        mountedRef.current = true
        // const index = items.findIndex((e)=>equalsIntegers(e, selectedItem))  
        // setSeletedIndex(index)
        // setSelectedItem(props.selectedItem)
        setTimeout(()=> animateItemChanged(selectedItem), 500)
        //animateItemChanged(DateUtils.CURRENT_YEAR)
        return () => {
            mountedRef.current = false
        } 
    }, [])
    const itemChanged = (_item)=>{
        if (_item === selectedItem)
            return
        //animateItemChanged(item, i);
        //props.onSelectedItem(item);        
        setItems(items.map(e=>({
            item: e.item,
            selected: e.item === _item
        })))
        animateItemChanged(_item)
        changeYear(_item)
        //setAppState({ ...appState, selectedYear: _item})
        //props.onSelectedItem(item)
        //setTimeout(()=> props.onSelectedItem(item), 400);
      
    }

    const animateItemChanged = (_item)=>{ 
        if (!mountedRef.current) return    
        // if (i === 0 || i === items.length - 1){
        //     return
        // }  
        const i = items.findIndex(e=>e.item === _item)
     
        //console.log({item, i})
        scrollRef.current.scrollTo({
            x: (width/3 * (i-1)),
            animated: true    
        })
    } 
    return (
        <ScrollView ref={scrollRef}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            alwaysBounceHorizontal={true}
            //contentContainerStyle={{flex: 1, justifyContent:'flex-start'}}
            style={styles.menu}>
            {
              
                items.map((e, i)=>(                
                    <View key={i} style={[styles.menuItem, e.selected && styles.menuItemActive]}>
                        { (i > 0 && i < items.length - 1)  && 
                        <Pressable style={[styles.btn, e.selected?styles.btnActive:(e.item<selectedItem)?styles.btnLeft:styles.btnRight]} 
                            onPress={()=>itemChanged(e.item)}
                            android_ripple={{color: '#2F5233' }}>
                            <Text style={{color: 'white', fontWeight: 'bold'}}>{e.item}</Text>
                        </Pressable>
                        }
                    </View>
                ))
            }
          
        </ScrollView>        
    )  
}

export default React.memo(Menu)

const styles = StyleSheet.create({    
    menu: {    
    //paddingLeft:10,
    //paddingRight:10,
        backgroundColor: '#3EB489',    
        flexGrow: 0      
    },
    menuItem: {
        flex: 1,
        //flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 3,    
        borderBottomColor: 'transparent',
        textAlign: 'center',
        width: width/3
    },
    menuItemActive:{
        borderBottomColor: 'orange',
        alignItems: 'center',
    },
    btn:{
        flex:1, 
        justifyContent: 'center',
        alignItems:'flex-start',      
        paddingVertical: 20,
        paddingHorizontal: 10,
        alignSelf: 'stretch',      
    },
    btnActive:{
        alignItems: 'center',      
    },
    btnLeft:{
        alignItems: 'flex-start',            
    },
    btnRight:{
        alignItems: 'flex-end',            
    }
})