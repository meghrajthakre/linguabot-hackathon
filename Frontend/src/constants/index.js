/**
 * src/constants/index.js
 * Central export point for all constants
 * 
 * Usage:
 * import { LANGUAGES, TIMINGS } from '../constants';
 * import { CONSTANTS } from '../constants'; // Optional
 */

// Import all constants
import { LANGUAGES } from './languages';
import { VALIDATION_RULES } from './validation';
import { INPUT_CLASSES } from './inputClasses';
import { TIMINGS } from './timings';

// Export individual constants (recommended)
export { LANGUAGES, VALIDATION_RULES, INPUT_CLASSES, TIMINGS };

// Optional: Export combined CONSTANTS object (for backward compatibility)
export const CONSTANTS = {
  LANGUAGES,
  VALIDATION_RULES,
  INPUT_CLASSES,
  TIMINGS,
  TABS: [
    { id: "basic", label: "Basic Info", icon: "Bot" },
    { id: "knowledge", label: "Knowledge Base", icon: "Sparkles" },
  ],
};