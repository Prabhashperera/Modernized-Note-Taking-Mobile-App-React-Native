import { useContext, useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Add this import
import { AuthContext } from "../Authcontext";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TextInput 
          placeholder="Email" 
          value={email}
          onChangeText={setEmail} 
          style={styles.input} 
        />
        <TextInput 
          placeholder="Password" 
          value={password}
          secureTextEntry 
          onChangeText={setPassword} 
          style={styles.input} 
        />
        <Button title="Login" onPress={() => login(email, password)} />
        <Button title="Register" onPress={() => navigation.navigate("Register")} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Ensure background is white, not transparent
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  }
});