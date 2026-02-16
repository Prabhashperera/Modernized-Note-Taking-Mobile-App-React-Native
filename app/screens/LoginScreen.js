import { useContext, useState } from "react";
import { Button, TextInput, View } from "react-native";
import { AuthContext } from "../AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Login" onPress={() => login(email, password)} />
      <Button title="Register" onPress={() => navigation.navigate("Register")} />
    </View>
  );
}
