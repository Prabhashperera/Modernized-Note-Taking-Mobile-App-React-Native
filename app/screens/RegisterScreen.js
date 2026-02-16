import { Ionicons } from '@expo/vector-icons'; //
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../Authcontext"; //

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
    // VISION PRO BACKGROUND: Deep Dark Blue/Black
    <SafeAreaView className="flex-1 bg-[#0f172a]">
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 px-8 justify-center"
      >
        
        {/* Header Area */}
        <View className="items-center mb-12">
           {/* Back Button (Floating Top Left) */}
           <TouchableOpacity 
             onPress={() => navigation.goBack()}
             className="absolute -top-20 left-0 h-10 w-10 rounded-full bg-white/10 items-center justify-center border border-white/20"
           >
             <Ionicons name="arrow-back" size={20} color="white" />
           </TouchableOpacity>

          {/* Icon */}
          <View className="h-16 w-16 bg-cyan-500/10 rounded-full items-center justify-center mb-6 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <Ionicons name="person-add-outline" size={30} color="#22d3ee" />
          </View>

          <Text className="text-4xl font-thin text-white tracking-tighter text-center">
            Create <Text className="font-bold text-cyan-400">Account</Text>
          </Text>
          <Text className="text-slate-400 text-sm tracking-[3px] uppercase mt-2">
            Join the workspace
          </Text>
        </View>

        {/* Inputs Area */}
        <View className="space-y-5">
          {/* Email Input - Glass Effect */}
          <View className="flex-row items-center bg-white/5 rounded-2xl border border-white/10 px-4 mb-5">
            <Ionicons name="mail-outline" size={20} color="#64748b" style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Email Address"
              placeholderTextColor="#64748b"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              className="flex-1 py-4 text-white text-base font-light"
              selectionColor="#22d3ee"
            />
          </View>

          {/* Password Input - Glass Effect */}
          <View className="flex-row items-center bg-white/5 rounded-2xl border border-white/10 px-4 py-1 mb-4">
            <Ionicons name="lock-closed-outline" size={20} color="#64748b" style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#64748b"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="flex-1 py-4 text-white text-base font-light"
              selectionColor="#22d3ee"
            />
          </View>
        </View>

        {/* Action Button */}
        {loading ? (
          <ActivityIndicator size="large" color="#22d3ee" className="mt-8" />
        ) : (
          <TouchableOpacity 
            onPress={handleRegister}
            activeOpacity={0.8}
            // Neon Glow Button
            className="w-full bg-cyan-500 p-4 rounded-full items-center mt-8 shadow-[0_0_20px_rgba(34,211,238,0.4)] border border-cyan-400"
          >
            <Text className="text-white font-bold text-lg tracking-widest uppercase">
              Sign Up
            </Text>
          </TouchableOpacity>
        )}

        {/* Footer Link */}
        <TouchableOpacity 
          onPress={() => navigation.navigate("Login")}
          className="mt-8 items-center"
        >
          <Text className="text-slate-400">
            Already have an account? <Text className="text-cyan-400 font-bold">Login</Text>
          </Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}