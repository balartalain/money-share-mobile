import React, {useState} from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity} from "react-native";
import { Button } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import {color, monthNames, dayOfWeek } from '../utils'


const AddExpense = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDatePicker, setshowDatePicker] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState();
  const onChange = (event, selectedDate) => {
    //const currentDate = selectedDate || currentDate;
    setshowDatePicker(Platform.OS === 'ios');
    setCurrentDate(selectedDate || currentDate);
  };

  return (
    <View style={{flex:1}}>
      <View style={{flex:1}}>
        <View style={{flex:0, alignItems:'center'}}>
          <TouchableOpacity style={{paddingVertical:15}} onPress={()=>setshowDatePicker(true)} >
            <Text>{`${dayOfWeek[currentDate.getDay()]}, ${currentDate.getDate()} ${monthNames[currentDate.getMonth()]}`}</Text>
            {showDatePicker && (
              <DateTimePicker style={{backgroundColor: "green"}}
                locale={'es'}
                testID="dateTimePicker"
                minimumDate={new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)} 
                maximumDate={new Date(currentDate.getFullYear(), currentDate.getMonth()+ 1, 0)}
                value={currentDate}
                //mode='date'
                is24Hour={true}
                display="default"
                placeHolderText="Select date"
                textStyle={{ color: 'green', }}
                placeHolderTextStyle={{ color: '#d3d3d3' }}
      
                onChange={onChange}
              />
            )}
          </TouchableOpacity>
        </View>
        <TextInput style={[styles.field, {
                    borderTopWidth: 1,
                    borderTopColor: 'rgb(216, 216, 216)'  
        }]} placeholder='Cantidad' />
        <TextInput style={styles.field} placeholder='Concepto' />
        <TextInput style={styles.field} placeholder='Comentario' />
        <View style={{
          paddingVertical: 5,
          paddingLeft: 10,
          borderWidth: 0,
          borderBottomWidth: 1,
          borderBottomColor: 'rgb(216, 216, 216)'  
        }}>
          <Picker 
            dropdownIconColor={color.primaryGreen}
            selectedValue={selectedCurrency}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedCurrency(itemValue)
            }>
              {/* // https://github.com/react-native-picker/picker */} 
            <Picker.Item label="USD" value="usd" />
            <Picker.Item label="CUP" value="cup" />
          </Picker> 
        </View>
      </View>
      <View style={{flex:0}}>
      <Button title="Aceptar" 
        buttonStyle={{
          backgroundColor:'red',
          paddingVertical: 15
        }}
      />
      <Button title="Cancelar" type='clear' 
        buttonStyle={{
          paddingVertical: 15
        }}
      />
      </View>
    </View>
  );
};
export default AddExpense; 
const styles = StyleSheet.create({    
  field: {    
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(216, 216, 216)'    
  },
});