import { useCallback, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  studentProfileDefaultValues,
  studentProfileSchema,
  type StudentProfileFormValues
} from '../schemas/profileSchemas';

const completionKeys: (keyof StudentProfileFormValues)[] = [
  'fullName',
  'email',
  'phone',
  'institution',
  'program',
  'yearOfStudy',
  'academicGoals',
  'subjectsOfInterest',
  'learningStyle',
  'sessionPreferences',
  'languages',
  'timezone',
  'emergencyContact'
];

export const useStudentProfileForm = () => {
  const methods = useForm<StudentProfileFormValues>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: studentProfileDefaultValues,
    mode: 'onBlur'
  });

  const watchedValues = methods.watch(completionKeys);

  const profileCompletion = useMemo(() => {
    const completed = completionKeys.reduce((count, _key, index) => {
      const value = watchedValues[index];

      if (Array.isArray(value)) {
        return value.length ? count + 1 : count;
      }

      if (typeof value === 'object' && value !== null) {
        // Handle emergencyContact object
        const objValues = Object.values(value);
        return objValues.every(v => v && String(v).trim()) ? count + 1 : count;
      }

      if (typeof value === 'number') {
        return Number.isFinite(value) ? count + 1 : count;
      }

      return value ? count + 1 : count;
    }, 0);

    return Math.round((completed / completionKeys.length) * 100);
  }, [watchedValues]);

  const addListItem = useCallback(
    (field: 'subjectsOfInterest' | 'languages', nextValue: string, transform?: (value: string) => string) => {
      const rawValue = nextValue.trim();
      const normalizedValue = transform ? transform(rawValue) : rawValue;

      if (!normalizedValue) {
        return false;
      }

      const currentValues = methods.getValues(field);
      if (currentValues.includes(normalizedValue)) {
        return false;
      }

      methods.setValue(field, [...currentValues, normalizedValue], {
        shouldDirty: true,
        shouldValidate: true
      });

      return true;
    },
    [methods]
  );

  const removeListItem = useCallback(
    (field: 'subjectsOfInterest' | 'languages', valueToRemove: string) => {
      const currentValues = methods.getValues(field);
      methods.setValue(
        field,
        currentValues.filter((item) => item !== valueToRemove),
        { shouldDirty: true, shouldValidate: true }
      );
    },
    [methods]
  );

  const toggleLearningStyle = useCallback(
    (learningStyle: StudentProfileFormValues['learningStyle'][number]) => {
      const currentStyles = methods.getValues('learningStyle');
      if (currentStyles.includes(learningStyle)) {
        methods.setValue(
          'learningStyle',
          currentStyles.filter((style) => style !== learningStyle),
          { shouldDirty: true, shouldValidate: true }
        );
        return;
      }

      methods.setValue('learningStyle', [...currentStyles, learningStyle], {
        shouldDirty: true,
        shouldValidate: true
      });
    },
    [methods]
  );

  const toggleSessionPreference = useCallback(
    (sessionPreference: StudentProfileFormValues['sessionPreferences'][number]) => {
      const currentPreferences = methods.getValues('sessionPreferences');
      if (currentPreferences.includes(sessionPreference)) {
        methods.setValue(
          'sessionPreferences',
          currentPreferences.filter((pref) => pref !== sessionPreference),
          { shouldDirty: true, shouldValidate: true }
        );
        return;
      }

      methods.setValue('sessionPreferences', [...currentPreferences, sessionPreference], {
        shouldDirty: true,
        shouldValidate: true
      });
    },
    [methods]
  );

  return {
    methods,
    profileCompletion,
    addListItem,
    removeListItem,
    toggleLearningStyle,
    toggleSessionPreference
  };
};

export type UseStudentProfileFormReturn = ReturnType<typeof useStudentProfileForm>;
