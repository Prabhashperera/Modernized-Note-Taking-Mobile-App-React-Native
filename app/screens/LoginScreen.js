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
import { AuthContext } from "../Authcontext";

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
      // Loading state is handled by the AuthContext usually, 
      // but we keep this here just in case logic sits in this component
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    // VISION PRO BACKGROUND: Deep Dark Blue/Black
    <SafeAreaView className="flex-1 bg-[#0f172a]">
      <StatusBar barStyle="light-content" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        className="flex-1 justify-center px-8"
      >
        {/* LOGO / HEADER AREA */}
        <View className="items-center mb-12">
          {/* Animated-looking Icon */}
          <View className="h-20 w-20 bg-cyan-500/10 rounded-full items-center justify-center mb-6 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <Ionicons name="planet-outline" size={40} color="#22d3ee" />
          </View>

          <Text className="text-4xl font-thin text-white tracking-tighter text-center">
            Welcome <Text className="font-bold text-cyan-400">Back</Text>
          </Text>
          <Text className="text-slate-400 text-sm tracking-[4px] uppercase mt-2">
            Access your workspace
          </Text>
        </View>

        {/* INPUTS AREA */}
        <View className="space-y-5">
          {/* Email Input - Glass Effect */}
          <View className="flex-row items-center bg-white/5 rounded-2xl border border-white/10 px-4 py-1 mb-5">
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

        {/* LOGIN BUTTON */}
        {loading ? (
          <ActivityIndicator size="large" color="#22d3ee" className="mt-8" />
        ) : (
          <TouchableOpacity 
            onPress={handleLogin}
            activeOpacity={0.8}
            // Neon Glow Button
            className="w-full bg-cyan-500 p-4 rounded-full items-center mt-8 shadow-[0_0_20px_rgba(34,211,238,0.4)] border border-cyan-400"
          >
            <Text className="text-white font-bold text-lg tracking-widest uppercase">
              Enter
            </Text>
          </TouchableOpacity>
        )}

        {/* FOOTER */}
        <TouchableOpacity 
          onPress={() => navigation.navigate("Register")}
          className="mt-8 items-center"
        >
          <Text className="text-slate-400">
            New here? <Text className="text-cyan-400 font-bold">Create Account</Text>
          </Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}