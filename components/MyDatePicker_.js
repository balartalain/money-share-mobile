import React, {useState} from 'react';
import {View, Button, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { color } from '../utils'

const MyDatePicker = () => {
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View>
      <View>
        <Button onPress={showDatepicker} title="Show date picker!" />
      </View>
      <View>
        <Button onPress={showTimepicker} title="Show time picker!" />
      </View>
      {show && (
        <DateTimePicker style={{backgroundColor: "green"}}
          locale={'es'}
          testID="dateTimePicker"
          minimumDate={new Date(2021, 5, 1)} 
          maximumDate={new Date(2021, 5, 30)}
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          placeHolderText="Select date"
          textStyle={{ color: 'green', }}
          placeHolderTextStyle={{ color: '#d3d3d3' }}

          onChange={onChange}
        />
      )}
    </View>
  );
};
export default MyDatePicker;