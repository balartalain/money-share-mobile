import React, {useState, useEffect, useRef, useContext, useCallback} from 'react'
import { ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native'
import Ripple from 'react-native-material-ripple'
import { Context } from '../Store'

const { width } = Dimensions.get('window')
const transformItems = (years, currentYear)=>{
    return years.map(item=>({
        item: parseInt(item),
        selected: parseInt(item) === currentYear 
    }))
}
export const Menu1 = ()=>(
    <View><Text>ABC</Text></View>
)

const Menu = () =>{
    const [state, distpatch] = useContext(Context)
    //    const {appState, changeYear} = useUserDataContextHook()
    //    const {selectedYear, years} = appState
    const {years, currentYear} = state
    const [items, setItems] = useState([{item:null}, ...transformItems(years, currentYear), {item:null}])  
    const scrollRef = useRef()
    const mountedRef = useRef(false)
    const selectedItem = items.find(item=>item.selected).item
    useEffect(()=>{  
        mountedRef.current = true
        setTimeout(()=> animateItemChanged(selectedItem), 500)
        // animateItemChanged()
        return () => {
            mountedRef.current = false
        } 
    }, [])
    const itemChanged = useCallback((_item)=>{
        if (_item === selectedItem)
            return     
        setItems(items.map(e=>({
            item: e.item,
            selected: e.item === _item
        })))
        animateItemChanged(_item)
        distpatch({type:'SET_CURRENT_YEAR', year: _item})
      
    }, [state.currentYear])

    const animateItemChanged = (_item)=>{ 
        if (!mountedRef.current) return    
        const i = items.findIndex(e=>e.item === _item)
        scrollRef.current.scrollTo({
            x: (width/3 * (i-1)),
            animated: true    
        })
    } 
    const screenHeight = Dimensions.get('screen').height
    const windowHeight = Dimensions.get('window').height
    console.log('screenHeight '+screenHeight)
    console.log('windowHeight '+windowHeight)
    
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
                            <Ripple style={[styles.btn, e.selected?styles.btnActive:(e.item<selectedItem)?styles.btnLeft:styles.btnRight]} 
                                onPress={()=>itemChanged(e.item)}
                            >
                                <Text style={{color: 'white', fontWeight: 'bold'}}>{e.item}</Text>
                            </Ripple>
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