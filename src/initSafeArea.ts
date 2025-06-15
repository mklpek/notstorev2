/**
 * Early initialization of safe area insets
 * This file is loaded before React renders to set CSS variables
 */

import { bootstrapSafeArea } from './core/hooks/useSafeArea/bootstrap';

// Set CSS variables ASAP
bootstrapSafeArea();
