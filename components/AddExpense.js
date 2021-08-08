import React, {useState, useContext} from 'react'
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Platform} from 'react-native'
import PropTypes from 'prop-types'
import { Button } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker'
import {Picker} from '@react-native-picker/picker'
import {color} from '../utils'
import { useUserDataContextHook } from './UserDataContext'
import DateUtils from '../DateUtils'
import { OverlayContext } from './OverlayContext'

const AddExpense = ({navigation, route}) => {
    const {params} = route
    const [currentDate, setCurrentDate] = useState(new Date(params.year, params.month, params.day))
    const [showDatePicker, setshowDatePicker] = useState(false)
    const [selectedCurrency, setSelectedCurrency] = useState('CUP')
    const [amount, setAmount] = useState()
    const [concept, setConcept] = useState()
    const [comment, setComment] = useState()
    const {showOverlay, hideOverlay} = useContext(OverlayContext)
    const {addExpense} = useUserDataContextHook()

    const onChange = (event, selectedDate) => {
    //const currentDate = selectedDate || currentDate;
        setshowDatePicker(Platform.OS === 'ios')
        setCurrentDate(selectedDate || currentDate)
    }
    const okButtonPressed = async()=>{
        try{
            if (isNaN(amount)){
                throw new Error('Cantidad no válida')
            }
            if (!concept  || concept.trim()===''){
                throw new Error('Tiene que introducir un concepto de gasto')
            }
            const created = Date.now()
            const newExpense = {
                year: currentDate.getFullYear(),
                month: currentDate.getMonth()+1, //("0" + (currentDate.getMonth()+1)).slice(-2),
                day: ('0' + currentDate.getDate()).slice(-2),
                created: created,
                updated: created,
                amount: amount,
                concept: concept,
                comment: comment,
                currency: selectedCurrency        
            }
            showOverlay('Guardando...')    
            await addExpense(newExpense)
            hideOverlay(false)
            navigation.navigate('Home', { newExpense })
        }
        catch(err){
            hideOverlay(false)
            alert(err)
        }
    }

    return (
        <View style={{flex:1}}>
            <View style={{flex:1}}>
                <View style={{flex:0, alignItems:'center'}}>
                    <TouchableOpacity style={{paddingVertical:15}} onPress={()=>setshowDatePicker(true)} >
                        <Text>{`${DateUtils.DAYS_OF_WEEK[currentDate.getDay()]}, ${currentDate.getDate()} ${DateUtils.MONTH_NAMES[currentDate.getMonth()]}`}</Text>
                        {showDatePicker && (
                            <DateTimePicker style={{backgroundColor: 'green'}}
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
                }]} placeholder='Cantidad' 
                onChangeText={(text) => setAmount(parseFloat(text)) }  
                />
                <TextInput style={styles.field} placeholder='Concepto'
                    onChangeText={(text) => setConcept(text) }
                />
                <TextInput style={styles.field} placeholder='Comentario' 
                    onChangeText={(text) => setComment(text) }
                />
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
                        onValueChange={(itemValue) =>
                            setSelectedCurrency(itemValue)
                        }>
                        {/* // https://github.com/react-native-picker/picker */} 
                        <Picker.Item label="USD" value="USD" />
                        <Picker.Item label="CUP" value="CUP" />
                    </Picker> 
                </View>
            </View>
            <View style={{flex:0}}>
                <Button title="Aceptar" 
                    onPress={okButtonPressed}
                    buttonStyle={{
                        backgroundColor:'red',
                        paddingVertical: 15
                    }}
                />
                <Button title="Cancelar" type='clear' 
                    buttonStyle={{
                        paddingVertical: 15
                    }}
                    onPress={()=>navigation.goBack()}
                />
            </View>
        </View>
    )
}
AddExpense.propTypes = {
    navigation: PropTypes.object.isRequired,
    route: PropTypes.object
}
export default AddExpense 
const styles = StyleSheet.create({    
    field: {    
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(216, 216, 216)'    
    },
})