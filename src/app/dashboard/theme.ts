// Define theme type
export type Theme = {
  background: string;
  text: {
    primary: string;
    secondary: string;
    muted?: string;
  };
  card: string;
  border: string;
  hover?: string;
  accent?: string;
  chart: {
    grid: string | { stroke: string };
    text?: {
      primary: string;
      secondary: string;
    };
    tooltip?: {
      background: string;
      border: string;
    };
    line?: string;
  };
};

// Define theme object with proper typing
export const theme: Theme = {
  background: 'bg-gray-100 dark:bg-gray-900',
  text: {
    primary: 'text-gray-900 dark:text-white',
    secondary: 'text-gray-600 dark:text-gray-300',
    muted: 'text-gray-500 dark:text-gray-400'
  },
  card: 'bg-white dark:bg-gray-800',
  border: 'border-gray-200 dark:border-gray-700',
  hover: 'hover:bg-gray-50 dark:hover:bg-gray-700',
  accent: 'text-blue-600 dark:text-blue-400',
  chart: {
    grid: { stroke: 'rgba(255, 255, 255, 0.1)' },
    text: {
      primary: 'text-gray-900 dark:text-white',
      secondary: 'text-gray-600 dark:text-gray-300'
    },
    tooltip: {
      background: 'bg-white dark:bg-gray-800',
      border: 'border-gray-200 dark:border-gray-700'
    },
    line: 'text-blue-500'
  }
};
