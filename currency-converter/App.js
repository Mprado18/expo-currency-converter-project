import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { PickerComponent } from './src/components/picker';
import { api } from './src/services/currency-api/api';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [conversionLoading, setConversionLoading] = useState(false);

  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const [inputedValue, setInputedValue] = useState("");

  const [currencyValue, setCurrencyValue] = useState(null);
  const [convertedValue, setConvertedValue] = useState(0);

  useEffect(() => {
    async function loadInitialCurrencies() {
      try {
        const allCurrencies = await api.get("all");

        const currencyList = [];
        Object.keys(allCurrencies.data).forEach((key) => {
          currencyList.push({
            key: key,
            label: key,
            value: key
          });
        });

        setCurrencies(currencyList);
        if (currencyList.length > 0) {
          setSelectedCurrency(currencyList[0].key);
        }
      } catch (error) {
        console.error("Erro ao carregar moedas:", error);
      } finally {
        setLoading(false);
      }
    }

    loadInitialCurrencies();
  }, []);

  async function handleConvertCurrency() {
    if (!selectedCurrency) {
      alert("Por favor, selecione uma moeda");
      return;
    }

    setConversionLoading(true);
    try {
      const response = await api.get(`/all/${selectedCurrency}-BRL`);

      let convertionResult = (response.data[selectedCurrency].ask * parseFloat(inputedValue));
      setConvertedValue(`${convertionResult.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })}`);
      setCurrencyValue(inputedValue);
      Keyboard.dismiss();
    } catch (error) {
      console.error("Erro ao converter moeda:", error);
      alert("Erro ao converter. Tente novamente.");
    } finally {
      setConversionLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#101215'
      }}>
        <ActivityIndicator size="large" color="#f9f9f9" />
        <Text style={{ color: '#f9f9f9', marginTop: 10 }}>Carregando moedas...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.currencySelectorHeader}>
          <Text style={styles.title}>Selecione sua moeda</Text>
          <PickerComponent
            currenciesList={currencies}
            selectedCurrency={selectedCurrency}
            onChangeCurrency={(currency) => {
              setSelectedCurrency(currency);
              console.log("Moeda selecionada:", currency);
            }}
          />

          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Digite um valor para converter em (R$)</Text>
            <TextInput
              placeholder='Ex: 150'
              style={styles.input}
              keyboardType='numeric'
              value={inputedValue}
              onChangeText={(value) => setInputedValue(value)}
            />
          </View>

          <TouchableOpacity
            style={styles.convertButton}
            onPress={handleConvertCurrency}
            disabled={conversionLoading}
          >
            <View style={styles.button}>
              {conversionLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.convertButtonText}>Converter moeda</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {convertedValue > 0 && (
          <View style={styles.resultContainer}>
            <Text style={styles.convertedValue}>{currencyValue} {selectedCurrency}</Text>
            <Text style={{ fontStyle: 'italic' }}>Cotado a:</Text>
            <Text style={styles.convertedValue}>R$ {convertedValue}</Text>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101215',
    paddingTop: 40,
    alignItems: 'center',
  },
  currencySelectorHeader: {
    backgroundColor: '#f9f9f9',
    width: '90%',
    borderRadius: 8,
    padding: 8,
  },
  title: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    paddingTop: 6,
    paddingLeft: 6
  },
  inputContainer: {
    width: '90%',
    backgroundColor: '#f9f9f9',
    padding: 6,
  },
  input: {
    width: '100%',
    padding: 8,
    fontSize: 18,
    color: '#000',
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#1a91ff',
    alignSelf: 'center',
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 12
  },
  convertButton: {
    backgroundColor: 'transparent',
    marginTop: 16,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: 8,
    minHeight: 0,
    padding: 0
  },
  convertButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  resultContainer: {
    width: '75%',
    backgroundColor: '#fff',
    marginTop: 18,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  convertedValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8f8282ff',
  }
});