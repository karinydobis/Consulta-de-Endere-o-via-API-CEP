import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import axios from 'axios';

const ConsultaCEP = () => {
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const consultarCEP = async () => {
    setError('');
    setEndereco(null);

    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      setError('CEP deve conter 8 dígitos');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      
      if (response.data.erro) {
        setError('CEP não encontrado');
      } else {
        setEndereco(response.data);
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
      setError('Erro ao consultar CEP. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const limparConsulta = () => {
    setCep('');
    setEndereco(null);
    setError('');
  };

  const formatarCEP = (text) => {
    const cepLimpo = text.replace(/\D/g, '');
    
    if (cepLimpo.length <= 5) {
      setCep(cepLimpo);
    } else if (cepLimpo.length <= 8) {
      setCep(`${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Consulta de CEP</Text>
        <Text style={styles.subtitle}>
          Digite um CEP para consultar o endereço
        </Text>

        {/* Formulário de entrada */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>CEP</Text>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            value={cep}
            onChangeText={formatarCEP}
            placeholder="Digite o CEP (XXXXX-XXX)"
            keyboardType="numeric"
            maxLength={9}
            editable={!loading}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.consultarButton]}
              onPress={consultarCEP}
              disabled={loading || cep.length < 9}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Consultar CEP</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.limparButton]}
              onPress={limparConsulta}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Limpar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Exibição dos resultados */}
        {endereco && !endereco.erro && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Endereço Encontrado</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>CEP:</Text>
              <Text style={styles.infoValue}>{endereco.cep}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Logradouro:</Text>
              <Text style={styles.infoValue}>
                {endereco.logradouro || 'Não informado'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Bairro:</Text>
              <Text style={styles.infoValue}>
                {endereco.bairro || 'Não informado'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cidade:</Text>
              <Text style={styles.infoValue}>
                {endereco.localidade || 'Não informado'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Estado:</Text>
              <Text style={styles.infoValue}>
                {endereco.uf || 'Não informado'}
              </Text>
            </View>

            {endereco.complemento && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Complemento:</Text>
                <Text style={styles.infoValue}>{endereco.complemento}</Text>
              </View>
            )}

            {endereco.ddd && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>DDD:</Text>
                <Text style={styles.infoValue}>{endereco.ddd}</Text>
              </View>
            )}
          </View>
        )}

        {/* Informações de uso */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Como usar:</Text>
          <Text style={styles.infoText}>
            • Digite um CEP válido de 8 dígitos{'\n'}
            • Use o formato XXXXX-XXX ou apenas números{'\n'}
            • Aguarde a consulta ser processada{'\n'}
            • Os dados serão exibidos automaticamente
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: '#d93025',
  },
  errorText: {
    color: '#d93025',
    fontSize: 14,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  consultarButton: {
    backgroundColor: '#4285f4',
  },
  limparButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  infoContainer: {
    backgroundColor: '#e8f4fd',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4285f4',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default ConsultaCEP;