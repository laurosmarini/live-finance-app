import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* Import Inter font from Google Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  /* Reset and base styles */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    font-weight: ${({ theme }) => theme.fontWeights.normal};
    color: ${({ theme }) => theme.colors.gray[800]};
    background-color: ${({ theme }) => theme.colors.gray[50]};
    overflow-x: hidden;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    line-height: ${({ theme }) => theme.lineHeights.tight};
    color: ${({ theme }) => theme.colors.gray[900]};
  }

  h1 {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
  }

  h2 {
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
  }

  h3 {
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }

  h4 {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }

  h5 {
    font-size: ${({ theme }) => theme.fontSizes.md};
  }

  h6 {
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }

  p {
    line-height: ${({ theme }) => theme.lineHeights.relaxed};
  }

  /* Links */
  a {
    color: ${({ theme }) => theme.colors.primary[600]};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.primary[700]};
      text-decoration: underline;
    }

    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
      outline-offset: 2px;
      border-radius: ${({ theme }) => theme.radii.sm};
    }
  }

  /* Form elements */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  /* Focus styles */
  *:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: 2px;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray[100]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[300]};
    border-radius: ${({ theme }) => theme.radii.lg};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.gray[400]};
  }

  /* Selection styles */
  ::selection {
    background-color: ${({ theme }) => theme.colors.primary[200]};
    color: ${({ theme }) => theme.colors.primary[900]};
  }

  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .visually-hidden {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }

  /* Animation utilities */
  .fade-in {
    animation: fadeIn 0.6s ease-out;
  }

  .slide-up {
    animation: slideUp 0.5s ease-out;
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  }

  .glass-button {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
  }

  .glass-button:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }

  /* Keyframe animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes glow {
    from {
      box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
    }
    to {
      box-shadow: 0 0 30px rgba(102, 126, 234, 0.8);
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export default GlobalStyle;
