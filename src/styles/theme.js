// src/styles/theme.js

/**
 * Application theme configuration
 * This file contains all the core design tokens used throughout the application
 * to maintain consistency in styling and appearance.
 */

export const theme = {
    // Color palette definitions
    colors: {
        // Primary colors - used for main actions and key UI elements
        primary: {
            main: '#3B82F6',    // Base blue color for primary elements
            light: '#60A5FA',   // Lighter shade for hover states
            dark: '#2563EB',    // Darker shade for active states
            50: '#EFF6FF',      // Very light blue for backgrounds
            100: '#DBEAFE',     // Light blue for subtle highlights
        },

        // Secondary colors - used for less prominent elements
        secondary: {
            main: '#6B7280',    // Base gray color for secondary elements
            light: '#9CA3AF',   // Lighter gray for subtle elements
            dark: '#4B5563',    // Darker gray for text
            50: '#F9FAFB',      // Very light gray for backgrounds
            100: '#F3F4F6',     // Light gray for borders
        },

        // Status colors for feedback and alerts
        status: {
            success: '#10B981', // Green for success states
            error: '#EF4444',   // Red for error states
            warning: '#F59E0B', // Amber for warning states
            info: '#3B82F6'     // Blue for information
        },

        // Text colors
        text: {
            primary: '#111827',   // Dark gray for primary text
            secondary: '#6B7280', // Medium gray for secondary text
            disabled: '#9CA3AF'   // Light gray for disabled text
        },

        // Background colors
        background: {
            main: '#F3F4F6',     // Main background color
            paper: '#FFFFFF',     // Paper/card background
            dark: '#1F2937'       // Dark background for contrast
        },

        // Border colors
        border: {
            light: '#E5E7EB',    // Light border color
            main: '#D1D5DB',     // Main border color
            dark: '#9CA3AF'      // Dark border color
        }
    },

    // Spacing scale for consistent layout spacing
    spacing: {
        xs: '0.25rem',    // 4px
        sm: '0.5rem',     // 8px
        md: '1rem',       // 16px
        lg: '1.5rem',     // 24px
        xl: '2rem',       // 32px
        '2xl': '2.5rem',  // 40px
        '3xl': '3rem'     // 48px
    },

    // Typography scale
    typography: {
        fontFamily: {
            sans: 'Inter, system-ui, -apple-system, sans-serif',
            mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
        },
        fontSize: {
            xs: '0.75rem',     // 12px
            sm: '0.875rem',    // 14px
            base: '1rem',      // 16px
            lg: '1.125rem',    // 18px
            xl: '1.25rem',     // 20px
            '2xl': '1.5rem',   // 24px
            '3xl': '1.875rem', // 30px
            '4xl': '2.25rem'   // 36px
        },
        fontWeight: {
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700'
        },
        lineHeight: {
            tight: '1.25',
            normal: '1.5',
            relaxed: '1.75'
        }
    },

    // Border radius scale
    borderRadius: {
        sm: '0.125rem',  // 2px
        md: '0.25rem',   // 4px
        lg: '0.5rem',    // 8px
        xl: '1rem',      // 16px
        full: '9999px'   // Fully rounded
    },

    // Shadow definitions
    shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
    },

    // Transition definitions
    transitions: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms'
    }
};

// Helper functions for using the theme
export const getColor = (path) => {
    return path.split('.').reduce((obj, key) => obj?.[key], theme.colors);
};

export const getSpacing = (size) => {
    return theme.spacing[size] || size;
};

export default theme;