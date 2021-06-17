import React, {useState, useEffect, useRef, memo} from 'react'
import { ScrollView, View, TouchableOpacity, Pressable, Text, StyleSheet, Dimensions } from 'react-native';
import Constants from 'expo-constants';
import {equalsIntegers} from '../utils';
const { width } = Dimensions.get('window');

const Menu = (props) =>{
    const [items, setItems] = useState(["", ...props.items, ""]) 
    const [selectedItem, setSelectedItem] = useState(props.selectedItem);
    const [selectedIndex, setSeletedIndex] = useState(-1);    
    const scrollRef = useRef();

    useEffect(()=>{  
      const index = items.findIndex((e)=>equalsIntegers(e, selectedItem));  
      setSeletedIndex(index);
      setSelectedItem(props.selectedItem)
      setTimeout(()=> animateItemChanged(props.selectedItem, index), 1000);
    }, [])
    const itemChanged = (item, i)=>{
      if (i === 0 || i === items.length - 1 || item===selectedItem){
        return;
      }
      //animateItemChanged(item, i);
      //props.onSelectedItem(item);
      animateItemChanged(item, i);
      setSelectedItem(item)
      setSeletedIndex(i);
      props.onSelectedItem(item)
      //setTimeout(()=> props.onSelectedItem(item), 400);
      
    }

    const animateItemChanged = (item, i)=>{     
      if (i === 0 || i === items.length - 1){
        return;
      }
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
              items.map((item, i)=>(                
                <View key={i} style={[styles.menuItem, equalsIntegers(item,selectedItem) && styles.menuItemActive]}>
                  <Pressable style={[styles.btn, equalsIntegers(item, selectedItem)?styles.btnActive:(i<selectedIndex)?styles.btnLeft:styles.btnRight]} 
                  onPress={()=>itemChanged(item, i)}
                  android_ripple={{color: '#2F5233' }}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>{item}</Text>
                  </Pressable>
                  
                </View>
              ))
            }
          
        </ScrollView>        
    );  
}
export default React.memo(Menu);

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
    //marginLeft: 20,
    //paddingVertical: 10,
    //paddingLeft: 10,
    //paddingRight: 10,
    //marginBottom: 4,
    //borderLeftWidth: 2,
    //borderLeftColor: 'blue',
    borderBottomWidth: 3,    
    borderBottomColor: 'transparent',
    //marginRight: 20,
    //marginLeft: 20,
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
});