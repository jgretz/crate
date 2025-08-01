import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {createLink} from '../services';
import {createLinkSchema, type CreateLinkFormData} from '../schemas';
import type {CreateLinkInput} from '@stashl/domain';
import {colors} from '../theme';

interface AddLinkFormProps {
  visible: boolean;
  onClose: () => void;
}

export function AddLinkForm({visible, onClose}: AddLinkFormProps) {
  const [formData, setFormData] = useState<CreateLinkFormData>({
    url: '',
    title: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

  const createLinkMutation = useMutation({
    mutationFn: (input: CreateLinkInput) => createLink(input),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['links']});
      handleClose();
      Alert.alert('Success', 'Link added successfully!');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to add link. Please try again.');
    },
  });

  const validateField = (field: keyof CreateLinkFormData, value: string) => {
    const fieldValidation = createLinkSchema.shape[field];
    if (fieldValidation) {
      const result = fieldValidation.safeParse(value || undefined);
      if (!result.success) {
        return result.error.issues[0]?.message;
      }
    }
    return undefined;
  };

  const validateForm = () => {
    const formToValidate = {
      ...formData,
      description: formData.description?.trim() || undefined,
    };

    const result = createLinkSchema.safeParse(formToValidate);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          newErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      description: formData.description?.trim() || undefined,
    };

    createLinkMutation.mutate(submitData as CreateLinkInput);
  };

  const handleClose = () => {
    setFormData({url: '', title: '', description: ''});
    setErrors({});
    onClose();
  };

  const handleFieldChange = (field: keyof CreateLinkFormData, value: string) => {
    setFormData((prev) => ({...prev, [field]: value}));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({...prev, [field]: ''}));
    }
  };

  const handleFieldBlur = (field: keyof CreateLinkFormData, value: string) => {
    const error = validateField(field, value);
    if (error) {
      setErrors((prev) => ({...prev, [field]: error}));
    }
  };

  return (
    <Modal visible={visible} animationType='slide' presentationStyle='pageSheet'>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add New Link</Text>
          <TouchableOpacity onPress={handleSubmit} disabled={createLinkMutation.isPending}>
            <Text
              style={[styles.saveButton, createLinkMutation.isPending && styles.disabledButton]}
            >
              {createLinkMutation.isPending ? 'Adding...' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.field}>
            <Text style={styles.label}>URL *</Text>
            <TextInput
              style={[styles.input, errors.url && styles.inputError]}
              value={formData.url}
              onChangeText={(value) => handleFieldChange('url', value)}
              onBlur={() => handleFieldBlur('url', formData.url)}
              placeholder='https://example.com'
              placeholderTextColor={colors.mutedForeground}
              keyboardType='url'
              autoCapitalize='none'
              autoCorrect={false}
            />
            {errors.url && <Text style={styles.errorText}>{errors.url}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              value={formData.title}
              onChangeText={(value) => handleFieldChange('title', value)}
              onBlur={() => handleFieldBlur('title', formData.title)}
              placeholder='Title for this link'
              placeholderTextColor={colors.mutedForeground}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.textArea, errors.description && styles.inputError]}
              value={formData.description}
              onChangeText={(value) => handleFieldChange('description', value)}
              onBlur={() => handleFieldBlur('description', formData.description || '')}
              placeholder='Description of this link'
              placeholderTextColor={colors.mutedForeground}
              multiline
              numberOfLines={4}
              textAlignVertical='top'
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  cancelButton: {
    fontSize: 16,
    color: colors.mutedForeground,
  },
  saveButton: {
    fontSize: 16,
    color: colors.linkAccent,
    fontWeight: 'bold',
  },
  disabledButton: {
    color: colors.mutedForeground,
  },
  form: {
    flex: 1,
    padding: 16,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.input,
    color: colors.foreground,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.input,
    color: colors.foreground,
    height: 100,
  },
  inputError: {
    borderColor: colors.destructive,
  },
  errorText: {
    color: colors.destructive,
    fontSize: 14,
    marginTop: 4,
  },
});
