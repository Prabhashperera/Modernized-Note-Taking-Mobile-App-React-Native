import { Ionicons } from '@expo/vector-icons';
import {
  collection, deleteDoc, doc, onSnapshot, orderBy, query, where
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {
  Alert, FlatList,
  Share,
  StatusBar,
  Text, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../Authcontext";
import { db } from "../firebase";

export default function HomeScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const { logout, user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "notes"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotes(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsubscribe;
  }, [user]);

  const onShare = async (title, text) => {
    try {
      await Share.share({
        message: `${title ? title.toUpperCase() + "\n\n" : ""}${text}`,
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const deleteNote = async (id) => {
    Alert.alert(
      "Delete Note",
      "Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try { await deleteDoc(doc(db, "notes", id)); } 
            catch (e) { Alert.alert("Error", e.message); }
          },
        },
      ]
    );
  };

  const renderNote = ({ item }) => (
    <View key={item.id} className="mx-6 mb-4">
      <TouchableOpacity
        onPress={() => navigation.navigate("AddNote", { existingNote: item })}
        activeOpacity={0.7}
        // VISION PRO STYLE CARD: Dark semi-transparent background with white border
        className="bg-white/10 p-5 rounded-[24px] border border-white/20 relative"
      >
        {/* DELETE BUTTON (Top Right) */}
        <TouchableOpacity
          onPress={() => deleteNote(item.id)}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          className="absolute top-3 right-3 bg-red-500/20 h-8 w-8 rounded-full items-center justify-center z-50 border border-red-500/30"
        >
          <Ionicons name="close" size={16} color="#ef4444" />
        </TouchableOpacity>

        {/* CONTENT */}
        <View className="pr-8">
          {item.title ? (
            <Text className="text-xl font-bold text-white mb-1 shadow-sm" numberOfLines={1}>
              {item.title}
            </Text>
          ) : null}
          
          <Text className="text-slate-300 leading-5 text-sm font-light" numberOfLines={3}>
            {item.text}
          </Text>
        </View>

        {/* FOOTER */}
        <View className="mt-4 flex-row items-center justify-between border-t border-white/10 pt-3">
          
          {/* Date Indicator */}
          <View className="flex-row items-center">
            <View className="h-1.5 w-1.5 rounded-full bg-cyan-400 mr-2 shadow-[0_0_10px_cyan]" />
            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              {item.createdAt?.toDate 
                ? item.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) 
                : "Now"}
            </Text>
          </View>

          {/* NEON SHARE BUTTON */}
          <TouchableOpacity
            onPress={() => onShare(item.title, item.text)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="flex-row items-center bg-cyan-500/20 px-3 py-1.5 rounded-full border border-cyan-500/30"
          >
            <Ionicons name="share-social-outline" size={14} color="#22d3ee" />
            <Text className="text-cyan-400 font-bold text-[10px] ml-1">SHARE</Text>
          </TouchableOpacity>

        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    // VISION PRO BACKGROUND: Deep Dark Blue/Black
    <SafeAreaView className="flex-1 bg-[#0f172a]">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View className="px-8 pt-4 pb-6 flex-row justify-between items-center">
        <View>
          <Text className="text-slate-400 text-xs font-medium uppercase tracking-[3px] mb-1">Workspace</Text>
          <Text className="text-4xl font-thin text-white tracking-tighter">
            My <Text className="font-bold text-cyan-400">Notes</Text>
          </Text>
        </View>
        <TouchableOpacity 
          onPress={logout}
          className="h-10 w-10 rounded-full bg-white/5 items-center justify-center border border-white/10"
        >
          <Ionicons name="log-out-outline" size={18} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 120 }}
        renderItem={renderNote}
        ListEmptyComponent={
          <View className="mt-32 items-center px-10 opacity-50">
            <Ionicons name="planet-outline" size={60} color="#64748b" />
            <Text className="text-slate-500 text-center font-light mt-4">Space is empty.</Text>
            <Text className="text-slate-600 text-center text-xs uppercase tracking-widest mt-1">Tap + to create</Text>
          </View>
        }
      />

      {/* GLASS FAB */}
      <View className="absolute bottom-10 w-full items-center">
        <TouchableOpacity
          onPress={() => navigation.navigate("AddNote")}
          activeOpacity={0.9}
          // Glowing button with blur effect logic
          className="bg-cyan-500 h-16 px-8 rounded-full flex-row items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-cyan-400"
        >
          <Ionicons name="add" size={28} color="white" />
          <Text className="text-white font-bold text-sm uppercase tracking-[2px] ml-2">New Entry</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}