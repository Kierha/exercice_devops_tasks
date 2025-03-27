import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Modal, TextInput, Button } from 'react-native';
import { useTaskStore } from '@/stores/taskStore';
import { Plus, Trash2 } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const COLORS = ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF'];

export default function TasksScreen() {
  const { tasks, isLoading, error, fetchTasks, deleteTask, updateTask, addTask } = useTaskStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [color, setColor] = useState(COLORS[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddTask = () => {
    if (!title.trim()) return;
    addTask({ title, description: '', deadline: deadline.toISOString(), color, completed: false });
    setTitle('');
    setDeadline(new Date());
    setColor(COLORS[0]);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Pressable
              onPress={() => updateTask(item.id, { completed: !item.completed })}
              style={styles.taskContent}>
              <Text style={[
                styles.taskTitle,
                item.completed && styles.completedTask
              ]}>
                {item.title}
              </Text>
              <Text style={styles.taskDescription}>{item.description}</Text>
            </Pressable>
            <Pressable
              onPress={() => deleteTask(item.id)}
              testID={`delete-button-${item.id}`}
              style={styles.deleteButton}>
              <Trash2 size={20} color="#FF3B30" />
            </Pressable>
          </View>
        )}
      />

      {/* Modal d'ajout de tâche */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Ajouter une tâche</Text>
            <TextInput
              placeholder="Titre de la tâche"
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />
            <Pressable onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
              <Text>Sélectionner une date: {deadline.toLocaleDateString()}</Text>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={deadline}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDeadline(selectedDate);
                }}
              />
            )}
            <View style={styles.colorSelector}>
              {COLORS.map((c) => (
                <Pressable key={c} onPress={() => setColor(c)} style={[styles.colorOption, { backgroundColor: c, borderWidth: color === c ? 2 : 0 }]} />
              ))}
            </View>
            <Button title="Ajouter" onPress={handleAddTask} />
            <Button title="Annuler" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
        <Plus size={24} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  taskDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '80%', backgroundColor: '#FFF', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderBottomWidth: 1, borderBottomColor: '#CCC', marginBottom: 10, padding: 8 },
  datePickerButton: { padding: 10, backgroundColor: '#EEE', borderRadius: 5, marginBottom: 10, alignItems: 'center' },
  colorSelector: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  colorOption: { width: 30, height: 30, borderRadius: 15, marginHorizontal: 5 },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 16,
  },
});