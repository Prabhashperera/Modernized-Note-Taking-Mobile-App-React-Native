import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../Authcontext"; // Check your path (../src/Authcontext vs ../app/Authcontext)

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Error", "Please enter both fields.");
    setLoading(true);
    try {
      await login(email, password);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        className="flex-1 justify-center px-6"
      >
        <View className="items-center mb-10">
          <Text className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</Text>
          <Text className="text-gray-500 text-lg">Log in to your notes</Text>
        </View>

        <View className="space-y-4">
          <TextInput 
            placeholder="Email" 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none"
            keyboardType="email-address"
            className="w-full bg-gray-100 p-4 rounded-xl text-gray-700 border border-gray-200"
          />
          <TextInput 
            placeholder="Password" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry 
            className="w-full bg-gray-100 p-4 rounded-xl text-gray-700 border border-gray-200 mb-4"
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" className="mt-4" />
        ) : (
          <TouchableOpacity 
            onPress={handleLogin}
            className="w-full bg-blue-600 p-4 rounded-xl items-center mt-4 shadow-md"
          >
            <Text className="text-white font-bold text-lg">Login</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          onPress={() => navigation.navigate("Register")}
          className="mt-6 items-center"
        >
          <Text className="text-blue-600 font-semibold">Don't have an account? Register</Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}