import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    ActivityIndicator
} from 'react-native';
import { useMainContext } from "../context/AppContext";
const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: "65%"
    },
});
const Loader = () => {
    const {theme} = useMainContext();
    return (
        <View style={styles.root}>
            <ActivityIndicator size="large" color={theme.primary} />
        </View>
    )
}

export default Loader;