import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export function PickerComponent() {
    return (
        <Picker>
            <Picker.Item label="BTC" value="BTC" key={0} />
        </Picker>
    );
}