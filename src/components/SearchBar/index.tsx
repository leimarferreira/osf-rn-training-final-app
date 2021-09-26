import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../style';

type Props = {
  handleSearchParamsChange: (params: string) => void;
};

const SearchBar = ({ handleSearchParamsChange }: Props) => {
  const [searchParams, setSearchParams] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    handleSearchParamsChange(searchParams);
  }, [searchParams, handleSearchParamsChange]);

  Keyboard.addListener('keyboardDidHide', () => {
    inputRef.current?.blur();
  });

  const handleClearButtonPress = () => {
    setSearchParams('');
    inputRef.current?.blur();
  };

  return (
    <View style={styles.container}>
      <Icon name="search" size={20} color={colors.secondaryColor} />
      <TextInput
        ref={inputRef}
        style={styles.textInput}
        placeholder="Procure um filme..."
        placeholderTextColor={colors.secondaryColor}
        onChangeText={setSearchParams}
        blurOnSubmit
        value={searchParams}
      />
      {!!searchParams && (
        <TouchableOpacity onPress={handleClearButtonPress}>
          <Icon name="close" size={20} color={colors.secondaryColor} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    borderColor: colors.secondaryColor,
    borderWidth: 1,
    borderRadius: 8,
    margin: 8,
    paddingHorizontal: 8,
  },
  textInput: {
    color: '#fff',
    flexGrow: 1,
  },
});

export default SearchBar;
