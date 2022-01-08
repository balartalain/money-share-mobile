import React, {useState, useEffect, useRef} from 'react'
import { ScrollView, View, Pressable, Text, StyleSheet, Dimensions } from 'react-native'
import Ripple from 'react-native-material-ripple'
import { useUserDataContextHook } from './UserDataContext'

const { width } = Dimensions.get('window')

const Menu = () =>{

    const {appState, changeYear} = useUserDataContextHook()
    const {selectedYear, years} = appState
    const [items, setItems] = useState([])  
    const scrollRef = useRef()
    // useEffect(()=>{  
    //     mountedRef.current = true
    //     setTimeout(()=> animateItemChanged(selectedItem), 500)
    //     return () => {
    //         mountedRef.current = false
    //     } 
    // }, [])
    useEffect(()=>{  
        const transformItems = (()=>{
            return years.map(item=>({
                item: parseInt(item),
                selected: parseInt(item) === selectedYear
            }))
        })()
        const items = [{item:null}, ...transformItems, {item:null}] 
        setItems(items)
    }, [years])

    useEffect(()=>{  
        if (items.length){
            const selectedItem = items.find(item=>item.selected).item
            setTimeout(()=> animateItemChanged(selectedItem), 500)
        }
    }, [items])

    const itemChanged = (_item)=>{
        const selectedItem = items.find(item=>item.selected).item
        if (_item === selectedItem)
            return     
        setItems(items.map(e=>({
            item: e.item,
            selected: e.item === _item
        })))
        animateItemChanged(_item)
        changeYear(_item)
      
    }

    const animateItemChanged = (_item)=>{ 
        const i = items.findIndex(e=>e.item === _item)
        scrollRef.current.scrollTo({
            x: (width/3 * (i-1)),
            animated: true    
        })
    } 
    if (items.length === 0){
        return null
    }
    const selectedItem = items.find(item=>item.selected).item
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