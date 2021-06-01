import React, {useState, useEffect, useRef} from 'react'
import { ScrollView, View, TouchableOpacity, Pressable, Text, StyleSheet, Dimensions } from 'react-native';
import Constants from 'expo-constants';
const { width } = Dimensions.get('window');
const Menu = (props) =>{
  const [selectedItem, setSelectedItem] = useState(1);
  const scrollRef = useRef();
  const years = ["","2016", "2017", "2018", "2019", "2020", "2021",""];
  // state = {
  //   index: 1,
  //   routes: [
  //     { key: 'first', title: '2020' },
  //     { key: 'second', title: '2021' }
  //   ],
  // };
    const onSelectedItem = (i)=>{
      if (i === 0 || i === years.length - 1){
        return;
      }
      scrollRef.current.scrollTo({
        x: (width/3 * (i-1)),
        animated: true    
      })
      setSelectedItem(i);
    }
    return (
      <ScrollView ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          alwaysBounceHorizontal={true}
          //contentContainerStyle={{flex: 1, justifyContent:'flex-start'}}
          style={styles.menu}>
            {
              years.map((item, i)=>(                
                <View key={i} style={[styles.menuItem, i===selectedItem?styles.menuItemActive:i<selectedItem?styles.menuItemLeft:styles.menuItemRight ]}>
                  <Pressable style={[styles.btn, i===selectedItem?styles.btnActive:i<selectedItem?styles.btnLeft:styles.btnRight]} 
                  onPress={()=>onSelectedItem(i)}
                  android_ripple={{color: 'green'}}>
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize:i===selectedItem?"15":"10"}}>{item} </Text>
                  </Pressable>
                  
                </View>
              ))
            }
          
        </ScrollView>        
    );  
}
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
    paddingLeft: 10,
    paddingRight: 10,
    //marginBottom: 4,
    //borderLeftWidth: 2,
    //borderLeftColor: 'blue',
    borderBottomWidth: 2,    
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
      alignSelf: 'stretch',
      marginBottom: 4      
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
export default Menu;