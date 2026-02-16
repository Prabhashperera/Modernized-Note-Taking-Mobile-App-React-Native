import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, FlatList, Text, TextInput, View } from "react-native";
import { db } from "../firebase";

export default function HomeScreen() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    const snapshot = await getDocs(collection(db, "notes"));
    setNotes(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const addNote = async () => {
    await addDoc(collection(db, "notes"), { text: note });
    setNote("");
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await deleteDoc(doc(db, "notes", id));
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <View>
      <TextInput placeholder="New note" value={note} onChangeText={setNote} />
      <Button title="Add" onPress={addNote} />

      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Text onPress={() => deleteNote(item.id)}>{item.text}</Text>
        )}
      />
    </View>
  );
}
