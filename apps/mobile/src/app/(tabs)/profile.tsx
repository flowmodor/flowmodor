import { useState } from 'react';
import { Alert, Modal, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable, Text } from '@/src/components/Themed';
import { useSession } from '@/src/ctx';

export default function Profile() {
  const { session, signOut, deleteAccount } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const insets = useSafeAreaInsets();

  const handleDeleteAccount = async () => {
    const error = await deleteAccount();
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    setIsDeleteModalVisible(false);
  };

  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        backgroundColor: '#131221',
        alignItems: 'center',
        paddingTop: insets.top + 10,
        paddingHorizontal: 20,
        gap: 20,
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          maxWidth: 500,
        }}
      >
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.sectionItem}>
          <Text style={styles.text}>Email</Text>
          <Text style={styles.text}>{session?.user.email}</Text>
        </View>
        <Pressable
          isLoading={isLoading}
          color="#FFFFFF"
          style={{
            backgroundColor: '#23223C',
            borderColor: '#23223C',
            borderWidth: 2,
          }}
          onPress={async () => {
            setIsLoading(true);
            const error = await signOut();

            if (error) {
              Alert.alert(error.message);
            }
            setIsLoading(false);
          }}
        >
          <Text
            style={[
              styles.text,
              {
                textAlign: 'center',
                color: '#FFFFFF',
              },
            ]}
          >
            Sign out
          </Text>
        </Pressable>
        <Pressable
          color="#FF4F4F"
          style={{
            backgroundColor: '#23223C',
            borderColor: '#23223C',
            borderWidth: 2,
          }}
          onPress={() => setIsDeleteModalVisible(true)}
        >
          <Text
            style={[
              styles.text,
              {
                textAlign: 'center',
                color: '#FF4F4F',
              },
            ]}
          >
            Delete account
          </Text>
        </Pressable>
      </View>
      <Modal
        animationType="fade"
        transparent
        visible={isDeleteModalVisible}
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to delete your account?
            </Text>
            <Text style={styles.modalSubText}>
              All your data will be permanently deleted.
            </Text>
            <View style={styles.modalButtonsContainer}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsDeleteModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDeleteAccount}
              >
                <Text style={[styles.modalButtonText, { color: '#FF4F4F' }]}>
                  Delete
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#23223C',
    padding: 20,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000AA',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#23223C',
    borderRadius: 16,
    padding: 35,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalSubText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 14,
    color: '#FFFFFF',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  modalButton: {
    width: 80,
    height: 40,
    alignContent: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#3E3D56',
  },
  deleteButton: {
    backgroundColor: '#23223C',
    borderColor: '#FF4F4F',
    borderWidth: 2,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
