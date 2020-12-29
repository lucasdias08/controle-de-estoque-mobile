import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, Text, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-community/picker';

import firebase from "../firebaseConnection";

export default function ViewModalDelete(props) {

    const [selectedValue, setSelectedValue] = useState("remedio");
    const [valueInputNome, setValueInputNome] = useState("");
    const [valueInputQuantidade, setValueInputQuantidade] = useState(0);
    const [erro, setErro] = useState("");
    const [valueLeftError, setValueLeftError] = useState("5%");
    const [valueKey, setValueKey] = useState(0);

    useEffect(() => {
        console.log(props.keyProduto);
        async function defineProduto() {
            await firebase.database().ref("produto/" + props.keyProduto).once("value").then(function(snapshot){
                console.log(snapshot.val().nome);
                console.log(snapshot.val().quantidade);
                console.log(snapshot.val().tipo);

                setValueInputNome(snapshot.val().nome);
                setValueInputQuantidade(snapshot.val().quantidade);
                setSelectedValue(snapshot.val().tipo);
                
            });
        }

        defineProduto();
    }, [props.keyProduto]);

    function removeProduto() {
        if (valueInputNome === "" || valueInputQuantidade <= 0) {
            Alert.alert(
                "Erro",
                "Verifique se digitou corretamente ;)"
            );
        } else {
            setErro(() => <ActivityIndicator size={50} color={"#FFF"} style={{ flex: 1 }} />);
            setValueLeftError("43%");
            deleteProduto();
        }
    }

    async function deleteProduto() {
        var i = 1;
        
        //remove o produto selecionado
        await firebase.database().ref("produto/" + props.keyProduto).remove().then(() => {
            Alert.alert(
                "Mensagem",
                `Produto ${valueInputNome} removido!`
            );

            
            
        }).catch(err => console.log(err));

            props.fechaModal(false);
            props.preencheTabela();

    }

    function styleError(myPosition) {
        return {
            color: "#F56D",
            width: "90%",
            left: myPosition
        }
    }

    return (

        <View style={styles.modalView}>
            <View style={{ alignItems: "center", width: "100%" }}>
                <Text style={{ fontWeight: "bold", fontSize: 22, color: "#FFF", top: "70%" }}>REMOVER {valueInputNome}</Text>
            </View>

            <View style={{ top: "30%" }}>
                <Text style={{ color: "#FFF", fontWeight: "bold", top: 20, left: 10 }}>Nome: </Text>
                <TextInput
                    style={styles.inputNome}
                    onChangeText={(value) => setValueInputNome(value)}
                    value={valueInputNome}
                    editable={false}
                />

                <Text style={{ color: "#FFF", fontWeight: "bold", top: 60, left: 3 }}>Quantidade: </Text>
                <TextInput
                    style={styles.inputQuantidade}
                    keyboardType={"decimal-pad"}
                    onChangeText={(value) => setValueInputQuantidade(value)}
                    defaultValue={valueInputQuantidade}
                    editable={false}
                />

                <Text style={{ color: "#FFF", fontWeight: "bold", top: 80, right: 150, position: "absolute" }}>Tipo: </Text>
                <Picker
                    selectedValue={selectedValue}
                    style={{ height: 50, width: 150, color: "#FFF", top: 27, left: "60%", fontWeight: "bold" }}
                    onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                    enabled={false}
                >
                    <Picker.Item label="Remédio" value="remedio" />
                    <Picker.Item label="Fralda" value="fralda" />
                </Picker>
            </View>

            <View style={{ width: "100%", height: "100%", position: "absolute", top: "20%" }}>
                <Text style={styleError(valueLeftError)}>{erro}</Text>
            </View>

            <TouchableOpacity style={styles.btnAddProduto} onPress={removeProduto}>
                <View style={{ flex: 1 }}>
                    <Text style={{ top: "30%", color: "#213e6e", fontWeight: "bold", fontSize: 20 }}>DELETAR</Text>
                </View>
            </TouchableOpacity>
        </View>

    );
}

const styles = StyleSheet.create({
    msgErro: {
        color: "#F56D",
        width: "90%",
        left: "43%"
    },
    model: {
        height: "50%",
        width: "95%",
        left: 10,
        top: 100
    },
    modalView: {
        backgroundColor: '#9e2116',
        height: "70%",
        width: "100%",
        borderRadius: 20,
        top: 100
    },
    inputNome: {
        height: 40,
        color: "#000",
        borderColor: 'gray',
        borderRadius: 10,
        backgroundColor: "#FFF",
        position: "absolute",
        width: "80%",
        right: 5,
        top: 10
    },
    inputQuantidade: {
        height: 40,
        color: "#000",
        borderColor: 'gray',
        borderRadius: 10,
        backgroundColor: "#FFF",
        position: "absolute",
        width: "20%",
        left: 90,
        top: 70
    },
    btnAddProduto: {
        backgroundColor: "#FFF",
        position: "absolute",
        alignItems: "center",
        height: "15%",
        width: "95%",
        left: "2.5%",
        borderRadius: 20,
        bottom: 20
    }

})

