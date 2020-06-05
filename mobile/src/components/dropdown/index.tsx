import React, { useCallback } from 'react';
import { FontAwesome } from '@expo/vector-icons/'
import RNPickerSelect, { Item } from 'react-native-picker-select';



interface DropdownItems {
    items: Item[];
    label: string;
    callBackSelect: (string: string) => void;
}

const Dropdown: React.FC<DropdownItems> = ({ items, label, callBackSelect }) => {


    const selected = useCallback(value => {
        callBackSelect(value);
    }, [])

    return (
        <RNPickerSelect        
            style={{
                inputAndroid: {
                    height: 60,
                    borderRadius: 10,
                    backgroundColor: "#FFF",
                },
            }}
            placeholder={{ label }}
            Icon={() => {
                return <FontAwesome style={{ marginTop: 24, marginRight: 8 }} name="caret-down" size={16} color="black" />;
            }}                                
            onValueChange={selected}
            items={items}
        />
    );
};

export default Dropdown;