export type Step = 'INTRO' | 'IDENTITY' | 'STORY' | 'RATING' | 'MEDIA' | 'VERIFICATION' | 'REVIEW' | 'SUCCESS';

export interface FormData {
  name: string;
  company: string; // Optional in Prisma model, handled in validation
  avatar: File | null;
  avatarPreview: string | null;
  feedback: string;
  rating: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  audioFile: File | null;
  socialType: 'linkedin' | 'twitter' | 'instagram';
  socialLink: string;
}

export interface StepProps {
  formData: FormData;
  updateField: (field: keyof FormData, value: any) => void;
  errors: Record<string, string>;
  onNext?: () => void;
  onBack?: () => void;
  isSubmitting?: boolean;
}