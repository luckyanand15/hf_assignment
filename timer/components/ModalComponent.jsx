import React from "react";
import { Modal, View, Text, Button, StyleSheet } from "react-native";

const ModalComponent = ({ visible, onClose, timerName }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.congratsText}>Congratulations!</Text>
          <Text style={styles.timerText}>Timer "{timerName}" has completed!</Text>
          <Button title="OK" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  congratsText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  timerText: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default ModalComponent;
