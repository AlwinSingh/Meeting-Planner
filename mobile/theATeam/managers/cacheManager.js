import AsyncStorage from '@react-native-community/async-storage';
//import { AsyncStorage } from 'react-native';

// Sets the cache value
async function set(key, value) {
    // console.log("JSON SET: " + JSON.stringify(value))
    // console.log("JSON KEY: " + JSON.stringify(key))
    return AsyncStorage.setItem(key, JSON.stringify(value));
}

// Get the Cache value
async function get(key, isJson = true) {
    const item = await AsyncStorage.getItem(key);
    //console.log("JSON SET: " + JSON.stringify(item))
    return isJson ? JSON.parse(item) : item;
}

// Clear all Cache value
async function clearAll() {
    console.log("Clearing Cache...");
    const allKeys = await AsyncStorage.getAllKeys();
    return await AsyncStorage.multiRemove(allKeys)
 }

 // Get all Cache Value
async function getAll() {
    const allKeys = await AsyncStorage.getAllKeys();
    const allValues = await AsyncStorage.multiGet(allKeys);
    const result = {};
    allValues.forEach(([key, value]) => (result[key] = JSON.parse(value)));
    return result;
}

// Exports Modules
module.exports = {
    get,
    set,
    clearAll,
    getAll,
};
