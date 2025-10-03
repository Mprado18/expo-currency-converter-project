import { Picker } from '@react-native-picker/picker';

export function PickerComponent(props) {
    let currencies = props.currenciesList.map((item, index) => {
        return <Picker.Item label={item.key} value={item.key} key={index} />;
    });

    return (
        <Picker
            selectedValue={props.selectedValue}
            onValueChange={(itemValue) => props.onValueChange(itemValue)}
        >
            {currencies}
        </Picker>
    );
}