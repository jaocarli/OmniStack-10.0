import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity, } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { getCurrentPositionAsync, requestPermissionsAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../services/api';

function Main({ navigation }) {
    const [devs, setDevs] = useState([])
    const [currentRegion, setCurrentRegion] = useState(null);
    const [techs, setTechs] = useState('');

    useEffect(() => {
        async function loadInitialPosition() {
            const { granted } = await requestPermissionsAsync();
    
          if (granted) {
            const { coords } = await getCurrentPositionAsync({
              enableHighAccuracy: true,
            });

            const { latitude, longitude } = coords;

            setCurrentRegion({
                latitude, 
                longitude, 
                latitudeDelta: 0.04, 
                longitudeDelta: 0.04, 
            })
        }

            async function newFunction() {
                return await requestPermissionsAsync();
            }
    }

    loadInitialPosition();
}, []);

async function loadDevs() {
    const { latitude, longitude } = currentRegion;

    console.log(currentRegion);
    const response = await api.get('/search', {
        params: {
            latitude,
            longitude,
            techs
        }
    });


    setDevs(response.data.devs);
}

function handleRagionChanged(region) {
    setCurrentRegion(region);
}

if (!currentRegion) {
    return null;
}
    return  (
    <>
        <MapView  onRegionChangeComplete={handleRagionChanged}
        initialRegion={currentRegion}
        style={styles.map}
        >
            {devs.map(dev => (
                <Marker
                key={dev._id}
                coordinate={{
                    longitude: dev.location.coordinates[0],
                    latitude: dev.location.coordinates[1],
                }}
                >
                <Image
                style={styles.avatar} 
                source={{ uri: dev.avatar_url }}
                />
    
                <Callout onPress={() => {
                    navigation.navigate('Profile', { github_username: dev.github_username });
                }}>
                    <View style={styles.callout}/>
                        <Text style={styles.devName}>{dev.name}</Text>
                        <Text style={styles.devBio}>{dev.bio}</Text>
                        <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                </Callout>
                </Marker>    
            ))}
        </MapView>
        <View style={styles.searchForm}>
            <TextInput 
            style={styles.searchInput}
            placeholder="Buscar devs por techs..."
            placeholderTextColor="#999"
            autoCapitalize="words"
            autoCorrect={false}
            value={techs}
            onChangeText={setTechs}
            />
            <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
                <MaterialIcons name="my-location" size={20} color="#FFF" />
            </TouchableOpacity>
        </View>
    </>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },

    avatar: {
        width: 35,
        height: 35,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: '#7D40E7'
    },

    callout: {
        width: 200,
    },

    devName: {
        fontWeight: 'bold',
        fontSize: 30,
    },

    devBio: {
        color: '#666',
        marginTop: 5,
    },

    devTechs: {
        marginTop: 5,
    },

    searchForm: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: 'row',
    },

    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#fff',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        elevation: 15,

    },

    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8E4DFF',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },



})

export default Main;