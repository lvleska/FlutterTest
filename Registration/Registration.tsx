import React, { useState, useEffect } from 'react';
import { PhoneStep } from './steps/PhoneStep';
import { CodeStep } from './steps/CodeStep';
import { NameStep } from './steps/NameStep';
import { RoleStep } from './steps/RoleStep';
import { SkillsStep } from './steps/SkillsStep';
import { OrganizationStep } from './steps/OrganizationStep';
import { PhotoStep } from './steps/PhotoStep';
import { SuccessStep } from './steps/SuccessStep';
import { apiService, User } from '../../services/api';

type RegistrationStep = 'phone' | 'code' | 'name' | 'role' | 'skills' | 'organization' | 'photo' | 'success';

interface OrganizationResult {
  inn: string;
  name: string;
  shortName?: string;
  kpp?: string;
  ogrn?: string;
  address?: string;
  phone?: string;
  email?: string;
  management?: {
    name?: string;
    post?: string;
  };
}

interface RegistrationData {
  phone: string;
  code: string;
  lastName: string;
  firstName: string;
  middleName: string;
  photo: File | null;
  agreedToTerms: boolean;
  agreedToPersonalData: boolean;
  selectedRole: string | null;
  selectedSkills: number[]; // Array of skill IDs
  selectedOrganization: OrganizationResult | null;
  organizationType: string;
  needsVerification: boolean;
  user?: User;
}

interface Props {
  onLogin?: (user: User) => void;
}

export const Registration: React.FC<Props> = ({ onLogin }) => {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('phone');
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    phone: '',
    code: '',
    lastName: '',
    firstName: '',
    middleName: '',
    photo: null,
    agreedToTerms: false,
    agreedToPersonalData: false,
    selectedRole: null,
    selectedSkills: [],
    selectedOrganization: null,
    organizationType: '',
    needsVerification: false,
  });

  // Debug: track currentStep changes
  useEffect(() => {
    console.log('Current step changed to:', currentStep);
  }, [currentStep]);

  // Set CSS variable for viewport height (for mobile keyboard handling)
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVH();
    window.addEventListener('resize', setVH);
    return () => window.removeEventListener('resize', setVH);
  }, []);

  const updateData = (data: Partial<RegistrationData>) => {
    setRegistrationData(prev => ({ ...prev, ...data }));
  };

  const goToNextStep = () => {
    const steps: RegistrationStep[] = ['phone', 'code', 'name', 'role', 'skills', 'organization', 'photo', 'success'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const goToPrevStep = () => {
    const steps: RegistrationStep[] = ['phone', 'code', 'name', 'role', 'skills', 'organization', 'photo', 'success'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleUserExists = (user: User, token: string) => {
    if (onLogin) {
      onLogin(user);
    }
  };

  const handleRoleComplete = () => {
    // Проверяем, требуется ли организация для выбранной роли
    const rolesRequiringOrg = ['contractor', 'exhibitor', 'organizer'];
    const needsOrg = registrationData.selectedRole && rolesRequiringOrg.includes(registrationData.selectedRole);

    if (needsOrg) {
      // Если роль требует организацию - идем на поиск организации
      setCurrentStep('organization');
    } else {
      // Если физ. лицо (исполнитель) - идем на выбор специальностей
      setCurrentStep('skills');
    }
  };

  const handleSkillsComplete = async () => {
    try {
      // Create individual context (replaces old isFreelancer flag)
      await apiService.createIndividualContext();

      // Save skills if user selected any
      if (registrationData.selectedSkills.length > 0) {
        await apiService.updateUserSkills(registrationData.selectedSkills);
      }
      // После сохранения навыков идем на экран фото
      setCurrentStep('photo');
    } catch (error) {
      console.error('Skills save failed:', error);
      alert('Ошибка сохранения навыков. Попробуйте снова.');
    }
  };

  const handleOrganizationComplete = async () => {
    try {
      // Save organization to user
      if (registrationData.selectedOrganization) {
        const selectedOrg = registrationData.selectedOrganization;
        const result = await apiService.saveOrganization({
          inn: selectedOrg.inn,
          name: selectedOrg.name,
          type: registrationData.organizationType,
          managementName: selectedOrg.management?.name,
          shortName: selectedOrg.shortName,
          kpp: selectedOrg.kpp,
          ogrn: selectedOrg.ogrn,
          address: selectedOrg.address,
          phone: selectedOrg.phone,
          email: selectedOrg.email,
        });

        updateData({ needsVerification: result.needsVerification });

        if (result.needsVerification) {
          console.log('Verification deferred; proceeding to photo step');
        } else {
          console.log('Going to photo step');
        }
        setCurrentStep('photo');
      } else {
        setCurrentStep('photo');
      }
    } catch (error) {
      console.error('Organization step failed:', error);
      alert('Ошибка сохранения организации. Попробуйте снова.');
    }
  };

  const handlePhotoComplete = async () => {
    try {
      // Загружаем фото если есть
      if (registrationData.photo) {
        await apiService.uploadProfilePhoto(registrationData.photo);
      }

      goToNextStep(); // Переход на success
    } catch (error) {
      console.error('Photo upload failed:', error);
      alert('Ошибка завершения регистрации. Попробуйте снова.');
    }
  };

  return (
    <div style={styles.container}>
      {currentStep === 'phone' && (
        <PhoneStep
          phone={registrationData.phone}
          onPhoneChange={(phone) => updateData({ phone })}
          onNext={goToNextStep}
          onBack={() => window.history.back()}
        />
      )}
      {currentStep === 'code' && (
        <CodeStep
          phone={registrationData.phone}
          code={registrationData.code}
          onCodeChange={(code) => updateData({ code })}
          onNext={goToNextStep}
          onBack={goToPrevStep}
          onUserExists={handleUserExists}
        />
      )}
      {currentStep === 'name' && (
        <NameStep
          lastName={registrationData.lastName}
          firstName={registrationData.firstName}
          middleName={registrationData.middleName}
          agreedToTerms={registrationData.agreedToTerms}
          agreedToPersonalData={registrationData.agreedToPersonalData}
          phone={registrationData.phone}
          onLastNameChange={(lastName) => updateData({ lastName })}
          onFirstNameChange={(firstName) => updateData({ firstName })}
          onMiddleNameChange={(middleName) => updateData({ middleName })}
          onAgreedChange={(agreedToTerms) => updateData({ agreedToTerms })}
          onAgreedPersonalDataChange={(agreedToPersonalData) => updateData({ agreedToPersonalData })}
          onNext={(user) => {
            updateData({ user });
            goToNextStep();
          }}
          onBack={goToPrevStep}
        />
      )}
      {currentStep === 'role' && (
        <RoleStep
          selectedRole={registrationData.selectedRole}
          organizationType={registrationData.organizationType}
          onRoleSelect={(selectedRole) => updateData({ selectedRole })}
          onOrganizationTypeChange={(organizationType) => updateData({ organizationType })}
          onNext={handleRoleComplete}
          onBack={goToPrevStep}
        />
      )}
      {currentStep === 'skills' && (
        <SkillsStep
          selectedSkills={registrationData.selectedSkills}
          onSkillsChange={(selectedSkills) => updateData({ selectedSkills })}
          onNext={handleSkillsComplete}
          onBack={goToPrevStep}
        />
      )}
      {currentStep === 'organization' && (
        <OrganizationStep
          selectedOrganization={registrationData.selectedOrganization}
          onOrganizationSelect={(selectedOrganization) => updateData({ selectedOrganization })}
          onNext={handleOrganizationComplete}
          onBack={goToPrevStep}
        />
      )}
      {currentStep === 'photo' && (
        <PhotoStep
          photo={registrationData.photo}
          onPhotoChange={(photo) => updateData({ photo })}
          onNext={handlePhotoComplete}
        />
      )}
      {currentStep === 'success' && (
        <SuccessStep
          onComplete={() => {
            // Вызываем onLogin только в конце всего процесса
            if (onLogin && registrationData.user) {
              onLogin(registrationData.user);
            }
            // Navigate to main app
            window.location.href = '/';
          }}
        />
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },
};
