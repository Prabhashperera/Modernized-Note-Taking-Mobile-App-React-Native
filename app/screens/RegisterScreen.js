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
import { AuthContext } from "../Authcontext";

export default function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Missing Info", "Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      await register(email, password);
      setLoading(false);
      
      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => navigation.navigate("Login") }
      ]);
      
    } catch (error) {
      setLoading(false);
      let errorMessage = error.message;
      if (error.code === 'auth/email-already-in-use') errorMessage = "That email is already registered.";
      else if (error.code === 'auth/invalid-email') errorMessage = "Please enter a valid email address.";
      else if (error.code === 'auth/weak-password') errorMessage = "Password should be at least 6 characters.";
      
      Alert.alert("Registration Failed", errorMessage);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 px-6 justify-center"
      >
        <View className="items-center mb-10">
          <Text className="text-3xl font-bold text-gray-800 mb-2">Create Account</Text>
          <Text className="text-gray-500 text-lg">Sign up to start taking notes</Text>
        </View>

        <View>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            className="w-full bg-gray-100 p-4 rounded-2xl text-gray-700 border border-gray-200 mb-4"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="w-full bg-gray-100 p-4 rounded-2xl text-gray-700 border border-gray-200 mb-6"
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" />
        ) : (
          <TouchableOpacity 
            onPress={handleRegister}
            className="w-full bg-blue-600 p-4 rounded-2xl items-center shadow-md"
          >
            <Text className="text-white font-bold text-lg">Register</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          onPress={() => navigation.navigate("Login")}
          className="mt-6 items-center"
        >
          <Text className="text-blue-600 font-semibold">
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}