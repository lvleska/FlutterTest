import React, { useState, useRef, useEffect } from 'react';
import { RegistrationHeader } from '../RegistrationHeader';
import { apiService, SkillCategory, Skill } from '../../../services/api';
import { Loader } from '../../Loader';

// Add spinner animation to document head
const addSpinnerAnimation = () => {
  if (!document.getElementById('spinner-animation')) {
    const style = document.createElement('style');
    style.id = 'spinner-animation';
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
};

interface Props {
  selectedSkills: number[]; // Now array of skill IDs
  onSkillsChange: (skillIds: number[]) => void;
  onNext: () => void;
  onBack: () => void;
  showHeader?: boolean; // Optional: show RegistrationHeader
  showFooter?: boolean; // Optional: show footer with Далее button
  onCategoryChange?: (categoryId: string | null) => void; // Optional: callback when category changes
  isModal?: boolean; // Optional: if used inside modal, changes layout styles
}

let skillCategoriesCache: SkillCategory[] | null = null;
let skillCategoriesPromise: Promise<SkillCategory[]> | null = null;

export const SkillsStep: React.FC<Props> = ({
  selectedSkills,
  onSkillsChange,
  onNext,
  onBack,
  showHeader = true,
  showFooter = true,
  onCategoryChange,
  isModal = false,
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [showSkillsOverlay, setShowSkillsOverlay] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [skillsCategories, setSkillsCategories] = useState<SkillCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const skillsOverlayRef = useRef<HTMLDivElement>(null);

  // Load skill categories from API
  useEffect(() => {
    addSpinnerAnimation();

    let isMounted = true;

    const loadCategories = async () => {
      try {
        if (skillCategoriesCache) {
          if (isMounted) {
            setSkillsCategories(skillCategoriesCache);
            setIsLoading(false);
          }
          return;
        }

        if (!skillCategoriesPromise) {
          if (isMounted) {
            setIsLoading(true);
          }
          skillCategoriesPromise = apiService.getSkillCategories()
            .then(({ categories }) => {
              skillCategoriesCache = categories;
              return categories;
            })
            .catch((error) => {
              skillCategoriesPromise = null;
              throw error;
            });
        }

        const categories = await skillCategoriesPromise;
        if (isMounted) {
          setSkillsCategories(categories);
        }
        skillCategoriesPromise = null;
      } catch (error) {
        skillCategoriesPromise = null;
        console.error('Failed to load skill categories:', error);
        // Optionally show error message to user
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // Close overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSkillsOverlay && skillsOverlayRef.current && !skillsOverlayRef.current.contains(event.target as Node)) {
        setShowSkillsOverlay(false);
      }
    };

    if (showSkillsOverlay) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSkillsOverlay]);

  const getColorClasses = (color: 'orange' | 'purple' | 'blue' | 'yellow' | 'green') => {
    const colors = {
      orange: { bg: '#FFF7ED', text: '#EA580C', solid: '#EA580C' },
      purple: { bg: '#F5F3FF', text: '#7C3AED', solid: '#7C3AED' },
      blue: { bg: '#EFF6FF', text: '#2563EB', solid: '#2563EB' },
      yellow: { bg: '#FEF3C7', text: '#D97706', solid: '#D97706' },
      green: { bg: '#F0FDF4', text: '#16A34A', solid: '#16A34A' }
    };
    return colors[color];
  };

  // SVG Icon Component
  const CategoryIconSvg: React.FC<{ categoryId: string; style?: React.CSSProperties }> = ({ categoryId, style }) => (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      {categoryId === 'construction' && (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      )}
      {categoryId === 'creative' && (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      )}
      {categoryId === 'staff' && (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      )}
      {categoryId === 'technical' && (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      )}
      {categoryId === 'logistics' && (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      )}
    </svg>
  );

  // Helper function to get skill name by ID
  const getSkillById = (skillId: number): Skill | undefined => {
    for (const category of skillsCategories) {
      const skill = category.skills.find((s: Skill) => s.id === skillId);
      if (skill) return skill;
    }
    return undefined;
  };

  const toggleSkill = (skillId: number, skillName: string) => {
    const isCurrentlySelected = selectedSkills.includes(skillId);

    if (isCurrentlySelected) {
      onSkillsChange(selectedSkills.filter(id => id !== skillId));
      setAnnouncement(`Специальность ${skillName} удалена. Выбрано ${selectedSkills.length - 1} специальностей`);
    } else {
      onSkillsChange([...selectedSkills, skillId]);
      setAnnouncement(`Специальность ${skillName} добавлена. Выбрано ${selectedSkills.length + 1} специальностей`);
    }
  };

  const canContinue = selectedSkills.length > 0;

  const handleCategoryClick = (categoryId: string) => {
    setTransitionDirection('left');
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveCategory(categoryId);
      onCategoryChange?.(categoryId);
      setIsTransitioning(false);
    }, 300);
  };

  const handleBackToCategories = () => {
    setTransitionDirection('right');
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveCategory(null);
      onCategoryChange?.(null);
      setIsTransitioning(false);
    }, 300);
  };

  const handleSubmit = () => {
    if (canContinue) {
      onNext();
    }
  };

  // Fixed Header Component - Main View (with subtitle)
  const FixedHeaderMain: React.FC<{ title: string }> = ({ title }) => (
    <div style={isModal ? styles.modalHeader : styles.fixedHeader}>
      <div style={styles.headerContent}>
        <h1 style={styles.pageTitle}>{title}</h1>
        <p style={styles.subtitle}>
          Укажите все ваши специальности — так подходящих заказов найдётся больше.
        </p>

        {/* Dynamic counter - only shows when skills are selected */}
        {selectedSkills.length > 0 && (
          <div style={styles.skillsCounterContainer}>
            <button
              type="button"
              onClick={() => setShowSkillsOverlay(!showSkillsOverlay)}
              style={styles.skillsCounter}
              aria-label={`Выбрано ${selectedSkills.length} специальностей. Нажмите для просмотра`}
            >
              <span style={styles.skillsCounterText}>
                Выбрано: {selectedSkills.length} {selectedSkills.length === 1 ? 'специальность' : selectedSkills.length < 5 ? 'специальности' : 'специальностей'}
              </span>
              <svg
                style={{
                  ...styles.skillsCounterIcon,
                  transform: showSkillsOverlay ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Skills Overlay */}
            {showSkillsOverlay && (
              <div ref={skillsOverlayRef} style={styles.skillsOverlay}>
                <div style={styles.skillsOverlayContent}>
                  {selectedSkills.map((skillId) => {
                    const skill = getSkillById(skillId);
                    if (!skill) return null;
                    return (
                      <div key={skillId} style={styles.skillsOverlayItem}>
                        <span style={styles.skillsOverlayItemText}>{skill.name}</span>
                        <button
                          type="button"
                          onClick={() => toggleSkill(skillId, skill.name)}
                          style={styles.skillsOverlayItemRemove}
                          aria-label={`Удалить специальность ${skill.name}`}
                        >
                          <svg style={styles.skillsOverlayItemRemoveIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Fixed Header Component - Category Detail View (with icon, no subtitle)
  const FixedHeaderCategory: React.FC<{ category: typeof skillsCategories[0] }> = ({ category }) => {
    const colors = getColorClasses(category.color);

    return (
      <div style={isModal ? styles.modalHeaderCategory : styles.fixedHeaderCategory}>
        <div style={styles.headerContent}>
          {/* Task 1: Category Icon + Title */}
          <div style={styles.categoryHeaderRow}>
            <div style={{ ...styles.categoryIcon, backgroundColor: colors.bg }}>
              <CategoryIconSvg
                categoryId={category.id}
                style={{ ...styles.categoryIconSvg, color: colors.text }}
              />
            </div>
            <h1 style={styles.pageTitleCategory}>{category.title}</h1>
          </div>

          {/* Dynamic counter - only shows when skills are selected */}
          {selectedSkills.length > 0 && (
            <div style={styles.skillsCounterContainer}>
              <button
                type="button"
                onClick={() => setShowSkillsOverlay(!showSkillsOverlay)}
                style={styles.skillsCounter}
                aria-label={`Выбрано ${selectedSkills.length} специальностей. Нажмите для просмотра`}
              >
                <span style={styles.skillsCounterText}>
                  Выбрано: {selectedSkills.length} {selectedSkills.length === 1 ? 'специальность' : selectedSkills.length < 5 ? 'специальности' : 'специальностей'}
                </span>
                <svg
                  style={{
                    ...styles.skillsCounterIcon,
                    transform: showSkillsOverlay ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Skills Overlay */}
              {showSkillsOverlay && (
                <div ref={skillsOverlayRef} style={styles.skillsOverlay}>
                  <div style={styles.skillsOverlayContent}>
                    {selectedSkills.map((skillId) => {
                      const skill = getSkillById(skillId);
                      if (!skill) return null;
                      return (
                        <div key={skillId} style={styles.skillsOverlayItem}>
                          <span style={styles.skillsOverlayItemText}>{skill.name}</span>
                          <button
                            type="button"
                            onClick={() => toggleSkill(skillId, skill.name)}
                            style={styles.skillsOverlayItemRemove}
                            aria-label={`Удалить специальность ${skill.name}`}
                          >
                            <svg style={styles.skillsOverlayItemRemoveIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={isModal ? styles.modalContainer : styles.container}>
        {showHeader && <RegistrationHeader onBack={onBack} />}
        <Loader fullHeight />
      </div>
    );
  }

  // Category Detail View
  if (activeCategory) {
    const category = skillsCategories.find((c: SkillCategory) => c.id === activeCategory);
    if (!category) return null;

    const colors = getColorClasses(category.color);

    return (
      <div style={isModal ? styles.modalContainer : styles.container}>
        {showHeader && <RegistrationHeader onBack={handleBackToCategories} />}

        {/* Screen reader announcements */}
        <div role="status" aria-live="polite" aria-atomic="true" style={styles.srOnly}>
          {announcement}
        </div>

        {/* Wrapper for sticky header + scrollable content */}
        <div
          style={{
            ...(isModal ? styles.modalScrollableContentCategory : styles.scrollableContentCategory),
            ...(isTransitioning && transitionDirection === 'right' ? styles.slideOutLeft : {}),
            ...(isTransitioning && transitionDirection === 'left' ? styles.slideInFromRight : {}),
            ...(!isTransitioning && !transitionDirection ? styles.slideInFromRight : {}),
          }}
        >
          {/* Sticky Header - Category View */}
          <FixedHeaderCategory category={category} />

          {/* Skills List with padding */}
          <div style={styles.skillsListWrapper}>
            <div style={styles.skillsList}>
              {category.skills.map((skill: Skill) => {
                const isSelected = selectedSkills.includes(skill.id);
                return (
                  <button
                    key={skill.id}
                    onClick={() => toggleSkill(skill.id, skill.name)}
                    style={{
                      ...styles.skillItem,
                      ...(isSelected
                        ? { ...styles.skillItemSelected, backgroundColor: colors.solid }
                        : styles.skillItemUnselected),
                    }}
                    role="checkbox"
                    aria-checked={isSelected}
                    aria-label={`${skill.name}, ${isSelected ? 'выбрано' : 'не выбрано'}`}
                    tabIndex={0}
                  >
                    <span style={isSelected ? styles.skillTextSelected : styles.skillText}>
                      {skill.name}
                    </span>
                    {isSelected && (
                      <svg style={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {showFooter && (
          <div style={isModal ? styles.modalFooter : styles.footer}>
            <button
              type="button"
              onClick={handleBackToCategories}
              style={styles.doneButton}
            >
              Готово
            </button>
          </div>
        )}
      </div>
    );
  }

  // Main View - Categories List
  return (
    <div style={isModal ? styles.modalContainer : styles.container}>
      {showHeader && <RegistrationHeader onBack={onBack} />}

      {/* Screen reader announcements */}
      <div role="status" aria-live="polite" aria-atomic="true" style={styles.srOnly}>
        {announcement}
      </div>

      {/* Wrapper for sticky header + scrollable content */}
      <div
        style={{
          ...(isModal ? styles.modalScrollableContentMain : styles.scrollableContentMain),
          ...(isTransitioning && transitionDirection === 'left' ? styles.slideOutLeft : {}),
          ...(isTransitioning && transitionDirection === 'right' ? styles.slideInFromLeft : {}),
        }}
      >
        {/* Sticky Header - Main View */}
        <FixedHeaderMain title="Чем вы занимаетесь?" />

        {/* Categories List with padding */}
        <div style={styles.categoriesListWrapper}>
          <div style={styles.categoriesList}>
            {skillsCategories.map((category: SkillCategory) => {
              const colors = getColorClasses(category.color);
              const categorySkillIds = category.skills.map((s: Skill) => s.id);
              const selectedInCategory = selectedSkills.filter((skillId: number) => categorySkillIds.includes(skillId)).length;

              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  style={styles.categoryItem}
                  aria-label={`${category.title}${selectedInCategory > 0 ? `, выбрано ${selectedInCategory} специальностей` : ''}`}
                >
                  <div style={styles.categoryItemContent}>
                    <div style={{ ...styles.categoryIcon, backgroundColor: colors.bg }}>
                      <CategoryIconSvg
                        categoryId={category.id}
                        style={{ ...styles.categoryIconSvg, color: colors.text }}
                      />
                    </div>
                    <div style={styles.categoryInfo}>
                      <span style={styles.categoryName}>{category.title}</span>
                      {selectedInCategory > 0 && (
                        <span style={styles.categoryCount}>
                          Выбрано: {selectedInCategory}
                        </span>
                      )}
                    </div>
                  </div>
                  <svg style={styles.chevronIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {showFooter && (
        <div style={isModal ? styles.modalFooter : styles.footer}>
          <button
            onClick={handleSubmit}
            disabled={!canContinue}
            style={{
              ...styles.submitButton,
              ...(canContinue ? {} : styles.submitButtonDisabled),
            }}
            aria-label={canContinue ? 'Продолжить регистрацию' : `Выберите хотя бы одну специальность для продолжения. Сейчас выбрано: ${selectedSkills.length}`}
          >
            Далее
          </button>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #000',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    fontSize: '16px',
    color: '#666',
    margin: 0,
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  },
  // Fixed Header Styles - Main View
  fixedHeader: {
    position: 'sticky',
    top: 0,
    left: 0,
    right: 0,
    background: '#fff',
    padding: '24px 20px 16px',
    zIndex: 100,
    boxSizing: 'border-box',
    borderBottom: '1px solid #f0f0f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    marginTop: 'var(--header-height, 64px)',
  },
  // Fixed Header Styles - Category Detail View
  fixedHeaderCategory: {
    position: 'sticky',
    top: 0,
    left: 0,
    right: 0,
    background: '#fff',
    padding: '24px 20px 16px',
    zIndex: 100,
    boxSizing: 'border-box',
    borderBottom: '1px solid #f0f0f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    marginTop: 'var(--header-height, 64px)',
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  // Task 1: Category Header Row with Icon
  categoryHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '700',
    margin: 0,
    color: '#000',
    textAlign: 'left',
    lineHeight: '1.2',
  },
  pageTitleCategory: {
    fontSize: '24px',
    fontWeight: '700',
    margin: 0,
    color: '#000',
    textAlign: 'left',
    lineHeight: '1.2',
    flex: 1,
  },
  subtitle: {
    fontSize: '15px',
    color: '#666',
    margin: 0,
    textAlign: 'left',
    lineHeight: '1.4',
  },
  // Skills Counter and Overlay
  skillsCounterContainer: {
    position: 'relative',
    width: '100%',
    marginTop: '12px',
  },
  skillsCounter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '12px 16px',
    background: '#f3f4f6',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  },
  skillsCounterText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1f2937',
  },
  skillsCounterIcon: {
    width: '20px',
    height: '20px',
    color: '#6b7280',
    transition: 'transform 0.2s ease-in-out',
  },
  skillsOverlay: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '8px',
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    zIndex: 200,
    maxHeight: '300px',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    animation: 'fadeInScale 0.2s ease-out',
  },
  skillsOverlayContent: {
    padding: '8px',
  },
  skillsOverlayItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    borderRadius: '8px',
    transition: 'background 0.2s',
    background: '#fafafa',
    marginBottom: '4px',
  },
  skillsOverlayItemText: {
    fontSize: '14px',
    color: '#1f2937',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  skillsOverlayItemRemove: {
    padding: '4px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
    minWidth: '28px',
    minHeight: '28px',
    flexShrink: 0,
  },
  skillsOverlayItemRemoveIcon: {
    width: '16px',
    height: '16px',
    color: '#6b7280',
  },
  // Scrollable Content Area - Main View
  scrollableContentMain: {
    flex: 1,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    boxSizing: 'border-box',
    transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
  },
  // Scrollable Content Area - Category Detail View
  scrollableContentCategory: {
    flex: 1,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    boxSizing: 'border-box',
    transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
  },
  // Wrapper for categories/skills lists
  categoriesListWrapper: {
    padding: '20px',
    paddingBottom: '102px', // Footer height + extra spacing
  },
  skillsListWrapper: {
    padding: '20px',
    paddingBottom: '102px', // Footer height + extra spacing
  },
  // Transition Animations
  slideOutLeft: {
    transform: 'translateX(-100%)',
    opacity: 0,
  },
  slideInFromLeft: {
    transform: 'translateX(0)',
    opacity: 1,
    animation: 'slideInLeft 0.3s ease-out',
  },
  slideInFromRight: {
    transform: 'translateX(0)',
    opacity: 1,
    animation: 'slideInRight 0.3s ease-out',
  },
  // Categories List
  categoriesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  categoryItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 0',
    minHeight: '44px',
    borderBottom: '1px solid #f3f4f6',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    textAlign: 'left',
    WebkitTapHighlightColor: 'transparent',
  },
  categoryItemContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    minWidth: 0,
  },
  categoryIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  categoryIconSvg: {
    width: '20px',
    height: '20px',
  },
  categoryInfo: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
  },
  categoryName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#000',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  categoryCount: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '2px',
  },
  chevronIcon: {
    width: '20px',
    height: '20px',
    color: '#d1d5db',
    flexShrink: 0,
  },
  // Skills List
  skillsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  skillItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    minHeight: '44px',
    borderRadius: '12px',
    transition: 'all 0.2s ease-in-out',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
  },
  skillItemSelected: {
    color: '#fff',
  },
  skillItemUnselected: {
    backgroundColor: '#fff',
    color: '#1f2937',
    border: '1px solid #f3f4f6',
  },
  skillText: {
    fontSize: '14px',
    color: '#374151',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: 'calc(100% - 24px)',
  },
  skillTextSelected: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#fff',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: 'calc(100% - 24px)',
  },
  checkIcon: {
    width: '16px',
    height: '16px',
    color: '#fff',
    strokeWidth: 2.5,
    flexShrink: 0,
  },
  // Footer
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '20px',
    background: '#fff',
    borderTop: '1px solid #f0f0f0',
    boxSizing: 'border-box',
    zIndex: 1000,
  },
  submitButton: {
    background: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    width: '100%',
  },
  submitButtonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  doneButton: {
    background: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
  },
  // Modal-specific styles
  modalContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative',
  },
  modalHeader: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    background: '#fff',
    padding: '16px 20px',
    zIndex: 100,
    boxSizing: 'border-box',
    borderBottom: '1px solid #f0f0f0',
    flexShrink: 0,
  },
  modalHeaderCategory: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    background: '#fff',
    padding: '16px 20px',
    zIndex: 100,
    boxSizing: 'border-box',
    borderBottom: '1px solid #f0f0f0',
    flexShrink: 0,
  },
  modalScrollableContentMain: {
    flex: 1,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    boxSizing: 'border-box',
    transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
  },
  modalScrollableContentCategory: {
    flex: 1,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    boxSizing: 'border-box',
    transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
  },
  modalFooter: {
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '16px 20px',
    background: '#fff',
    borderTop: '1px solid #f0f0f0',
    boxSizing: 'border-box',
    zIndex: 1000,
    flexShrink: 0,
  },
};
