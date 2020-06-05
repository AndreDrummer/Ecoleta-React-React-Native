import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, ImageBackground, TextInput } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from "@expo/vector-icons"
import { useNavigation, useRoute } from '@react-navigation/native'
import Dropdown from '../../components/dropdown';
import axios from 'axios';
import api from '../../Services/api';

function IBGEUrl(paramUF?: string): string {
    if (!paramUF) return `https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`;
    return `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${paramUF}/municipios`;
}

interface IBGEUFs {
    sigla: string
}

interface IBGECities {
    nome: string;
}

interface UFinterface {
    label: string;
    value: string;
}


interface Cityinterface {
    label: string;
    value: string;
}
const Home = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [ufs, setUfs] = useState<UFinterface[]>([]);
    const [cities, setCities] = useState<Cityinterface[]>([]);
    const [selectedUF, setSelectedUF] = useState('');
    const [selectedCity, setSelectedCity] = useState('');    

    function handleNavigationToPoints() {
        navigation.navigate('Points', {
            selectedUF,
            selectedCity
        });
    }

    useEffect(() => {
        api.get<IBGEUFs[]>(IBGEUrl()).then(response => {
            const ufs = response.data.map((uf) => {
                return {
                    label: uf.sigla,
                    value: uf.sigla
                }
            });
            setUfs(ufs);
        })
    }, []);

    useEffect(() => {
        api.get<IBGECities[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(response => {
            const cities = response.data.map((city) => {
                return {
                    label: city.nome,
                    value: city.nome
                }
            });
            setCities(cities);
        })
    }, [selectedUF])

    return (
        <ImageBackground
            source={require('../../assets/home-background.png')}
            style={styles.container}
            imageStyle={{ width: 274, height: 368 }}
        >
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
            </View>

            <View style={styles.footer}>

                <View style={styles.input}>
                    <Dropdown items={ufs} label={"UF"} callBackSelect={setSelectedUF} />
                </View>

                <View style={styles.input}>
                    <Dropdown items={cities} label={"Cidade"} callBackSelect={setSelectedCity} />
                </View>

                <RectButton style={styles.button} onPress={handleNavigationToPoints}>
                    <View style={styles.buttonIcon}>
                        <Text>
                            <Icon name="arrow-right" color="#FFF" size={24}></Icon>
                        </Text>
                    </View>
                    <Text style={styles.buttonText}>
                        Entrar
                    </Text>
                </RectButton>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {},

    select: {},

    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});

export default Home;