import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: ${props => props.fullScreen ? '100vh' : '200px'};
`;

const Spinner = styled.div`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border: 3px solid ${({ theme }) => theme.colors.gray[200]};
  border-top: 3px solid ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  margin-left: ${({ theme }) => theme.space[4]};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

function LoadingSpinner({ 
  size = '40px', 
  text = '', 
  fullScreen = false,
  className 
}) {
  return (
    <SpinnerContainer fullScreen={fullScreen} className={className}>
      <Spinner size={size} />
      {text && <LoadingText>{text}</LoadingText>}
    </SpinnerContainer>
  );
}

export default LoadingSpinner;
